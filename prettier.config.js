const prettierPluginTailwindcss = require('prettier-plugin-tailwindcss')

module.exports = {
  semi: false,
  printWidth: 100,
  trailingComma: 'all',
  singleQuote: true,
  plugins: [prettierPluginTailwindcss],
}
