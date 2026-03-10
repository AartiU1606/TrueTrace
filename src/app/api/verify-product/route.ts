import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { analyzeFraud } from '@/services/fraudEngine'
import { computeImageSimilarity } from '@/services/imageSimilarity'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // ── Parse multipart form data ────────────────────────────────────────────
    let seller_name = ''
    let marketplace = ''
    let price = 0
    let product_name = ''
    let product_url = ''
    let reference_price: number | undefined

    let imageBuffer: Buffer | null = null

    const contentType = req.headers.get('content-type') ?? ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      seller_name = (formData.get('seller_name') as string) ?? ''
      marketplace = (formData.get('marketplace') as string) ?? ''
      price = Number(formData.get('price') ?? 0)
      product_name = (formData.get('product_name') as string) ?? ''
      product_url = (formData.get('product_url') as string) ?? ''
      reference_price = formData.get('reference_price')
        ? Number(formData.get('reference_price'))
        : undefined

      const imageFile = formData.get('product_image') as File | null
      if (imageFile && imageFile.size > 0) {
        const arrayBuffer = await imageFile.arrayBuffer()
        imageBuffer = Buffer.from(arrayBuffer)

        // ── Optionally persist image to Supabase Storage ───────────────────
        try {
          const fileName = `${user.id}/${Date.now()}_${imageFile.name}`
          await supabaseAdmin.storage
            .from('product-images')
            .upload(fileName, imageBuffer, {
              contentType: imageFile.type,
              upsert: false,
            })
        } catch (storageErr) {
          // Non-fatal: log and continue
          console.warn('Storage upload skipped:', storageErr)
        }
      }
    } else {
      // Fallback: JSON body (backward-compatible)
      const body = await req.json()
      seller_name = body.seller_name ?? ''
      marketplace = body.marketplace ?? ''
      price = body.product_price ?? body.price ?? 0
      product_name = body.product_name ?? ''
      product_url = body.product_url ?? ''
      reference_price = body.reference_price
    }

    if (!seller_name || !marketplace || !price) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: seller_name, marketplace, price' },
        { status: 400 }
      )
    }

    // ── 1. Compute image similarity ─────────────────────────────────────────
    const imageSimilarity = await computeImageSimilarity(imageBuffer)

    // ── 2. Run dynamic fraud analysis ───────────────────────────────────────
    const analysis = analyzeFraud({
      seller_name,
      price,
      marketplace,
      imageSimilarity,
    })

    // ── 3. Save product metadata ─────────────────────────────────────────────
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .insert({
        user_id: user.id,
        product_url,
        product_name,
        marketplace,
        seller_name,
        product_price: price,
      })
      .select()
      .single()

    if (productError) {
      console.error('Product insert error:', productError)
      return NextResponse.json({ success: false, error: 'Failed to save product' }, { status: 500 })
    }

    // ── 4. Save verification result ──────────────────────────────────────────
    const { data: result, error: resultError } = await supabaseAdmin
      .from('verification_results')
      .insert({
        product_id: product.id,
        authenticity_score: analysis.authenticityScore,
        seller_score: analysis.sellerScore,
        price_anomaly_score: analysis.priceAnomalyScore,
        packaging_similarity: analysis.packagingSimilarity,
        marketplace_risk: analysis.marketplaceRisk,
        final_recommendation: analysis.recommendation,
      })
      .select()
      .single()

    if (resultError) {
      console.error('Result insert error:', resultError)
      return NextResponse.json({ success: false, error: 'Failed to save result' }, { status: 500 })
    }

    // ── 5. Return dynamic response ───────────────────────────────────────────
    return NextResponse.json({
      success: true,
      data: {
        product_id: product.id,
        result_id: result.id,
        authenticity_score: analysis.authenticity_score,
        seller_trust: analysis.seller_trust,
        price_anomaly: analysis.price_anomaly,
        market_risk: analysis.market_risk,
        packaging_similarity: analysis.packaging_similarity,
        recommendation: analysis.recommendation,
      },
    })
  } catch (error) {
    console.error('verify-product error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
