# AcquiTrack — Copilot Instructions (Angular 20+, PrimeNG + Nora)

> **Purpose**: This document tells Copilot (Claude Sonnet 4) exactly how to scaffold, design, and implement the **AcquiTrack** procurement acquisitions web app from a clean slate using **Angular 20+** and **PrimeNG** with the **Nora** preset (default light theme). It locks in decisions so Copilot doesn’t invent new patterns or styles.

---

## 0. Request Size Guardrails (avoid 413)

- Do **not** paste entire files or long logs. Show only changed regions or the last \~50–100 error lines.
- Prefer **diffs over full files**. If unavoidable, include a short description + direct file link first, then only the necessary sections.
- Reference files by **path + line ranges** (e.g., `src/app/feature/po-list/po-list.ts:12–64`) and include a clickable link.
- Summarize large logs; include only the essential stack traces.
- Never include binaries or giant JSON in chat—commit them or reference the path.

---

## Golden Rules (Read First, Every Time)

1. **Framework & Versions**
   - Use **Angular 20+** with **standalone components**, **control flow syntax** (`@if`, `@for`, `@switch`), and **Signals** where appropriate.
   - Follow **modern Angular file naming conventions** (no legacy suffix-based names; use the Angular CLI defaults).
   - Use **PrimeNG (latest)** + **Nora preset** (default **light** style).
   - Use **TailwindCSS** with `tailwindcss-primeui` integration to consume Nora tokens (no custom color hex values unless explicitly requested).

2. **Styling & Theming**
   - **Do not** invent custom tokens, colors, spacing, or typography.
   - **Always** use **Nora design tokens** via Tailwind utility classes and PrimeNG’s theme variables.
   - Keep the **default Nora light theme** unless instructed to add dark mode.

3. **Components & Library**
   - Prefer **PrimeNG** components for all UI (tables, forms, dialogs, menus, toasts, steps, tabs, etc.).
   - Don’t swap in other UI libs. If something’s missing, search PrimeNG first, then propose an approach using PrimeNG building blocks.
   - **Important**: Use **updated PrimeNG component naming conventions** (e.g., `p-table`, `p-button`, `p-card`, not legacy names like `p-datatable`).

4. **Accessibility & UX**
   - Follow **WCAG 2.2 AA**. Use semantic roles/labels and keyboard support for all interactive elements.
   - Use PrimeNG’s built-in a11y patterns; add `aria-*` attributes where needed.
   - Never rely on color alone for meaning.

   ### Accessibility Guardrails
   - Always provide `aria-label` or `aria-labelledby` for icon-only buttons, inputs, or controls.
   - Ensure form fields use `<label for="...">` tied to the input `id`.
   - Use PrimeNG’s keyboard navigation patterns (arrow keys, tab order) and test them.
   - Provide visible focus states using Nora/Prime tokens (never remove outlines).
   - Do not rely solely on color for meaning; always pair with icons or text.
   - Validate a11y using Testing Library queries (`getByRole`, `getByLabelText`) instead of CSS selectors.

> Rule: if it’s interactive, it must be reachable by keyboard and announced correctly by a screen reader.

5. **Code Quality & Discipline**
   - Keep PRs and steps **small**. **Explain what you’re doing and why** at each step.
   - Enforce **ESLint**, **Prettier**, **Type-checked Templates**, and strict TypeScript.
   - Add **unit tests** (Jest + Testing Library) and **e2e tests** (Playwright) as you go.

6. **Ask Before Diverging**
   - If a requirement is ambiguous or would introduce new dependencies, **ask first**.
   - Provide 2–3 clear options with trade-offs when proposing changes.

---

## Project Vision (One-paragraph Brief)

AcquiTrack is an enterprise-grade **government procurement & acquisitions** app. It streamlines **purchase requests, solicitations, bids, vendor management, contracts, approvals,** and **audit trails**, with a clean, accessible UI using **PrimeNG + Nora**. Target users are contracting officers, program managers, and procurement analysts. Our north star is **clarity, compliance, and speed**.

---

## Domain Model (Initial)

- **PurchaseRequest**: id, requester, org, needDate, amount, lineItems[], fundingSource, status, history[]
- **Solicitation**: id, prId, title, type (RFQ/RFP/etc.), releaseDate, dueDate, documents[], status
- **Bid/Proposal**: id, solicitationId, vendorId, amount, attachments[], score, status
- **Vendor**: id, name, cageCode, duns, pointOfContact, pastPerformance[], documents[]
- **Contract**: id, solicitationId, vendorId, number, startDate, endDate, ceiling, clins[], mods[]
- **User**: id, name, email, role (Requester/CO/KO/Analyst/Admin)
- **Approval**: id, entityType, entityId, approverId, step, decision, decidedAt, note
- **AuditLog**: id, actorId, action, targetType, targetId, timestamp, diff

> Treat this as a starting schema; keep adapters/repositories isolated to allow backend swap.

---

## Feature Map (MVP → V1)

**MVP**

1. Auth shell (mock/local first), role-based nav
2. Dashboard (my tasks, pending approvals, recent activity)
3. Purchase Requests (CRUD + workflow: Draft → Submitted → Under Review → Approved/Rejected)
4. Vendors (search, view, CRUD)
5. Solicitations (list, detail, create from approved PR)
6. Approvals (inbox, detail, approve/reject with comment)
7. Global search (PR/Solicitation/Vendor)
8. Audit log (entity timeline)

**V1 additions**

1. Bids/Proposals (submit, list, score)
2. Contracts (award from solicitation, CLINs, mods)
3. Attachments (PrimeNG fileUpload with size/type checks)
4. Reports (PrimeNG DataTable export, basic charts)
5. Admin (users/roles, reference data, thresholds)

---

## Milestones & Acceptance Criteria

### M0 — Environment & Tooling

- ✅ Angular 20+ app created (standalone).
- ✅ ESLint + Prettier configured; strict TS enabled.
- ✅ Jest + Testing Library for unit tests; Playwright for e2e.
- ✅ Commit hooks (Husky) run lint/test/format.
- ✅ CI job (GitHub Actions) for build + unit tests.

**Copilot tasks**

- Generate shell commands to scaffold Angular app.
- Add and configure ESLint/Prettier.
- Configure Jest + Testing Library and Playwright.
- Create `CONTRIBUTING.md` with run/lint/test instructions.

### M1 — PrimeNG + Nora + TailwindCSS v3 Integration

- ✅ PrimeNG installed and wired.
- ✅ **TailwindCSS v3** configured with **official `tailwindcss-primeui` plugin**.
- ✅ **Nora preset** styling approach using PrimeUI plugin integration.
- ✅ **ES Module** configuration for modern JavaScript imports.
- ✅ All PrimeNG design tokens available as Tailwind utilities (e.g., `bg-primary`, `text-color`).
- ✅ `StyleGuard` checklist for preventing custom tokens.

**Copilot tasks**

- Install: `primeng`, `primeicons`, `tailwindcss@^3.4.0`, `tailwindcss-primeui`, `autoprefixer`.
- Configure `tailwind.config.js` as ES module with `PrimeUI` plugin import.
- Add `"type": "module"` to `package.json` for ES module support.
- Update `postcss.config.js` to use ES module syntax.
- Import PrimeIcons and configure TailwindCSS v3 directives in `styles.css`.
- Verify PrimeNG color utilities work correctly (no custom color definitions needed).

**Key Integration Points:**

- **Color Palette**: Use `primary-[50-950]`, `surface-[0-950]`, `text-color`, `text-muted-color`, etc.
- **Semantic Colors**: `bg-primary`, `border-surface`, `bg-emphasis`, `bg-highlight`
- **Animation**: Use plugin-provided animation utilities with PrimeNG components
- **Dark Mode**: Plugin handles dark mode integration automatically with PrimeNG themes

**DO NOT:**

- Define custom color tokens manually (the plugin provides them)
- Use CommonJS syntax in config files (use ES modules)
- Override PrimeNG color variables (use the plugin utilities instead)

### M2 — App Shell, Layout, & Navigation

- ✅ Top nav with app title (**AcquiTrack**) + user menu + notifications icon.
- ✅ Left sidebar for primary nav (Dashboard, PRs, Vendors, Solicitations, Approvals, Admin).
- ✅ Responsive layout (desktop first, graceful tablet, readable mobile).
- ✅ Route-based code splitting, loading states, error boundaries.
- ✅ Toast service wired (PrimeNG `ToastModule`).

**Copilot tasks**

- Create `CoreLayout` with PrimeNG `Menubar`/`Sidebar` + `Breadcrumb`.
- Add top-level routes and lazy child routes.
- Add `MessageService` + `Toast` container.

### M3 — Dashboard

- ✅ Cards for **My Tasks**, **Pending Approvals**, **Recent Activity** using PrimeNG `Card`, `DataView`/`DataTable`.
- ✅ Skeleton loaders and empty states.

**Copilot tasks**

- Create dashboard route and stub services with mock data.
- Use Nora spacing/typography utilities only.

### M4 — Purchase Requests (CRUD + Workflow)

- ✅ PR list with filters (status, date, requester) using PrimeNG `DataTable` with column templates.
- ✅ PR detail view with timeline (AuditLog) and **Approve/Reject** if role allows.
- ✅ PR form (multi-step) using `Steps` + `DynamicDialog` or routed wizard.
- ✅ Client-side validation (Angular forms + PrimeNG form components).
- ✅ Workflow transitions with optimistic UI + rollback.

**Copilot tasks**

- Build `PurchaseRequestsModule` with list/detail/form.
- Wire mock repository; add signals for loading/error states.
- Add unit tests for reducers/services and critical components.

### M5 — Vendors

- ✅ Searchable list (name, CAGE/DUNS) with server-side pagination.
- ✅ Vendor detail (POC, past performance, docs).
- ✅ Vendor form (create/edit) with validation.

### M6 — Solicitations & Approvals

- ✅ Solicitations list/detail; create from Approved PR.
- ✅ Approval inbox view, decision dialog with comment.

### M7 — Global Search & Audit Log

- ✅ Global search across PR/Solicitation/Vendor entities.
- ✅ Per-entity audit timeline with diff rendering.

### M8 — Hardening & V1 Add-Ons

- ✅ File attachments (PrimeNG `FileUpload`) with size/type validation.
- ✅ Reports (export CSV/XLSX; simple bar/line charts with Chart.js via PrimeNG).
- ✅ Admin area (users/roles/refs).
- ✅ a11y audit pass, perf budget checks.

---

## Tech Stack & Dependencies

- **Angular 20+** (standalone, Signals, control flow)
- **PrimeNG** + **PrimeIcons**
- **Nora design system** (via official `tailwindcss-primeui` plugin integration)
- **TailwindCSS v3** + `tailwindcss-primeui` + `autoprefixer`
- **ES Modules** configuration for modern JavaScript
- **State**: signals + service-based stores (no NgRx unless requested)
- **Forms**: Angular Reactive Forms + PrimeNG form controls
- **Testing**: Jest + Testing Library, Playwright for e2e
- **Tooling**: ESLint, Prettier, Husky, lint-staged, Commitlint (conventional commits)

---

## Angular Naming Conventions (Modern, CLI Defaults)

- **Filenames**: **kebab-case** with a **single, standard suffix** (CLI defaults).
- **Do not** duplicate suffixes.
- **Class names**: **PascalCase** with one suffix.
- **Selectors**: dashed, always prefixed with `at-` (e.g., `<at-pr-list>`).
- **Folders**: kebab-case, feature-scoped.
- **Standalone**: Prefer standalone components; avoid creating `*.module.ts` unless necessary.
- **Testing**: Unit tests `*.spec.ts` beside sources; e2e under Playwright project.

---

## PrimeNG Updated Component Names & Imports (Use Current APIs)

Use **current** PrimeNG components and imports. Avoid deprecated/legacy names that Copilot may still suggest.

### Common mappings (old → current)

- `p-dataTable` / `DataTableModule` → **`p-table`** / **`TableModule`**
- `p-calendar` / `CalendarModule` → **`p-datepicker`** / **`DatePickerModule`**
- `p-growl` → **`p-toast`** (`ToastModule` + `MessageService`)
- `ScheduleModule` (legacy) → **`FullCalendarModule`** integration or alternatives
- `DialogModule` (still valid) → for programmatic dialogs use **`DynamicDialogModule`** + **`DialogService`**
- `p-toggleButton` (legacy) → prefer **`p-inputSwitch`** for binary on/off states
- `p-inputMask`, `p-dropdown`, `p-multiselect` → still valid; confirm latest API docs before use

### Rules

- Always import from the **top-level** `primeng/*` package — never deep/private paths.
- Use the documented **component selectors** exactly (e.g., `<p-table>`, `<p-datepicker>`, `<p-toast>`).
- When creating dialogs programmatically, always use `DialogService` with `DynamicDialogModule`.
- Check PrimeNG’s documentation for breaking changes before adding new components.
- Never use legacy aliases (`p-dataTable`, `p-calendar`, `p-growl`, etc.) — they will break the build in modern versions.

---

## Angular LLM Best Practices (from official guidance)

Adopt these rules so code generation aligns with modern Angular (v20+) patterns.

### TypeScript

- Enable **strict** type checking across the project.
- Prefer **type inference** when the type is obvious.
- Avoid `any`; when uncertain, use **`unknown`** and narrow.

### Angular Core

- Use **standalone components** everywhere; create NgModules only for interop if absolutely required.
- If Angular CLI scaffolds `standalone: true`, keep it. Do not manually add or remove it unless needed for interop.
- Implement **lazy loading** for feature routes.
- Prefer **signals** for state; use **`computed()`** for derived state.
- Avoid `@HostBinding` and `@HostListener`; put host bindings/listeners in the **`host`** object of `@Component` / `@Directive`.
- Use **`NgOptimizedImage`** for static images (note: it does **not** support inline base64).

### Components & Templates

- Keep components **small** and single-responsibility.
- Use the **`input()`** and **`output()`** functions instead of decorators.
- Set `changeDetection: ChangeDetectionStrategy.OnPush` on all components.
- Prefer **inline templates** for small components; otherwise keep external templates focused and readable.
- Prefer **Reactive Forms** over template-driven forms.
- Avoid `ngClass`/`ngStyle`; use **`[class.foo]`** and **`[style.bar.px]`** bindings instead.
- Keep templates simple; no heavy logic in the view.
- Use **native control flow**: `@if`, `@for`, `@switch` instead of `*ngIf`, `*ngFor`, `*ngSwitch`.
- When subscribing to Observables in templates, use the **`async` pipe**.

### State Management with Signals

- Use **signals** for local component state.
- Use **`computed()`** for derived state.
- **Do not** use `mutate` on signals; use **`set`** or **`update`** to change state.
- Keep state transformations **pure and predictable**.

### Services

- Design services with a **single responsibility**.
- Provide singletons via `providedIn: 'root'`.
- Prefer the **`inject()`** function over constructor injection in components/services where appropriate.

> These practices are additive to our Nora/PrimeNG rules, naming conventions, and 413 guardrails. Copilot should default to them unless the task explicitly requires a deviation (in which case, explain the trade-offs).

---

## Styling Rules (Nora-First)

- **Never** hardcode colors, border radii, spacing, or typography.
- Use Tailwind utilities backed by Nora tokens and Prime theme classes.
- Use PrimeNG CSS classes for alignment, density, and state.
- Dialogs, forms, tables must read as Nora out of the box.

### Example (Allowed)

```html
<p-card class="p-4">
  <div class="flex items-center justify-between">
    <h2 class="text-xl font-semibold">My Tasks</h2>
    <p-button label="New" icon="pi pi-plus"></p-button>
  </div>
</p-card>
```

### Example (Not Allowed)

```css
/* ❌ Don’t do this */
.my-card {
  background: #2b6cb0;
  border-radius: 3px;
}
```

---

## Project Structure (Guideline)

Follow Angular CLI conventions with **standalone components** and **feature-based folders**. Keep the structure shallow, consistent, and discoverable.

### Root Layout

```
src/
  app/
    core/              # Singleton services, interceptors, auth, guards, http, logging, config
    shared/            # Reusable, stateless UI (components), directives, pipes, models, utilities
    layout/            # CoreLayout, Menubar, Sidebar, Breadcrumb, Toast host
    features/          # All app features live here (see Feature Folders)
    app.config.ts      # App-wide providers (provideRouter, HttpClient, etc.)
    main.ts
  assets/              # Static assets (icons, logos, mock JSON if needed)
  styles.css           # Global styles: import Nora preset + Tailwind base/utilities only
  environments/        # environment.ts files if you use per-env settings
```

### Feature Folders

Each feature lives under `features/` and contains its list/detail/form components, a small data layer, and routes. Features should be self-contained and lazy-loaded.

```
features/
  purchase-requests/
    list/
      pr-list.component.ts
      pr-list.component.html
      pr-list.component.spec.ts
    detail/
      pr-detail.component.ts
      pr-detail.component.html
      pr-detail.component.spec.ts
    form/
      pr-form.component.ts
      pr-form.component.html
      pr-form.component.spec.ts
    data/
      pr.service.ts        # Feature-scoped data access (mock -> HTTP later)
      pr.model.ts          # Types/interfaces for this feature
      pr.store.ts          # (Optional) signals-based store for feature state
      pr.mock.ts           # In-memory mocks (dev only)
    purchase-requests.routes.ts  # Standalone route definitions for this feature
```

> Repeat the same pattern for `vendors/`, `solicitations/`, `approvals/`, `contracts/`, `admin/`, etc.

### Conventions

- **File naming**: kebab-case with Angular CLI defaults (`*.component.ts`, `*.service.ts`, `*.routes.ts`, `*.pipe.ts`, `*.directive.ts`, `*.guard.ts`, `*.spec.ts`).
- **Class naming**: PascalCase with a **single** suffix (e.g., `PurchaseRequestService`, `VendorsStore`).
- **Selector prefix**: use `at-` (e.g., `<at-pr-list>`).
- **Colocation**: tests (`*.spec.ts`), styles, and templates live beside their components.
- **Mocks/stubs**: place in a `data/` subfolder within the feature; remove or guard for production builds.
- **Barrels**: allow small, local `index.ts` barrels within a feature; avoid giant cross-feature barrels that hide dependencies.

### Shared vs Core

- `shared/`:
  - Small, reusable **stateless** UI components (wrappers around PrimeNG), directives, pipes, and pure utilities.
  - No feature-specific business logic; no singletons.
- `core/`:
  - App-wide singletons: auth, http interceptors, role/route guards, configuration, logging, audit service.
  - Never import `features/` into `core/` or `shared/`.

### Routing

- Define each feature’s routes in `*.routes.ts` under that feature, returning a `Routes` array.
- Compose top-level routes in `app.config.ts` with `provideRouter(...)`.
- Use **lazy loading** for features via `loadComponent` / `loadChildren`.
- Attach metadata (`breadcrumb`, `roles`) in route `data` for the breadcrumb and guards.

### Signals & State

- Prefer **local component signals** for UI state.
- For feature-level state, use a lightweight `*.store.ts` with signals and `computed()`.
- Avoid global state unless required; if necessary, place global stores in `core/state/`.

### Assets & Styles

- Import **Nora** preset and Tailwind only in `styles.css`.
- Do **not** add custom theme tokens or global CSS that overrides Nora/PrimeNG unless explicitly approved.
- Keep feature-scoped styles minimal and utility-first (Tailwind + PrimeNG classes).

### Testing Placement

- Unit tests: `*.spec.ts` colocated with sources (services, components, pipes, directives).
- Component tests: use Testing Library queries by role/label; assert a11y roles and keyboard behavior.
- e2e tests: Playwright project at the repo root (separate from `src/`).

> Goal: keep features self-contained, testable, and aligned with Angular CLI + modern best practices while reinforcing Nora/PrimeNG guardrails.

---

## Data Access & API

- Start with **mock repositories** (in-memory JSON).
- Provide a `DataService` per entity with CRUD methods. Use Observables only for HttpClient responses, and immediately convert them into Signals inside the service. Default to Signals-based stores for all state management.
- Centralize HTTP interceptors in `core/`.
- Add swappable `environment.ts` for API base URLs.

#### Example: Convert Observable to Signal

```ts
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

export class PurchaseRequestService {
  private http = inject(HttpClient);

  private _requests$ = this.http.get<PurchaseRequest[]>('/api/requests').pipe(
    catchError(() => of([])) // handle errors gracefully
  );
  requests = toSignal(this._requests$, { initialValue: [] });
}
```

- > Rule: Always adapt HttpClient Observables into Signals inside services so components consume Signals directly.

### Data Fetching Strategy

- **Dashboard**: eager-load lightweight summary data on route entry.
- **Lists (PRs, Vendors, Solicitations)**: use server-side pagination, sorting, and filtering. Fetch on-demand as the user interacts.
- **Detail Views**: fetch entity data on route activation; show skeleton loaders while loading.
- **Forms**: prefetch reference data (dropdowns, enums) before rendering steps; cache results in feature service.
- **Caching**: store recent results in feature-level signal stores; invalidate when user performs a write action.

> Rule of thumb: load small/summary data eagerly, load heavy data lazily and cache smartly.

---

## Routing, Guards, and Roles

- Define routes per feature (lazy).
- Use `AuthGuard` (mock first), `RoleGuard` for feature access.
- Route data contains `breadcrumb` and `roles`.
- Use PrimeNG `Breadcrumb` for nav hints.

---

## Forms & Validation

- Use Reactive Forms; surface validation with PrimeNG messages/tooltips.
- Disable submit until valid.
- For wizards, persist state between steps.
- Validation error messages must be associated with their inputs via `aria-describedby` so screen readers announce them correctly.

---

## Tables & Lists

- Use `p-table` with resizing, sorting, filtering, paginator.
- Provide empty states, skeleton loaders, and no-results copy.

---

## Notifications & Errors

- Use `MessageService` + `Toast` for transient messages.
- Use `ConfirmDialog` for destructive actions.
- Keep state recoverable (retry, report).

### Error Handling Strategy

- **Global Errors**
  - Use an `HttpInterceptor` in `core/` to catch API errors and log them via the Audit service.
  - Show a transient `Toast` notification (PrimeNG `MessageService`) for generic failures.
  - Mask sensitive or technical error messages; show user-friendly text instead.

- **Feature-Specific Errors**
  - For form validation, display inline messages with PrimeNG `<p-message>` or `<p-messages>` components.
  - For table/list fetch failures, show an inline error state with retry action.
  - For destructive actions (delete, reject), always use a `ConfirmDialog` with clear labels and keyboard focus.

> Goal: keep errors consistent, recoverable, and distinguish between global failures vs. feature-specific validations.

---

## Testing Strategy

- **Unit**: services, utils, component logic.
- **Component**: a11y roles, ARIA labels, keyboard nav.
- **e2e**: happy paths for PR creation, approval, vendor CRUD.
- Cover critical workflows early.

### Testing Guardrails

- Enforce **minimum coverage threshold of 80%** for lines/branches.
- Disallow `.only` or `.skip` tests in commits via ESLint/Jest rule.
- Do not use snapshot tests except for very stable UI outputs (icons, static templates).
- Always test accessibility roles and keyboard interactions (Testing Library queries by role, not by CSS class).
- For Playwright e2e, focus on **happy paths + critical workflows**; do not exhaustively test all permutations.
- Fail CI if overall coverage drops below the 80% threshold (lines and branches must both meet 80%).

---

## Performance & DX

- Use Angular deferrable views / route-level code splitting.
- Track bundle size in CI.
- Memoize expensive lists with signals.
- Prefer OnPush change detection.
- Aim for a **Lighthouse performance score of 90+** on production builds.

### Deployment & CI/CD

- Use **GitHub Actions** for build, lint, test, and bundle size checks.
- Add a **bundle size budget** (fail build if exceeded).
- Initial load JavaScript should not exceed **500kb uncompressed** (Angular CLI `budgets` in `angular.json`).
- Enable **Nx/Angular build caching** for faster CI runs.
- Deploy **preview builds per PR** to a temporary environment on **Netlify** (default).
- Use Husky hooks to enforce lint/test before push.
- Tag releases using **Conventional Commits** + semantic versioning.
- Use feature-specific scopes for consistency (e.g., `feat(pr)`, `fix(vendor)`, `chore(ci)`).
- Run `npm audit` as part of CI to catch vulnerable dependencies.

> Goal: every commit is validated, every PR has a preview, and bundle size stays within budget.

---

## Security & Compliance

- Sanitize HTML inputs.
- Validate file uploads.
- Mask PII in logs.
- Centralize audit logging.
- Role checks client- and server-side.
- Enforce a strict Content Security Policy (CSP) in deployment configs to mitigate XSS risks.
- Run dependency auditing (npm audit / OWASP checks) in CI/CD pipelines.

### Authentication & Identity

- Start with a **mock/local auth service** for development (simple roles and a hard-coded user).
- Design auth flow to be **OIDC/JWT ready** so it can later integrate with enterprise SSO or federal IdP.
- Store tokens in **HttpOnly cookies** (never localStorage).
- Apply `AuthGuard` and `RoleGuard` consistently at the route level.
- Always pair **client-side role checks** with backend verification.

> Copilot: scaffold login/logout components with mock services first, but keep the code structured for future OIDC/JWT integration.

---

## Copilot Working Agreement

1. Small, labeled steps with diffs.
2. Explain decisions with brief rationale.
3. No custom tokens; stick to Nora.
4. Verify visually after UI work.
5. Add tests before moving on.
6. Ask clarifying questions if blocked.

### Additional Guardrails for Copilot

- Never suggest Angular Material, Bootstrap, or other UI libraries; always prefer PrimeNG + Nora.
- When I say **“scaffold X”**, generate: folder, routes, mock service, one test spec.
- When I say **“refactor”**, show a **unified diff** instead of full file dumps.
- When unsure, propose 2–3 valid approaches using Angular/PrimeNG best practices; ask before introducing external dependencies.

---

## Copilot Mentorship Mode

When generating code or explanations, act as an **Angular expert and mentor**. Always:

- Teach me **what** you are doing and **why** step by step, not just the final output.
- Explain how the code follows **Angular best practices** (standalone components, signals, control flow, naming conventions, OnPush, etc.).
- Call out trade-offs and provide 2–3 alternatives when relevant, with reasoning.
- Keep examples small and focused, then build them up incrementally.
- Add comments in the code when it helps clarify intent.
- Reinforce **Nora/PrimeNG styling guardrails** and explain how the choices align with enterprise UI standards.
- Provide links or references to Angular and PrimeNG documentation when appropriate.
- Encourage learning by writing explanations in plain, approachable language.
- When presenting trade-offs, provide **pros/cons in bullet form**, then recommend the best option for this project.

> The goal is that Copilot not only produces code but also helps me **learn Angular and grow as a developer** while building AcquiTrack.

---

## Kickoff Script (What Copilot Should Do First)

**Step 0** — Initialize repo

- Create Angular app, strict mode, linting.

**Step 1** — Install UI stack

- Add PrimeNG, Tailwind, configure. Verify Nora preset.

**Step 2** — App shell

- Create CoreLayout, sidebar, breadcrumb, toast. Add routes.

**Step 3** — Dashboard & Mock Data

- Build dashboard cards, skeletons, mock repos.

**Step 4** — First Feature (PRs)

- Implement list, detail, form wizard. Add validations, workflow. Tests.

**Step 5** — Vendors

- CRUD + detail + search.

**Step 6** — Solicitations & Approvals

**Step 7** — Global Search & Audit

**Step 8** — Hardening (attachments, reports, admin, perf, a11y).

---
