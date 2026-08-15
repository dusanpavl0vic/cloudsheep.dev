# 10 — Forme i validacija

> Status: active | Last review: 2026-08-15

`react-hook-form` 7 + `zod` 4 + `@hookform/resolvers`.

## Pravila

1. **Nula `useState` u formama.** RHF drži sve — vrednosti, greške, `isSubmitting`, `isDirty`.
2. **Zod šema je jedini izvor istine.** Tip se izvodi iz nje, ne piše ručno.
3. **`mode: 'onTouched'`, `reValidateMode: 'onChange'`** — ne viči na korisnika dok kuca prvi put,
   ali odmah potvrdi ispravku.
4. **Poruke grešaka su i18n ključevi**, ne tekst.
5. **`FormField` iz `@app/ui`** povezuje RHF ↔ shadcn ↔ a11y (`aria-invalid`, `aria-describedby`, `id`).
6. **Server greške → `setError` na polje**, ne toast. Toast samo za 5xx.
7. **Ista šema validira i API odgovor** gde ima smisla (`safeParse` u `transformResponse`).

## Šema

```ts
// features/auth/schemas/login.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ message: 'auth.errors.emailInvalid' }),
  password: z.string().min(8, { message: 'auth.errors.passwordTooShort' }),
  rememberMe: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

> **zod 4:** `z.email()` je zamenio `z.string().email()`. Isto važi za `z.url()`, `z.uuid()`.

## Forma

```tsx
// features/auth/components/LoginForm/LoginForm.tsx
export function LoginForm() {
  const { t } = useTranslation('auth');
  const { login, isLoading } = useLogin();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await login(values);
    if (result.error) {
      form.setError('password', { message: 'auth.errors.invalidCredentials' });
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FormField control={form.control} name="email" label={t('auth.login.email')} />
      <FormField control={form.control} name="password" type="password" label={t('auth.login.password')} />
      <Button type="submit" disabled={isLoading}>{t('auth.login.submit')}</Button>
    </form>
  );
}
```

**Nula `useState`.** `isSubmitting`, `errors`, `isDirty` i `isValid` dolaze iz `form.formState`.

## `FormField` — gde živi a11y

```tsx
// packages/ui/src/molecules/FormField/FormField.tsx
export function FormField<T extends FieldValues>({ control, name, label, ...input }: FormFieldProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={fieldState.invalid}
        aria-describedby={fieldState.error ? errorId : undefined}
        {...field}
        {...input}
      />
      {fieldState.error && (
        <p id={errorId} role="alert" className="text-destructive text-sm">
          {t(fieldState.error.message)}
        </p>
      )}
    </div>
  );
}
```

Svaka forma dobija `id` linkovanje, `aria-invalid`, `aria-describedby` i `role="alert"`
**bez razmišljanja** — zato se polja ne pišu ručno.

## Server greške

```ts
const result = await createProject(values);

if (result.error) {
  const err = normalizeError(result.error);
  if (err.status === 422 && err.details?.field) {
    form.setError(err.details.field as Path<ProjectInput>, { message: err.messageKey });
  } else if (err.status >= 500) {
    toast.error(t(err.messageKey));      // samo 5xx ide u toast
  }
}
```

Greška polja pripada polju — korisnik mora da vidi *gde* je problem, a toast nestane za 4 s.

## Validacija API odgovora istom šemom

```ts
transformResponse: (raw: unknown) => {
  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    logger.warn('project.schema.mismatch', parsed.error);
    throw new AppError({ code: 'INVALID_RESPONSE', messageKey: 'errors.invalidResponse' });
  }
  return parsed.data;
};
```

## Anti-patterns

| ❌ | ✅ |
|---|---|
| `const [email, setEmail] = useState('')` | `useForm` + `FormField` |
| `const [errors, setErrors] = useState({})` | `form.formState.errors` |
| `const [isSubmitting, setIsSubmitting] = useState(false)` | `form.formState.isSubmitting` |
| `type LoginInput = { email: string }` ručno | `z.infer<typeof loginSchema>` |
| `.min(8, { message: 'Lozinka je prekratka' })` | i18n ključ |
| `mode: 'onChange'` | `onTouched` — inače greška bljesne na prvi karakter |
| `useEffect(() => reset(data), [data])` | `values` prop ili `key` na formi |
| sve server greške u toast | `setError` na polje, toast samo za 5xx |
| `<input onChange={...}>` ručno vezan | `FormField` |

## Checklist

- [ ] Nula `useState` u formi
- [ ] Tip izveden iz zod šeme sa `z.infer`
- [ ] Sve poruke grešaka su i18n ključevi, u `sr.json` i `en.json`
- [ ] `mode: 'onTouched'`, `reValidateMode: 'onChange'`
- [ ] Polja idu kroz `FormField` (a11y linkovanje)
- [ ] `noValidate` na `<form>` — validaciju radi zod, ne browser
- [ ] Server greška polja ide u `setError`, ne u toast
- [ ] Test: prazna forma → greške; ispravan unos → submit; server 422 → greška na polju
