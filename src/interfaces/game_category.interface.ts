import { IFormErrorMessage } from "./common.interface";
import { IGame } from "./game.interface";

export interface IGameCategory {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IPopulateGame {
  Game: Partial<IGame>;
}

export interface IGameByCategory {
  name: string;
  GameByCategory: IPopulateGame[];
}

export interface IAddGameWithCategoryForm {
  Game: IFormErrorMessage;
  GameCategory: IFormErrorMessage;
}

export interface IGameCategoryForm {
  name: IFormErrorMessage;
}

export interface IGameInCategory {
  id: string;
  name: string;
  slug: string;
  Games: IGame[];
}
