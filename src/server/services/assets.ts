import 'server-only'

import type { Asset } from '@/types/media'

import { prisma } from '../db'
import { publicUrl, storeUpload } from '../uploads/storage'

export const createAsset = async (file: { buffer: Buffer; name: string }): Promise<Asset> => {
  const stored = await storeUpload(file)
  const asset = await prisma.asset.create({ data: stored })
  return {
    id: asset.id,
    url: publicUrl(asset.storageKey),
    mimeType: asset.mimeType,
    sizeBytes: asset.sizeBytes,
    width: asset.width,
    height: asset.height,
    label: asset.label,
  }
}
