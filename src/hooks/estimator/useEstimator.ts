'use client'

import { useState } from 'react'

import { ESTIMATE_DEFAULTS, type EstimateFeature, type EstimatePace, type EstimatePlatform, type EstimateType } from '@/constants/estimator'
import { contactHref } from '@/constants/routes'
import { estimate, toggleItem, type EstimateInput } from '@/helpers/estimator'

/** Stanje procene na početnoj i link koji ga prenosi u upit (`/contact?type=…`). */
export const useEstimator = () => {
  const [selection, setSelection] = useState<EstimateInput>(ESTIMATE_DEFAULTS)

  return {
    selection,
    result: estimate(selection),
    briefHref: contactHref({
      type: selection.type,
      platforms: selection.platforms.join(','),
      features: selection.features.join(','),
      pace: selection.pace,
    }),
    setType: (type: EstimateType) => {
      setSelection((current) => ({ ...current, type }))
    },
    togglePlatform: (platform: EstimatePlatform) => {
      setSelection((current) => ({ ...current, platforms: toggleItem(current.platforms, platform) }))
    },
    toggleFeature: (feature: EstimateFeature) => {
      setSelection((current) => ({ ...current, features: toggleItem(current.features, feature) }))
    },
    setPace: (pace: EstimatePace) => {
      setSelection((current) => ({ ...current, pace }))
    },
  }
}
