import esbuild from 'esbuild'
import fs from 'fs'

const version = process.env.VERSION
const domain = process.env.DOMAIN || 'libtl.com'

if (version) {
  console.log('Building version:', version)
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
  packageJson.version = version
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2), 'utf-8')
}

console.log('Building with domain:', domain)

const config = {
  entryPoints: ['index.ts'],
  minify: true,
  define: {
    'process.env.DOMAIN': JSON.stringify(domain),
  }
}

// ESM
esbuild.build({
  ...config,
  outfile: 'index.js',
  format: 'esm',
}).catch(() => process.exit(1))

// IIFE for HTML
esbuild.build({
  ...config,
  outfile: 'index.global.js',
  format: 'iife',
  globalName: 'MonetagSDK',
  bundle: true,
  footer: {
    js: 'window.createAdHandler = MonetagSDK.default;'
  }
}).catch(() => process.exit(1))

