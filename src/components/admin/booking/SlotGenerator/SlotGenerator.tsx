'use client'

import { useTranslations } from 'next-intl'

import Panel from '@/components/admin/Panel'
import Button from '@/components/buttons/Button'
import Chip from '@/components/buttons/Chip'
import TextField from '@/components/inputs/TextField'
import { WEEKDAY_KEYS } from '@/constants/booking'
import { useSlotGenerator } from '@/hooks/admin/booking'
import { useKeyTranslator } from '@/hooks/useApiErrorMessage'

import { Days, Error, Fieldset, Form, Wide } from './SlotGenerator.styles'

/** Dodavanje termina: raspon datuma, dani u nedelji i satnice. */
const SlotGenerator = () => {
  const t = useTranslations('admin.booking')
  const translate = useKeyTranslator()
  const generator = useSlotGenerator()
  const { register } = generator.form

  return (
    <Panel title={t('generator.title')}>
      <Form noValidate onSubmit={(event) => void generator.submit(event)}>
        <TextField id="slots-from" type="date" label={t('generator.from')} error={translate(generator.errors.from?.message)} {...register('from')} />
        <TextField id="slots-to" type="date" label={t('generator.to')} error={translate(generator.errors.to?.message)} {...register('to')} />
        <Wide>
          <Fieldset>
            <legend>{t('generator.weekdays')}</legend>
            <Days>
              {WEEKDAY_KEYS.map((key, index) => (
                <Chip
                  key={key}
                  role="checkbox"
                  selected={generator.weekdays.includes(index + 1)}
                  onClick={() => {
                    generator.toggleWeekday(index + 1)
                  }}
                >
                  {t(`weekdays.${key}`)}
                </Chip>
              ))}
            </Days>
            {generator.errors.weekdays && <Error role="alert">{translate(generator.errors.weekdays.message)}</Error>}
          </Fieldset>
        </Wide>
        <Wide>
          <TextField
            id="slots-times"
            label={t('generator.times')}
            hint={t('generator.timesHint')}
            error={translate(generator.errors.times?.message)}
            {...register('times')}
          />
        </Wide>
        <Wide>
          <Button type="submit" iconLeft="plus" loading={generator.isSubmitting}>
            {t('generator.submit')}
          </Button>
        </Wide>
      </Form>
    </Panel>
  )
}

export default SlotGenerator
