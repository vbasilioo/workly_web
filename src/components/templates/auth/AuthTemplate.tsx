interface AuthTemplateProps {
  children: React.ReactNode
}

export function AuthTemplate({ children }: AuthTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center p-4">
      {children}
    </div>
  )
} 