import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { analyzeFraud } from '@/services/fraudEngine'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { product_url, seller_name, marketplace, product_price, product_name, reference_price } = body

    if (!seller_name || !marketplace || !product_price) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Save product metadata
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .insert({
        user_id: user.id,
        product_url,
        product_name,
        marketplace,
        seller_name,
        product_price,
      })
      .select()
      .single()

    if (productError) {
      console.error('Product insert error:', productError)
      return NextResponse.json({ success: false, error: 'Failed to save product' }, { status: 500 })
    }

    // 2. Get seller fraud report count
    const { data: sellerData } = await supabaseAdmin
      .from('seller_profiles')
      .select('fraud_reports')
      .eq('seller_name', seller_name)
      .single()

    const sellerFraudReports = sellerData?.fraud_reports ?? 0

    // 3. Run fraud analysis engine
    const analysis = analyzeFraud({
      productPrice: product_price,
      referencePrice: reference_price,
      sellerFraudReports,
      marketplace,
    })

    // 4. Save verification results
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

    return NextResponse.json({
      success: true,
      data: {
        product_id: product.id,
        authenticity_score: analysis.authenticityScore,
        seller_score: analysis.sellerScore,
        price_anomaly_score: analysis.priceAnomalyScore,
        packaging_similarity: analysis.packagingSimilarity,
        marketplace_risk: analysis.marketplaceRisk,
        recommendation: analysis.recommendation,
        result_id: result.id,
      },
    })
  } catch (error) {
    console.error('verify-product error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
