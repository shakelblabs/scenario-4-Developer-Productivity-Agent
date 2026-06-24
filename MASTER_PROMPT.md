# MASTER PROMPT — Developer Productivity Agent
# Paste this ENTIRE block into the Claude Code terminal (VS Code)

---

You are setting up a Developer Productivity Agent project. All files are already scaffolded in this folder. Your job is to verify the setup, wire everything together, and confirm each capability works.

Work through these steps IN ORDER. Do not skip any step.

---

## STEP 1 — Verify Project Structure
Read the root CLAUDE.md to understand your operating rules. Then list all files in the project to confirm the scaffold is complete.

Expected structure:
- CLAUDE.md (root)
- .mcp.json
- scratchpad.md
- .claude/agents/deep-explorer.md
- .claude/commands/explore.md
- demo-app/CLAUDE.md
- demo-app/auth/middleware.ts
- demo-app/auth/passwordReset.ts
- demo-app/models/order.ts
- demo-app/models/user.ts
- demo-app/routes/auth.ts
- demo-app/routes/orders.ts
- demo-app/services/emailService.ts
- demo-app/services/tokenService.ts
- demo-app/middleware/errorHandler.ts

Confirm all files exist, then say "✅ Step 1 complete — structure verified."

---

## STEP 2 — Register Context7 MCP Server
The .mcp.json file is already present. Run this command to register Context7 as a project-scoped MCP server:

```
claude mcp add --scope project context7 -- npx -y @upstash/context7-mcp@latest
```

After running it, verify with:
```
claude mcp list
```

Confirm context7 appears in the list, then say "✅ Step 2 complete — Context7 MCP registered."

---

## STEP 3 — Test Prompt 1 (Required for Video)
Run this EXACT prompt inside the Claude Code session (this is a required walkthrough prompt):

> "How does the password-reset flow work here?"

The agent MUST:
1. Use Grep first (search for "password" or "reset" keywords)
2. Use Glob to find relevant files
3. Read ONLY relevant files (not the whole codebase)
4. Trace the flow: routes/auth.ts → auth/passwordReset.ts → services/tokenService.ts → services/emailService.ts
5. Explain the full flow clearly
6. Append findings to scratchpad.md

After completing, say "✅ Step 3 complete — Prompt 1 demonstrated."

---

## STEP 4 — Test Prompt 2 (Required for Video)
Run this EXACT prompt inside the Claude Code session:

> "Summarize the data model for orders."

The agent MUST:
1. Grep for "order" or "Order" across the codebase
2. Read models/order.ts
3. Trace to routes/orders.ts to show how the model is used
4. Explain: fields, OrderStatus state machine, and totals calculation
5. Save a summary note to scratchpad.md under "## Orders Data Model"

After completing, say "✅ Step 4 complete — Prompt 2 demonstrated."

---

## STEP 5 — Test Prompt 3 (Required for Video)
Run this EXACT prompt inside the Claude Code session:

> "Deep-dive the auth middleware in a subagent, then return a concise parent summary and persist key findings in scratchpad."

The agent MUST:
1. Delegate to the deep-explorer subagent (defined in .claude/agents/deep-explorer.md)
2. The subagent reads auth/middleware.ts extensively in its own context
3. The subagent returns ONLY a structured summary (not raw file contents)
4. The parent agent receives the summary and keeps its own context clean
5. Parent appends findings to scratchpad.md under "## Auth Middleware"

After completing, say "✅ Step 5 complete — Prompt 3 / subagent demonstrated."

---

## STEP 6 — Verify Scratchpad Persistence
Read scratchpad.md and confirm it now contains entries from Steps 3, 4, and 5.

This proves that findings persist across questions (Task 5.4 — context in large codebase exploration).

Say "✅ Step 6 complete — scratchpad persistence verified."

---

## STEP 7 — Demonstrate Plan Mode vs Direct (Task 3.4)
Ask: "Fix the typo in the error message in middleware/errorHandler.ts — change 'Internal server error.' to 'An internal server error occurred.'"

- This is a single-line edit → execute DIRECTLY (no plan needed)
- Then ask: "How does the order status state machine work?" — this is exploration → show your Grep/Glob PLAN before executing

Say "✅ Step 7 complete — plan vs direct demonstrated."

---

## STEP 8 — Verify /explore Slash Command (Task 3.2)
Type `/explore auth middleware` in Claude Code.

Confirm the slash command is recognised and runs the exploration workflow defined in .claude/commands/explore.md.

Say "✅ Step 8 complete — /explore slash command verified."

---

## FINAL VERIFICATION
Read scratchpad.md one more time and summarise everything the agent learned during this session.

This session has demonstrated:
- ✅ Task 1.3: Subagent invocation (deep-explorer)
- ✅ Task 2.1: Tool interfaces (Grep/Glob/Read with clear descriptions in CLAUDE.md)
- ✅ Task 2.4: MCP server integration (Context7)
- ✅ Task 2.5: Built-in tools (Grep, Glob, Read, Write for scratchpad)
- ✅ Task 3.1: CLAUDE.md hierarchy (root + demo-app/ scoped + subagent)
- ✅ Task 3.2: Custom slash command (/explore)
- ✅ Task 3.4: Plan mode vs direct execution
- ✅ Task 5.4: Context management in large codebase via scratchpad + subagent

Say "✅ Developer Productivity Agent — all tasks verified."
