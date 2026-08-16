import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-[transform,background-color,box-shadow,color,border-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-[1.15em] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'btn-shine bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/35',
        accent:
          'btn-shine bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/35',
        outline:
          'border-[1.5px] border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        success: 'bg-success text-success-foreground hover:brightness-105',
        ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:brightness-110',
      },
      size: {
        sm: 'h-9 px-5 text-[14.5px]',
        default: 'h-11 px-6 text-[15px]',
        lg: 'h-[52px] px-7 text-[16.5px]',
        icon: 'size-9',
      },
      shape: {
        rounded: 'rounded-[10px]',
        pill: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'rounded',
    },
  },
)
