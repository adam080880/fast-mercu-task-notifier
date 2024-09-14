import { Request, Response } from "express";
import Controller from ".";

class AuthController extends Controller {
  login(req: Request, res: Response) {
    return res.json(super.response(true, 'Login success', {}));
  }

  profile(req: Request, res: Response) {
    return res.json(super.response(true, 'User profile', {name: 'test'}));
  }
};

export default AuthController;
