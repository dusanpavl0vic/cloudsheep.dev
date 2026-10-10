/**
 * Potvrda adrese linkom (ADR 0016). Link iz mejla važi 24 h — toliko se drži i izabran termin;
 * nepotvrđeni upiti i prijave brišu se posle 7 dana (minimizacija ličnih podataka).
 */
export const CONFIRM_LINK_HOURS = 24
export const UNCONFIRMED_PURGE_DAYS = 7

/** Ishod potvrde — stranica ga prikazuje posle `POST`-a (`?status=`). */
export const CONFIRM_STATUSES = ['confirmed', 'expired', 'invalid'] as const
export type ConfirmStatus = (typeof CONFIRM_STATUSES)[number]
