import { NextFunction, Request, Response } from "express";

import { page_service } from "../services";
import { ICommonResponse, IPage, IPaginationResponse } from "src/interfaces";
import { catchAsync } from "src/utility";

const getPages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ICommonResponse<IPaginationResponse<IPage>>> => {
  let page: number = parseInt(req.query.page as string);
  let itemNo: number = parseInt(req.query.itemNo as string);

  const pages = await page_service.getPages(page, itemNo);
  return res.json({
    success: true,
    ...pages
  });
  /* ************** Swagger Documentation  **************
    #swagger.ignore = true
    #swagger.tags = ['Pages']
    #swagger.description = 'Api for listing all pages.'
    #swagger.summary = 'Get all pages.'
    #swagger.operationId = 'getAllPages'

    #swagger.responses[200] = {
      description: 'Successfully get all Pages !!' ,
      schema: { $ref: '#/definitions/PageList' }
    }
  ************** Swagger Documentation  ************** */
};

const getPageDetailsBySlug = async (req: Request, res: Response, next: NextFunction) => {
  const slug = req.params.slug;

  const page_details = await page_service.getPageDetailsBySlug(slug);
  return res.json({
    success: true,
    data: page_details
  });
  /* ************** Swagger Documentation  **************
    #swagger.tags = ['Pages']
    #swagger.description = 'Api for getting page detail.'
    #swagger.summary = 'Get page detail.'
    #swagger.operationId = 'getPageDetail'

    #swagger.responses[200] = {
      description: 'Successfully get page detail !!' ,
      schema: { $ref: '#/definitions/PageDetail' }
    }
  ************** Swagger Documentation  ************** */
};

export const page_controller = {
  getPages: catchAsync(getPages),
  getPageDetailsBySlug: catchAsync(getPageDetailsBySlug)
};
