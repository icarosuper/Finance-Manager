'use client';

import React, { type FC } from 'react';
import { Input } from '~/app/_components/ui/input';
import { Button } from '~/app/_components/ui/button';
import { api } from '~/trpc/react';
import { type z } from 'zod';
import { CreateTransactionSchema } from '~/schemas/transactions.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/app/_components/ui/form';
import dayjs from 'dayjs';

type Props = {
  accountId: string;
  onSuccess?: () => void;
};

type CreateTransactionInput = z.input<typeof CreateTransactionSchema>;

export const TransactionForm: FC<Props> = ({ accountId, onSuccess }) => {
  const form = useForm<CreateTransactionInput>({
    resolver: zodResolver(CreateTransactionSchema),
    mode: 'onTouched',
    defaultValues: {
      accountId,
      value: 0,
      description: '',
      time: new Date(),
    },
  });

  const { mutate, isPending } = api.transactions.create.useMutation({
    onSuccess,
  });

  const onSubmit = form.handleSubmit((data) => mutate(data));

  return (
    <Form {...form}>
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <span className="text-2xl font-bold">Nova transação</span>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Descrição</FormLabel>

              <FormControl>
                <Input
                  placeholder="Insira a descrição da transação"
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
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Valor</FormLabel>

              <FormControl>
                <Input
                  type="number"
                  step={0.01}
                  placeholder="Insira o valor da transação"
                  {...field}
                  onChange={(e) =>
                    form.setValue('value', Number(e.target.value))
                  }
                  autoComplete="on"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*<FormField*/}
        {/*  control={form.control}*/}
        {/*  name="category"*/}
        {/*  render={({ field }) => (*/}
        {/*    <FormItem>*/}
        {/*      <FormLabel className="text-muted-foreground">Categoria</FormLabel>*/}

        {/*      <FormControl>*/}
        {/*        <Input*/}
        {/*          type="number"*/}
        {/*          step={0.01}*/}
        {/*          placeholder="Insira o valor da transação"*/}
        {/*          {...field}*/}
        {/*          autoComplete="on"*/}
        {/*        />*/}
        {/*      </FormControl>*/}
        {/*      <FormMessage />*/}
        {/*    </FormItem>*/}
        {/*  )}*/}
        {/*/>*/}

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Data</FormLabel>

              <FormControl>
                <Input
                  type="datetime-local"
                  placeholder="Insira o momento em que a transação ocorreu"
                  {...field}
                  value={dayjs(field.value).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) =>
                    form.setValue('time', dayjs(e.target.value).toDate())
                  }
                  autoComplete="on"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} variant="outline">
          Criar
        </Button>
      </form>
    </Form>
  );
};
