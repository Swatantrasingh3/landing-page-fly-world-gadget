import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createRepairRequest } from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  repair: router({
    create: publicProcedure
      .input(z.object({
        fullName: z.string().trim().min(2).max(160),
        phone: z.string().trim().min(7).max(40),
        email: z.string().trim().email().max(320).optional().or(z.literal("")),
        droneBrand: z.string().trim().min(1).max(80),
        droneModel: z.string().trim().max(160).optional().or(z.literal("")),
        problemType: z.string().trim().min(1).max(120),
        problemDescription: z.string().trim().min(5).max(5000),
        repairRequirement: z.string().trim().max(120).optional(),
        pickupPreference: z.string().trim().max(120).optional(),
        preferredContactMethod: z.string().trim().max(80).optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await createRepairRequest({
          fullName: input.fullName,
          phone: input.phone,
          email: input.email || null,
          droneBrand: input.droneBrand,
          droneModel: input.droneModel || null,
          problemType: input.problemType,
          problemDescription: input.problemDescription,
          repairRequirement: input.repairRequirement || null,
          pickupPreference: input.pickupPreference || null,
          preferredContactMethod: input.preferredContactMethod || null,
        });
        return { id, persisted: true } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
