import { Prisma } from "@prisma/client";
import { IFormErrorMessage } from "./common.interface";

export interface IGameTypeWithGame {
  id: string;
  name: string;
  description: string;
  image?: Prisma.JsonValue;
  orders: number | null;
  slug: string | null;
}

export interface IGameType {
  id: string;
  name: string;
  description: string;
  image?: Prisma.JsonValue;
  orders: number | null;
  slug: string | null;
  meta_title: string | null;
  keywords: string | null;
  meta_description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGameTypeForm {
  name: IFormErrorMessage;
  description: IFormErrorMessage;
  image_alternative_text: IFormErrorMessage;
}
