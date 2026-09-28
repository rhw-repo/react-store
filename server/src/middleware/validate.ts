import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";

export function validateBody(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    req.body = result.data;
    next();
  };
}

// Only checks: in Express 5 req.query is read-only and can't be replaced.
export function validateQuery(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({ error: "Invalid query parameters" });
      return;
    }
    next();
  };
}
