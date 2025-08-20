# AcquiTrack — Copilot Instructions (Angular 20+, PrimeNG + Nora)

> **Purpose**: This document tells Copilot (Claude Sonnet 4) exactly how to scaffold, design, and implement the **AcquiTrack** procurement acquisitions web app from a clean slate using **Angular 20+** and **PrimeNG** with the **Nora** preset (default light theme). It locks in decisions so Copilot doesn't invent new patterns or styles.

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
   - Use **TailwindCSS v3** with `tailwindcss-primeui` integration to consume Nora tokens (no custom color hex values unless explicitly requested).

2. **Styling & Theming - STRICT NORA ADHERENCE**
   - **NEVER** override PrimeNG Nora theme defaults with custom CSS
   - **NEVER** invent custom tokens, colors, spacing, or typography
   - **ALWAYS** use **Nora design tokens** via TailwindCSS utilities and PrimeNG's built-in theme variables
   - **ALWAYS** keep the **default Nora light theme** - no dark mode implementation unless explicitly requested
   - **IF** you encounter a styling limitation, **ASK FIRST** before deviating from Nora preset
   - **EXPLAIN** why deviation is needed and propose Nora-compatible alternatives

3. **Components & Library**
   - Prefer **PrimeNG** components for all UI (tables, forms, dialogs, menus, toasts, steps, tabs, etc.).
   - Don't swap in other UI libs. If something's missing, search PrimeNG first, then propose an approach using PrimeNG building blocks.
   - **Important**: Use **updated PrimeNG component naming conventions** (see Component Names section).

4. **Accessibility & UX**
   - Follow **WCAG 2.2 AA**. Use semantic roles/labels and keyboard support for all interactive elements.
   - Use PrimeNG's built-in a11y patterns; add `aria-*` attributes where needed.
   - Never rely on color alone for meaning.

   ### Accessibility Guardrails
   - Always provide `aria-label` or `aria-labelledby` for icon-only buttons, inputs, or controls.
   - Ensure form fields use `<label for="...">` tied to the input `id`.
   - Use PrimeNG's keyboard navigation patterns (arrow keys, tab order) and test them.
   - Provide visible focus states using Nora/Prime tokens (never remove outlines).
   - Do not rely solely on color for meaning; always pair with icons or text.
   - Validate a11y using Testing Library queries (`getByRole`, `getByLabelText`) instead of CSS selectors.

> Rule: if it's interactive, it must be reachable by keyboard and announced correctly by a screen reader.

5. **Code Quality & Discipline**
   - Keep PRs and steps **small**. **Explain what you're doing and why** at each step.
   - Enforce **ESLint**, **Prettier**, **Type-checked Templates**, and strict TypeScript.
   - Add **unit tests** (Jest + Testing Library) and **e2e tests** (Playwright) as you go.

6. **Ask Before Diverging**
   - If a requirement is ambiguous or would introduce new dependencies, **ask first**.
   - Provide 2–3 clear options with trade-offs when proposing changes.
   - **NEVER** add custom CSS without explicit approval and justification.

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

### M1 — PrimeNG + Nora + TailwindCSS v3 Integration

- ✅ PrimeNG installed and wired with **Nora preset** theme.
- ✅ **TailwindCSS v3** configured with **official `tailwindcss-primeui` plugin**.
- ✅ **Nora light theme** as default with NO custom overrides.
- ✅ **ES Module** configuration for modern JavaScript imports.
- ✅ All PrimeNG design tokens available as Tailwind utilities (e.g., `bg-primary`, `text-color`).
- ✅ **Zero custom CSS** - rely entirely on Nora theme defaults.

**Integration Configuration:**

```typescript
// app.config.ts - CORRECT Nora setup
providePrimeNG({
  theme: {
    preset: Nora, // ✅ Use Nora light theme
    options: {
      darkModeSelector: '.dark', // ✅ Class-based (not used, but proper setup)
      cssLayer: {
        name: 'primeng',
        order: 'tailwind-base, primeng, tailwind-utilities',
      },
    },
  },
});
```

```javascript
// tailwind.config.js - CORRECT PrimeUI plugin setup
import PrimeUI from 'tailwindcss-primeui';

export default {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class', // ✅ Class-based dark mode (not used)
  theme: {
    extend: {
      // ✅ NO custom colors - PrimeUI plugin provides all tokens
    },
  },
  plugins: [PrimeUI], // ✅ Official plugin provides Nora integration
};
```

**DO NOT:**

- Override Nora color variables with custom CSS
- Add custom color definitions in Tailwind config
- Use any CSS that conflicts with Nora theme
- Implement dark mode without explicit approval

### M2 — App Shell, Layout, & Navigation

- ✅ Top nav with app title (**AcquiTrack**) + user menu + notifications icon.
- ✅ Left sidebar for primary nav (Dashboard, PRs, Vendors, Solicitations, Approvals, Admin).
- ✅ Responsive layout (desktop first, graceful tablet, readable mobile).
- ✅ Route-based code splitting, loading states, error boundaries.
- ✅ Toast service wired (PrimeNG `ToastModule`).
- ✅ **All styling uses Nora defaults** - no custom CSS overrides.

### M3 — Dashboard

- ✅ Cards for **My Tasks**, **Pending Approvals**, **Recent Activity** using PrimeNG `Card`, `DataView`/`DataTable`.
- ✅ Skeleton loaders and empty states.
- ✅ **Pure Nora styling** - no custom color schemes or spacing.

### M4 — Purchase Requests (CRUD + Workflow)

- ✅ PR list with filters (status, date, requester) using PrimeNG `DataTable` with column templates.
- ✅ PR detail view with timeline (AuditLog) and **Approve/Reject** if role allows.
- ✅ PR form (multi-step) using `Steps` + `DynamicDialog` or routed wizard.
- ✅ Client-side validation (Angular forms + PrimeNG form components).
- ✅ Workflow transitions with optimistic UI + rollback.

---

## Tech Stack & Dependencies

- **Angular 20+** (standalone, Signals, control flow)
- **PrimeNG** + **PrimeIcons** + **Nora preset theme**
- **TailwindCSS v3** + `tailwindcss-primeui` + `autoprefixer`
- **ES Modules** configuration for modern JavaScript
- **State**: signals + service-based stores (no NgRx unless requested)
- **Forms**: Angular Reactive Forms + PrimeNG form controls
- **Testing**: Jest + Testing Library, Playwright for e2e
- **Tooling**: ESLint, Prettier, Husky, lint-staged, Commitlint (conventional commits)

---

## PrimeNG Updated Component Names & Imports (Use Current APIs)

Use **current** PrimeNG v19+ components and imports. Avoid deprecated/legacy names.

### Common mappings (old → current)

- `p-dataTable` / `DataTableModule` → **`p-table`** / **`TableModule`**
- `p-calendar` / `CalendarModule` → **`p-datepicker`** / **`DatePickerModule`**
- `p-dropdown` / `DropdownModule` → **`p-select`** / **`SelectModule`**
- `p-sidebar` / `SidebarModule` → **`p-drawer`** / **`DrawerModule`**
- `p-inputSwitch` / `InputSwitchModule` → **`p-toggleSwitch`** / **`ToggleSwitchModule`**
- `p-overlayPanel` / `OverlayPanelModule` → **`p-popover`** / **`PopoverModule`**

### Rules

- Always import from the **top-level** `primeng/*` package — never deep/private paths.
- Use the documented **component selectors** exactly (e.g., `<p-table>`, `<p-datepicker>`, `<p-drawer>`).
- When creating dialogs programmatically, always use `DialogService` with `DynamicDialogModule`.
- Check PrimeNG's documentation for breaking changes before adding new components.
- Never use legacy aliases — they will break the build in modern versions.

---

## Styling Rules (Nora-First) - STRICT ADHERENCE

- **NEVER** hardcode colors, border radii, spacing, or typography in custom CSS.
- **NEVER** override Nora theme variables or CSS custom properties.
- **ALWAYS** use TailwindCSS utilities backed by `tailwindcss-primeui` plugin tokens.
- **ALWAYS** use PrimeNG CSS classes for alignment, density, and state.
- **IF** styling limitation encountered, **ASK FIRST** before adding any custom CSS.

### Example (Allowed - Pure Nora + TailwindCSS)

```html
<p-card class="p-4">
  <div class="flex items-center justify-between">
    <h2 class="text-xl font-semibold text-color">My Tasks</h2>
    <p-button label="New" icon="pi pi-plus" severity="primary"></p-button>
  </div>
</p-card>
```

### Example (FORBIDDEN - Custom CSS)

```css
/* ❌ NEVER DO THIS - Overrides Nora theme */
.my-card {
  background: #2b6cb0;
  border-radius: 3px;
  color: #ffffff;
}

/* ❌ NEVER DO THIS - Custom spacing */
.custom-spacing {
  margin: 23px;
  padding: 11px 17px;
}
```

### When You Need Custom Styling

**STOP** and ask:

1. "Does PrimeNG have a component variant that solves this?"
2. "Does the `tailwindcss-primeui` plugin provide the needed utility?"
3. "Can I achieve this with existing Nora design tokens?"

**If NO to all three:**

1. **ASK** before proceeding
2. **EXPLAIN** the specific limitation
3. **PROPOSE** Nora-compatible alternatives
4. **GET APPROVAL** before adding any custom CSS

---

## Project Structure (Guideline)

Follow Angular CLI conventions with **standalone components** and **feature-based folders**. Keep the structure shallow, consistent, and discoverable.

### Root Layout

```
src/
  app/
    core/              # Singleton services, interceptors, auth, guards, http, logging, config
    shared/            # Reusable, stateless UI (components), directives, pipes, models, utilities
    layout/            # CoreLayout, Menubar, Drawer, Breadcrumb, Toast host
    features/          # All app features live here (see Feature Folders)
    app.config.ts      # App-wide providers (provideRouter, HttpClient, etc.)
    main.ts
  assets/              # Static assets (icons, logos, mock JSON if needed)
  styles.css           # Global styles: import Nora preset + Tailwind base/utilities ONLY
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
      pr.service.ts        # Feature-scoped data access (mock → HTTP later)
      pr.model.ts          # Types/interfaces for this feature
      pr.store.ts          # (Optional) signals-based store for feature state
      pr.mock.ts           # In-memory mocks (dev only)
    purchase-requests.routes.ts  # Standalone route definitions for this feature
```

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

---

## Testing Strategy

- **Unit**: services, utils, component logic.
- **Component**: a11y roles, ARIA labels, keyboard nav.
- **e2e**: happy paths for PR creation, approval, vendor CRUD.
- Cover critical workflows early.

### Testing Guardrails

- Start with **low coverage thresholds** (0%) during rapid development.
- Gradually increase thresholds as features stabilize.
- Always test accessibility roles and keyboard interactions.
- Focus on critical business logic and user workflows.

---

## Copilot Working Agreement

1. **Small, labeled steps** with diffs.
2. **Explain decisions** with brief rationale.
3. **No custom tokens** - stick to Nora defaults.
4. **Ask before deviating** from Nora theme.
5. **Verify visually** after UI work.
6. **Add tests** before moving on.
7. **Ask clarifying questions** if blocked.

### Nora Theme Adherence Protocol

When implementing any UI component:

1. **First**: Check if PrimeNG has the component
2. **Second**: Check if `tailwindcss-primeui` has the needed utilities
3. **Third**: Use only Nora design tokens
4. **Last Resort**: Ask for permission to deviate with justification

### Emergency Escalation

If you encounter a styling limitation that cannot be solved with Nora defaults:

1. **STOP** development
2. **DOCUMENT** the specific limitation
3. **PROPOSE** 2-3 Nora-compatible alternatives
4. **ASK** for guidance before proceeding
5. **NEVER** add custom CSS without explicit approval

---

## Copilot Mentorship Mode

When generating code or explanations, act as an **Angular expert and mentor**. Always:

- Teach me **what** you are doing and **why** step by step, not just the final output.
- Explain how the code follows **Angular best practices** and **Nora theme adherence**.
- Call out trade-offs and provide 2–3 alternatives when relevant, with reasoning.
- Keep examples small and focused, then build them up incrementally.
- Add comments in the code when it helps clarify intent.
- Reinforce **Nora/PrimeNG styling guardrails** and explain how the choices align with enterprise UI standards.
- **Alert immediately** if any requirement would require deviating from Nora defaults.

> The goal is that Copilot not only produces code but also helps me **learn Angular and grow as a developer** while building AcquiTrack **within strict Nora theme boundaries**.

---

## Kickoff Script (What Copilot Should Do First)

**Step 0** — Initialize repo

- Create Angular app, strict mode, linting.

**Step 1** — Install UI stack

- Add PrimeNG + Nora preset, TailwindCSS v3 + PrimeUI plugin. **Verify NO custom CSS overrides**.

**Step 2** — App shell

- Create CoreLayout, drawer, breadcrumb, toast. Add routes. **Pure Nora styling**.

**Step 3** — Dashboard & Mock Data

- Build dashboard cards, skeletons, mock repos. **Nora design tokens only**.

**Step 4** — First Feature (PRs)

- Implement list, detail, form wizard. Add validations, workflow. Tests. **No custom styling**.

**Step 5** — Vendors

- CRUD + detail + search. **Maintain Nora consistency**.

**Step 6** — Solicitations & Approvals

**Step 7** — Global Search & Audit

**Step 8** — Hardening (attachments, reports, admin, perf, a11y).

---
