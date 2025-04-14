interface AuthTemplateProps {
  children: React.ReactNode
}

export function AuthTemplate({ children }: AuthTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br bg-[linear-gradient(135deg,var(--custom-blue),var(--custom-cyan))] flex items-center justify-center p-4">
      {children}
    </div>
  )
} 