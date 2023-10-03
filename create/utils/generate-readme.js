const generateNpmScripts = require('./generate-npm-scripts');

module.exports = (options) => {
  const { name } = options;

  const npmScripts = generateNpmScripts().map((s) => {
    return `* ${s.icon} \`${s.name}\` - ${s.description}`;
  });

  return `

# ${name}

## ZMP CLI Options

ZMP app created with following options:

\`\`\`
${JSON.stringify(options, null, 2)}
\`\`\`

## NPM Scripts

${npmScripts.join('\n')}
`
    .trim()
    .replace(/[\n]{3,}/, '\n');
};
