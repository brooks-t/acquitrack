# StyleGuard Checklist — AcquiTrack (Nora Theme Strict Adherence)

> **Purpose**: Prevent ANY custom styling that conflicts with the **PrimeNG Nora preset theme**. Maintain strict adherence to Nora defaults using only `tailwindcss-primeui` plugin utilities. **ZERO tolerance for custom CSS overrides**.

---

## 🚨 CRITICAL RULES - NO EXCEPTIONS

### **Absolute Prohibitions**

❌ **NEVER**: Add custom CSS files or `<style>` blocks  
❌ **NEVER**: Override Nora CSS custom properties  
❌ **NEVER**: Use custom hex colors (`#FF0000`, `#123456`)  
❌ **NEVER**: Define custom spacing or typography values  
❌ **NEVER**: Import non-Nora stylesheets  
❌ **NEVER**: Use `!important` to override Nora styles

### **Emergency Protocol**

🛑 **IF** you need styling that Nora doesn't provide:

1. **STOP** - Do not implement custom CSS
2. **DOCUMENT** - What specific styling is needed and why
3. **RESEARCH** - Check if PrimeNG has a component variant
4. **ASK** - Request approval with 2-3 Nora-compatible alternatives
5. **WAIT** - Get explicit approval before proceeding

---

## ✅ APPROVED STYLING APPROACHES

### **Colors - ONLY Nora Design Tokens**

```html
<!-- ✅ CORRECT: Nora design tokens via tailwindcss-primeui -->
<div class="bg-primary text-primary-contrast">Primary content</div>
<div class="bg-surface-0 text-color">Main content</div>
<div class="bg-surface-100 text-color-secondary">Secondary content</div>
<div class="border-surface">Content with border</div>

<!-- ✅ CORRECT: PrimeNG severity variants -->
<p-button severity="primary" label="Primary Action" />
<p-button severity="secondary" label="Secondary Action" />
<p-button severity="success" label="Success Action" />
```

### **Spacing - ONLY TailwindCSS + PrimeUI Plugin**

```html
<!-- ✅ CORRECT: Standard TailwindCSS spacing -->
<div class="p-4 m-2 gap-3 space-y-4">
  <p-card class="mb-4">Card content</p-card>
</div>

<!-- ✅ CORRECT: PrimeNG layout components -->
<p-panel header="Panel Title" class="p-4">
  <p-divider />
  <div class="flex flex-col gap-4">Content</div>
</p-panel>
```

### **Typography - ONLY Nora Tokens**

```html
<!-- ✅ CORRECT: TailwindCSS typography with Nora tokens -->
<h1 class="text-2xl font-bold text-color">Main Heading</h1>
<p class="text-base text-color-secondary leading-6">Body text</p>
<span class="text-sm text-muted-color">Helper text</span>
```

### **Components - ONLY PrimeNG**

```html
<!-- ✅ CORRECT: Pure PrimeNG components -->
<p-table [value]="data" styleClass="p-datatable-sm">
  <ng-template pTemplate="header">
    <tr>
      <th class="text-left">Column Header</th>
    </tr>
  </ng-template>
</p-table>

<p-dialog [visible]="showDialog" header="Dialog Title" [modal]="true">
  <div class="flex flex-col gap-4">
    <p>Dialog content using Nora defaults</p>
    <div class="flex justify-end gap-2">
      <p-button label="Cancel" severity="secondary" />
      <p-button label="Save" severity="primary" />
    </div>
  </div>
</p-dialog>
```

---

## 🔍 DEVELOPMENT WORKFLOW

### **Before Writing ANY Styling Code**

- [ ] **Check PrimeNG**: Does a component/variant exist?
- [ ] **Check tailwindcss-primeui**: Does the plugin provide the utility?
- [ ] **Check Nora tokens**: Are the design tokens available?
- [ ] **Verify necessity**: Is custom styling actually needed?

### **Code Review Checklist**

- [ ] **Zero custom CSS**: No `.css` files except `styles.css` with imports only
- [ ] **Zero style overrides**: No CSS custom properties overriding Nora
- [ ] **Zero magic numbers**: No custom spacing/sizing values
- [ ] **Pure PrimeNG**: Uses PrimeNG components exclusively
- [ ] **Pure TailwindCSS**: Uses only plugin-provided utilities
- [ ] **Nora consistency**: Maintains visual consistency with Nora theme

### **Merge Blockers**

🚫 **Automatic rejection** if code contains:

- Custom CSS files (except approved global imports)
- CSS custom property overrides
- Hardcoded color values
- Custom spacing definitions
- Non-PrimeNG UI components
- Style blocks in components
- `!important` declarations

---

## 📚 NORA QUICK REFERENCE

### **Available Color Utilities** (via tailwindcss-primeui)

```css
/* Primary Colors */
.bg-primary, .text-primary, .border-primary
.bg-primary-50, .bg-primary-100, ..., .bg-primary-950

/* Surface Colors */
.bg-surface-0, .bg-surface-50, ..., .bg-surface-950
.text-color, .text-color-secondary, .text-muted-color

/* Semantic Colors */
.bg-emphasis, .bg-highlight, .bg-highlight-emphasis
.border-surface, .text-color-emphasis, .text-muted-color-emphasis
```

### **Standard TailwindCSS Utilities** (Safe to Use)

```css
/* Layout */
.flex, .grid, .block, .inline, .hidden
.items-center, .justify-between, .gap-4

/* Spacing */
.p-2, .p-4, .p-6, .m-2, .m-4, .m-6
.space-x-2, .space-y-4, .gap-3

/* Typography */
.text-xs, .text-sm, .text-base, .text-lg, .text-xl, .text-2xl
.font-normal, .font-medium, .font-semibold, .font-bold
.leading-4, .leading-5, .leading-6, .leading-7
```

### **PrimeNG Component Classes** (Built-in)

```css
/* Component Sizing */
.p-button-sm, .p-button-lg
.p-inputtext-sm, .p-inputtext-lg
.p-datatable-sm, .p-datatable-lg

/* Component States */
.p-disabled, .p-invalid, .p-readonly
.p-button-outlined, .p-button-text
```

---

## 🚨 VIOLATION EXAMPLES

### **FORBIDDEN: Custom CSS**

```css
/* ❌ NEVER DO THIS */
.custom-card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
}

.brand-colors {
  --custom-primary: #0066cc;
  --custom-secondary: #6c757d;
}

.weird-spacing {
  margin: 23px 17px;
  padding: 11px 13px;
}
```

### **FORBIDDEN: Nora Overrides**

```css
/* ❌ NEVER DO THIS */
:root {
  --p-primary-color: #ff0000 !important;
  --p-surface-0: #000000 !important;
}

.override-nora {
  color: var(--p-primary-color) !important;
  background: #custom-color !important;
}
```

### **FORBIDDEN: Non-PrimeNG Components**

```html
<!-- ❌ NEVER DO THIS -->
<div class="custom-button" (click)="action()">Custom Button</div>
<table class="custom-table">
  <tr>
    <td>Custom table</td>
  </tr>
</table>
<div class="custom-modal">Custom dialog</div>
```

---

## ✅ APPROVED EXAMPLES

### **Perfect Nora Implementation**

```html
<!-- ✅ PERFECT: Pure Nora + PrimeNG -->
<p-card class="mb-4">
  <ng-template pTemplate="header">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-color">Dashboard</h2>
      <p-button
        icon="pi pi-refresh"
        severity="secondary"
        size="small"
        [text]="true"
      />
    </div>
  </ng-template>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="bg-surface-50 p-4 rounded border-surface">
      <h3 class="text-lg font-medium text-color mb-2">My Tasks</h3>
      <p class="text-2xl font-bold text-primary">12</p>
      <p class="text-sm text-color-secondary">Active tasks</p>
    </div>
  </div>
</p-card>
```

### **Perfect Form Implementation**

```html
<!-- ✅ PERFECT: Pure PrimeNG form -->
<form [formGroup]="myForm" class="flex flex-col gap-4">
  <div class="field">
    <label for="name" class="font-semibold text-color">Name</label>
    <p-inputtext
      id="name"
      formControlName="name"
      class="w-full"
      placeholder="Enter name"
    />
  </div>

  <div class="field">
    <label for="status" class="font-semibold text-color">Status</label>
    <p-select
      id="status"
      formControlName="status"
      [options]="statusOptions"
      class="w-full"
      placeholder="Select status"
    />
  </div>

  <div class="flex justify-end gap-2">
    <p-button label="Cancel" severity="secondary" [text]="true" />
    <p-button label="Save" severity="primary" type="submit" />
  </div>
</form>
```

---

## 🆘 EMERGENCY FALLBACK STRATEGIES

### **If Nora Theme Breaks**

**Immediate Actions:**

1. **Do NOT** add custom CSS to fix it
2. **Document** the specific issue
3. **Revert** to last working state
4. **Report** the issue for guidance

**Approved Fallback (ONLY with permission):**

```css
/* Emergency fallback - requires explicit approval */
/* Minimal CSS reset ONLY if Nora completely breaks */
```

### **If PrimeNG Component Missing**

**Escalation Process:**

1. **Search** PrimeNG documentation thoroughly
2. **Check** if composition of existing components works
3. **Document** the exact requirement
4. **Propose** PrimeNG-based alternatives
5. **Request** approval for any non-PrimeNG solution

---

## 🎯 SUCCESS METRICS

### **Green Light Indicators**

✅ **Zero custom CSS files** (except approved imports)  
✅ **100% PrimeNG components** for UI elements  
✅ **100% Nora design tokens** for colors  
✅ **100% TailwindCSS utilities** for layout  
✅ **Visual consistency** across all components  
✅ **No build warnings** about CSS conflicts

### **Red Flag Indicators**

🚨 **Any custom CSS files** created  
🚨 **Any color hex values** in templates/styles  
🚨 **Any custom spacing** definitions  
🚨 **Any CSS property overrides**  
🚨 **Any non-PrimeNG UI components**  
🚨 **Any `!important` declarations**

---

**Remember**: When in doubt, **ASK FIRST**. It's better to pause development than to add styling that breaks Nora theme consistency. **Nora defaults are sacred** - deviation requires explicit approval with clear justification.
