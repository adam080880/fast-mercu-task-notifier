import Model from "@models/index";

class UserModel extends Model<User> {
  constructor() {
    super('users');

    return this;
  }
};

export type User = {
  id: string;
  username: string;
  password: string;
  telegramPhone: string;
};

export default UserModel;
