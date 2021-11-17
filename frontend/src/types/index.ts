export interface ITransaction {
  id?: number;
  user_id: number;
  description: string;
  amount: number;
  transaction_date: Date;
  tags?: ITag[];
}

export interface ITag {
  id: number;
  tag_name: string;
}

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
}
