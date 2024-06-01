import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { BankAccountsTable, TransactionsTable } from '~/server/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const CreateTransactionSchema = createInsertSchema(
  TransactionsTable,
).omit({
  id: true,
});

export const transactionsRouter = createTRPCRouter({
  getByAccountId: publicProcedure
    .input(z.object({ accountId: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(TransactionsTable)
        .where(eq(TransactionsTable.accountId, input.accountId))
        .orderBy(desc(TransactionsTable.time));
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(TransactionsTable)
        .where(eq(TransactionsTable.id, input.id));
    }),

  create: publicProcedure
    .input(CreateTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (trx) => {
        await trx.insert(TransactionsTable).values(input);
        await trx
          .update(BankAccountsTable)
          .set({ balance: sql`${BankAccountsTable.balance} + ${input.value}` })
          .where(eq(BankAccountsTable.id, input.accountId));
      });
    }),
});
