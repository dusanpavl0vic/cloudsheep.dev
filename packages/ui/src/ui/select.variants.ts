import { cva } from 'class-variance-authority'

/**
 * Deli izgled sa `Input`-om namerno — polje za izbor i polje za unos u istoj formi
 * moraju da izgledaju kao ista porodica.
 *
 * `appearance-none` uklanja nativnu strelicu; zamenjuje je SVG u `background-image`, pa
 * strelica ne traži dodatni element i kontrola ostaje jedan `<select>`.
 */
export const selectVariants = cva(
  "flex w-full cursor-pointer appearance-none rounded-[10px] border border-input bg-background bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%221.6%22%3E%3Cpath d=%22M4 6l4 4 4-4%22/%3E%3C/svg%3E')] bg-[length:16px] bg-[right_0.875rem_center] bg-no-repeat py-2.5 ps-3.5 pe-10 text-[15px] text-foreground transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:bg-destructive/5 aria-invalid:focus-visible:ring-destructive/30",
)
