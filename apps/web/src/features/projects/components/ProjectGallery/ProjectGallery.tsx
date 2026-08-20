import { Reveal } from '@app/ui'

import { localize } from '../../lib/localize'
import type { Project } from '../../types'

interface ProjectGalleryProps {
  images: Project['images']
  layout: Project['galleryLayout']
  language: string
}

const Figure = ({
  image,
  language,
  className,
  priority = false,
}: {
  image: Project['images'][number]
  language: string
  className?: string
  priority?: boolean
}) => (
  <figure className={`m-0 ${className ?? ''}`}>
    <div className="border-border bg-card overflow-hidden rounded-xl border">
      <img
        src={image.url}
        alt={localize(image.alt, language)}
        width={image.width}
        height={image.height}
        /* Prva slika je LCP kandidat — ona se NE učitava lenjo (docs/07 §7). */
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="size-full object-cover"
      />
    </div>
  </figure>
)

/**
 * Galerija projekta, po rasporedu izabranom u adminu.
 *
 * Raspored je podatak, a ne pravilo u kodu: nekom projektu odgovara mreža jednakih
 * snimaka, nekom jedan veliki pregled sa detaljima ispod. Ranije su sve stranice imale
 * isti raspored od tri prazna okvira, bez obzira na to šta projekat jeste.
 */
export const ProjectGallery = ({ images, layout, language }: ProjectGalleryProps) => {
  if (layout === 'none' || images.length === 0) return null

  const [first, ...rest] = images

  if (layout === 'feature' && first) {
    return (
      <div className="mb-14 flex flex-col gap-5">
        <Reveal>
          <Figure image={first} language={language} priority />
        </Reveal>
        {rest.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {rest.map((image) => (
              <Figure key={image.id} image={image} language={language} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mb-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
      {images.map((image, index) => (
        <Figure key={image.id} image={image} language={language} priority={index === 0} />
      ))}
    </div>
  )
}
