import { z } from "zod";
import { ROLES } from "./user.types";

export const updateRolSchema = z.object({
  rol: z.enum(ROLES, "El rol debe ser user, admin u organizer"),
});

export type UpdateRolInput = z.infer<typeof updateRolSchema>;
