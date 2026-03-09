import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// This route is called on server startup to initialize the database infrastructure.
// It's safe to be public since it only reads state and logs.
export async function GET() {
  const logs: string[] = []

  try {
    // 1. Test connection
    const { error: pingError } = await supabaseAdmin.from('seller_profiles').select('id').limit(1)
    if (pingError) throw new Error(`Supabase connection failed: ${pingError.message}`)
    logs.push('✅ Supabase connected')

    // 2. Verify tables exist
    const tables = ['user_profiles', 'products', 'verification_results', 'fraud_reports', 'seller_profiles', 'verified_products']
    for (const table of tables) {
      const { error } = await supabaseAdmin.from(table).select('id').limit(1)
      if (error) {
        logs.push(`⚠️  Table "${table}" missing or inaccessible: ${error.message}`)
      }
    }
    logs.push('✅ Tables verified')

    // 3. Check seed data
    const { count: sellerCount } = await supabaseAdmin
      .from('seller_profiles')
      .select('*', { count: 'exact', head: true })

    const { count: reportCount } = await supabaseAdmin
      .from('fraud_reports')
      .select('*', { count: 'exact', head: true })

    if ((sellerCount ?? 0) > 0 || (reportCount ?? 0) > 0) {
      logs.push('✅ Seed data present')
    } else {
      logs.push('⚠️  Seed data missing — run migration to populate')
    }

    // 4. Check storage bucket
    const { data: buckets } = await supabaseAdmin.storage.listBuckets()
    const bucketExists = buckets?.some((b) => b.name === 'product-images')
    
    if (!bucketExists) {
      const { error: bucketError } = await supabaseAdmin.storage.createBucket('product-images', {
        public: false,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/jpg', 'application/pdf'],
        fileSizeLimit: 10485760, // 10MB
      })
      if (bucketError && !bucketError.message.includes('already exists')) {
        logs.push(`⚠️  Storage bucket error: ${bucketError.message}`)
      } else {
        logs.push('✅ Storage bucket created: product-images')
      }
    } else {
      logs.push('✅ Storage bucket ready: product-images')
    }

    // Print to server console
    console.log('\n=== TrueTrace Backend Status ===')
    logs.forEach((l) => console.log(l))
    console.log('================================\n')

    return NextResponse.json({ success: true, logs })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Init error:', errorMsg)
    return NextResponse.json({ success: false, error: errorMsg, logs }, { status: 500 })
  }
}
