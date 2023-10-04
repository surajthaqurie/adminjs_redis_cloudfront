import { DMMFClass, prisma } from "../utility";
import {
  admin_seo_resource,
  delete_guard,
  image_properties,
  image_validation,
  localProvider
} from "./helper.resources";
import {
  checkEditGameTypesUniqueFields,
  checkGameTypesUniqueFields,
  gameTypesValidation
} from "../frontend/validations";
import { imageName, payloadTrim, slugify } from "../hooks";
import { Components } from "../frontend/components";
import uploadFeature from "@adminjs/upload";

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
        before: [
          payloadTrim,
          gameTypesValidation,
          slugify,
          checkGameTypesUniqueFields
        ]
      },
      list: admin_seo_resource,
      show: admin_seo_resource,
      edit: {
        ...admin_seo_resource,
        before: [
          payloadTrim,
          gameTypesValidation,
          slugify,
          checkEditGameTypesUniqueFields
        ],
        after: [imageName]
      },
      delete: { ...delete_guard, ...admin_seo_resource }
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
      uploadPath: (record: any, filename: string) =>
        `/game_types/${record.id()}~~${filename}`
    })
  ]
};

export default game_type_resource;
