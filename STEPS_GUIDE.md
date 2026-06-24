# Developer Productivity Agent — Full Steps Guide
# Read this before touching VS Code

---

## BEFORE YOU START — One-Time Setup

### 1. Copy the project folder into your blank folder
Copy the entire `dev-productivity-agent/` folder contents into your blank task folder.
Your folder should look like this when done:
```
your-blank-folder/
├── CLAUDE.md
├── MASTER_PROMPT.md
├── STEPS_GUIDE.md        ← this file
├── scratchpad.md
├── .mcp.json
├── .claude/
│   ├── agents/
│   │   └── deep-explorer.md
│   └── commands/
│       └── explore.md
└── demo-app/
    ├── CLAUDE.md
    ├── auth/
    ├── models/
    ├── routes/
    ├── services/
    └── middleware/
```

### 2. Open the folder in VS Code
```
code your-blank-folder
```

### 3. Open Claude Code terminal inside VS Code
- Press `Ctrl+Shift+P` → type "Claude" → open Claude Code panel
  OR
- Open terminal → type `claude` and press Enter

---

## PHASE 1 — One-Time MCP Registration (do this before the video)

Run this command ONCE in your terminal (not inside Claude Code — in your regular terminal):
```bash
claude mcp add --scope project context7 -- npx -y @upstash/context7-mcp@latest
```

Verify it worked:
```bash
claude mcp list
```
You should see `context7` listed. If you do, MCP is ready.

> **Why not in video?** MCP registration is a one-time setup step. Do it before recording so your video focuses on the agent capabilities.

---

## PHASE 2 — Start Claude Code Session

Open Claude Code in VS Code (Ctrl+Shift+P → Claude Code, or `claude` in terminal).

**First thing to do:** paste this to initialise the session:
```
Read CLAUDE.md and scratchpad.md, then confirm you're ready to explore the demo-app codebase.
```

Claude should confirm it read both files and is ready.

---

## PHASE 3 — Run the 3 Required Prompts (RECORD THESE)

These are the exact prompts required by the rubric. Run them word-for-word.

### Required Prompt 1
```
How does the password-reset flow work here?
```
**What to watch for:**
- Claude uses Grep FIRST (not Read)
- Traces: routes/auth.ts → auth/passwordReset.ts → services/tokenService.ts → services/emailService.ts
- Explains the 2-step flow (request → reset)
- Appends to scratchpad.md at the end

### Required Prompt 2
```
Summarize the data model for orders.
```
**What to watch for:**
- Claude Greps for "order"
- Reads models/order.ts and routes/orders.ts
- Explains: fields, OrderStatus state machine (pending→confirmed→shipped→delivered), totals calculation
- Saves a note to scratchpad.md

### Required Prompt 3
```
Deep-dive the auth middleware in a subagent, then return a concise parent summary and persist key findings in scratchpad.
```
**What to watch for:**
- Claude spawns the `deep-explorer` subagent
- Subagent does the heavy reading (auth/middleware.ts) in ITS OWN context
- Parent receives only the summary (not raw file content)
- scratchpad.md gets updated

---

## PHASE 4 — Demonstrate Supporting Concepts (for video or self-check)

### Plan Mode vs Direct (Task 3.4)
Run both of these:
```
Fix the typo in errorHandler.ts — change "Internal server error." to "An internal server error occurred."
```
→ Claude should execute this DIRECTLY (single line, no plan)

```
How does the order status state machine enforce valid transitions?
```
→ Claude should PLAN first (show which files it will search/read before doing it)

### Slash Command (Task 3.2)
In Claude Code, type:
```
/explore auth middleware
```
→ Claude should recognise the /explore command and run the exploration workflow

### MCP Docs (Task 2.4)
Ask:
```
How does jsonwebtoken's sign() function work? use context7
```
→ Claude should pull live docs from Context7 MCP and cite them

---

## PHASE 5 — Verify All Evidence is Present

Before ending the session, run:
```
Read scratchpad.md and summarise everything you learned in this session.
```

Your scratchpad.md should now have entries for:
- Password Reset Flow
- Orders Data Model
- Auth Middleware

This proves the scratchpad persistence (Task 5.4).

---

## WHAT PROVES EACH TASK

| Task | What proves it | Where it happens |
|------|---------------|-----------------|
| 1.3 Subagent invocation | deep-explorer spawned in Prompt 3 | .claude/agents/deep-explorer.md |
| 2.1 Tool interfaces | CLAUDE.md tool table + Grep/Glob/Read usage | Root CLAUDE.md |
| 2.4 MCP servers | Context7 registered + used for docs | .mcp.json |
| 2.5 Built-in tools | Grep first, Glob second, Read only relevant | All 3 prompts |
| 3.1 CLAUDE.md hierarchy | Root + demo-app/ scoped + subagent prompt | 3 separate CLAUDE.md files |
| 3.2 Slash commands | /explore command works | .claude/commands/explore.md |
| 3.4 Plan vs direct | Single-line edit = direct; exploration = plan | Phase 4 demo |
| 5.4 Large codebase context | Scratchpad persists across questions | scratchpad.md |

---

## COMMON ISSUES

**Claude reads whole files before Grepping:**
→ Remind it: "Follow the CLAUDE.md rule: Grep first, then Read"

**Subagent doesn't spawn for Prompt 3:**
→ Make sure the prompt contains "deep-dive" — that's the trigger word in deep-explorer.md's description

**MCP not found:**
→ Re-run: `claude mcp add --scope project context7 -- npx -y @upstash/context7-mcp@latest`
→ Restart Claude Code session

**scratchpad.md not updated:**
→ Remind Claude: "Remember to append your findings to scratchpad.md as per CLAUDE.md rules"
