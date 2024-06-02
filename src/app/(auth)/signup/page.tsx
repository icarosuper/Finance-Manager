'use client';

import Link from 'next/link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/app/_components/ui/form';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FcGoogle } from 'react-icons/fc';
import { Input } from '~/app/_components/ui/input';
import { Button } from '~/app/_components/ui/button';
import { useState } from 'react';
import { signUp } from '~/app/_actions/auth';

const registerSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email().max(50),
  password: z.string().min(6).max(30),
});

export type SignupInput = z.infer<typeof registerSchema>;

export default function SignUpPage() {
  const form = useForm<SignupInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (data: SignupInput) => {
    const result = await signUp(data);

    if (!result || result.error) {
      setSuccess(null);
      setError(result?.error || 'Algo deu errado, tente novamente mais tarde');
      return;
    }

    setError(null);
    setSuccess(
      'Sua conta foi criada com sucesso! Confirme seu e-mail para prosseguir',
    );

    form.reset();
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background p-5">
      <div className="flex w-[35em] flex-col gap-6 rounded-lg px-10 py-8 shadow-lg">
        <h1 className="text-2xl font-semibold">Crie sua conta</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-1 flex-col justify-center gap-2 text-muted-foreground animate-in"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Nome</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Insira seu primeiro nome"
                      {...field}
                      autoComplete="on"
                    />
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
                  <FormLabel className="text-muted-foreground">
                    E-mail
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Insira seu endereço de e-mail"
                      {...field}
                      autoComplete="on"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Senha</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Insira sua senha"
                      type="password"
                      autoComplete="on"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button variant="default" className="my-3 w-full" type="submit">
              Criar conta
            </Button>

            <div className="text-center text-sm font-medium">
              {success && (
                <div className="rounded-md border border-border bg-green-100 p-3">
                  <p className="text-muted-foreground">{success}</p>
                </div>
              )}

              {error && (
                <div className="rounded-md border border-destructive bg-red-100 p-3">
                  <p className="text-destructive">{error}</p>
                </div>
              )}
            </div>
          </form>
        </Form>

        <div className="flex items-center gap-2">
          <hr className="w-full" />
          <p className="text-xs text-muted-foreground">OU</p>
          <hr className="w-full" />
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="flex w-full items-center gap-2 font-normal text-muted-foreground"
          >
            <FcGoogle className="h-5 w-5" />
            <p>Entre com o Google</p>
          </Button>

          <Link href="/login">
            <p className="text-center text-sm text-muted-foreground underline">
              Já possúi uma conta? Clique aqui para entrar
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
