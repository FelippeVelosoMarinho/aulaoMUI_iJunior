import {validationResult} from 'express-validator';

export const validate = (validations: any) => {
  return async (req:any, res:any, next: any) => {
    for (const validation of validations) {
      await validation.run(req);
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    res.status(400).json({ errors: errors.array() });

  };
};