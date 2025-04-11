'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginFormData, loginSchema } from '@/features/auth/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/atoms/brand/Logo'
import { signIn } from "next-auth/react";
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    const result = await toast.promise(
      async () => {
        const response = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false
        });

        if (!response?.ok) {
          throw new Error("Login failed");
        }

        return response;
      },
      {
        loading: "Entrando...",
        success: () => {
          router.push("/dashboard")
          return "Login realizado com sucesso!";
        },
        error: "Credenciais inválidas. Verifique seu e-mail e senha.",
      }
    );
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-4">
        <Logo className="mx-auto" />
        <CardTitle className="text-2xl text-center">Bem-vindo ao Workly!</CardTitle>
        <CardDescription className="text-center">
          Entre com suas credenciais para acessar sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button variant="link" className="text-sm">
          Esqueceu sua senha?
        </Button>
        <Button variant="link" className="text-sm">
          Não tem uma conta? Cadastre-se
        </Button>
      </CardFooter>
    </Card>
  )
} 