import { NextRequest, NextResponse } from 'next/server'
import { analyzeWithCLIP } from '@/services/clipAnalysis'

export async function POST(req: NextRequest) {
    try {
        // ── Parse request ──────────────────────────────────────────────────────
        let imageBuffer: Buffer | null = null
        let product_price = 5000
        let average_market_price = 5000
        let seller_rating = 80
        let seller_name = ''
        let product_category = 'General'

        const contentType = req.headers.get('content-type') ?? ''

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData()
            product_price = Number(formData.get('product_price') ?? formData.get('price') ?? 5000)
            average_market_price = Number(formData.get('average_market_price') ?? product_price)
            seller_rating = Number(formData.get('seller_rating') ?? 80)
            seller_name = (formData.get('seller_name') as string) ?? ''
            product_category = (formData.get('product_category') as string) ?? 'General'

            const imageFile = formData.get('product_image') as File | null
            if (imageFile && imageFile.size > 0) {
                const arrayBuffer = await imageFile.arrayBuffer()
                imageBuffer = Buffer.from(arrayBuffer)
            }
        } else {
            const body = await req.json().catch(() => ({}))
            product_price = body.product_price ?? body.price ?? 5000
            average_market_price = body.average_market_price ?? product_price
            seller_rating = body.seller_rating ?? 80
            seller_name = body.seller_name ?? ''
            product_category = body.product_category ?? 'General'

            // Accept base64 image
            if (body.image) {
                const b64 = body.image.replace(/^data:image\/\w+;base64,/, '')
                imageBuffer = Buffer.from(b64, 'base64')
            }
        }

        // ── Run CLIP analysis ──────────────────────────────────────────────────
        const result = await analyzeWithCLIP(imageBuffer, {
            product_price,
            average_market_price,
            seller_rating,
            seller_name,
            product_category,
        })

        return NextResponse.json({
            success: true,
            data: result,
        })
    } catch (error) {
        console.error('[predict-authenticity] error:', error)
        return NextResponse.json(
            { success: false, error: 'Predictive analysis failed' },
            { status: 500 }
        )
    }
}
