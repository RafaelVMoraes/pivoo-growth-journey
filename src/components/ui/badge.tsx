const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        secondary:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border border-blue-300 dark:border-blue-700",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline:
          "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
        glass:
          "bg-primary/10 text-primary-800 dark:bg-primary-900/30 dark:text-primary-100 border-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
