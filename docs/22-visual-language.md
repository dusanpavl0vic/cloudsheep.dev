# 22 — Vizuelni jezik

> Status: active | Last review: 2026-08-16

Ovaj dokument opisuje **vizuelni sloj** koji stoji preko tokena iz
[`08-styling-ui.md`](08-styling-ui.md). Tokeni kažu *koje su boje*; ovde piše *kako se koriste*.

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

### 4. Jedan akcenat, i to štedljivo

Paleta je skoro monohromna — pozadina, tekst, sivi tonovi. **Plava se koristi samo za ono
što traži akciju**: primarno dugme, istaknuta kartica, aktivna stavka. Ako je na ekranu tri
plave stvari, dve su suvišne.

### 4b. Boja na oznakama, ne na površinama

Pored plave postoji pet `mark-*` tokena (`amber`, `violet`, `teal`, `rose`, `lime`).
Oni nose **šarenilo na sitnim površinama**: ikonice, brojevi koraka, tanke niti, tagovi.

> **Nikad na dugmetu ni na punoj kartici.** Plava ostaje jedina boja akcije (§4).
> Ako korak procesa ima ljubičastu nit i ljubičast broj, to je oznaka; ako bi imao
> ljubičastu podlogu, četiri kartice bi vikale jedna preko druge.

Svi `mark-*` su usklađeni po svetlini da nijedan ne dominira, i svi prolaze 3:1 prema
podlozi u obe teme — to je prag za grafičke oznake po WCAG-u.

Brend logotipi tehnologija su izuzetak od pravila o jednom akcentu: oni **jesu** šarenilo,
i zato stoje u belim squircle pločicama koje ih drže odvojene od ostatka stranice.

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
  label={t('pricing.label')}      // pilula
  title={t('pricing.title')}       // puna boja
  muted={t('pricing.titleMuted')}  // prigušeni nastavak
/>
```

**Kartica**

```tsx
<article className={cn(surfaceVariants({ elevation: 'raised' }), 'rounded-2xl p-8')}>
```

---

## Anti-patterns

| ❌ | Zašto | ✅ |
|---|---|---|
| Animiran uzorak u pozadini | trza se, vuče pogled, ponovno crtanje po kadru | statična tekstura |
| Ivica + senka na istoj kartici | dva sistema izdvajanja koja se bore | senka, bez ivice |
| Tri različite akcenatske boje | ništa se ne ističe kad se sve ističe | jedan akcenat |
| Naslov u dve veličine slova | lomi tipografsku skalu | dvotonski, ista veličina |
| `//` ili drugi znak kao labela sekcije | traži da čitalac zna šifru | pilula sa rečju |
| Tamna uska senka (`shadow-md`) | izgleda kao Bootstrap 2014 | široka i bleda |
| Prigušen tekst nosi ključni podatak | slab kontrast, preskače se | prigušeno je dopuna |

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
