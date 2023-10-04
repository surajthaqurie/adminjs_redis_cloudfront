export const slugify_string = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const pageDetailsCustomResponse = (response: any): any => {
  const custom_page_section_data: any = [];
  const custom_page_meta_box_data: any = [];
  if (response && response.sections && response.sections.length) {
    for (let i = 0; i < response.sections.length; i++) {
      custom_page_section_data.push({
        [response.sections[i].title || null]: response.sections[i].description || null
      });
    }
    response.sections = new Array(Object.assign({}, ...custom_page_section_data));
  }

  if (response && response.meta_box && response.meta_box.length) {
    for (let i = 0; i < response.meta_box.length; i++) {
      custom_page_meta_box_data.push({
        [response.meta_box[i].key || null]: response.meta_box[i].value || null
      });
    }
    response.meta_box = new Array(Object.assign({}, ...custom_page_meta_box_data));
  }

  return response;
};
