# 22 — Vizuelni jezik

> Status: active | Last review: 2026-08-16

Ovaj dokument opisuje **vizuelni sloj** koji stoji preko tokena iz
[`08-styling-ui.md`](08-styling-ui.md). Tokeni kažu _koje su boje_; ovde piše _kako se koriste_.

**Poreklo:** jezik je izveden iz referentnog dizajna (ChronoTask, studio Outcrowd) koji je
naručilac izabrao. Preuzeti su **obrasci** — dvotonski naslov, pilula-labela, meka elevacija,
istaknuta srednja kartica. Nisu preuzeti ni raspored, ni tekst, ni ilustracije: to je tuđe
autorsko delo, a i naš sajt nije SaaS proizvod nego studio.

---

## Pravila

### 1. Dvotonski naslov

Naslov sekcije ima **dva registra u istoj rečenici**: nosivi deo u punoj boji teksta,
nastavak u prigušenoj. Time naslov dobija ritam bez druge veličine slova i bez druge težine.

```tsx
<h2>
  {t('services.title')} <span className="text-faint">{t('services.titleMuted')}</span>
</h2>
```

Pravilo: prigušeni deo je **dopuna, ne ključna informacija**. Ako se izgubi, rečenica i dalje
mora imati smisla — prigušen tekst ima slabiji kontrast i neko će ga preskočiti.

### 2. Pilula-labela iznad naslova

Svaka sekcija se najavljuje malom pilulom sa jednom rečju (`Usluge`, `Cene`, `Proces`).
Bela podloga, tanka ivica, meka senka, centrirano.

Zamenjuje raniji `//` marker: pilula nosi isti podatak, a ne traži da čitalac zna šta `//` znači.

### 3. Meka elevacija umesto ivica

Kartice se izdvajaju **senkom i podlogom**, ne linijom. Senka je široka i bleda —
nikad tamna i uska.

```
✅ shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_-8px_rgb(0_0_0/0.10)]
❌ border border-border shadow-md
```

Radijus je velik: `rounded-2xl` za kartice, `rounded-3xl` za panele i okvire sekcija.

### 3b. Lebdeći ukras je oblak, ne kartica

Papirne površine koje **lebde oko naslova** (hero, 404) su **oblaci misli**: silueta oblačića
iz stripa i **rep od tri kružića** koji opadaju ka izvoru misli — naslovu.

Razlog je značenje, ne ukus. Sadržaj tih površina („poslednji deploy", „u toku",
„lighthouse") nije dokument nego razmišljanje studija; kartica obećava sadržaj koji se može
otvoriti, oblak ne obećava ništa.

- **Silueta je jedna nacrtana putanja**, `--cloud-mask` u `theme.css`: zatvoren niz od osam
  lukova oko elipse, bez ijedne prave ivice, primenjen kao `mask-image`.
  Poluprečnik svakog luka je ~58% njegove tetive — manje daje plitke doline, više izboči luk
  u balon.
- **Ne krugovi preko pravougaonika.** Tako je prvo bilo napravljeno i nikad nije dalo oblak:
  bokovi ostaju pravi, krugovi blizu uglova vise izvan plohe, a `justify-between` uz nužno
  preklapanje izbacuje poslednji krug van reda. Jedna putanja nema nijedan od tih problema i
  ne zavisi od širine sadržaja.
- **Maska ide na zaseban sloj**, nikad na element sa tekstom — inače seče i slova.
- **Rep uvek gleda ka izvoru.** Oblak gore-levo ima rep na donjem-desnom uglu i obrnuto. Rep
  koji pokazuje u prazno je crtež, ne znak.
- **Senka je `drop-shadow` na omotaču**, ne `box-shadow`: prati alfu maske, pa obilazi
  konturu oblaka umesto njegovog pravougaonog okvira.
- **Ispod `xl` oblaka nema uopšte.** Naslov je tamo centriran preko cele širine i za lebdeći
  raspored nema mesta. Probana su i odbačena dva surogata: vodoravna traka koja se prevlači
  (sakrivala je 3 od 5 misli iza pokreta koji većina posetilaca ne napravi) i jedna misao koja
  plovi preko kadra (jedna od pet ne opravdava stalan pokret ispod naslova). Ništa je bolje od
  surogata.
- **Gasi se u komponenti, ne klasom.** `hidden` bi ostavio pet oblaka u DOM-u da se crtaju i
  animiraju bez ijednog vidljivog piksela; granicu zato bira `useDevice`.
- **Ovo važi samo za ukras.** Panelne sekcije (usluge, proces, cene) nose sadržaj i ostaju
  paneli po §3. Oblak sa domenskom akcijom u sebi je greška.

### 4. Jedan akcenat, i to štedljivo

Paleta je skoro monohromna — pozadina, tekst, sivi tonovi. **Plava se koristi samo za ono
što traži akciju**: primarno dugme, istaknuta kartica, aktivna stavka. Ako je na ekranu tri
plave stvari, dve su suvišne.

### 4b. Boja na oznakama, ne na površinama

Pored plave postoje četiri `mark-*` tokena (`amber`, `violet`, `teal`, `rose`).
Oni nose **šarenilo na sitnim površinama**: ikonice, brojevi koraka, tanke niti, tagovi.

> **Nikad na dugmetu ni na punoj kartici.** Plava ostaje jedina boja akcije (§4).
> Ako korak procesa ima ljubičastu nit i ljubičast broj, to je oznaka; ako bi imao
> ljubičastu podlogu, četiri kartice bi vikale jedna preko druge.

Svi `mark-*` su usklađeni po svetlini da nijedan ne dominira, i svi prolaze 3:1 prema
podlozi u obe teme — to je prag za grafičke oznake po WCAG-u.

Brend logotipi tehnologija su izuzetak od pravila o jednom akcentu: oni **jesu** šarenilo,
i zato stoje u belim squircle pločicama koje ih drže odvojene od ostatka stranice.

**Za tuđe logotipe fiksne boje postoji grupa `--plate*`** — jedini tokeni koji **nemaju par
u tamnoj temi**, i to namerno. Grb Elektronskog fakulteta je tamno plav sa providnom
pozadinom; na `--card` u tamnoj temi (27.68% svetline) prosto bi nestao. Boju tuđeg znaka
ne biramo mi, pa mu moramo dati podlogu koju biramo.

| Token               | Uloga                        |
| ------------------- | ---------------------------- |
| `--plate`           | papir / podloga logotipa     |
| `--plate-ink`       | mastilo na papiru            |
| `--plate-ink-muted` | prigušeno mastilo (podnožje) |
| `--plate-line`      | linija na papiru             |

**Kad se podloga ne invertuje, ne sme ni tekst na njoj.** `text-foreground` bi u tamnoj temi
postao skoro beo i nestao sa svetlog papira — zato papir nosi svoje mastilo. Izmereno iz
OKLCH: mastilo **9.98:1**, prigušeno **7.08:1**, linija **3.05:1**.

**Gde se sme koristiti — tri mesta, i to je ceo spisak:**

| Gde                           | Zašto baš tu                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| pločice logotipa (`TechTile`) | `nextjs.svg` i `github.svg` su `fill="black"` — na tamnoj `--card` su bili nevidljivi |
| diploma (`CredentialSeal`)    | grb je tamno plav na providnoj pozadini                                               |
| lebdeće hero kartice          | lebde **iznad** podloge, pa u tamnoj temi čitaju kao papir na stolu                   |

> Za sve ostalo `--card`. Površina koja se ne invertuje je u tamnoj temi svetla mrlja, i
> svaka sledeća je mrlja više. Zajedničko za sva tri slučaja: **nisu deo toka stranice** —
> ili nose tuđu boju koju ne biramo, ili lebde iznad nje.

**Posledica koju je lako promašiti:** kad podloga ne prati temu, ne sme ni tekst na njoj.
`text-foreground` unutar `bg-plate` postaje u tamnoj temi skoro beo i nestaje. Zato uz
`--plate` uvek ide `text-plate-ink` (ili `-muted`), nikad obična tekstualna klasa.

### 4c. Dokument sme ivicu — i to je jedini izuzetak od §3

Diploma u Studio sekciji ima **uokvireno polje sa tankom linijom**, iako §3 kaže da se
površine izdvajaju senkom. Razlog je što ovde ivica **nije način izdvajanja nego sadržaj**:
štampan dokument bez okvira nije dokument nego kartica.

Papir se i dalje izdvaja senkom, kao svaka druga površina; linija je unutar njega.
Prva vrednost za nju bio je `--border-strong`, koji na papiru daje **1.62:1** i praktično se
ne vidi — otud poseban `--plate-line`.

Pečat je otisnut **preko** sadržaja (`absolute`, zarotiran, `mix-blend-multiply`), ne
poređan pored njega. Znak koji stoji uredno u koloni sa tekstom je ikonica; pečat je otisak.

Tag sa logotipom je druga strana istog pravila: kad boju nosi znak, oko njega **nema ni
ivice ni podloge** (`badge` varijanta `logo` + veličina `bare`). Pilula bi bila drugi sistem
izdvajanja preko istog (§3).

### 5. Istaknuta kartica u grupi

U grupi od tri (cene, planovi), srednja je **puna akcenatska**: plava podloga, beo tekst,
malo veća i podignuta. Ostale ostaju svetle. Bez toga korisnik ne zna šta biramo za njega.

### 6. Tačkasta tekstura, i to statična

Podloga sekcije sme da nosi **finu tačkastu teksturu** — ali samo statičnu.

> **Nikad animiran uzorak u pozadini.** Već su dva pala na tome: oblaci koji promiču i
> perspektivna mreža koja klizi. Oba su animirala `background-position`, što znači ponovno
> crtanje cele površine u svakom kadru — trza se na slabijem uređaju i vuče pogled sa naslova.
> Ako pozadina mora da se kreće, to je `transform` ili `opacity`, i to na malom elementu.

### 7. Strelica ispred linka u listi

Linkovi u footeru i sekundarnim listama dobijaju `→` ispred teksta. Dekorativno je,
pa ide `aria-hidden`.

---

## Primeri

**Zaglavlje sekcije**

```tsx
<SectionHeading
  label={t('pricing.label')} // pilula
  title={t('pricing.title')} // puna boja
  muted={t('pricing.titleMuted')} // prigušeni nastavak
/>
```

**Kartica**

```tsx
<article className={cn(surfaceVariants({ elevation: 'raised' }), 'rounded-2xl p-8')}>
```

---

## Anti-patterns

| ❌                                     | Zašto                                          | ✅                       |
| -------------------------------------- | ---------------------------------------------- | ------------------------ |
| Animiran uzorak u pozadini             | trza se, vuče pogled, ponovno crtanje po kadru | statična tekstura        |
| Ivica + senka na istoj kartici         | dva sistema izdvajanja koja se bore            | senka, bez ivice         |
| Tri različite akcenatske boje          | ništa se ne ističe kad se sve ističe           | jedan akcenat            |
| Naslov u dve veličine slova            | lomi tipografsku skalu                         | dvotonski, ista veličina |
| `//` ili drugi znak kao labela sekcije | traži da čitalac zna šifru                     | pilula sa rečju          |
| Tamna uska senka (`shadow-md`)         | izgleda kao Bootstrap 2014                     | široka i bleda           |
| Prigušen tekst nosi ključni podatak    | slab kontrast, preskače se                     | prigušeno je dopuna      |

---

## Checklist

- [ ] Sekcija ima pilula-labelu, ne `//` marker
- [ ] Naslov je dvotonski, u jednoj veličini slova
- [ ] Kartica se izdvaja senkom, ne ivicom
- [ ] Radijus je `rounded-2xl` ili veći
- [ ] Na ekranu je najviše jedna akcenatska površina po grupi
- [ ] Nijedan uzorak u pozadini se ne animira
- [ ] Prigušen tekst se može izgubiti bez gubitka smisla
- [ ] Kontrast prigušenog teksta i dalje ≥ 4.5:1 ([`15-accessibility.md`](15-accessibility.md))
