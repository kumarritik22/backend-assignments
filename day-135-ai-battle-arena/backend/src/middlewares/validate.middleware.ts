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
    } catch (error: any) {
      try {
        const issues = JSON.parse(error.message);
        if (Array.isArray(issues)) {
          const errorMessage = issues.map((issue: any) => issue.message).join(' | ');
          res.status(400).json({ success: false, message: errorMessage });
          return;
        }
      } catch (e) {
        // Fallback if error.message is not a Zod JSON string
      }
      
      res.status(400).json({ success: false, message: error?.message || 'Invalid request data' });
    }
  };
};
