import { DMMFClass, prisma } from "src/utility";

export const TABLE_NAME_CONSTANT = {
  Pages: ((prisma as any)._baseDmmf as DMMFClass).modelMap.Pages.name,
  Games: ((prisma as any)._baseDmmf as DMMFClass).modelMap.Games.name,
  GameTypes: ((prisma as any)._baseDmmf as DMMFClass).modelMap.GameTypes.name
};
