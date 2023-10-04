import { Prisma } from "@prisma/client";
import { IFormErrorMessage } from "./common.interface";

export interface IPage {
  id: string;
  name: string;
  image: Prisma.JsonValue;
  description: string;
  og_title: string | null;
  meta_title: string | null;
  og_description: string | null;
  meta_description: string | null;
  keywords: string | null;
  canonical_link: string | null;
  og_url: string | null;
  og_type: string | null;
  slug: string;
  sections: Prisma.JsonValue;
  meta_box: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPageForm {
  name: IFormErrorMessage;
  description: IFormErrorMessage;
  image_alternative_text: IFormErrorMessage;
}
