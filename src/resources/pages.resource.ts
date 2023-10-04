import { Components } from "../frontend/components";
import {
  checkEditPageUniqueFields,
  checkPageUniqueFields,
  pageResponseMessage,
  pageValidation
} from "../frontend/validations";
import {
  imageName,
  payloadTrim,
  prismaSaveNullDataToUndefined,
  slugify
} from "../hooks";
import { DMMFClass, prisma } from "../utility";
import {
  admin_seo_resource,
  delete_guard,
  image_properties,
  image_validation,
  localProvider,
  og_types
} from "./helper.resources";
import uploadFeature from "@adminjs/upload";

const page_resource = {
  resource: {
    model: ((prisma as any)._baseDmmf as DMMFClass).modelMap.Pages,
    client: prisma
  },
  options: {
    parent: null,
    actions: {
      new: {
        ...admin_seo_resource,
        before: [payloadTrim, pageValidation, slugify, checkPageUniqueFields],
        after: [pageResponseMessage]
      },
      edit: {
        ...admin_seo_resource,
        before: [
          payloadTrim,
          pageValidation,
          slugify,
          checkEditPageUniqueFields,
          prismaSaveNullDataToUndefined
        ],
        after: [imageName]
      },
      show: admin_seo_resource,
      list: admin_seo_resource,
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
      og_type: og_types,
      slug: {
        isVisible: false,
        isAccessible: false
      },
      sections: {
        type: "mixed",
        isArray: true
      },
      "sections.title": {
        type: "string"
      },
      "sections.description": {
        components: {
          edit: Components.TextEditor,
          show: Components.ShowTextEditor
        }
      },
      meta_box: {
        type: "mixed",
        isArray: true
      },
      "meta_box.key": {
        type: "string"
      },
      "meta_box.value": {
        type: "string"
      }
    }
  },
  features: [
    uploadFeature({
      provider: { local: localProvider },
      validation: image_validation,
      properties: image_properties,
      uploadPath: (record: any, filename: string) =>
        `/pages/${record.id()}~~${filename}`
    })
  ]
};

export default page_resource;
