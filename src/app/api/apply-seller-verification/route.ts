import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { seller_name, marketplace, product_list } = body

    if (!seller_name || !marketplace) {
      return NextResponse.json({ success: false, error: 'Missing seller_name or marketplace' }, { status: 400 })
    }

    // Check existing record
    const { data: existing } = await supabaseAdmin
      .from('seller_profiles')
      .select('id, fraud_reports, verification_status')
      .eq('seller_name', seller_name)
      .eq('marketplace', marketplace)
      .maybeSingle()

    if (existing) {
      if (existing.fraud_reports >= 3) {
        return NextResponse.json({
          success: false,
          error: 'Too many fraud reports to qualify for verification',
        }, { status: 400 })
      }

      // Already verified
      if (existing.verification_status === 'verified') {
        return NextResponse.json({ success: true, data: { status: 'already_verified' } })
      }

      // Approve
      await supabaseAdmin
        .from('seller_profiles')
        .update({ verification_status: 'verified' })
        .eq('id', existing.id)

      return NextResponse.json({ success: true, data: { status: 'verified', seller_id: existing.id } })
    }

    // Create new seller profile
    const { data: newSeller, error } = await supabaseAdmin
      .from('seller_profiles')
      .insert({ seller_name, marketplace, verification_status: 'verified', trust_score: 80 })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // Insert product list if provided
    if (product_list?.length) {
      const products = product_list.map((p: { product_name: string; category: string; price: number }) => ({
        seller_id: newSeller.id,
        product_name: p.product_name,
        category: p.category,
        price: p.price,
        verification_score: 85,
      }))
      await supabaseAdmin.from('verified_products').insert(products)
    }

    return NextResponse.json({ success: true, data: { status: 'verified', seller_id: newSeller.id } })
  } catch (error) {
    console.error('apply-seller-verification error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
