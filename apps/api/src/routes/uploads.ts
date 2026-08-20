import express, { Router } from 'express'
import rateLimit from 'express-rate-limit'
import multer from 'multer'

import { prisma } from '../db.ts'
import { env, isTest } from '../env.ts'
import { publicUrl, storeUpload } from '../lib/uploads.ts'
import { requireAuth, requireRole } from '../middleware/auth.ts'
import { HttpError } from '../middleware/error.ts'

export const uploadsRouter: Router = Router()

/**
 * `memoryStorage`, ne `diskStorage`.
 *
 * Magične bajtove treba proveriti PRE nego što išta dodirne disk — sa `diskStorage` bi
 * odbačen fajl ipak nakratko postojao na serveru. Granica veličine je ista kao u
 * `storeUpload`, samo primenjena ranije, da se 50 MB ne učita u memoriju uzalud.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_UPLOAD_BYTES, files: 1 },
})

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { messageKey: 'errors.tooManyRequests' },
  skip: () => isTest,
})

uploadsRouter.post(
  '/admin/uploads',
  requireAuth,
  requireRole('admin'),
  uploadLimiter,
  upload.single('file'),
  async (req, res) => {
    if (!req.file) throw new HttpError(400, 'uploads.errors.missing')

    const stored = await storeUpload(req.file)
    const asset = await prisma.asset.create({ data: stored })

    res.status(201).json({ ...asset, url: publicUrl(asset.storageKey) })
  },
)

/**
 * Serviranje otpremljenih datoteka.
 *
 * Tri zaglavlja koja se lako zaborave, a svako od njih je posebna greška:
 *
 * 1. **`Cross-Origin-Resource-Policy: cross-origin`** — `helmet()` podrazumevano postavlja
 *    `same-origin`, pa `cloudsheep.dev` ne može da učita sliku sa `api.cloudsheep.dev`
 *    **ni sa ispravnim CSP-om**. Greška u konzoli izgleda identično kao CSP problem.
 * 2. **`Content-Security-Policy: default-src 'none'; sandbox`** — neutrališe SVG koji nosi
 *    `<script>`. Bez ovoga je otpremljen SVG stored-XSS na sopstvenom poreklu.
 * 3. **`Content-Disposition: inline`** uz `X-Content-Type-Options: nosniff` — pretraživač
 *    ne pogađa tip i ne izvršava ništa što nije slika.
 */
uploadsRouter.use(
  '/uploads',
  express.static(env.UPLOAD_DIR, {
    index: false,
    dotfiles: 'deny',
    fallthrough: false,
    immutable: true,
    maxAge: '1y',
    setHeaders: (res) => {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
      res.setHeader(
        'Content-Security-Policy',
        "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      )
      res.setHeader('Content-Disposition', 'inline')
      res.setHeader('X-Content-Type-Options', 'nosniff')
    },
  }),
)
