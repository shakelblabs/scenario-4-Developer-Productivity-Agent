# /explore — Codebase Exploration Skill

Explore how a feature or flow works in this codebase. Uses Grep → Glob → Read strategy, delegates deep dives to the deep-explorer subagent, and persists findings to scratchpad.md.

## Usage
```
/explore <feature or question>
```

## Examples
```
/explore password reset flow
/explore order data model
/explore auth middleware
```

## What This Command Does (Step by Step)

**Phase 1 — Search (never read first)**
1. Grep for the feature keyword across the codebase
2. Glob for files matching the feature name pattern
3. Build a shortlist of relevant files (max 5)

**Phase 2 — Read Selectively**
4. Read only the shortlisted files
5. Follow imports one level deep if needed
6. Stop reading when the flow is clear

**Phase 3 — Check Scratchpad**
7. Read `scratchpad.md` — have we explored this before?
8. If yes: supplement prior findings, don't re-explore from scratch

**Phase 4 — Answer**
9. Explain the feature clearly: entry point → flow → exit
10. Cite every file referenced (filename + line range)

**Phase 5 — Persist**
11. Append findings to `scratchpad.md` under a new `## [Topic]` heading
12. Keep the entry to 5 bullets maximum

## Deep Dive Variant
If the feature is complex (5+ files), delegate to the `deep-explorer` subagent:
> "Use the deep-explorer subagent to explore [feature], then summarise the result here and save key findings to scratchpad.md"

## Plan Mode Note (Task 3.4)
This command always runs in plan-style:
- Show the search strategy BEFORE executing it
- List which files you intend to read BEFORE reading them
- Only execute direct (no plan) for single-line edits
