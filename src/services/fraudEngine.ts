// Fraud Engine Service — Dynamic Predictive Fraud Analysis Engine
// Computes authenticity scores based on seller, price, marketplace, and image similarity

export interface FraudInput {
  seller_name: string
  price: number
  marketplace: string
  imageSimilarity?: number
  // Legacy / extended fields kept for backward compatibility
  productPrice?: number
  referencePrice?: number
  sellerFraudReports?: number
  category?: string
}

export interface FraudAnalysis {
  authenticity_score: number
  seller_trust: number
  price_anomaly: string
  market_risk: string
  packaging_similarity: number
  recommendation: 'SAFE' | 'CAUTION' | 'AVOID'
  // Legacy fields for the existing Supabase save logic
  authenticityScore: number
  sellerScore: number
  priceAnomalyScore: number
  marketplaceRisk: number
  packagingSimilarity: number
  fraudScore: number
}

// --- Constants ---
const AVG_PRICE = 5000

const SUSPICIOUS_SELLER_KEYWORDS = [
  'cheap',
  'deal',
  'discount',
  '99',
  'best_price',
  'official_store123',
]

const TRUSTED_MARKETPLACES = ['amazon', 'flipkart', 'ebay']

// --- Helpers ---

function computePriceDeviation(price: number): { deduction: number; label: string } {
  const deviation = ((AVG_PRICE - price) / AVG_PRICE) * 100

  if (deviation > 50) {
    return { deduction: 35, label: 'Severe' }
  } else if (deviation > 30) {
    return { deduction: 20, label: 'High' }
  } else if (deviation > 15) {
    return { deduction: 10, label: 'Moderate' }
  }
  return { deduction: 0, label: 'Normal' }
}

function assessSellerRisk(sellerName: string): number {
  const lowerName = sellerName.toLowerCase()
  const suspicious = SUSPICIOUS_SELLER_KEYWORDS.some((kw) => lowerName.includes(kw))
  return suspicious ? 10 : 0
}

function assessMarketplaceRisk(marketplace: string): { deduction: number; label: string } {
  const lowerMarket = marketplace.toLowerCase()
  const trusted = TRUSTED_MARKETPLACES.some((m) => lowerMarket.includes(m))
  if (trusted) {
    return { deduction: 0, label: 'Low' }
  }
  return { deduction: 15, label: 'High' }
}

function assessImageSimilarity(similarity: number): {
  adjustment: number
  score: number
} {
  if (similarity > 90) {
    return { adjustment: 5, score: similarity }
  } else if (similarity >= 70) {
    return { adjustment: 0, score: similarity }
  } else {
    return { adjustment: -15, score: similarity }
  }
}

// --- Main Export ---

export function analyzeFraud(input: FraudInput): FraudAnalysis {
  // Support both new API shape and legacy shape
  const sellerName = input.seller_name ?? ''
  const price = input.price ?? input.productPrice ?? 0
  const marketplace = input.marketplace ?? ''

  let baseScore = 100

  // 1. Price anomaly
  const priceResult = computePriceDeviation(price)
  baseScore -= priceResult.deduction

  // 2. Seller risk
  const sellerDeduction = assessSellerRisk(sellerName)
  baseScore -= sellerDeduction

  // 3. Marketplace trust
  const marketResult = assessMarketplaceRisk(marketplace)
  baseScore -= marketResult.deduction

  // 4. Image / packaging similarity
  const rawSimilarity =
    input.imageSimilarity ??
    // Demo fallback: realistic random between 75–95
    Math.floor(Math.random() * 21) + 75

  const imageResult = assessImageSimilarity(rawSimilarity)
  baseScore += imageResult.adjustment

  // Clamp to 0–100
  const authenticityScore = Math.max(0, Math.min(100, Math.round(baseScore)))

  // Seller trust: 100 minus (seller deduction * 5) for backward compat, also factor legacy fraud reports
  const legacyFraudPenalty = (input.sellerFraudReports ?? 0) * 5
  const sellerTrust = Math.max(0, Math.min(100, 100 - sellerDeduction * 5 - legacyFraudPenalty))

  // Recommendation
  let recommendation: 'SAFE' | 'CAUTION' | 'AVOID'
  if (authenticityScore > 80) {
    recommendation = 'SAFE'
  } else if (authenticityScore >= 50) {
    recommendation = 'CAUTION'
  } else {
    recommendation = 'AVOID'
  }

  // Legacy numeric marketplace risk (for Supabase save)
  const marketplaceRiskNumeric = marketResult.deduction

  return {
    // New API shape
    authenticity_score: authenticityScore,
    seller_trust: sellerTrust,
    price_anomaly: priceResult.label,
    market_risk: marketResult.label,
    packaging_similarity: Math.round(imageResult.score),
    recommendation,
    // Legacy shape (used by existing Supabase insert in route.ts)
    authenticityScore,
    sellerScore: sellerTrust,
    priceAnomalyScore: priceResult.deduction,
    marketplaceRisk: marketplaceRiskNumeric,
    packagingSimilarity: Math.round(imageResult.score),
    fraudScore: 100 - authenticityScore,
  }
}
