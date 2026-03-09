// Fraud Engine Service
// Responsible for fraud score calculation, authenticity score generation, and recommendation logic

export interface FraudInput {
  productPrice: number
  referencePrice?: number
  sellerFraudReports: number
  marketplace: string
  category?: string
}

export interface FraudAnalysis {
  packagingSimilarity: number
  priceAnomalyScore: number
  sellerScore: number
  marketplaceRisk: number
  fraudScore: number
  authenticityScore: number
  recommendation: 'SAFE' | 'CAUTION' | 'AVOID'
}

// Marketplace risk table
const MARKETPLACE_RISK: Record<string, Record<string, number>> = {
  Amazon: {
    electronics: 20,
    cosmetics: 15,
    fashion: 25,
    default: 20,
  },
  Flipkart: {
    electronics: 30,
    cosmetics: 20,
    fashion: 30,
    default: 25,
  },
  Zepto: {
    groceries: 10,
    default: 12,
  },
  Myntra: {
    fashion: 20,
    default: 18,
  },
  Nykaa: {
    cosmetics: 15,
    default: 15,
  },
  TataCLiQ: {
    default: 18,
  },
}

function getMarketplaceRisk(marketplace: string, category?: string): number {
  const marketRisks = MARKETPLACE_RISK[marketplace]
  if (!marketRisks) return 25 // unknown marketplace — moderate risk
  const cat = category?.toLowerCase() ?? 'default'
  return marketRisks[cat] ?? marketRisks['default'] ?? 25
}

export function analyzeFraud(input: FraudInput): FraudAnalysis {
  const { productPrice, referencePrice, sellerFraudReports, marketplace, category } = input

  // 1. Packaging similarity — mock: random between 70-95
  const packagingSimilarity = Math.floor(Math.random() * 26) + 70

  // 2. Price anomaly detection
  let priceAnomalyScore = 10
  if (referencePrice && referencePrice > 0) {
    const priceDiff = Math.abs(productPrice - referencePrice) / referencePrice
    if (priceDiff > 0.3) {
      priceAnomalyScore = 40
    }
  }

  // 3. Seller reputation (capped at 0 minimum)
  const sellerScore = Math.max(0, 100 - sellerFraudReports * 5)

  // 4. Marketplace risk
  const marketplaceRisk = getMarketplaceRisk(marketplace, category)

  // 5. Fraud score formula
  const fraudScore =
    0.35 * priceAnomalyScore +
    0.25 * (100 - sellerScore) +
    0.25 * (100 - packagingSimilarity) +
    0.15 * marketplaceRisk

  const authenticityScore = Math.max(0, Math.min(100, 100 - fraudScore))

  // 6. Recommendation
  let recommendation: 'SAFE' | 'CAUTION' | 'AVOID'
  if (authenticityScore > 80) {
    recommendation = 'SAFE'
  } else if (authenticityScore >= 50) {
    recommendation = 'CAUTION'
  } else {
    recommendation = 'AVOID'
  }

  return {
    packagingSimilarity,
    priceAnomalyScore,
    sellerScore,
    marketplaceRisk,
    fraudScore: Math.round(fraudScore * 100) / 100,
    authenticityScore: Math.round(authenticityScore * 100) / 100,
    recommendation,
  }
}
