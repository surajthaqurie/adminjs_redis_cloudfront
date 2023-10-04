import { IFormErrorMessage } from "./common.interface";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPasswordChange {
  id: string;
  email: string;
}

export interface IUserForm {
  name: IFormErrorMessage;
  email: IFormErrorMessage;
  password?: IFormErrorMessage;
  confirm_password?: IFormErrorMessage;
  role: IFormErrorMessage;
}
