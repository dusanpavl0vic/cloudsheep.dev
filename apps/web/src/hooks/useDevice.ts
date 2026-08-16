import { useMediaQuery } from '@app/hooks'

/**
 * Granice su Tailwind-ove (`sm` 640, `lg` 1024, `xl` 1280), namerno — da bi klasa u `.tsx`
 * i grana u `.ts` uvek značile isto. Kad bi hook imao svoje brojeve, jedan bi se pomerio
 * bez drugog i raspored bi se prelomio negde između.
 */
const QUERY = {
  mobile: '(max-width: 639px)',
  tablet: '(min-width: 640px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  wide: '(min-width: 1280px)',
} as const

/**
 * Klasa uređaja po širini prozora.
 *
 * **Koristi se samo kad se raspored zaista razlikuje, ne kad se razlikuje samo izgled.**
 * Za „drugačija širina" ili „sakriveno" postoji Tailwind prefiks i to je uvek bolje: radi
 * pre nego što JS stigne i ne prisiljava komponentu na ponovni render pri promeni veličine.
 *
 * Ovde je opravdano jer se menja **ponašanje**: mobilni panel je preko celog ekrana i ulazi
 * odozdo, a tablet je bočni i ulazi zdesna — to su dve različite animacije, ne dve širine.
 *
 * Oslanja se na `useMediaQuery`, koji čita kroz `useSyncExternalStore`, pa je vrednost tačna
 * već pri prvom renderu — nema kadra u kom je sve `false`.
 */
export const useDevice = () => ({
  isMobile: useMediaQuery(QUERY.mobile),
  isTablet: useMediaQuery(QUERY.tablet),
  isDesktop: useMediaQuery(QUERY.desktop),
  /** `xl` — jedina širina na kojoj lebdeće hero kartice imaju mesta pored naslova. */
  isWide: useMediaQuery(QUERY.wide),
})
