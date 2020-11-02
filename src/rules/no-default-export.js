import docsUrl from '../docsUrl'

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: docsUrl('no-default-export'),
    },
    schema: [],
  },

  create(context) {
    // ignore non-modules
    if (context.parserOptions.sourceType !== 'module') {
      return {}
    }

    const preferNamed = 'Prefer named exports.'
    const preferAliasedDefault = 'Do not export `default` itself. Give it an alias instead.'
    const noAliasDefault = ({local}) =>
      `Do not alias \`${local.name}\` as \`default\`. Just export ` +
      `\`${local.name}\` itself instead.`

    return {
      ExportDefaultDeclaration(node) {
        context.report({node, message: preferNamed})
      },

      ExportNamedDeclaration(node) {
        node.specifiers.forEach(specifier => {
          if (specifier.type === 'ExportDefaultSpecifier' &&
              specifier.exported.name === 'default') {
            context.report({node, message: preferNamed})
          } else if (specifier.type === 'ExportSpecifier' &&
              specifier.exported.name === 'default') {
            if (specifier.name === 'default') {
              context.report({node, message: preferAliasedDefault})
            }
            else {
              context.report({node, message: noAliasDefault(specifier)})
            }
          }
        })
      },
    }
  },
}
