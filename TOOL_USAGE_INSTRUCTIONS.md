# TOOL_USAGE_INSTRUCTIONS.md

## When & How to Call External Tools

### Tool Categories

1. **AI Services** (OpenAI, Anthropic)
2. **Storage Services** (localStorage, IndexedDB)
3. **System Integration** (WebSocket PTY, File System API)
4. **External APIs** (Weather, News, Documentation)

---

### OpenAI Integration

#### When to Use
- Natural language queries prefixed with "nishito"
- Code generation requests
- Complex problem solving
- Language translation

#### Implementation
```typescript
interface OpenAIConfig {
  apiKey: string;
  model: 'gpt-3.5-turbo' | 'gpt-4';
  temperature: number;
  maxTokens: number;
  stream: boolean;
}

async function callOpenAI(prompt: string, config: OpenAIConfig) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      stream: config.stream,
    }),
  });
  
  if (!response.ok) {
    throw new OpenAIError(response.status, await response.text());
  }
  
  return response;
}
```

#### Rate Limiting Strategy
```typescript
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests = 60;
  private readonly timeWindow = 60000; // 1 minute
  
  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    return this.requests.length < this.maxRequests;
  }
  
  recordRequest(): void {
    this.requests.push(Date.now());
  }
  
  timeUntilNextRequest(): number {
    if (this.canMakeRequest()) return 0;
    const oldestRequest = Math.min(...this.requests);
    return this.timeWindow - (Date.now() - oldestRequest);
  }
}
```

---

### LocalStorage Management

#### When to Use
- Persisting user preferences
- Caching API responses
- Storing file system state
- Saving command history

#### Best Practices
```typescript
class StorageManager {
  private readonly prefix = 'nishitos_';
  private readonly maxSize = 5 * 1024 * 1024; // 5MB
  
  set(key: string, value: any): boolean {
    try {
      const serialized = JSON.stringify(value);
      
      // Check size before storing
      if (this.getStorageSize() + serialized.length > this.maxSize) {
        this.cleanup();
      }
      
      localStorage.setItem(this.prefix + key, serialized);
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        this.handleQuotaExceeded();
      }
      return false;
    }
  }
  
  get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }
  
  private cleanup(): void {
    // Remove oldest entries based on timestamp
    const entries = this.getAllEntries();
    entries.sort((a, b) => a.timestamp - b.timestamp);
    
    // Remove oldest 20%
    const toRemove = Math.floor(entries.length * 0.2);
    entries.slice(0, toRemove).forEach(entry => {
      localStorage.removeItem(entry.key);
    });
  }
}
```

#### Backup Strategy
```typescript
interface BackupConfig {
  autoBackup: boolean;
  backupInterval: number; // milliseconds
  maxBackups: number;
}

class BackupManager {
  async createBackup(): Promise<Blob> {
    const data = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      filesystem: this.storage.get('filesystem'),
      preferences: this.storage.get('preferences'),
      history: this.storage.get('history'),
    };
    
    return new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
  }
  
  async restoreBackup(file: File): Promise<void> {
    const text = await file.text();
    const data = JSON.parse(text);
    
    // Validate backup format
    if (!this.isValidBackup(data)) {
      throw new Error('Invalid backup file');
    }
    
    // Restore data
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'timestamp' && key !== 'version') {
        this.storage.set(key, value);
      }
    });
  }
}
```

---

### WebSocket PTY Integration

#### When to Use
- Real terminal emulation
- Remote command execution
- Interactive shell sessions
- Container management

#### Implementation
```typescript
class PTYWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnects = 5;
  
  connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        resolve();
      };
      
      this.ws.onerror = (error) => {
        reject(error);
      };
      
      this.ws.onclose = () => {
        this.handleDisconnect();
      };
    });
  }
  
  send(data: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'input',
        data: data,
      }));
    }
  }
  
  private handleDisconnect(): void {
    if (this.reconnectAttempts < this.maxReconnects) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect(this.lastUrl).catch(console.error);
      }, Math.pow(2, this.reconnectAttempts) * 1000);
    }
  }
}
```

---

### External API Guidelines

#### Request Management
```typescript
interface APIConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}

class APIClient {
  constructor(private config: APIConfig) {}
  
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i <= this.config.retries; i++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.config.timeout);
        
        const response = await fetch(`${this.config.baseURL}${endpoint}`, {
          ...options,
          headers: {
            ...this.config.headers,
            ...options.headers,
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeout);
        
        if (!response.ok) {
          throw new HTTPError(response.status, response.statusText);
        }
        
        return await response.json();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors
        if (error instanceof HTTPError && error.status < 500) {
          throw error;
        }
        
        // Exponential backoff
        if (i < this.config.retries) {
          await this.sleep(Math.pow(2, i) * 1000);
        }
      }
    }
    
    throw lastError!;
  }
}
```

---

### Error Handling & Fallbacks

#### Graceful Degradation
```typescript
class ToolManager {
  async executeWithFallback<T>(
    primary: () => Promise<T>,
    fallback: () => Promise<T>,
    context: string
  ): Promise<T> {
    try {
      return await primary();
    } catch (error) {
      console.warn(`Primary ${context} failed:`, error);
      
      try {
        return await fallback();
      } catch (fallbackError) {
        console.error(`Fallback ${context} also failed:`, fallbackError);
        throw new Error(`Both primary and fallback ${context} failed`);
      }
    }
  }
}

// Usage example
const result = await toolManager.executeWithFallback(
  () => callOpenAI(prompt, config),
  () => getOfflineResponse(prompt),
  'AI response generation'
);
```

---

### Monitoring & Metrics

#### Tool Usage Tracking
```typescript
interface ToolMetrics {
  toolName: string;
  callCount: number;
  successCount: number;
  errorCount: number;
  averageLatency: number;
  lastError?: string;
  lastUsed: Date;
}

class MetricsCollector {
  private metrics = new Map<string, ToolMetrics>();
  
  recordCall(toolName: string, success: boolean, latency: number, error?: Error): void {
    const current = this.metrics.get(toolName) || this.createEmptyMetrics(toolName);
    
    current.callCount++;
    if (success) {
      current.successCount++;
    } else {
      current.errorCount++;
      current.lastError = error?.message;
    }
    
    // Update average latency
    current.averageLatency = 
      (current.averageLatency * (current.callCount - 1) + latency) / current.callCount;
    
    current.lastUsed = new Date();
    this.metrics.set(toolName, current);
  }
  
  getHealthStatus(): Record<string, 'healthy' | 'degraded' | 'down'> {
    const status: Record<string, 'healthy' | 'degraded' | 'down'> = {};
    
    this.metrics.forEach((metrics, toolName) => {
      const errorRate = metrics.errorCount / metrics.callCount;
      
      if (errorRate > 0.5) {
        status[toolName] = 'down';
      } else if (errorRate > 0.1) {
        status[toolName] = 'degraded';
      } else {
        status[toolName] = 'healthy';
      }
    });
    
    return status;
  }
}
```

---

### Security Considerations

#### API Key Management
```typescript
class SecureKeyManager {
  private keys = new Map<string, string>();
  
  setKey(service: string, key: string): void {
    // Never store keys in plain text in production
    // Use environment variables or secure key management service
    if (import.meta.env.PROD) {
      console.warn('Attempting to set API key in production mode');
      return;
    }
    
    this.keys.set(service, this.encrypt(key));
  }
  
  getKey(service: string): string | undefined {
    const encrypted = this.keys.get(service);
    return encrypted ? this.decrypt(encrypted) : undefined;
  }
  
  private encrypt(text: string): string {
    // Implement proper encryption in production
    return btoa(text);
  }
  
  private decrypt(encrypted: string): string {
    // Implement proper decryption in production
    return atob(encrypted);
  }
}
```

#### Request Sanitization
```typescript
function sanitizeForAPI(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim()
    .slice(0, 1000); // Limit length
}