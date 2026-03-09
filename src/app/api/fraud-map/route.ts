import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('fraud_reports')
      .select('city, state, marketplace, seller_name, status, report_count')
      .order('report_count', { ascending: false })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // Group by city+state
    const hotspots: Record<string, { city: string; state: string; reports: number; marketplaces: string[] }> = {}
    for (const row of data ?? []) {
      const key = `${row.city}::${row.state}`
      if (!hotspots[key]) {
        hotspots[key] = {
          city: row.city,
          state: row.state,
          reports: 0,
          marketplaces: [],
        }
      }
      hotspots[key].reports += row.report_count ?? 1
      if (row.marketplace && !hotspots[key].marketplaces.includes(row.marketplace)) {
        hotspots[key].marketplaces.push(row.marketplace)
      }
    }

    return NextResponse.json({
      success: true,
      data: Object.values(hotspots).sort((a, b) => b.reports - a.reports),
    })
  } catch (error) {
    console.error('fraud-map error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
