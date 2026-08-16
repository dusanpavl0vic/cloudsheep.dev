import { createPackageConfig } from '@app/eslint-config';

// react: false — zero React deps po docs/14-helpers-utils.md
export default createPackageConfig({ tsconfigRootDir: import.meta.dirname, react: false });
