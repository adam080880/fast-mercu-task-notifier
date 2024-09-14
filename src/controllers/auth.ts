import { Request, Response } from "express";
import UserModel from "@models/user";
import Controller, { ResponseError } from ".";

class AuthController extends Controller {
  private userModel: UserModel;

  constructor() {
    super();

    this.userModel = new UserModel();
  }

  login = (req: Request, res: Response) => {
    try {
      const {username, password} = req.body;
  
      if (!username || !password) {
        throw new ResponseError('Username and password are required', 400);
      }

      const checkFindUserIsExist = this.userModel.on({
        username: {
          method: 'eq',
          value: username
        },
        password: {
          method: 'eq',
          value: password
        },
      }).getOne();

      if (!checkFindUserIsExist) {
        throw new ResponseError('Username and password are not valid', 400);
      }

      return res.status(200).json(this.response(true, 'Success', checkFindUserIsExist));
    } catch (error: any) {
      if (error instanceof ResponseError) {
        return res.status(error.code).json(this.response(false, error.message));
      } else if (error instanceof Error) {
        return res.status(500).json(this.response(false, error.message));
      }
    }
  }

  register = (req: Request, res: Response) => {
    try {
      const {username, password, telegramPhone} = req.body;
  
      if (!username || !password || !telegramPhone) {
        throw new ResponseError('Username, password, and telegramPhone are required', 400);
      }

      const checkFindUserIsExist = this.userModel.on({
        username: {
          method: 'eq',
          value: username
        },
      }).getOne();

      if (checkFindUserIsExist) {
        throw new ResponseError('Username is already exist', 400);
      }
  
      const newUser = this.userModel.create({
        password,
        username,
        telegramPhone,
      });

      return res.status(201).json(this.response(true, 'Success', newUser));
    } catch (error: any) {
      if (error instanceof ResponseError) {
        return res.status(error.code).json(this.response(false, error.message));
      } else if (error instanceof Error) {
        return res.status(500).json(this.response(false, error.message));
      }
    }
  }

  profile = (req: Request, res: Response) => {
    return res.json(this.response(true, 'User profile', {name: 'test'}));
  }
};

export default AuthController;
