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
    const { product_url, seller_name, marketplace, description, city, state, image_url } = body

    if (!description || !city || !marketplace) {
      return NextResponse.json({ success: false, error: 'Missing required fields: description, city, marketplace' }, { status: 400 })
    }

    // 1. Check for duplicate report (same URL or seller + marketplace)
    const { data: existing } = await supabaseAdmin
      .from('fraud_reports')
      .select('id, report_count')
      .eq('marketplace', marketplace)
      .eq('seller_name', seller_name ?? '')
      .maybeSingle()

    if (existing) {
      const newCount = (existing.report_count ?? 1) + 1
      const newStatus = newCount > 5 ? 'verified' : 'pending'

      await supabaseAdmin
        .from('fraud_reports')
        .update({ report_count: newCount, status: newStatus })
        .eq('id', existing.id)

      // 3. Update seller fraud_reports count
      await supabaseAdmin
        .from('seller_profiles')
        .update({ fraud_reports: supabaseAdmin.rpc as unknown as number })
        .eq('seller_name', seller_name)

      return NextResponse.json({
        success: true,
        data: { id: existing.id, merged: true, report_count: newCount, status: newStatus },
      })
    }

    // 2. Save new report
    const { data: report, error } = await supabaseAdmin
      .from('fraud_reports')
      .insert({
        product_url,
        marketplace,
        seller_name,
        description,
        image_url,
        city,
        state: state ?? '',
        status: 'pending',
        report_count: 1,
      })
      .select()
      .single()

    if (error) {
      console.error('report-fraud insert error:', error)
      return NextResponse.json({ success: false, error: 'Failed to save fraud report' }, { status: 500 })
    }

    // Update seller fraud_reports count in seller_profiles
    if (seller_name) {
      const { data: sellerRow } = await supabaseAdmin
        .from('seller_profiles')
        .select('id, fraud_reports')
        .eq('seller_name', seller_name)
        .maybeSingle()

      if (sellerRow) {
        await supabaseAdmin
          .from('seller_profiles')
          .update({ fraud_reports: (sellerRow.fraud_reports ?? 0) + 1 })
          .eq('id', sellerRow.id)
      }
    }

    return NextResponse.json({ success: true, data: report })
  } catch (error) {
    console.error('report-fraud error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
