import { type Request, type Response, type NextFunction } from 'express';
import { ZodError } from 'zod';

export const validateRequest = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = (error as any).errors.map((err: any) => err.message).join(', ');
        res.status(400).json({ success: false, message: errorMessage });
      } else {
        res.status(400).json({ success: false, message: 'Invalid request data' });
      }
    }
  };
};
