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

esbuild.build({
  entryPoints: ['index.ts'],
  outfile: 'index.js',
  minify: true,
  define: {
    'process.env.DOMAIN': JSON.stringify(domain),
  }
}).catch(() => process.exit(1))

