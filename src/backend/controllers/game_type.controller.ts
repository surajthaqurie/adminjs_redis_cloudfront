import { NextFunction, Request, Response } from "express";
import { game_type_service } from "../services";
import { ICommonResponse, IGameType, IPaginationResponse } from "src/interfaces";
import { catchAsync } from "src/utility";

const getGameTypes = async (req: Request, res: Response, next: NextFunction): Promise<ICommonResponse<IPaginationResponse<IGameType>>> => {
  let page: number = parseInt(req.query.page as string);
  let itemNo: number = parseInt(req.query.itemNo as string);

  const game_types = await game_type_service.getGameTypes(page, itemNo);

  return res.status(200).json({
    success: true,
    data: game_types
  });
  /* ************** Swagger Documentation  **************
    #swagger.tags = ['Games Types']
    #swagger.description = 'Api for get all games types.'
    #swagger.summary = 'Get all games types.'
    #swagger.operationId = 'getGameTypes'

    #swagger.responses[200] = {
      description: 'Successfully get all games types !!' ,
      schema: { $ref: '#/definitions/GameTypeList' }
    }
  ************** Swagger Documentation  ************** */
};

const getGameTypeDetailsBySlug = async (req: Request, res: Response, next: NextFunction) => {
  const slug = req.params.slug;

  const game_type_details = await game_type_service.getGameTypeDetailsBySlug(slug);

  return res.json({
    success: true,
    data: game_type_details
  });
  /* ************** Swagger Documentation  **************
    #swagger.tags = ['Games Types']
    #swagger.description = 'Api for get games type detail.'
    #swagger.summary = 'Get games type detail.'
    #swagger.operationId = 'getGameTypeDetail'

    #swagger.responses[200] = {
      description: 'Successfully get games type detail !!' ,
      schema: { $ref: '#/definitions/GameTypeDetail' }
    }
  ************** Swagger Documentation  ************** */
};

export const game_type_controller = {
  getGameTypes: catchAsync(getGameTypes),
  getGameTypeDetailsBySlug: catchAsync(getGameTypeDetailsBySlug)
};
