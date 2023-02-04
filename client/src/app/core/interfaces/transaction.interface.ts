export interface TransactionList {
  _id?: string;
  id:Number;
  comments: string;
  date: Date;
  status: string;
}

export interface TransactionCreateOrUpdate {
  id:Number;
  comments: string;
  date: Date;
  status: string;
}
