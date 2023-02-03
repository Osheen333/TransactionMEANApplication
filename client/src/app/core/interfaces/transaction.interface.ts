export interface TransactionList {
  _id?: string;
  comments: string;
  date: Date;
  status: string;
}

export interface TransactionCreateOrUpdate {
  comments: string;
  date: Date;
  status: string;
}
