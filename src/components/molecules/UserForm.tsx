/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CreateUserRequest, UpdateUserRequest, User } from '@/lib/types';

const createUserSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Endereço de email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['administrator', 'user']),
});

const updateUserSchema = createUserSchema.partial();

type FormData = z.infer<typeof createUserSchema>;

type UserFormProps = {
  user?: User | null;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  isLoading?: boolean;
};

export function UserForm({ user, onSubmit, isLoading }: UserFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(user ? updateUserSchema : createUserSchema) as any,
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          role: user.role,
        }
      : {
          name: '',
          email: '',
          password: '',
          role: 'user',
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="João da Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="joao@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!user && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Perfil</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um perfil" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="administrator">Administrador</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-sky-400 hover:bg-sky-500 text-white"
          >
            {isLoading ? 'Salvando...' : user ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 