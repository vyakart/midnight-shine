# CHAT_INSTRUCTIONS.md

## How the Agent Should Handle CLI Commands vs Chat Queries

### Command Detection & Routing

#### CLI Command Pattern
```bash
# Direct command execution
$ ls -la
$ cd /home/user/projects
$ cat README.md

# These go to command handlers, NOT chat
```

#### Chat Query Pattern
```bash
# Prefixed with "nishito" or "nishi"
$ nishito explain how React hooks work
$ nishi help me optimize this SQL query

# These go to AI chat completion
```

---

### Decision Tree

```
User Input
    │
    ├─ Starts with "nishito " or "nishi "?
    │   │
    │   ├─ YES → Route to Chat AI
    │   │         └─ Stream response with color coding
    │   │
    │   └─ NO → Continue to command check
    │
    └─ Is it a known command?
        │
        ├─ YES → Execute command handler
        │         └─ Show command output
        │
        └─ NO → Show "command not found"
                └─ Suggest using "nishito" for help
```

---

### Chat Integration Examples

#### Basic Query
```bash
$ nishito what is a monad?

Nishito: A monad is a design pattern that wraps values and provides:
  • A way to wrap values (return/unit)
  • A way to chain operations (bind/flatMap)
  • Follows three laws: left identity, right identity, associativity
  
Think of it as a "computational context" like Maybe, List, or IO.
```

#### Code Help
```bash
$ nishito fix this React error: "Cannot update during render"

Nishito: This error occurs when you're calling setState during render. 

**Quick Fix**:
```javascript
// ❌ Wrong - updating state during render
function Component() {
  const [count, setCount] = useState(0);
  if (count === 0) {
    setCount(1); // This causes the error
  }
}

// ✅ Correct - update in useEffect
function Component() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count === 0) {
      setCount(1);
    }
  }, [count]);
}
```
```

#### System Task Assistance
```bash
$ nishito how do I find large files in this directory?

Nishito: Use the `find` command with size filters:

```bash
# Files larger than 100MB
find . -type f -size +100M

# With human-readable sizes
find . -type f -size +100M -exec ls -lh {} \;

# Top 10 largest files
find . -type f -exec ls -la {} \; | sort -k5 -nr | head -10
```
```

---

### Special Chat Commands

#### Mode Switching
```bash
$ nishito switch to meditation mode
$ zen begin breathing exercise
$ switch nishi  # Back to default mode
```

#### Context-Aware Responses
```bash
# In a Python project directory
$ nishito suggest project structure

Nishito: Based on your Python project, I recommend:
```
project/
├── src/
│   ├── __init__.py
│   ├── main.py
│   └── modules/
├── tests/
├── docs/
├── requirements.txt
├── setup.py
└── README.md
```

# In a React project
$ nishito suggest project structure

Nishito: For your React app, consider:
```
src/
├── components/
├── hooks/
├── utils/
├── pages/
├── styles/
└── App.tsx
```
```

---

### Response Formatting

#### Color Coding
- **User input**: Default terminal color
- **Nishito label**: Cyan (`\x1b[1;36m`)
- **Code blocks**: Green (`\x1b[1;32m`)
- **Warnings**: Yellow (`\x1b[1;33m`)
- **Errors**: Red (`\x1b[1;31m`)

#### Streaming Behavior
```javascript
// Stream response character by character
async function streamResponse(text, terminal) {
  const label = '\x1b[1;36mNishito:\x1b[0m ';
  terminal.write(label);
  
  for (const char of text) {
    terminal.write(char);
    await sleep(30); // Typewriter effect
  }
  
  terminal.writeln('');
}
```

---

### Error Handling

#### API Failures
```bash
$ nishito explain quantum computing

Nishito: [Error] Unable to connect to AI service. 
Please check your API key or try again later.

💡 Tip: You can set VITE_OPENAI_API_KEY in your .env file
```

#### Rate Limiting
```bash
$ nishito [multiple rapid requests]

Nishito: ⚠️ Rate limit reached. Please wait 60 seconds.
Alternative: Use local commands like 'help' or 'man'
```

---

### Context Persistence

#### Chat History
- Store last 50 exchanges in localStorage
- Key: `nishito-chat-history`
- Format: Array of `{role, content, timestamp}`

#### Session Continuity
```bash
$ nishito remember we were discussing Python decorators

Nishito: Yes, we were exploring how decorators work as 
higher-order functions. Would you like to continue with 
practical examples or dive into decorator factories?
```

---

### Integration Examples

#### With File System
```bash
$ nishito analyze package.json

Nishito: Reading package.json...

Your project uses:
• React 18.2.0
• TypeScript 5.0.2
• Vite for bundling
• 23 total dependencies

Suggestions:
- Update @types/react to match React version
- Consider adding husky for git hooks
```

#### With Commands
```bash
$ nishito what files should I add to .gitignore?

Nishito: Based on your project type, add these:

# Dependencies
node_modules/
.pnp.*

# Build outputs
dist/
build/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/

Run: echo "node_modules/" >> .gitignore
```

---

### Personality Traits

#### Technical Responses
- Assume intermediate technical knowledge
- Provide code examples when relevant
- Cite documentation sources

#### Conversational Elements
- Light humor when appropriate
- Acknowledge uncertainty
- Offer alternative approaches

#### Easter Eggs
```bash
$ nishito sudo make me a sandwich

Nishito: 🥪 I'd suggest a nice dal sandwich with 
roasted oyster mushrooms. Much more nutritious 
than whatever sudo had in mind!

$ nishito tell me a joke

Nishito: Why do programmers prefer dark mode?
Because light attracts bugs! 🐛

*ba dum tss* 🥁