import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city')

    if (!city) {
      return NextResponse.json({ success: false, error: 'city parameter is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('fraud_reports')
      .select('city, state, marketplace, seller_name, description, status, report_count, created_at')
      .ilike('city', city)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const totalReports = (data ?? []).reduce((sum, r) => sum + (r.report_count ?? 1), 0)
    const marketplaceCount: Record<string, number> = {}
    const sellerCount: Record<string, number> = {}

    for (const r of data ?? []) {
      if (r.marketplace) marketplaceCount[r.marketplace] = (marketplaceCount[r.marketplace] ?? 0) + 1
      if (r.seller_name) sellerCount[r.seller_name] = (sellerCount[r.seller_name] ?? 0) + 1
    }

    const topMarketplaces = Object.entries(marketplaceCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    const topSellers = Object.entries(sellerCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    return NextResponse.json({
      success: true,
      data: {
        city,
        totalReports,
        topMarketplaces,
        topSellers,
        reports: data,
      },
    })
  } catch (error) {
    console.error('city-risk error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
