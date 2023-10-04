export const user_roles = {
  availableValues: [
    { value: "EDITOR", label: "Editor" },
    { value: "SEO", label: "SEO" }
  ]
};

export const user_new_layouts = [
  "name",
  "email",
  "password",
  "confirm_password",
  "role"
];
export const user_list_properties = [
  "name",
  "email",
  "role",
  "createdAt",
  "updatedAt"
];

export const delete_guard = {
  guard: "doYouReallyWantToDoThis"
};

export const localProvider = {
  bucket: process.env.NODE_ENV === "development" ? "public" : "build/public",
  opts: {
    baseUrl: "/public"
  }
};

export const image_validation = {
  mimeTypes: ["image/jpg", "image/jpeg", "image/png", "image/gif"],
  maxSize: 4000000 // 4mb
};

export const image_properties = {
  file: "image",
  key: "image.key",
  filename: "image.filename",
  filePath: `image.path`,
  mimeType: "image.mine",
  bucket: "image.bucket",
  size: `image.size`,
  filesToDelete: "image.filesToDelete"
};

export const admin_resource = {
  isAccessible: ({ currentAdmin }: any) => currentAdmin.role === "ADMIN"
};

export const admin_seo_resource = {
  isAccessible: ({ currentAdmin }: any) =>
    currentAdmin.role === "ADMIN" || currentAdmin.role === "SEO"
};

export const admin_editor_resource = {
  isAccessible: ({ currentAdmin }: any) =>
    currentAdmin.role === "ADMIN" || currentAdmin.role === "EDITOR"
};

export const og_types = {
  availableValues: [
    { value: "WEBSITE", label: "Website" },
    { value: "MOBILE", label: "Mobile" }
  ]
};
