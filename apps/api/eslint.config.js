import { createPackageConfig } from '@app/eslint-config';

// `createPackageConfig`, ne `createAppConfig`: API je Node servis bez Reacta, pa mu
// React pravila (hookovi, JSX a11y) nemaju šta da provere.
export default createPackageConfig({ tsconfigRootDir: import.meta.dirname, react: false });
