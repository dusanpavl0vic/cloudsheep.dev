import type { RootState } from '../../../index'
import { initialState } from '../reducer/initialState'

/** Slice je lenj — pre ubacivanja ga nema u stanju, pa se čita sa podrazumevanom vrednošću. */
const auth = (state: RootState) => state.auth ?? initialState

export const selectSessionStatus = (state: RootState) => auth(state).status

export const selectSessionUser = (state: RootState) => auth(state).user

export const selectAccessToken = (state: RootState) => auth(state).accessToken
