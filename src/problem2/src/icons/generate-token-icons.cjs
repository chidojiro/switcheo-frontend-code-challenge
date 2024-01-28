/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const FOLDER_PATH = './tokens';

const pascalCase = str =>
  str
    .replace(/(\w)(\w*)/g, function (g0, g1, g2) {
      return g1.toUpperCase() + g2.toLowerCase();
    })
    .replace(/\W/g, '');

const getIconsCollectionFileContent = () => {
  const directChildren = fs.readdirSync(path.resolve(__dirname, FOLDER_PATH));

  const getImportDeclaration = file => {
    const fileName = file.split('.')[0];

    const componentName = pascalCase(fileName);

    return `import { ReactComponent as Token${componentName} } from './tokens/${fileName}.svg';`;
  };

  const getExportDeclaration = file => {
    const fileName = file.split('.')[0];

    const componentName = pascalCase(fileName);

    return `export const Token${componentName}Icon = withIconProps(Token${componentName});`;
  };

  const importDeclarations = directChildren.map(getImportDeclaration).filter(Boolean).join('\n') + '\n';

  const exportDeclarations = directChildren.map(getExportDeclaration).filter(Boolean).join('\n') + '\n';

  return ["import { withIconProps } from './withIconProps';\n", importDeclarations, exportDeclarations].join('\n');
};

fs.writeFileSync(path.resolve(__dirname, FOLDER_PATH, '../token-icons.generated.tsx'), getIconsCollectionFileContent());
