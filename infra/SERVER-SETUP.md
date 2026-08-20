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

## 3. DNS na Namecheapu

Domain List → `cloudsheep.dev` → Manage → **Advanced DNS**.

**Prvo obriši** ono što Namecheap ubaci sam:

- `URL Redirect Record` za `@` (parking stranica)
- `CNAME` `www` → `parkingpage.namecheap.com`

Ako ovo ostane, A rekord se ne primenjuje i domen i dalje vodi na parking.

**Pa dodaj:**

| Type | Host    | Value  | TTL       |
| ---- | ------- | ------ | --------- |
| A    | `@`     | `<IP>` | Automatic |
| A    | `www`   | `<IP>` | Automatic |
| A    | `admin` | `<IP>` | Automatic |
| A    | `api`   | `<IP>` | Automatic |

Hetzner daje i IPv6 `/64`; ako hoćeš i AAAA rekorde, koristi `<prefiks>::1` za ista četiri
hosta. Nije obavezno — sve radi i samo preko IPv4.

**Provera pre nego što kreneš dalje:**

```bash
dig +short cloudsheep.dev
dig +short www.cloudsheep.dev
dig +short admin.cloudsheep.dev
dig +short api.cloudsheep.dev
```

Sva četiri moraju vratiti `<IP>`. Namecheap propagira 5–30 min.

> **`.dev` je na HSTS preload listi.** Pretraživač fizički odbija HTTP na `.dev` domenu.
> Dok Coolify ne izda sertifikat, sajt neće raditi **uopšte** — ne „bez katanca", nego
> nikako. To je očekivano. ACME HTTP-01 challenge svejedno prolazi, jer njega radi Traefik,
> ne pretraživač.

---

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
