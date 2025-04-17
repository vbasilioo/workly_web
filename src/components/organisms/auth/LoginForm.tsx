'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginFormData, loginSchema } from '@/features/auth/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/atoms/brand/Logo'
import { signIn } from "next-auth/react";
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false
      });

      if (!response?.ok) {
        toast.error("Credenciais inválidas. Verifique seu e-mail e senha.");
        throw new Error("Login failed");
      }

      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-600 to-cyan-400 relative">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold text-white mb-4">Transforme a gestão da sua equipe com o Workly</h1>
            <p className="text-white/90 text-lg">
              Uma plataforma completa para gerenciar seus colaboradores 
              e aumentar a produtividade do seu negócio.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Logo className="mx-auto mb-6 h-12" />
            <h2 className="text-2xl font-bold text-gray-900">Bem-vindo ao Workly!</h2>
            <p className="text-gray-600 mt-2">
              Entre com suas credenciais para acessar sua conta.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="h-11"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-700">Senha</Label>
                <Button variant="link" className="text-sm p-0 h-auto font-normal text-blue-600" type="button">
                  Esqueceu sua senha?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-11" 
              loadingText="Entrando..."
            >
              Entrar
            </Button>
            
            <p className="text-center text-gray-600 text-sm mt-6">
              Não tem uma conta?{' '}
              <Button variant="link" className="p-0 h-auto font-normal text-blue-600 text-sm" type="button">
                Cadastre-se agora
              </Button>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}