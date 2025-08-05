export const COLORS = {
  forestGreen: '#228B22',
  lightGreen: '#90EE90',
  darkGreen: '#006400',
  goldLight: '#F2D492',
  goldDark: '#D4A017',
  sageGreen: '#A8CABA',
  berryRed: '#8D314A',
  creamBeige: '#E3D5CA',
} as const;

export const PRODUCT_CATEGORIES = {
  serums: 'Serums & Oils',
  makeup: 'Vegan Makeup',
  kits: 'Skincare Kits',
  supplements: 'Supplements',
} as const;

export const SKIN_TYPES = {
  dry: 'Dry',
  oily: 'Oily',
  combination: 'Combination',
  sensitive: 'Sensitive',
  normal: 'Normal',
} as const;

export const SKIN_CONCERNS = {
  aging: 'Anti-aging',
  acne: 'Acne & Breakouts',
  pigmentation: 'Dark Spots',
  hydration: 'Dryness & Hydration',
  dullness: 'Dullness',
  sensitivity: 'Sensitivity',
} as const;

export const SUSTAINABILITY_FEATURES = {
  vegan: 'Vegan',
  crueltyFree: 'Cruelty-Free',
  organic: 'Organic',
  recyclable: 'Recyclable Packaging',
  carbonNeutral: 'Carbon Neutral',
  fairTrade: 'Fair Trade',
} as const;
