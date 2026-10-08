import { combineSlices } from '@reduxjs/toolkit'

import { preferencesSlice } from './slices/preferences/reducer'
import { uiSlice } from './slices/ui/reducer'

/**
 * Slice-ovi koji se ubacuju kad zatrebaju (`rootReducer.inject`). Prvi je RTK Query
 * (`store/api/baseApi.ts`): javna stranica bez forme ga nikad ne učita (docs/04-state-management.md §2).
 * Proširuje se module augmentation-om u fajlu koji ubacuje slice.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- popunjava se augmentation-om
export interface LazyLoadedSlices {}

export const rootReducer = combineSlices(
  uiSlice,
  preferencesSlice,
).withLazyLoadedSlices<LazyLoadedSlices>()
