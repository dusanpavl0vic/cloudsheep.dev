/** Zraci sunca: osam linija oko centra (x1, y1, x2, y2). */
export const RAYS = [
  [12, 1.5, 12, 3.5],
  [12, 20.5, 12, 22.5],
  [1.5, 12, 3.5, 12],
  [20.5, 12, 22.5, 12],
  [4.6, 4.6, 6, 6],
  [18, 18, 19.4, 19.4],
  [4.6, 19.4, 6, 18],
  [18, 6, 19.4, 4.6],
] as const

/** Jedinstven id maske — dugme može da postoji dvaput (header i mobilni meni). */
export const MASK_PREFIX = 'cs-moon'
