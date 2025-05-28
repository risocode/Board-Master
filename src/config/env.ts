export const config = {
  public: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  },
  private: {
    apiKey: process.env.API_KEY,
  },
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

export type Config = typeof config; 