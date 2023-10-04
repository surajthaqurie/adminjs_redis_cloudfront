import { Prisma } from "@prisma/client";
import { IGameTypeWithGame } from "./game_type.interface";
import { IFormErrorMessage } from "./common.interface";

export interface IGame {
  id: string;
  name: string;
  image?: Prisma.JsonValue;
  description: string;
  orders: number | null;
  og_title: string | null;
  meta_title: string | null;
  og_description: string | null;
  meta_description: string | null;
  keywords: string | null;
  canonical_link: string | null;
  og_url: string | null;
  game_type: string;
  og_type: string | null;
  slug: string;
  gallery: Prisma.JsonValue | null;
  youtube_link: string | null;
  createdAt: Date;
  updatedAt: Date;
  GameTypes: IGameTypeWithGame | null;
}

export type IGetGames = IGame & IGameTypeWithGame;

export interface IGameForm {
  name: IFormErrorMessage;
  description: IFormErrorMessage;
  GameTypes: IFormErrorMessage;
  image_alternative_text: IFormErrorMessage;
  gallery_alternative_text: IFormErrorMessage;
}
