import { ILoginAdmin } from "../interfaces";
import { verifyPassword } from "./bcrypt";
import { prisma } from "./db_connection";

const { users: Users } = prisma;

export const adminAuthenticate = async (email: string, password: string, context: any): Promise<ILoginAdmin | null> => {
  try {
    const admin = await Users.findFirst({
      where: {
        OR: [{ role: "ADMIN" }, { role: "EDITOR" }, { role: "SEO" }],
        AND: { email }
      }
    });

    if (!admin) return null;
    const matched_password = await verifyPassword(password, admin.password);
    if (!matched_password) return null;
    return Promise.resolve({
      email: admin.email,
      id: admin.id,
      role: admin.role
    });
  } catch (err) {
    return null;
  }
};
