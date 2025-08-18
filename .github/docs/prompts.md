# Copilot Prompt Templates for AcquiTrack

These are ready-to-use prompt templates to guide Copilot while building AcquiTrack. Each template references `copilot-instructions.md` to ensure Copilot stays aligned.

---

## 0) Session Kickoff (once per new chat)
Before we start: ALWAYS follow everything in `copilot-instructions.md`. Use Angular 20+ (standalone), Signals-first, PrimeNG + Nora with Tailwind tokens, no Angular Material/Bootstrap, diffs only, tests as you go.  
Acknowledge you’ve loaded and will follow it.

---

## 1) Scaffold a Feature (folder, routes, mocks, tests)
Scaffold the `<feature-name>` feature exactly per `copilot-instructions.md`:
- Feature folder under `src/app/features/<feature-name>/`
- Standalone components (list/detail/form), Signals store, feature-scoped data service (mock repo now, HTTP later)
- Lazy route file `*.routes.ts` with route `data` (breadcrumb, roles)
- PrimeNG components only; Nora/Tailwind utilities; no custom tokens
- Unit tests for service + critical components  
Return a unified diff only.

---

## 2) Implement a Component (small, OnPush, a11y)
Create `<ComponentName>` in `features/<feature>/...`:
- Standalone + OnPush; `input()`/`output()` APIs
- Signals for local state; computed() for derived state
- PrimeNG + Nora utilities, no hardcoded colors
- Keyboard + ARIA per a11y guardrails
- Add a focused `.spec.ts` using Testing Library (queries by role/label)  
Show a unified diff only.

---

## 3) Refactor (diff-only, explain briefly)
Refactor `<path/to/file>` to align with `copilot-instructions.md`:
- Replace RxJS-heavy local state with Signals (keep HttpClient observable, convert to signal in service)
- Remove any legacy `*ngIf/*ngFor` in favor of `@if/@for`
- Enforce Tailwind+Nora utilities; remove hardcoded styles  
Explain rationale in 3 bullets, then show a unified diff only.

---

## 4) Styling Task (Nora/Tailwind only)
Style `<component>` to match Nora/Tailwind rules in `copilot-instructions.md`:
- Use Tailwind utilities backed by Nora tokens
- No custom tokens, no hex colors, no global overrides
- Ensure visible focus states; do not remove outlines  
Return diff for template + stylesheet (if any).

---

## 5) Routing + Guards + Breadcrumbs
Add lazy routes for `<feature>` in `features/<feature>/<feature>.routes.ts`:
- Route-level `data`: `{ breadcrumb: '<Label>', roles: ['<Role1>','<Role2>'] }`
- Wire `AuthGuard` + `RoleGuard`
- Update `app.config.ts` to include lazy route  
Return a unified diff across changed files.

---

## 6) Data Service with Signals (example-based)
Create/Update `features/<feature>/data/<feature>.service.ts` per `copilot-instructions.md`:
- HttpClient observable → convert to signal via `toSignal(...)`
- Add `catchError(() => of([]))` safety
- Expose signals only to components; no direct observables to UI  
Include imports (`catchError`, `of`) and return a unified diff.

---

## 7) Forms & Validation (accessible)
Build a reactive form for `<entity>` in `<component>`:
- PrimeNG form controls; disable submit until valid
- Validation errors tied via `aria-describedby`; messages via `<p-messages>/<p-message>`
- If multi-step, persist state between steps
- Add a component test verifying roles/labels/keyboard and error announcement  
Show a unified diff only.

---

## 8) Tables & Lists (p-table, server-side)
Implement `p-table` list for `<entity>`:
- Server-side pagination/sorting/filtering hooks
- Empty state + skeleton loaders
- `trackBy` with `@for`
- No legacy `p-dataTable`; current `p-table` APIs  
Return diff for component, template, and service.

---

## 9) Notifications & Errors
Add error handling per `copilot-instructions.md`:
- HttpInterceptor logs to Audit + generic toast for unexpected errors
- Inline form validation errors in feature components
- ConfirmDialog with clear labels for destructive actions  
Provide diffs for interceptor, module providers, and any feature components touched.

---

## 10) Testing (unit, component, e2e)
Add tests per `copilot-instructions.md`:
- Unit: service logic + pure utils
- Component: Testing Library by role/label; keyboard interaction; no snapshots
- e2e (Playwright): happy path for `<workflow>`
- Ensure coverage stays ≥80% lines & branches; fail CI if below  
Return only new/changed test files and minimal config diffs.

---

## 11) CI/CD & Budgets (Netlify preview)
Update CI (GitHub Actions) to enforce:
- Lint, typecheck, tests (coverage ≥80% lines & branches)
- Bundle size budget: initial JS ≤500kb **uncompressed** (Angular `budgets`)
- Netlify deploy preview on PR
- `npm audit` step  
Return a diff for workflow files + `angular.json` budget changes.

---

## 12) Accessibility Audit Fixes (quick pass)
Run an a11y pass on `<component>`:
- Ensure all interactive controls are reachable by keyboard and have labels
- Replace query-by-class tests with role/label queries
- Add/fix `aria-*` where needed; keep visible focus  
Return a unified diff for template + tests.

---

## 13) Bugfix / Triage (minimal, reversible)
Triage bug: "<short description>".
- Propose the smallest reversible fix aligned with `copilot-instructions.md`
- Provide 2–3 options with pros/cons, then recommend one
- Return a unified diff implementing the recommended fix + a narrow test

---

## 14) Code Review Gate
Review the diff I pasted against `copilot-instructions.md`. List:
1) Violations (libraries, styling, state, naming, a11y, tests)
2) Risky changes (perf, bundle, security)
3) Required fixes (blocking) vs nits (non-blocking)  
Keep it concise; no code unless you include a minimal, safe replacement snippet.

---

## 15) Commit Message (Conventional Commits + scopes)
Generate a Conventional Commit message with scopes (e.g., feat(pr), fix(vendor), chore(ci)):
- Type(scope): summary
- 1–3 bullet points (imperative, present tense)
- Include BREAKING CHANGE footer only if truly necessary

---

## 16) PR Description (checklist)
Draft a PR description:
- Summary
- Scope (files/features)
- Screenshots/gifs (if UI)
- Tests added/updated; coverage impact
- A11y notes (roles, keyboard, labels)
- CI/Netlify preview link
- Risks & rollback plan
- Checklist (lint, budgets, docs updated)

---

## Anti-Drift Macros
Re-anchor Copilot when it strays:

Re-anchor macro:
```
Re-anchor: check `copilot-instructions.md`. No Angular Material/Bootstrap; PrimeNG + Nora only. Standalone components, Signals-first, Tailwind tokens (no hex). Diffs only. If unsure, propose 2–3 options with trade-offs.
```

RxJS drift macro:
```
You drifted from the instructions: replace RxJS-heavy local state with Signals, keep HttpClient as observable → convert to signal in service via `toSignal`, and fix templates to use `@if/@for`.
```
