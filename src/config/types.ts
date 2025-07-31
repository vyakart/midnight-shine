/**
 * Strongly typed configuration schema for the site.
 * Mirrors the provided JSON structure and is safe for client-side import.
 * Note: Do not place secrets in this config; reference environment variable names if needed.
 */

export interface AppMeta {
  /** Human-friendly application name */
  name: string;
  /** Short description used in metadata and docs */
  description: string;
  /** List of owner contact identifiers (emails, usernames) */
  owners: string[];
  /** Keyword tags for categorization */
  tags: string[];
}

export interface Environment {
  /** Environment name (e.g., production, staging, development) */
  name: string;
  /** Hosting region identifier (string for flexibility) */
  region: string;
  /** IANA timezone name */
  timezone: string;
  /** Locale code (e.g., en, en-IN) */
  locale: string;
}

export interface Pagination {
  /** Default page size for lists */
  pageSize: number;
  /** Maximum allowed page size */
  maxPageSize: number;
}

export interface RuntimeFeatures {
  /** darkMode behavior: 'system' | 'on' | 'off' (string to allow future variants) */
  darkMode: string;
  /** Respect prefers-reduced-motion by default */
  reducedMotionDefault: boolean;
  /** Toggle global animations */
  enableAnimations: boolean;
  /** Enable Netlify Forms integration */
  enableNetlifyForms: boolean;
  /** Enable Netlify Deploy Previews */
  enableDeployPreviews: boolean;
}

export interface Runtime {
  /** Dev server port (used locally) */
  port: number;
  /** Canonical base URL of the deployment */
  baseUrl: string;
  /** Pagination defaults */
  pagination: Pagination;
  /** Feature flags for runtime behavior */
  features: RuntimeFeatures;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogFormat = 'json' | 'pretty';

export interface LogDestinationConsoleOptions {
  colorize: boolean;
  prettyPrint: boolean;
}

export interface LogDestinationSentryOptions {
  /** Environment variable name containing DSN */
  dsnEnvVar: string;
  /** Sampling rate for traces 0..1 */
  tracesSampleRate: number;
}

export type LogDestinationType = 'console' | 'sentry' | 'http' | 'file';

export interface LogDestination {
  type: LogDestinationType;
  enabled: boolean;
  options?: Partial<LogDestinationConsoleOptions & LogDestinationSentryOptions & Record<string, unknown>>;
}

export interface Logging {
  level: LogLevel;
  format: LogFormat;
  destinations: LogDestination[];
}

export interface SecretsConfig {
  /** Strategy for secret resolution; typically 'env' */
  strategy: 'env' | string;
  /** Optional prefix for env vars */
  envPrefix: string;
}

export interface CorsConfig {
  enabled: boolean;
  origins: string[];
  methods: string[];
  headers: string[];
  credentials: boolean;
  maxAgeSeconds: number;
}

export interface RateLimitingConfig {
  enabled: boolean;
  windowSeconds: number;
  maxRequests: number;
  /** Strategy for keying clients (e.g., 'ip', 'userId') */
  keyStrategy: string;
}

export interface AuthProvider {
  name: string;
  enabled: boolean;
  options: Record<string, unknown>;
}

export interface TokenLifetimes {
  accessTokenSeconds: number;
  refreshTokenSeconds: number;
}

export interface AuthConfig {
  providers: AuthProvider[];
  tokenLifetimes: TokenLifetimes;
}

export interface Security {
  secrets: SecretsConfig;
  allowedOrigins: string[];
  cors: CorsConfig;
  rateLimiting: RateLimitingConfig;
  auth: AuthConfig;
}

export interface DbPoolConfig {
  min: number;
  max: number;
  idleMillis: number;
}

export interface DbMigrationsConfig {
  enabled: boolean;
  directory: string;
  autoRun: boolean;
}

export interface Database {
  /** DB type (e.g., 'none', 'postgres', 'mysql', 'sqlite') */
  type: string;
  host: string;
  port: number;
  name: string;
  user: string;
  ssl: boolean;
  pool: DbPoolConfig;
  migrations: DbMigrationsConfig;
}

export interface CacheConnection {
  host: string;
  port: number;
  /** Env var containing password/secret if needed */
  passwordEnvVar: string;
}

export interface CacheTtls {
  defaultSeconds: number;
  contentSeconds: number;
}

export interface Cache {
  /** Cache provider (e.g., 'none', 'redis') */
  provider: string;
  connection: CacheConnection;
  ttls: CacheTtls;
}

export interface RetryBackoff {
  type: 'fixed' | 'exponential' | string;
  initialDelayMs: number;
  maxDelayMs: number;
}

export interface QueueRetry {
  maxAttempts: number;
  backoff: RetryBackoff;
}

export interface Queues {
  /** Queue provider (e.g., 'none', 'bullmq', 'sqs') */
  provider: string;
  concurrency: number;
  retry: QueueRetry;
}

export interface IntegrationCredentials {
  /** Generic token env var key if applicable */
  tokenEnvVar?: string;
  /** Generic API key env var key if applicable */
  apiKeyEnvVar?: string;
  /** Additional keys if needed */
  [k: string]: string | undefined;
}

export interface IntegrationTimeouts {
  requestMs: number;
}

export interface Integration {
  name: string;
  enabled: boolean;
  baseUrl: string;
  credentials: IntegrationCredentials;
  timeouts: IntegrationTimeouts;
}

export interface MetricsConfig {
  enabled: boolean;
  provider: string;
  options: Record<string, unknown>;
}

export interface TracingConfig {
  enabled: boolean;
  provider: string;
  sampleRate: number;
}

export interface HealthchecksConfig {
  enabled: boolean;
  endpoints: string[];
}

export interface Observability {
  metrics: MetricsConfig;
  tracing: TracingConfig;
  healthchecks: HealthchecksConfig;
}

export interface CdnConfig {
  enabled: boolean;
  baseUrl: string;
}

export interface StoragePaths {
  assets: string;
  images: string;
  videos: string;
}

export interface Storage {
  /** Storage provider; for static hosting use 'netlify' */
  provider: string;
  bucket: string;
  basePath: string;
  cdn: CdnConfig;
  paths: StoragePaths;
}

export interface ProxyRule {
  from?: string;
  to?: string;
  status?: number;
  [k: string]: unknown;
}

export interface ProxiesConfig {
  enabled: boolean;
  rules: ProxyRule[];
}

export interface TimeoutsConfig {
  connectMs: number;
  readMs: number;
}

export interface RetriesConfig {
  enabled: boolean;
  maxAttempts: number;
}

export interface Networking {
  ipAllowlist: string[];
  proxies: ProxiesConfig;
  timeouts: TimeoutsConfig;
  retries: RetriesConfig;
}

export interface I18n {
  defaultLocale: string;
  supportedLocales: string[];
}

export interface Build {
  commitSha: string;
  buildNumber: string;
  releaseChannel: string;
  featureGates: string[];
}

export interface DeployRedirect {
  from: string;
  to: string;
  status: number;
}

export interface DeployPreviews {
  enabled: boolean;
  context: string;
}

export interface DeployHeaders {
  strictTransportSecurity: string;
  contentSecurityPolicy: string;
  xContentTypeOptions: string;
  referrerPolicy: string;
  permissionsPolicy: string;
}

export interface Deploy {
  platform: string;
  siteName: string;
  customDomain: string;
  buildCommand: string;
  outputDir: string;
  deployPreviews: DeployPreviews;
  headers: DeployHeaders;
  redirects: DeployRedirect[];
}

export interface OpenGraph {
  title: string;
  description: string;
  image: string;
}

export interface TwitterCard {
  card: string;
  handle: string;
}

export interface SitemapConfig {
  enabled: boolean;
  path: string;
}

export interface SEO {
  title: string;
  description: string;
  robots: string;
  canonicalDomain: string;
  openGraph: OpenGraph;
  twitter: TwitterCard;
  sitemap: SitemapConfig;
}

export interface NavItem {
  label: string;
  path: string;
}

export interface HeroCta {
  label: string;
  url: string;
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  primaryCta: HeroCta;
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterContent {
  links: FooterLink[];
  copyright: string;
}

export interface ContentConfig {
  navigation: NavItem[];
  hero: HeroContent;
  footer: FooterContent;
}

export interface RecaptchaConfig {
  enabled: boolean;
  siteKeyEnvVar: string;
}

export interface SpamProtection {
  honeypot: string;
  recaptcha: RecaptchaConfig;
}

export interface FormNotifications {
  email: string;
  webhookUrlEnvVar: string;
}

export interface ContactFormConfig {
  enabled: boolean;
  formName: string;
  fields: string[];
  spamProtection: SpamProtection;
  notifications: FormNotifications;
}

export interface Forms {
  contact: ContactFormConfig;
}

export interface AnalyticsGA {
  measurementIdEnvVar: string;
}

export interface AnalyticsPlausible {
  domain: string;
}

export interface AnalyticsSentry {
  dsnEnvVar: string;
  environment: string;
  sampleRate: number;
}

export interface Analytics {
  /** 'none' | 'ga' | 'plausible' | 'sentry' etc. */
  provider: string;
  googleAnalytics: AnalyticsGA;
  plausible: AnalyticsPlausible;
  sentry?: AnalyticsSentry;
}

export interface ExperimentalFlags {
  [flagName: string]: boolean;
}

export interface Experimental {
  flags: ExperimentalFlags;
}

export interface MetaInfo {
  createdBy: string;
  createdAt: string;
  lastUpdated: string;
  migrationNotes: string;
}

export interface Config {
  schemaVersion: string;
  _meta: MetaInfo;
  app: AppMeta;
  environment: Environment;
  runtime: Runtime;
  logging: Logging;
  security: Security;
  database: Database;
  cache: Cache;
  queues: Queues;
  integrations: Integration[];
  observability: Observability;
  storage: Storage;
  networking: Networking;
  i18n: I18n;
  build: Build;
  deploy: Deploy;
  seo: SEO;
  content: ContentConfig;
  forms: Forms;
  analytics: Analytics;
  experimental: Experimental;
}