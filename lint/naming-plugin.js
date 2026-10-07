// Private class members must start with an underscore: `private _poll()`.
const privateUnderscore = {
  meta: {
    type: 'suggestion',
    messages: {
      missing: "Private member '{{name}}' should start with an underscore",
    },
  },
  create(context) {
    function check(node, key) {
      if (node.accessibility !== 'private' || key?.type !== 'Identifier') {
        return
      }
      if (!key.name.startsWith('_')) {
        context.report({ node: key, messageId: 'missing', data: { name: key.name } })
      }
    }

    return {
      PropertyDefinition: (node) => check(node, node.key),
      MethodDefinition: (node) => check(node, node.key),
      TSAbstractPropertyDefinition: (node) => check(node, node.key),
      TSAbstractMethodDefinition: (node) => check(node, node.key),
      TSParameterProperty: (node) =>
        check(
          node,
          node.parameter.type === 'AssignmentPattern' ? node.parameter.left : node.parameter,
        ),
    }
  },
}

export default {
  meta: { name: 'naming' },
  rules: { 'private-underscore': privateUnderscore },
}
