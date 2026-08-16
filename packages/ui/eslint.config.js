import { createPackageConfig } from '@app/eslint-config';

// react: true — uključuje i zabranu uvoza store-a i i18n-a, što je za ovaj paket suština
export default createPackageConfig({ tsconfigRootDir: import.meta.dirname });
