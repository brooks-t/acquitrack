// Simple guard to enforce TailwindCSS v3 setup with standard PostCSS plugins
// and ensure global styles use @tailwind directives (not v4 @import syntax).
const fs = require('fs');
const path = require('path');

const errors = [];

// 1) Ensure postcss.config.* exists and uses tailwindcss (not @tailwindcss/postcss)
const postcssCandidates = [
  'postcss.config.js',
  'postcss.config.cjs',
  'postcss.config.mjs',
];

let postcssFound = false;
let postcssContent = '';
for (const file of postcssCandidates) {
  const p = path.resolve(process.cwd(), file);
  if (fs.existsSync(p)) {
    postcssFound = true;
    postcssContent = fs.readFileSync(p, 'utf8');
    break;
  }
}
if (!postcssFound) {
  errors.push('Missing postcss.config.(js|cjs|mjs) at repo root.');
} else {
  if (!postcssContent.includes('tailwindcss:')) {
    errors.push(
      "postcss.config.* must use 'tailwindcss: {}' plugin (TailwindCSS v3)."
    );
  }
  if (postcssContent.includes('@tailwindcss/postcss')) {
    errors.push(
      "postcss.config.* must NOT use '@tailwindcss/postcss' plugin (that is v4 style, we use v3)."
    );
  }
}

// 2) Ensure styles use TailwindCSS v3 @tailwind directives
const styleCandidates = [
  'src/styles.css',
  'src/styles.scss',
  'src/styles.sass',
];
let stylesFound = false;
let stylesContent = '';
for (const file of styleCandidates) {
  const p = path.resolve(process.cwd(), file);
  if (fs.existsSync(p)) {
    stylesFound = true;
    stylesContent = fs.readFileSync(p, 'utf8');
    break;
  }
}
if (!stylesFound) {
  errors.push('Missing global styles file (src/styles.css|scss|sass).');
} else {
  const requiredDirectives = [
    '@tailwind base',
    '@tailwind components',
    '@tailwind utilities',
  ];
  for (const directive of requiredDirectives) {
    if (!stylesContent.includes(directive)) {
      errors.push(
        `Global styles must include: ${directive}; (TailwindCSS v3 syntax).`
      );
    }
  }

  // Warn against v4 syntax
  if (
    stylesContent.includes("@import 'tailwindcss'") ||
    stylesContent.includes('@import "tailwindcss"')
  ) {
    errors.push(
      'Global styles should NOT use @import "tailwindcss"; (that is v4 syntax, we use v3 @tailwind directives).'
    );
  }
}

// 3) Ensure tailwind.config.js exists (unlike v4, v3 requires explicit config)
const tailwindConfigPath = path.resolve(process.cwd(), 'tailwind.config.js');
if (!fs.existsSync(tailwindConfigPath)) {
  errors.push(
    'Missing tailwind.config.js at repo root (required for TailwindCSS v3).'
  );
}

if (errors.length) {
  console.error('\n❌ TailwindCSS v3 / PostCSS setup check failed:');
  for (const e of errors) console.error(' - ' + e);
  console.error('\nFix the issues above. Failing as a safeguard.\n');
  process.exit(1);
} else {
  console.log('✅ TailwindCSS v3 / PostCSS setup looks correct.');
}
