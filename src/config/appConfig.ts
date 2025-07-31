import type { Config, SEO, NavItem, HeroContent, FooterContent } from './types';

/**
 * Strongly-typed application configuration.
 * This file contains NON-SECRET values only. Reference env variable names for secrets elsewhere.
 * Values are derived from the provided Vyakart configuration JSON.
 */

export const appConfig: Config = {
  schemaVersion: '1.0.0',
  _meta: {
    createdBy: 'Kilo Code',
    createdAt: '2025-07-31T00:00:00Z',
    lastUpdated: '2025-07-31T00:00:00Z',
    migrationNotes:
      'Increment schemaVersion on breaking changes. Maintain a changelog of key format updates. Consumers should validate schemaVersion and apply migrations as needed.'
  },
  app: {
    name: 'Vyakart',
    description: 'Oliemannetje',
    owners: ['vyakart@tuta.io'],
    tags: [
      'portfolio',
      'react',
      'tailwind',
      'framer-motion',
      'shadcn/ui',
      'threejs',
      'lottie',
      'gsap',
      'netlify',
      'vite'
    ]
  },
  environment: {
    name: 'production',
    region: 'ap-south-1',
    timezone: 'Asia/Kolkata',
    locale: 'en-IN'
  },
  runtime: {
    port: 5173,
    baseUrl: 'https://vyakart.netlify.app',
    pagination: {
      pageSize: 12,
      maxPageSize: 100
    },
    features: {
      darkMode: 'system',
      reducedMotionDefault: false,
      enableAnimations: true,
      enableNetlifyForms: true,
      enableDeployPreviews: true
    }
  },
  logging: {
    level: 'info',
    format: 'json',
    destinations: [
      {
        type: 'console',
        enabled: true,
        options: {
          colorize: true,
          prettyPrint: false
        }
      },
      {
        type: 'sentry',
        enabled: false,
        options: {
          dsnEnvVar: 'SENTRY_DSN',
          tracesSampleRate: 0.1
        }
      }
    ]
  },
  security: {
    secrets: {
      strategy: 'env',
      envPrefix: ''
    },
    allowedOrigins: ['https://vyakart.netlify.app'],
    cors: {
      enabled: true,
      origins: ['https://vyakart.netlify.app'],
      methods: ['GET', 'POST', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization'],
      credentials: false,
      maxAgeSeconds: 86400
    },
    rateLimiting: {
      enabled: true,
      windowSeconds: 60,
      maxRequests: 100,
      keyStrategy: 'ip'
    },
    auth: {
      providers: [
        {
          name: 'none',
          enabled: true,
          options: {}
        }
      ],
      tokenLifetimes: {
        accessTokenSeconds: 3600,
        refreshTokenSeconds: 2592000
      }
    }
  },
  database: {
    type: 'none',
    host: '',
    port: 0,
    name: '',
    user: '',
    ssl: false,
    pool: {
      min: 0,
      max: 5,
      idleMillis: 10000
    },
    migrations: {
      enabled: false,
      directory: './migrations',
      autoRun: false
    }
  },
  cache: {
    provider: 'none',
    connection: {
      host: '',
      port: 0,
      passwordEnvVar: ''
    },
    ttls: {
      defaultSeconds: 300,
      contentSeconds: 900
    }
  },
  queues: {
    provider: 'none',
    concurrency: 5,
    retry: {
      maxAttempts: 5,
      backoff: {
        type: 'exponential',
        initialDelayMs: 1000,
        maxDelayMs: 60000
      }
    }
  },
  integrations: [
    {
      name: 'github',
      enabled: true,
      baseUrl: 'https://api.github.com',
      credentials: {
        tokenEnvVar: 'GITHUB_TOKEN'
      },
      timeouts: {
        requestMs: 10000
      }
    },
    {
      name: 'openai',
      enabled: false,
      baseUrl: 'https://api.openai.com',
      credentials: {
        apiKeyEnvVar: 'OPENAI_API_KEY'
      },
      timeouts: {
        requestMs: 20000
      }
    }
  ],
  observability: {
    metrics: {
      enabled: false,
      provider: 'none',
      options: {}
    },
    tracing: {
      enabled: false,
      provider: 'none',
      sampleRate: 0.0
    },
    healthchecks: {
      enabled: true,
      endpoints: ['/healthz']
    }
  },
  storage: {
    provider: 'netlify',
    bucket: '',
    basePath: '/',
    cdn: {
      enabled: false,
      baseUrl: ''
    },
    paths: {
      assets: '/assets/',
      images: '/assets/images/',
      videos: '/assets/videos/'
    }
  },
  networking: {
    ipAllowlist: [],
    proxies: {
      enabled: false,
      rules: []
    },
    timeouts: {
      connectMs: 5000,
      readMs: 15000
    },
    retries: {
      enabled: true,
      maxAttempts: 3
    }
  },
  i18n: {
    defaultLocale: 'en',
    supportedLocales: ['en']
  },
  build: {
    commitSha: '',
    buildNumber: '',
    releaseChannel: 'stable',
    featureGates: ['site-core']
  },
  deploy: {
    platform: 'netlify',
    siteName: 'vyakart',
    customDomain: '',
    buildCommand: 'npm run build',
    outputDir: 'dist',
    deployPreviews: {
      enabled: true,
      context: 'deploy-preview'
    },
    headers: {
      strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
      contentSecurityPolicy:
        "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' https:; connect-src 'self' https:; font-src 'self' https: data:",
      xContentTypeOptions: 'nosniff',
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: 'geolocation=(), microphone=(), camera=()'
    },
    redirects: [
      {
        from: '/old-path',
        to: '/new-path',
        status: 301
      }
    ]
  },
  seo: {
    title: 'Vyakart',
    description: 'Oliemannetje',
    robots: 'index, follow',
    canonicalDomain: 'https://vyakart.netlify.app',
    openGraph: {
      title: 'Vyakart',
      description: 'Oliemannetje',
      image: '/assets/og-image.png'
    },
    twitter: {
      card: 'summary_large_image',
      handle: '@vyakart'
    },
    sitemap: {
      enabled: true,
      path: '/sitemap.xml'
    }
  },
  content: {
    navigation: [
      { label: 'Home', path: '/' },
      { label: 'About', path: '/#about' },
      { label: 'Passions', path: '/#interests' },
      { label: 'Contact', path: '/#contact' }
    ],
    hero: {
      headline: 'Nishit/Vyakart',
      subheadline: 'Oliemannetje',
      primaryCta: { label: 'Discover More', url: '/#about' }
    },
    footer: {
      links: [
        { label: 'GitHub', url: 'https://github.com/vyakart' },
        { label: 'X', url: 'https://x.com/vyakart' }
      ],
      copyright: '© 2025 Vyakart'
    }
  },
  forms: {
    contact: {
      enabled: true,
      formName: 'contact',
      fields: ['name', 'email', 'message'],
      spamProtection: {
        honeypot: 'bot-field',
        recaptcha: {
          enabled: false,
          siteKeyEnvVar: 'RECAPTCHA_SITE_KEY'
        }
      },
      notifications: {
        email: 'vyakart@tuta.io',
        webhookUrlEnvVar: ''
      }
    }
  },
  analytics: {
    provider: 'none',
    googleAnalytics: {
      measurementIdEnvVar: 'GA_MEASUREMENT_ID'
    },
    plausible: {
      domain: 'vyakart.netlify.app'
    }
    // sentry optional not provided/enabled
  },
  experimental: {
    flags: {
      newHeroVariant: false,
      optimizeLCPImages: true
    }
  }
};

// Helper accessors for common areas
export const getSeoDefaults = (): SEO => appConfig.seo;
export const getNav = (): NavItem[] => appConfig.content.navigation;
export const getHero = (): HeroContent => appConfig.content.hero;
export const getFooter = (): FooterContent => appConfig.content.footer;