// AI Service for OpenAI integration
// Note: This is a placeholder implementation. In production, you would:
// 1. Install openai package: npm install openai
// 2. Add OPENAI_API_KEY to environment variables
// 3. Implement actual OpenAI API calls for enhanced recommendations

export interface AIRecommendationRequest {
  skinType: string;
  concerns: string[];
  productList: Array<{
    id: string;
    name: string;
    description: string;
    ingredients: Array<{ name: string; percentage?: number }>;
    price: string;
    sustainabilityScore?: number;
  }>;
}

export interface AIRecommendationResponse {
  recommendations: Array<{
    productId: string;
    score: number;
    reasoning: string;
  }>;
  explanation: string;
}

export class AIService {
  private apiKey: string;
  
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  async generateRecommendations(request: AIRecommendationRequest): Promise<AIRecommendationResponse> {
    // TODO: Implement actual OpenAI API integration
    // This is a placeholder that mimics AI recommendations
    
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured. Please add OPENAI_API_KEY to environment variables.');
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Placeholder AI logic (replace with actual OpenAI call)
    const recommendations = this.generatePlaceholderRecommendations(request);

    return {
      recommendations,
      explanation: `Based on your ${request.skinType} skin type and concerns about ${request.concerns.join(', ')}, here are personalized product recommendations prioritizing effective ingredients and sustainability.`
    };
  }

  private generatePlaceholderRecommendations(request: AIRecommendationRequest): Array<{
    productId: string;
    score: number;
    reasoning: string;
  }> {
    return request.productList
      .map(product => {
        let score = 0;
        let reasoning = [];

        // Score based on skin type compatibility
        if (request.skinType === 'dry' && product.name.toLowerCase().includes('hydrat')) {
          score += 20;
          reasoning.push('excellent hydration properties');
        }
        
        if (request.skinType === 'oily' && product.name.toLowerCase().includes('oil-free')) {
          score += 20;
          reasoning.push('oil-free formula suitable for oily skin');
        }

        // Score based on concerns
        if (request.concerns.includes('aging')) {
          const hasAntiAging = product.ingredients.some(ing => 
            ing.name.toLowerCase().includes('bakuchiol') || 
            ing.name.toLowerCase().includes('vitamin c') ||
            ing.name.toLowerCase().includes('retinol')
          );
          if (hasAntiAging) {
            score += 25;
            reasoning.push('contains proven anti-aging ingredients');
          }
        }

        if (request.concerns.includes('acne') && product.name.toLowerCase().includes('clear')) {
          score += 20;
          reasoning.push('formulated for acne-prone skin');
        }

        // Sustainability bonus
        if (product.sustainabilityScore && product.sustainabilityScore > 80) {
          score += 10;
          reasoning.push('high sustainability rating');
        }

        // Price consideration (prefer mid-range products)
        const price = parseFloat(product.price);
        if (price >= 20 && price <= 50) {
          score += 5;
          reasoning.push('excellent value for quality');
        }

        return {
          productId: product.id,
          score,
          reasoning: reasoning.length > 0 ? reasoning.join(', ') : 'matches your skin profile'
        };
      })
      .filter(rec => rec.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  // Method to get the actual OpenAI prompt template
  private buildPrompt(request: AIRecommendationRequest): string {
    const productDescriptions = request.productList.map(p => 
      `${p.name} ($${p.price}): ${p.description}. Ingredients: ${p.ingredients.map(i => i.name).join(', ')}`
    ).join('\n');

    return `
As a skincare expert specializing in sustainable beauty products, analyze the following products for someone with ${request.skinType} skin who has concerns about ${request.concerns.join(', ')}.

Available Products:
${productDescriptions}

Please recommend 3-5 products that would be most suitable, prioritizing:
1. Effectiveness for their skin type and concerns
2. Ingredient safety and quality
3. Sustainability and eco-friendliness
4. Value for money

For each recommendation, provide:
- Product name and brief reasoning
- Key beneficial ingredients
- How it addresses their specific concerns

Focus especially on bakuchiol-based products for anti-aging concerns as they're gentle alternatives to retinol.
`;
  }
}

// Export singleton instance
export const aiService = new AIService();