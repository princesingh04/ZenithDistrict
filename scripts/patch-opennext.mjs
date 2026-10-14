import fs from 'node:fs';
import path from 'node:path';

const patchTarget = path.resolve('node_modules/@opennextjs/cloudflare/dist/cli/build/patches/plugins/load-manifest.js');

if (fs.existsSync(patchTarget)) {
  let content = fs.readFileSync(patchTarget, 'utf-8');

  // Ensure 3 closing parentheses before .join("\n")
  content = content.replace(
    /\}\s*`\s*\)\s*\)\s*\.?\s*join\s*\(\s*["']\\n["']\s*\)/g,
    '}`))).join("\\n")'
  );

  // Add preview-props to manifests glob
  if (!content.includes('preview-props}.json')) {
    content = content.replace(
      '**/{*-manifest,required-server-files,prefetch-hints}.json',
      '**/{*-manifest,required-server-files,prefetch-hints,preview-props}.json'
    );
  }

  // Add preview-props to known fallback manifests
  if (!content.includes('p.endsWith("preview-props")')) {
    content = content.replace(
      'p.endsWith("prefetch-hints")) {',
      'p.endsWith("prefetch-hints") || p.endsWith("preview-props")) {'
    );
  }

  fs.writeFileSync(patchTarget, content, 'utf-8');
  console.log('✓ Successfully applied patch to load-manifest.js');
}
