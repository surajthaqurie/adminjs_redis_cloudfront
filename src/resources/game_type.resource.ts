import { DMMFClass, prisma } from "../utility";
import { admin_seo_resource, delete_guard, image_properties, image_validation, localProvider } from "./helper.resources";
import { checkEditGameTypesUniqueFields, checkGameTypesUniqueFields, gameTypesValidation } from "../frontend/validations";
import { imageName, payloadTrim, slugify } from "../hooks";
import { Components } from "../frontend/components";
import uploadFeature from "@adminjs/upload";
import { saveGameTypeCache, updateGameTypeCache, preventUsedDelete, deleteGameTypeCache, bulkDeleteGameTypeCache } from "src/hooks/redis-hooks";

const { games: Games } = prisma;

const game_type_resource = {
  resource: {
    model: ((prisma as any)._baseDmmf as DMMFClass).modelMap.GameTypes,
    client: prisma
  },
  options: {
    parent: null,
    actions: {
      new: {
        ...admin_seo_resource,
        before: [payloadTrim, gameTypesValidation, slugify, checkGameTypesUniqueFields],
        after: [saveGameTypeCache]
      },
      list: admin_seo_resource,
      show: admin_seo_resource,
      edit: {
        ...admin_seo_resource,
        before: [payloadTrim, gameTypesValidation, slugify, checkEditGameTypesUniqueFields],
        after: [imageName, updateGameTypeCache]
      },
      delete: {
        ...delete_guard,
        ...admin_seo_resource,
        before: [preventUsedDelete],
        after: [deleteGameTypeCache]
      },
      bulkDelete: {
        ...delete_guard,
        ...admin_seo_resource,
        handler: async (request: any, response: any, context: any) => {
          //@ts-expect-error
          const { records, resource, h, translateMessage } = context;
          if (request.method === "get") {
            const recordsInJSON = records.map((record: any) => record.toJSON(context.currentAdmin));
            return {
              records: recordsInJSON
            };
          }
          if (request.method === "post") {
            let deleted_records = records.length;

            await Promise.all(
              records.map(async (record: any) => {
                const game = await Games.findMany({ where: { game_type: record.id() } });

                if (game.length) {
                  deleted_records--;
                } else {
                  return resource.delete(record.id());
                }
              })
            );

            return {
              records: records.map((record: any) => record.toJSON(context.currentAdmin)),
              notice: {
                message: deleted_records ? `Successfully delete game type, Total records: ${deleted_records}s, but unable to delete used game_type: Total records: ${records.length - deleted_records}` : `Unable to delete used game types, Total records: ${records.length - deleted_records}`,
                type: deleted_records ? "success" : "info"
              },
              redirectUrl: h.resourceUrl({ resourceId: resource._decorated?.id() || resource.id() })
            };
          }

          throw new Error('method should be either "post" or "get"');
        },
        after: [bulkDeleteGameTypeCache]
      }
    },
    filterProperties: ["name"],
    properties: {
      description: {
        components: {
          edit: Components.TextEditor,
          show: Components.ShowTextEditor
        },
        isVisible: {
          list: false,
          edit: true,
          show: true
        }
      },
      orders: {
        components: {
          new: Components.NumberInput,
          edit: Components.NumberInput
        }
      },
      slug: {
        isVisible: false,
        isAccessible: false
      }
    }
  },
  features: [
    uploadFeature({
      provider: { local: localProvider },
      validation: image_validation,
      properties: image_properties,
      uploadPath: (record: any, filename: string) => `/game_types/${record.id()}~~${filename}`
    })
  ]
};

export default game_type_resource;
