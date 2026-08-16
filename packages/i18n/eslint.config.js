import { createPackageConfig } from '@app/eslint-config';

// react: false — ovo NIJE UI paket; zabrana uvoza i18n-a važi za packages/ui, ne ovde
export default createPackageConfig({ tsconfigRootDir: import.meta.dirname, react: false });
