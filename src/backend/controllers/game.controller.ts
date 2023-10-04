import { NextFunction, Request, Response } from "express";
import { game_service } from "../services";
import { ICommonResponse, IGame } from "src/interfaces";
import { catchAsync } from "src/utility";

const getGames = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICommonResponse<IGame>> => {
  let page: number = parseInt(req.query.page as string);
  let itemNo: number = parseInt(req.query.itemNo as string);
  let game_type: string = req.query.game_type as string;

  const games = await game_service.getGames(page, itemNo, game_type);

  return res.json({
    success: true,
    ...games
  });
  /* ************** Swagger Documentation  **************
    #swagger.tags = ['Games']
    #swagger.description = 'Api for get all games.'
    #swagger.summary = 'Get all games.'
    #swagger.operationId = 'getGames'

    #swagger.responses[200] = {
      description: 'Successfully get all games !!' ,
      schema: { $ref: '#/definitions/GameList' }
    }
  ************** Swagger Documentation  ************** */
};

const getGameDetailsBySlug = async (req: Request, res: Response, next: NextFunction) => {
  const slug = req.params.slug;

  const game_details = await game_service.getGameDetailsBySlug(slug);
  return res.json({
    success: true,
    data: game_details
  });
  /* ************** Swagger Documentation  **************
    #swagger.tags = ['Games']
    #swagger.description = 'Api for get game detail.'
    #swagger.summary = 'Get game detail.'
    #swagger.operationId = 'getGameDetail'

    #swagger.responses[200] = {
      description: 'Successfully get all games !!' ,
      schema: { $ref: '#/definitions/GameDetail' }
    }
  ************** Swagger Documentation  ************** */
};

export const game_controller = {
  getGames: catchAsync(getGames),
  getGameDetailsBySlug: catchAsync(getGameDetailsBySlug)
};
