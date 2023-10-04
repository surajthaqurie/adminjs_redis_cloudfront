export interface ITwoFASetup {
  id: string;
  userId: string;
}

export interface ITwoFA {
  id: string;
  secret: string;
  status: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IEnableDisableTwoFA = ITwoFASetup & {
  status: boolean;
};
