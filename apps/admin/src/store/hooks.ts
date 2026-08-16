import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, RootState } from './index'

// Tipizirani hookovi — koriste ih FEATURE HOOKOVI, nikad komponente (docs/13)
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
