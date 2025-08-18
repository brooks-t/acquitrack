// Simple guard to enforce Tailwind v4 setup with @tailwindcss/postcss
// and ensure global styles import the v4 entrypoint.
const fs = require('fs');
const path = require('path');

const errors = [];

// 1) Ensure postcss.config.* exists and uses @tailwindcss/postcss
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
  if (!postcssContent.includes('@tailwindcss/postcss')) {
    errors.push(
      "postcss.config.* must use '@tailwindcss/postcss' plugin (Tailwind v4)."
    );
  }
  if (postcssContent.match(/tailwindcss["']?\s*[),}]/)) {
    errors.push(
      "postcss.config.* must NOT register 'tailwindcss' as a PostCSS plugin (that is v3 style)."
    );
  }
}

// 2) Ensure styles import Tailwind v4 entrypoint
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
  if (
    !stylesContent.includes("@import 'tailwindcss'") &&
    !stylesContent.includes('@import "tailwindcss"')
  ) {
    errors.push(
      'Global styles must include: @import "tailwindcss"; at the top (Tailwind v4).'
    );
  }
  if (
    !stylesContent.includes("@import 'tailwindcss-primeui'") &&
    !stylesContent.includes('@import "tailwindcss-primeui"')
  ) {
    errors.push(
      'Global styles should include: @import "tailwindcss-primeui"; after the Tailwind import.'
    );
  }
}

if (errors.length) {
  console.error('\n❌ Tailwind v4 / PostCSS / PrimeUI setup check failed:');
  for (const e of errors) console.error(' - ' + e);
  console.error('\nFix the issues above. Failing as a safeguard.\n');
  process.exit(1);
} else {
  console.log('✅ Tailwind v4 / PostCSS / PrimeUI setup looks correct.');
}
