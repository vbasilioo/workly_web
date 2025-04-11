import { LoginForm } from '@/components/organisms/auth/LoginForm'
import { AuthTemplate } from '@/components/templates/auth/AuthTemplate'

export default function HomePage() {
  return (
    <AuthTemplate>
      <LoginForm />
    </AuthTemplate>
  )
}
