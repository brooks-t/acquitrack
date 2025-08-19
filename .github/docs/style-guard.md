# StyleGuard Checklist — AcquiTrack

> **Purpose**: Prevent custom tokens, colors, spacing, or typography that conflict with the **Nora design system**. Always use PrimeNG + TailwindCSS v3 with custom CSS properties for PrimeNG integration.

---

## ✅ Style Guidelines

### **Colors**

- ✅ **Use**: Nora design tokens via Tailwind classes (`bg-primary`, `text-surface-500`, etc.)
- ✅ **Use**: PrimeNG CSS variables (`var(--primary-color)`, `var(--surface-ground)`, etc.)
- ❌ **Avoid**: Custom hex colors (`#FF0000`, `#123456`)
- ❌ **Avoid**: Custom CSS color properties

### **Spacing & Layout**

- ✅ **Use**: Tailwind spacing classes (`p-4`, `m-2`, `gap-3`, `space-y-4`)
- ✅ **Use**: PrimeNG layout components (`p-card`, `p-panel`, `p-divider`)
- ❌ **Avoid**: Custom margin/padding values
- ❌ **Avoid**: Magic numbers in CSS

### **Typography**

- ✅ **Use**: Nora typography tokens (`text-xl`, `font-semibold`, `leading-6`)
- ✅ **Use**: PrimeNG text utilities (`p-text-secondary`, `p-text-lg`)
- ❌ **Avoid**: Custom font families (unless Nora extension)
- ❌ **Avoid**: Custom font sizes or line heights

### **Components**

- ✅ **Use**: PrimeNG components for all UI (`p-button`, `p-table`, `p-dialog`, etc.)
- ✅ **Use**: PrimeNG component variants (`severity`, `size`, `outlined`)
- ❌ **Avoid**: Third-party UI libraries (Bootstrap, Material, etc.)
- ❌ **Avoid**: Custom styled components that duplicate PrimeNG functionality

### **Icons**

- ✅ **Use**: PrimeIcons (`pi pi-check`, `pi pi-times`, `pi pi-search`)
- ✅ **Use**: PrimeNG icon utilities (`p-button-icon`, `p-menuitem-icon`)
- ❌ **Avoid**: Other icon libraries (FontAwesome, Material Icons, etc.)
- ❌ **Avoid**: Custom SVG icons without approval

---

## 🔧 Development Checklist

### **Before Adding Styles**

- [ ] Check if PrimeNG has a suitable component
- [ ] Verify Tailwind + tailwindcss-primeui has the needed utilities
- [ ] Confirm the style aligns with Nora design tokens

### **Code Review Checklist**

- [ ] No custom hex colors
- [ ] No magic numbers for spacing/sizing
- [ ] Uses PrimeNG components where possible
- [ ] Uses Tailwind utilities for layout
- [ ] Maintains accessibility standards
- [ ] Consistent with Nora light theme

### **Testing Checklist**

- [ ] Component renders correctly with Nora theme
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] Dark mode compatibility (when implemented)

---

## 📚 Quick Reference

### **Common Nora Tokens (via TailwindCSS v3)**

```css
/* Colors (using custom CSS properties) */
.bg-primary-500      /* Primary brand color */
.bg-surface-0        /* White/lightest surface */
.bg-surface-50       /* Very light surface */
.bg-surface-100      /* Light surface */
.text-surface-700    /* Default text color */
.text-surface-500    /* Secondary text color */

/* Spacing */
.p-2, .p-4, .p-6     /* Padding */
.m-2, .m-4, .m-6     /* Margin */
.gap-2, .gap-4       /* Grid/flex gaps */

/* Typography */
.text-xl, .text-2xl  /* Font sizes */
.font-semibold       /* Font weights */
.leading-6           /* Line heights */
```

### **Common PrimeNG Components**

```html
<!-- Buttons -->
<p-button label="Save" severity="primary" />
<p-button label="Cancel" severity="secondary" outlined />

<!-- Cards -->
<p-card header="Title">Content</p-card>

<!-- Tables -->
<p-table [value]="data">
  <ng-template pTemplate="header">
    <tr>
      <th>Column</th>
    </tr>
  </ng-template>
</p-table>

<!-- Forms -->
<p-inputtext [(ngModel)]="value" placeholder="Enter text" />
<p-dropdown [options]="options" [(ngModel)]="selected" />
```

---

## 🚨 Style Violations

### **Common Violations to Avoid**

```css
/* ❌ BAD: Custom colors */
.custom-red {
  color: #ff0000;
}
.brand-blue {
  background: #0066cc;
}

/* ❌ BAD: Custom spacing */
.weird-margin {
  margin: 23px;
}
.custom-padding {
  padding: 11px 17px;
}

/* ❌ BAD: Custom typography */
.custom-font {
  font-family: 'Comic Sans';
  font-size: 13.5px;
}
```

```html
<!-- ❌ BAD: Non-PrimeNG components -->
<div class="custom-button">Click me</div>
<table class="custom-table">
  ...
</table>

<!-- ✅ GOOD: PrimeNG components -->
<p-button label="Click me" />
<p-table [value]="data">...</p-table>
```

---

## 🚨 Emergency Fallback Plans

### **PrimeNG v20 Theming Issues**

If Nora theming becomes too complex with PrimeNG v20's new `@primeuix/*` architecture:

**Fallback Strategy:**

1. **Remove Nora theming**: Use PrimeNG default theme (no custom CSS imports)
2. **Simplify color system**: Use TailwindCSS default colors + minimal custom properties
3. **Component-first approach**: Rely on PrimeNG component defaults + TailwindCSS utilities

**Fallback Implementation:**

```css
/* styles.css - Simplified fallback */
@import 'primeicons/primeicons.css';
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Minimal custom properties only if needed */
:root {
  --brand-primary: #3b82f6;
  --brand-secondary: #64748b;
}
```

### **TailwindCSS Issues**

If TailwindCSS integration becomes problematic:

**Ultimate Fallback:**

- Remove TailwindCSS entirely
- Use plain CSS + PrimeNG defaults
- Custom CSS properties for consistent spacing/colors

---

**Remember**: When in doubt, check the **Nora theme documentation** and **PrimeNG component library** first before creating custom styles. If theming becomes blocking, **prioritize delivery over perfect styling** and use the fallback plans above.
