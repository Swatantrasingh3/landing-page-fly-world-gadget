import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createRepairRequest } from "./db";
import { appendRepairToExcel } from "./excel";
import { createSupabaseRepairRequest } from "./supabase";
import { ENV } from "./_core/env";
import { TRPCError } from "@trpc/server";
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
        photos: z.array(z.object({
          fileName: z.string().trim().min(1).max(255),
          mimeType: z.string().trim().min(1).max(120),
          fileSize: z.number().int().nonnegative().max(15_000_000),
          data: z.string().min(1).max(20_000_000),
        })).max(5).default([]),
      }))
      .mutation(async ({ input }) => {
        let id: number;
        try {
          ({ id } = await createSupabaseRepairRequest({
            fullName: input.fullName,
            phone: input.phone,
            email: input.email || null,
            droneBrand: input.droneBrand,
            droneModel: input.droneModel || null,
            problemType: input.problemType,
            problemDescription: input.problemDescription,
            repairRequirement: input.repairRequirement || null,
            pickupPreference: input.pickupPreference || null,
            photos: input.photos,
          }));
        } catch (error) {
          console.error("[Supabase] Failed to save repair request:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "We could not save your repair request. Please try again or contact us directly on WhatsApp.",
          });
        }

        if (ENV.databaseUrl) {
          try {
            await createRepairRequest({
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
          } catch (error) {
            console.error("[Legacy database] Failed to mirror repair request:", error);
          }
        }

        try {
          await appendRepairToExcel({
            fullName: input.fullName,
            phone: input.phone,
            email: input.email || "",
            droneBrand: input.droneBrand,
            droneModel: input.droneModel || "",
            problemType: input.problemType,
            problemDescription: input.problemDescription,
            repairRequirement: input.repairRequirement || "",
            pickupPreference: input.pickupPreference || "",
          });
        } catch (error) {
          console.error("[Excel] Failed to mirror repair request:", error);
        }

        return { id, persisted: true } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
