/**
 * Opcije `register`-a za brojčano polje koje sme da bude prazno.
 *
 * `valueAsNumber` na praznom `<input type="number">` daje `NaN`, koji zod odbija kao „nije
 * broj" — a prazno polje znači „nije uneto", ne grešku. `setValueAs` zato prevodi prazan
 * string u `null`.
 *
 * Stoji ovde, a ne u šemi: `z.preprocess` bi promenio ulazni tip u `unknown` i razišao
 * `zodResolver` sa `useForm`. Pretvaranje pripada granici forme, ne ugovoru podataka.
 */
export const OPTIONAL_NUMBER = {
  setValueAs: (value: unknown) =>
    value === '' || value === null || value === undefined ? null : Number(value),
} as const

/** Obavezan broj: prazno ostaje `NaN`, pa zod prijavi grešku na polju, kako i treba. */
export const REQUIRED_NUMBER = { valueAsNumber: true } as const
