import { createPackageConfig } from '@app/eslint-config';

// react: false — ovo je build konfiguracija, nema komponenti
export default createPackageConfig({ tsconfigRootDir: import.meta.dirname, react: false });
