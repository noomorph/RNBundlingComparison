const fs = require('fs');
const {loremIpsum} = require('lorem-ipsum');

const COUNT = 9000;

const generateModule = () => `module.exports = {
  message: ${JSON.stringify(loremIpsum({count: 100}))}
};
`;

for (let index = 0; index < COUNT; index++) {
    console.log('create', index);
    fs.writeFileSync(`stubs/module-${index}.js`, generateModule())
}

const originalCode = fs.readFileSync('./App.js', 'utf8');

const startIndex = originalCode.indexOf('\n', originalCode.indexOf('// BEGIN DEAD CODE'));
const endIndex = originalCode.indexOf('// END DEAD CODE');

function generateRequires() {
    let section = `if (Math.random() < 0) {\n`;
    for (let index = 0; index < COUNT; index++) {
        section += `  require("./stubs/module-${index}.js");\n`;
    }
    section += `}\n`;

    return section;
}

if (startIndex !== -1 && endIndex !== -1) {
    fs.writeFileSync('./App.js', originalCode.slice(0, startIndex + 1) + generateRequires() + originalCode.slice(endIndex - 1));
}
