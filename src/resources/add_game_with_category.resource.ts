import { bulkDeleteGameWithCategoryCache, deleteGameWithCategoryCache, saveGameWithCategoryCache, updateGameWithCategoryCache } from "src/hooks/redis-hooks";
import { addGameWithCategoryValidation } from "../frontend/validations";
import { payloadTrim, preventStoreGameCategoryDuplicationData } from "../hooks";
import { DMMFClass, prisma } from "../utility";
import { admin_seo_resource, delete_guard } from "./helper.resources";

const add_game_with_category_resource = {
  resource: {
    model: ((prisma as any)._baseDmmf as DMMFClass).modelMap.GameByCategory,
    client: prisma
  },
  options: {
    id: "Add game with category",
    parent: null,
    actions: {
      show: admin_seo_resource,
      list: admin_seo_resource,
      new: {
        ...admin_seo_resource,
        before: [payloadTrim, addGameWithCategoryValidation, preventStoreGameCategoryDuplicationData],
        after: [saveGameWithCategoryCache]
      },
      edit: {
        ...admin_seo_resource,
        before: [payloadTrim, addGameWithCategoryValidation, preventStoreGameCategoryDuplicationData],
        after: [updateGameWithCategoryCache]
      },
      delete: {
        ...delete_guard,
        ...admin_seo_resource,
        after: [deleteGameWithCategoryCache]
      },
      bulkDelete: {
        ...delete_guard,
        ...admin_seo_resource,
        after: [bulkDeleteGameWithCategoryCache]
      }
    },
    filterProperties: ["GameCategory", "Game"],
    properties: {
      slug: {
        isVisible: false,
        isAccessible: false
      }
    }
  }
};

export default add_game_with_category_resource;
