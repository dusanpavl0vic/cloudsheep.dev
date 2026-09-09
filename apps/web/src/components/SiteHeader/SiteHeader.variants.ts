import { cva } from 'class-variance-authority'

/**
 * Header prati zaobljeni okvir stranice, pa umesto pune ivice preko celog ekrana
 * nosi hairline koji se gasi na krajevima — inače linija seče zaobljene uglove.
 */
export const siteHeaderVariants = cva(
  // Header je jedina površina koja je i pre redizajna bila staklena. Sad nosi isti
  // materijal kao sve ostalo — uključujući saturaciju i spekular — umesto sopstvenog
  // `/80` i `blur-xl`. Bez radijusa i bočnih ivica: naleže na ivicu okvira.
  [
    'sticky top-0 z-60 isolate w-full',
    /*
     * Staklo NE stoji na samom headeru nego na sloju ispod sadržaja, i taj sloj nosi masku
     * koja ga gasi ka dnu.
     *
     * Ranije je header bio ploča pune jačine koja naglo prestaje: na 84. pikselu je bilo
     * 81 nivo razlike prema sadržaju ispod — vidljiva vodoravna linija preko cele širine.
     * Hairline ispod nje je taj rez samo naglašavao, pa ga više nema.
     *
     * Maska mora na zaseban sloj, ne na header: na headeru bi gasila i logo i navigaciju.
     * `backdrop-filter` se maskira zajedno sa podlogom, pa se i zamućenje gasi postepeno —
     * upravo to i hoćemo, inače bi ostala oštra granica zamućenja bez granice boje.
     */
    // Sloj je VIŠI od headera: seže 40px ispod njega, i maska se gasi tek u tom produžetku.
    // Ranije je `inset-0` značilo da se gašenje dešava KROZ navigaciju — logo i linkovi su
    // pola stajali na staklu a pola u prazno, što je u svetloj temi izgledalo isprano.
    "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:-bottom-10 before:-z-10 before:bg-glass-strong before:content-['']",
    'before:supports-[backdrop-filter]:backdrop-blur-glass-strong before:supports-[backdrop-filter]:backdrop-saturate-[1.7]',
    'before:[-webkit-mask-image:linear-gradient(to_bottom,#000_64%,transparent)] before:[mask-image:linear-gradient(to_bottom,#000_64%,transparent)]',
  ].join(' '),
)

export const siteHeaderInnerVariants = cva('flex h-[72px] items-center gap-7')

export const siteNavVariants = cva('ml-auto hidden items-center gap-7 lg:flex')

export const siteNavLinkVariants = cva(
  'nav-underline text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground',
)
