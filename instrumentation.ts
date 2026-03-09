// Next.js instrumentation hook — runs once when the server starts.
// Calls /api/init to verify database, seed data, and storage bucket.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      ? `http://localhost:${process.env.PORT ?? 3000}`
      : 'http://localhost:3000'

    try {
      console.log('\n=== TrueTrace Backend Initializing ===')
      const res = await fetch(`${baseUrl}/api/init`, { cache: 'no-store' }).catch(() => null)
      if (res?.ok) {
        const json = await res.json().catch(() => null)
        if (json?.logs) {
          json.logs.forEach((l: string) => console.log(l))
        }
      } else {
        console.log('⚠️  Could not reach /api/init on startup — will initialize on first request')
      }
      console.log('=====================================\n')
    } catch {
      // Non-fatal: init will happen on first API call
    }
  }
}
