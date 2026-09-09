# 22 — Vizuelni jezik

> Status: active | Last review: 2026-09-09

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

### 3. Staklo: površina je providna, ivica hvata svetlo

> **Izmenjeno 2026-09-09** (`redesign/glassmorphism`). Ranije je ovde pisalo „meka elevacija
> umesto ivica": kartica se izdvaja isključivo senkom, a ivica + senka na istoj površini bila
> je anti-pattern. Materijal je sada staklo, pa ivica **jeste** deo materijala, ne drugi
> sistem izdvajanja. Ostatak tog pravila — široka bleda senka, velik radijus — ostaje.

Površina je **providna ploča iznad podloge**: propušta boju i oblik onoga što je iza,
zamućeno, i hvata svetlo po gornjoj ivici.

Materijal ima šest sastojaka i nijedan nije opcion:

| Sastojak           | Token                     | Zašto                                                   |
| ------------------ | ------------------------- | ------------------------------------------------------- |
| providna podloga   | `bg-glass`                | boja podloge se vidi kroz nju; puna podloga nije staklo |
| zamućenje iza      | `backdrop-blur-glass`     | bez njega je ploča prozirna, ne staklena                |
| **saturacija iza** | `backdrop-saturate-[1.7]` | zamućenje razmaže boju u sivo; saturacija je vrati      |
| **spekular**       | `--glass-specular`        | `inset` odsjaj uz gornju ivicu — daje ploči DEBLJINU    |
| prigušena ivica    | `border-glass-edge-soft`  | rub ploče; **jedne boje sa svih strana**                |
| široka bleda senka | `shadow-glass`            | odvaja ploču od podloge; nasleđeno iz starog §3         |

Poslednja tri stižu kroz `shadow-glass`, koja nosi tri sloja: `inset` odsjaj gore, `inset`
senku dole, pa spoljnu senku.

> **Gornja ivica se ne crta borderom.** Prva verzija je imala i `border-t-glass-edge` i
> `inset` spekular — dve bele linije jedna na drugoj, što je na ekranu debela pruga umesto
> odsjaja, i najgore na zaobljenim uglovima gde ravna linija ne prati luk. Debljinu nosi
> isključivo spekular.

```
✅ glassVariants({ elevation: 'raised' })
❌ bg-card shadow-md                     — puna podloga, uska senka: nije staklo
❌ bg-glass                              — providno bez zamućenja je prozor, ne staklo
❌ border-t-glass-edge uz shadow-glass   — dve svetle linije, pruga umesto odsjaja
```

Radijus je velik: `rounded-2xl` za kartice, `rounded-3xl` za panele i okvire sekcija.

**Ne piše se ručno.** Recept živi u `glassVariants` (`packages/ui/src/lib/surface.variants.ts`)
i uzima se odatle — inače se četiri sastojka razidu po fajlovima i prva izmena zaboravi jedan.

### 3a. Staklo traži svetlo iza sebe

`backdrop-filter: blur()` preko ravne boje **ne daje ništa vidljivo** — zamućena ravna boja
je ista ta boja. Zato ceo redizajn stoji na ambijentalnom sloju ispod stranice: četiri velika
meka radijalna svetla u `--aurora-*` bojama.

- **Svetla su ogromna i slaba** (`60vw`, alfa 0.10–0.16). Malo i jako svetlo je mrlja;
  veliko i slabo je ambijent.
- **Boje su `mark-*` paleta** (plava, ljubičasta, tirkiz, ćilibar) — ista ona iz §4b.
  Ovde ne krše pravilo o jednom akcentu jer **ne stoje ni na jednoj akcionoj površini**:
  difuzne su, iza svega, i nijedan element se njima ne označava.
- **Statična su.** §6 i dalje važi i nije popustio: nijedan `background-position` se ne
  animira. Aurora je nacrtana jednom i stoji.
- **Jedan sloj na ceo dokument**, ne po sekciji. Četiri svetla po sekciji znače četrdeset
  svetala na stranici i podloga postane šarena kaša.

### 3b-glass. Koliko zamućenja, i gde se staje

`backdrop-filter` je skup: pretraživač mora da uzorkuje i zamuti sve ispod elementa, na
svaki kadar u kom se nešto pomeri. Zato:

- **Poluprečnik prati veličinu površine.** 14px (`--glass-blur`) za kartice i panele,
  22px (`--glass-blur-strong`) za slojeve iznad sadržaja (dijalog, mobilna navigacija,
  header), **8px za kontrole** (`control` varijanta: dugme, pilula, polje). Poluprečnik
  veći od pola visine elementa nije materijal nego zamućena fleka.
- **Kontrole SMEJU nositi staklo.** Prva verzija ovog dokumenta je to zabranjivala; zabrana
  je pala na merenju, ne na raspravi. Ali `default` dugme ostaje **puna plava** — plava je
  jedina boja akcije (§4), a staklo na primarnom dugmetu ga izjednačava sa sekundarnim.
- **Broji ploče U KADRU, ne u dokumentu.** Element van ekrana se ne kompozituje. Stranica
  ima 26 staklenih elemenata a u kadru su istovremeno 2 — granica od ~12 važi za ono što
  se vidi.

**Izmereno** (produkcijski build, 4× usporen CPU, skrol kroz celu stranicu):

|                                | pre redizajna | posle   |
| ------------------------------ | ------------- | ------- |
| elemenata sa `backdrop-filter` | 12            | 26      |
| p50 kadra                      | 21.9 ms       | 23.3 ms |
| p95 kadra                      | 47.4 ms       | 53.5 ms |
| kadrova preko 50 ms            | 0 / 84        | 11 / 78 |

Trošak je stvaran i nije nula: p95 raste 13%, i pojave se kadrovi preko 50 ms kojih pre nije
bilo. Na neusporenom uređaju je to oko četvrtine toga. **Ako broj ploča u kadru poraste, ovo
se ponovo meri** — vrednosti gore su prag, ne istorijska beleška.

- **Tekst nikad ne stoji na providnosti bez podloge.** Tokeni teksta ostaju puni
  (`text-foreground`, `text-muted-foreground`); providna je samo podloga ispod njih.

### 3c. Nijedno neprovidno ostrvo u providnom okviru

Okvir stranice propušta auroru. Sekcija koja nosi **punu** podlogu postaje ostrvo pune boje
usred providne stranice, a na njegovoj ivici se pojavi oštra vodoravna linija tamo gde
ostrvo prestaje.

Tako je i bilo: hero je imao `bg-background`, footer `bg-muted/55` — i druga boja i druga
alfa od okvira. Dok je okvir bio neprovidan ništa se nije videlo; providan okvir je to
razotkrio kao rez preko stranice.

- Sekcija koja treba da se izdvoji uzima **isti materijal** (`glassVariants`), ne drugu boju.
- Sekcija koja se ne izdvaja nema podlogu uopšte — aurora prolazi kroz nju.
- Izuzetak je `tone: 'inverse'` (tamna CTA traka): ona je namerno druga površina, i prelaz
  joj rešavaju radijus i senka, ne ton podloge.

**Površina koja naleže na ivicu okvira gasi se maskom, ne ivicom.** Header i footer su
puna ploča koja naglo prestaje — na dnu headera je to bilo 81 nivo razlike na jednom
pikselu, dakle vidljiva linija preko cele širine. Rešenje nije tanja linija nego nikakva:
staklo ide na sloj ispod sadržaja (`before:`), a taj sloj nosi
`mask-image: linear-gradient(...)` koji ga gasi ka sadržaju. `backdrop-filter` se maskira
zajedno sa podlogom, pa se i zamućenje gasi postepeno — bez toga ostaje oštra granica
zamućenja i kad granica boje nestane.

> Maska **mora** na zaseban sloj. Na samom headeru bi gasila i logo i navigaciju.

**Izmereno** skeniranjem kolone piksela niz celu stranicu (skok > 12 nivoa = rez):

| prelaz                      | pre | posle   |
| --------------------------- | --- | ------- |
| dno headera                 | 81  | 36      |
| vrh footera                 | 81  | nema ga |
| ivice dijagonalne trake     | 54  | nema ih |
| ivica okvira (namerna)      | 97  | 57      |
| **ukupno rezova na strani** | 6   | **4**   |

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
| Puna podloga (`bg-card`) na kartici    | staklo mora propuštati podlogu                 | `glassVariants`          |
| `bg-glass` bez `backdrop-blur`         | providno bez zamućenja je prozor, ne staklo    | ceo recept iz §3         |
| Pun poluprečnik (14px) na dugmetu      | veći od pola visine = zamućena fleka           | `control` varijanta, 8px |
| Staklo na primarnom dugmetu            | izjednačava ga sa sekundarnim (§4)             | puna plava               |
| Puna podloga na sekciji                | neprovidno ostrvo → rez preko stranice (§3c)   | isti materijal ili ništa |
| Više od ~12 staklenih ploča u kadru    | skrol se trza na slabijem uređaju              | lista umesto kartica     |
| Tri različite akcenatske boje          | ništa se ne ističe kad se sve ističe           | jedan akcenat            |
| Naslov u dve veličine slova            | lomi tipografsku skalu                         | dvotonski, ista veličina |
| `//` ili drugi znak kao labela sekcije | traži da čitalac zna šifru                     | pilula sa rečju          |
| Tamna uska senka (`shadow-md`)         | izgleda kao Bootstrap 2014                     | široka i bleda           |
| Prigušen tekst nosi ključni podatak    | slab kontrast, preskače se                     | prigušeno je dopuna      |

---

## Checklist

- [ ] Sekcija ima pilula-labelu, ne `//` marker
- [ ] Naslov je dvotonski, u jednoj veličini slova
- [ ] Kartica koristi `glassVariants`, ne ručno sklopljen recept
- [ ] Staklo ima sva četiri sastojka (podloga, zamućenje, ivica, senka)
- [ ] Kontrole koriste `control` (8px), ne pun poluprečnik
- [ ] Nijedna sekcija ne nosi punu podlogu (§3c)
- [ ] U kadru (ne u dokumentu) nema više od ~12 staklenih ploča
- [ ] Radijus je `rounded-2xl` ili veći
- [ ] Na ekranu je najviše jedna akcenatska površina po grupi
- [ ] Nijedan uzorak u pozadini se ne animira
- [ ] Prigušen tekst se može izgubiti bez gubitka smisla
- [ ] Kontrast prigušenog teksta i dalje ≥ 4.5:1 ([`15-accessibility.md`](15-accessibility.md))
