import session from "express-session";
import Connect from "connect-pg-simple";

export const adminSessionStore = (): Connect.PGStore => {
  const ConnectSession = Connect(session);
  return new ConnectSession({
    conObject: {
      connectionString: process.env.DATABASE_URL,
      ssl: false
    },
    tableName: "session",
    createTableIfMissing: true
  });
};
