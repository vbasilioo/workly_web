import { cn } from "@/lib/utils"

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg"
}

export function Loading({ className, size = "default", ...props }: LoadingProps) {
  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent text-current",
        {
          "h-4 w-4": size === "sm",
          "h-5 w-5": size === "default",
          "h-6 w-6": size === "lg"
        },
        className
      )}
      {...props}
      role="status"
      aria-label="Carregando"
    >
      <span className="sr-only">Carregando...</span>
    </div>
  )
} 