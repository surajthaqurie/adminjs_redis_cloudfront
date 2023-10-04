export const isEmptyString = (string: string): boolean => {
  return !string || /^\s*$/.test(string);
};

export const isEmailValid = (email: string): boolean => {
  if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) return true;

  return false;
};

export const isPasswordValid = (password: string): boolean => {
  if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password)) return true;

  return false;
};

export const isEmptyQuillJsDescription = (string: string): boolean => {
  return string.replace(/<(.|\n)*?>/g, "").trim().length === 0;
};

export const isDbUniqueField = async (db: any, field: string, value: string): Promise<boolean> => {
  const unique_field = await db.findUnique({
    where: {
      [field]: value
    },
    select: {
      id: true
    }
  });

  return !!unique_field;
};

export const checkDBUniqueOnEdit = async (db: any, id: string, field: string, value: string): Promise<boolean> => {
  const current_data = await db.findUnique({ where: { id }, select: { id: true } });
  const unique_field = await db.findUnique({ where: { [field]: value }, select: { id: true } });

  if (!unique_field || current_data.id === unique_field?.id) return false;
  return true;
};
