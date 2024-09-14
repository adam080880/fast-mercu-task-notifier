import { Request, Response as ExpressResponse, NextFunction } from "express";

class Controller {
  constructor() {
  }

  protected response<T>(status: boolean, message: string, data?: T): Response<T> {
    return {
      status,
      message,
      data,
    };
  }

  public needAuth() {
    return (req: Request, res: ExpressResponse, next: NextFunction) => {
      if (!req.headers.authorization) {
        return res.status(403).json(this.response(false, 'Need Authorization'));
      }

      next();
    }
  }
};

export type Response<T> = {
  status: boolean,
  message: string,
  data?: T,
};

export default Controller;
