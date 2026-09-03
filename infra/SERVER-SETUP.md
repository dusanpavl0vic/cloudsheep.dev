# Server setup — Hetzner + Coolify

Ovo se radi **jednom, ručno**, i traje oko 45 minuta od kojih je polovina čekanje DNS-a.
Posle ovoga deploy je `git push`, a ovaj dokument više ne treba.

Redosled nije proizvoljan: **DNS mora da propagira pre nego što se u Coolify-u dodeli
domen.** Let's Encrypt ima rate limit od 5 neuspelih pokušaja po nalogu na sat — ako
kreneš prerano, čekaš sat vremena bez ijedne korisne poruke o grešci.

Konvencija: `<IP>` je javna IPv4 adresa servera, svuda ista.

---

## 1. Server na Hetzneru

Cloud Console → Project → **Add Server**:

| Polje                              | Vrednost                                   | Zašto                                                                                  |
| ---------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------- |
| Location                           | Falkenstein (`fsn1`) ili Nürnberg (`nbg1`) | ~25 ms iz Srbije                                                                       |
| Image                              | Ubuntu 24.04 LTS                           |                                                                                        |
| Type                               | Shared vCPU, **2 vCPU / 4 GB / 40 GB**     | u konzoli je to `CX22` ili `CX23`, zavisi od generacije — gledaj specifikaciju, ne ime |
| Networking                         | ostavi i IPv4 i IPv6                       | IPv4 ti treba za A rekorde                                                             |
| SSH Keys                           | dodaj svoj javni ključ                     | **obavezno** — bez ovoga Hetzner šalje root lozinku mejlom                             |
| Volumes / Placement group / Labels | preskoči                                   |                                                                                        |
| Firewall                           | novi, pravila ispod                        |                                                                                        |
| Backups                            | uključi (+20%, ~€1.1/mes)                  | jedini server, jedina baza                                                             |
| Name                               | `cloudsheep-prod`                          |                                                                                        |

Ako nemaš SSH ključ:

```bash
ssh-keygen -t ed25519 -C "cloudsheep"
cat ~/.ssh/id_ed25519.pub    # ovo lepiš u Hetzner
```

### Firewall (inbound)

| Port | Protokol | Source                                             | Zašto                                  |
| ---- | -------- | -------------------------------------------------- | -------------------------------------- |
| 22   | TCP      | tvoja IP ako je fiksna, inače `0.0.0.0/0` + `::/0` | SSH                                    |
| 80   | TCP      | any                                                | HTTP + Let's Encrypt HTTP-01 challenge |
| 443  | TCP      | any                                                | HTTPS                                  |

Outbound ostavi otvoren (default).

**Port 8000 se NE otvara.** To je Coolify UI. Do njega se ide SSH tunelom:

```bash
ssh -L 8000:localhost:8000 root@<IP>
# pa u pretraživaču: http://localhost:8000
```

Coolify UI je jedina stvar na serveru koja može da izmeni sve — ne izlaže se internetu
dok za to ne postoji razlog.

---

## 2. Osnovno obezbeđivanje

```bash
ssh root@<IP>

apt update && apt upgrade -y
apt install -y fail2ban

# Swap 2 GB. 4 GB RAM-a i Docker build Vite bundle-a znaju da se sudare,
# a OOM killer ubija build bez ijedne jasne poruke.
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Prijava lozinkom se gasi. Ključ je već gore.
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
systemctl restart ssh

systemctl enable --now fail2ban
timedatectl set-timezone Europe/Belgrade
```

Proveri da te SSH i dalje pušta **iz drugog terminala, pre nego što zatvoriš ovaj**.
Ako si se zaključao, jedini put nazad je Hetzner web konzola.

### O `ufw`

`ufw` ovde **ne treba i može da smeta**. Docker upisuje svoja `iptables` pravila u
`DOCKER-USER` lanac koji zaobilazi `ufw`, pa `ufw` daje lažan osećaj zaštite: port koji si
„zatvorio" ostaje otvoren ako ga je Docker objavio. Hetzner Cloud Firewall radi na nivou
mreže, **ispred** servera, i tog problema nema.

Ako ga svejedno hoćeš kao drugi sloj:

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp
ufw enable
```

---

## 3. DNS na Cloudflare-u

Domen ostaje registrovan na **Namecheapu** — menjaju se samo nameserveri, tako da zapise drži
Cloudflare. Registracija, obnova i vlasništvo se ne diraju.

Zašto uopšte: Cloudflare menja zapise za sekunde umesto za pola sata, ima API ako ikad zatreba
automatizacija, i besplatan je. Namecheapov DNS radi isto, samo sporije i bez ijedne od tih
mogućnosti.

### 3.1 Dodaj domen u Cloudflare

1. Napravi nalog na `dash.cloudflare.com` (Free plan)
2. **Add a site** → `cloudsheep.dev` → **Free**
3. Cloudflare skenira postojeće zapise i ponudi ih na uvoz

> **Obriši sve što uveze skeniranje.** Namecheap drži parking zapise (`URL Redirect Record`
> za `@` i `CNAME www → parkingpage.namecheap.com`); ako se prenesu, domen i dalje vodi na
> parking iako je A zapis tačan.

Na kraju Cloudflare daje **dva nameservera**, u obliku `ana.ns.cloudflare.com` i
`bob.ns.cloudflare.com`. Zapiši ih.

### 3.2 Prebaci nameservere na Namecheapu

Domain List → `cloudsheep.dev` → **Manage** → sekcija **Nameservers** → **Custom DNS**, pa
upiši ona dva iz prethodnog koraka i sačuvaj.

Propagacija traje od nekoliko minuta do par sati. Cloudflare šalje mejl kad preuzme zonu;
dotle se ne ide dalje, jer zapisi upisani u Cloudflare još ne važe.

```bash
dig +short NS cloudsheep.dev
```

Mora vratiti Cloudflare nameservere, ne `dns1.registrar-servers.com`.

### 3.3 Zapisi

Cloudflare → `cloudsheep.dev` → **DNS** → **Records**:

| Type | Name    | Content | Proxy status | TTL  |
| ---- | ------- | ------- | ------------ | ---- |
| A    | `@`     | `<IP>`  | **DNS only** | Auto |
| A    | `www`   | `<IP>`  | **DNS only** | Auto |
| A    | `admin` | `<IP>`  | **DNS only** | Auto |
| A    | `api`   | `<IP>`  | **DNS only** | Auto |

> **Proxy mora biti isključen — sivi oblak, ne narandžasti.** Sa uključenim proxyjem saobraćaj
> ide kroz Cloudflare, pa Traefik vidi Cloudflare umesto posetioca, a Let's Encrypt izdavanje
> dobija još jedno mesto na kom može da pukne. Ovako se ponaša identično kao ranije: Cloudflare
> je samo imenik.

Hetzner daje i IPv6 `/64`; ako hoćeš AAAA zapise, koristi `<prefiks>::1` za ista četiri imena.
Nije obavezno.

### 3.4 Provera pre nego što kreneš dalje

```bash
dig +short cloudsheep.dev
dig +short www.cloudsheep.dev
dig +short admin.cloudsheep.dev
dig +short api.cloudsheep.dev
```

Sva četiri moraju vratiti `<IP>`. Ako vrate Cloudflare adrese (`104.x`, `172.67.x`), proxy je
ostao uključen — vrati ga na „DNS only".

> **`.dev` je na HSTS preload listi.** Pretraživač fizički odbija HTTP na `.dev` domenu. Dok
> Coolify ne izda sertifikat, sajt neće raditi **uopšte** — ne „bez katanca", nego nikako. To
> je očekivano. ACME HTTP-01 challenge svejedno prolazi, jer njega radi Traefik, ne pretraživač.

### 3.5 Ako ikad uključiš proxy

Nije potrebno za rad, ali ako jednog dana zatreba CDN ili skrivanje IP adrese servera, dve
stvari su **obavezne**, a ne opcione:

1. **SSL/TLS mode → Full (strict).** Na „Flexible" Cloudflare zove origin preko HTTP-a, a
   Traefik odgovara redirekcijom na HTTPS — beskonačna petlja.
2. **Hetzner firewall ograniči na Cloudflare IP opsege** za portove 80 i 443. Bez toga origin
   ostaje dostupan direktno preko IP-a, a `trust proxy` u `apps/api/src/app.ts` tada veruje
   `X-Forwarded-For` zaglavlju koje svako može da pošalje — rate limit po IP-u postaje ukras.

Sertifikat mora biti izdat **pre** uključivanja proxyja.

## 4. Coolify

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Instalira Docker, Traefik i svoju bazu; traje 2–3 minuta.

Odmah zatim otvori tunel i registruj se — **prvi nalog koji se registruje postaje admin
instance.** Ne ostavljaj to da visi ni deset minuta.

```bash
ssh -L 8000:localhost:8000 root@<IP>
# pretraživač → http://localhost:8000
```

Posle registracije:

- **Servers → localhost** → mora pisati `Reachable` i `Usable`
- **Settings → Instance Settings** → ako hoćeš UI na domenu, dodaj
  `coolify.cloudsheep.dev` (+ A rekord za `coolify`). Nije neophodno — tunel radi posao,
  i jedan izloženi panel manje.

---

## 5. Dalje

Konfiguracija tri aplikacije i baze je u [`COOLIFY.md`](COOLIFY.md).

---

## Troškovi

| Stavka                 | €/mes     |
| ---------------------- | --------- |
| Server (2 vCPU / 4 GB) | ~5.50     |
| Backups (20%)          | ~1.10     |
| Coolify                | 0         |
| Let's Encrypt          | 0         |
| **Ukupno**             | **~6.60** |

Domen se plaća godišnje na Namecheapu, odvojeno.
