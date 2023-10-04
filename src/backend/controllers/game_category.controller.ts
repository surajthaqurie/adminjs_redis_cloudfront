import { NextFunction, Request, Response } from "express";
import { game_category_service } from "../services";
import { ICommonResponse, IGameCategory, IPaginationResponse } from "src/interfaces";
import { catchAsync } from "src/utility";

const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<ICommonResponse<IPaginationResponse<IGameCategory>>> => {
  let page: number = parseInt(req.query.page as string);
  let itemNo: number = parseInt(req.query.itemNo as string);

  const game_categories = await game_category_service.getGameCategories(page, itemNo);
  return res.json({
    success: true,
    ...game_categories
  });
  /* ************** Swagger Documentation  **************
    #swagger.tags = ['Games Category']
    #swagger.description = 'Api for get all games categories.'
    #swagger.summary = 'Get all games categories.'
    #swagger.operationId = 'getGameCategories'

    #swagger.responses[200] = {
      description: 'Successfully get all games categories !!' ,
      schema: { $ref: '#/definitions/GameCategoryList' }
    }
  ************** Swagger Documentation  ************** */
};

const getGamesByCategory = async (req: Request, res: Response, next: NextFunction) => {
  let slug: string = req.params.slug as string;
  let page: number = parseInt(req.query.page as string);
  let itemNo: number = parseInt(req.query.itemNo as string);

  const games = await game_category_service.getGamesByCategory(slug, page, itemNo);
  return res.json({
    success: true,
    ...games
  });
  /* ************** Swagger Documentation  **************
    #swagger.ignore = true
    #swagger.tags = ['Games Category']
    #swagger.description = 'Api for get all games by category.'
    #swagger.summary = 'Get all games by category.'
    #swagger.operationId = 'getGamesByCategory'

    #swagger.responses[200] = {
      description: 'Successfully get all games by category !!' ,
      schema: { $ref: '#/definitions/GameCategoryList' }
    }
  ************** Swagger Documentation  ************** */
};

export const game_category_controller = {
  getCategories: catchAsync(getCategories),
  getGamesByCategory: catchAsync(getGamesByCategory)
};
