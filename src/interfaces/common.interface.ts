import { Request, Response } from "express";

interface Json<ResData> {
  success: boolean;
  data: ResData;
}

type Send<ResData, T = Response> = (body?: Json<ResData>) => T;

export interface ICommonResponse<ResData> extends Response {
  json: Send<ResData, this>;
}

export interface IFormErrorMessage {
  message: string;
}

export interface IPaginationResponse<T> {
  data: T[];
  total_count: number;
}

export interface IAuthJWTRequest extends Request {
  user: IUserJWTInfo;
}

export interface IUserJWTInfo {
  id: string;
  role: string;
}

export interface IMailData {
  email: string | string[];
  title: string;
  body: string;
}

export interface IMailSender<T> {
  success: boolean;
  message: string;
  content?: T;
}
