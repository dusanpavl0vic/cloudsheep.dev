import { styled } from 'next-yak'

import Slot from '@/components/foundations/Slot'
import { visuallyHidden } from '@/styles/mixins'

export const Root = styled(Slot)`
  ${visuallyHidden};
`
