import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, RootState } from './index'

// Tipizirani hookovi — u komponentama se koriste OVI, nikad goli useDispatch/useSelector
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
