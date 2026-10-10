-- Kolona se uklanja jer je web prestao da je čita: strane u sekciji „Radovi" se od sada
-- smenjuju po rednom broju projekta, pa vrednost iz baze nije imala nikakvog efekta.
--
-- PAŽNJA: nije unazad kompatibilno. Rollback koda na prethodnu verziju bi tražio kolonu
-- koje više nema (`docs` / DEPLOYMENT.md §8).
ALTER TABLE "Project" DROP COLUMN "mediaSide";

DROP TYPE "MediaSide";
