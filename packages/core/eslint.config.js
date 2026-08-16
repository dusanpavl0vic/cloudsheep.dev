import { createPackageConfig } from '@app/eslint-config';

// react: false — core sadrži store i mora smeti da uvozi @reduxjs/toolkit,
// što zabrana iz react preseta (namenjena packages/ui) ne bi dozvolila
export default createPackageConfig({ tsconfigRootDir: import.meta.dirname, react: false });
