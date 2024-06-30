import { createTRPCRouter, privateProcedure } from '~/server/api/trpc';
import { BankAccountsTable, TransactionsTable } from '~/server/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { CreateTransactionParams } from '~/procedure-params/transactions-params';
import { TRPCError } from '@trpc/server';

export const transactionsRouter = createTRPCRouter({
  getByAccountId: privateProcedure
    .input(z.object({ accountId: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(TransactionsTable)
        .where(eq(TransactionsTable.accountId, input.accountId))
        .orderBy(desc(TransactionsTable.updatedAt));
    }),

  getById: privateProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(TransactionsTable)
        .where(eq(TransactionsTable.id, input.id));
    }),

  create: privateProcedure
    .input(CreateTransactionParams)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (trx) => {
        await trx.insert(TransactionsTable).values(input);
        await trx
          .update(BankAccountsTable)
          .set({ balance: sql`${BankAccountsTable.balance} + ${input.value}` })
          .where(eq(BankAccountsTable.id, input.accountId));
      });
    }),

  delete: privateProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [trans] = await ctx.db
        .select()
        .from(TransactionsTable)
        .where(eq(TransactionsTable.id, input.id));

      if (!trans)
        throw new TRPCError({
          code: 'NOT_FOUND',
        });

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(BankAccountsTable)
          .set({
            balance: sql`${BankAccountsTable.balance} - ${trans.value}`,
          })
          .where(eq(BankAccountsTable.id, trans.accountId));

        await tx
          .delete(TransactionsTable)
          .where(eq(TransactionsTable.id, input.id));
      });
    }),
});
