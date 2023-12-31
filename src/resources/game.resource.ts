import { saveGameCache, updateGameCache, deleteGameCache, bulkDeleteGameCache } from "src/hooks/redis-hooks";
import { Components } from "../frontend/components";
import { checkEditGameUniqueFields, checkGameUniqueFields, gameValidation } from "../frontend/validations";
import { galleryImagesName, imageName, payloadTrim, slugify } from "../hooks";
import { DMMFClass, prisma } from "../utility";
import { admin_seo_resource, delete_guard, image_properties, image_validation, AWScredentials, og_types } from "./helper.resources";
import uploadFeature from "@adminjs/upload";

const game_resource = {
  resource: {
    model: ((prisma as any)._baseDmmf as DMMFClass).modelMap.Games,
    client: prisma
  },
  options: {
    parent: null,
    actions: {
      show: admin_seo_resource,
      list: admin_seo_resource,
      new: {
        ...admin_seo_resource,
        before: [payloadTrim, gameValidation, slugify, checkGameUniqueFields],
        after: [saveGameCache]
      },
      edit: {
        ...admin_seo_resource,
        before: [payloadTrim, gameValidation, slugify, checkEditGameUniqueFields],
        after: [imageName, galleryImagesName, updateGameCache]
      },
      delete: {
        ...delete_guard,
        ...admin_seo_resource,
        after: [deleteGameCache]
      },
      bulkDelete: {
        ...delete_guard,
        ...admin_seo_resource,
        after: [bulkDeleteGameCache]
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
      og_type: og_types,
      slug: {
        isVisible: false,
        isAccessible: false
      },
      gallery: {
        isVisible: {
          list: false,
          filter: false,
          edit: true,
          show: true
        }
      }
    }
  },
  features: [
    uploadFeature({
      provider: { aws: AWScredentials },
      validation: image_validation,
      properties: image_properties,
      uploadPath: (record: any, filename: string) => `${(process.env.APP_NAME as string).toLowerCase()}/game/${record.id()}_${filename}`
    }),
    uploadFeature({
      provider: { aws: AWScredentials },
      validation: image_validation,
      properties: {
        file: "gallery",
        filePath: "gallery.path",
        key: "gallery.key",
        filename: "gallery.filename",
        mimeType: "gallery.mine",
        bucket: "gallery.bucket",
        size: `gallery.size`,
        filesToDelete: "gallery.filesToDelete"
      },
      multiple: true,
      uploadPath: (record: any, filename: string) => `${(process.env.APP_NAME as string).toLowerCase()}/game_gallery/${record.id()}_${filename}`
    })
  ]
};

export default game_resource;
