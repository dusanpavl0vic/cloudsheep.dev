import { useState } from 'react';

/**
 * Vrednost iz prethodnog rendera; `undefined` pri prvom.
 *
 * NE koristi `useRef` + `useEffect`, iako je to najrasprostranjeniji obrazac na internetu.
 * Čitanje `ref.current` tokom rendera je kršenje pravila React-a i `eslint-plugin-react-hooks`
 * v7 (compiler pravila) ga prijavljuje kao grešku — uz konkurentno renderovanje ref može
 * nositi vrednost iz rendera koji nikad nije commit-ovan.
 *
 * Umesto toga koristi „prilagođavanje stanja tokom rendera": kad se prop promeni, upiši
 * novo stanje odmah. React prekida taj render i odmah ga ponovi sa novim stanjem, bez
 * međukoraka koji korisnik vidi.
 *
 * Ako ti treba samo reakcija na promenu — to je skoro uvek event handler, ne ovaj hook.
 */
export function usePrevious<T>(value: T): T | undefined {
  const [current, setCurrent] = useState(value);
  const [previous, setPrevious] = useState<T | undefined>(undefined);

  if (!Object.is(value, current)) {
    setPrevious(current);
    setCurrent(value);
  }

  return previous;
}
