import { createPackageConfig } from '@app/eslint-config';

// react: false — testing sme da uvozi store i i18n; zabrana važi za packages/ui
export default createPackageConfig({ tsconfigRootDir: import.meta.dirname, react: false });
