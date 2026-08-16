// Javni API @app/core (docs/adr/0005 — barrel samo na granici paketa)

export { type AppError, ERROR_KEYS, isAppError, normalizeError } from './errors/AppError'
export { consoleTransport, createLogger, type Logger, type LogLevel, type LogTransport } from './logger/logger'
export { Mutex } from './api/mutex'
export {
  allModalsClosed,
  MODAL_SLICE_NAME,
  modalClosed,
  modalOpened,
  modalReducer,
  selectHasOpenModal,
  selectModalStack,
  selectTopModal,
} from './modals/modal.slice'
export type {
  ModalEntry,
  ModalId,
  ModalMeta,
  ModalPropsMap,
  ModalSize,
  ModalState,
} from './modals/modal.types'
export { pendingResolverCount, registerResolver, resetResolvers, settleResolver } from './modals/resolvers'
export { useModal } from './modals/useModal'
export { type AppDispatch, type AppStore, createStore } from './store/createStore'
