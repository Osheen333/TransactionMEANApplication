import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TransactionCreateOrUpdate,
  TransactionList,
} from '../interfaces/transaction.interface';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  baseUrl = environment.apiUrl;
  isTblLoading = true;

  dataChange: BehaviorSubject<TransactionList[]> = new BehaviorSubject<
    TransactionList[]
  >([]);

  constructor(private _http: HttpClient) {}

  get data(): TransactionList[] {
    return this.dataChange.value;
  }

  getById(id: string) {
    return this._http.get(`${this.baseUrl + id}`);
  }

  getAll() {
    this._http.get(`${this.baseUrl}`).subscribe((result: any) => {
      this.isTblLoading = false;
      this.dataChange.next(result.data.data);
    });
  }

  getAllTransactions() {
    return this._http.get(`${this.baseUrl}`);
  }

  create(model: TransactionCreateOrUpdate) {
    return this._http.post(`${this.baseUrl}`, model);
  }

  update(id: string, model: TransactionCreateOrUpdate) {
    return this._http.patch(`${this.baseUrl + id}`, model);
  }

  delete(id: string) {
    return this._http.delete(`${this.baseUrl + id}`);
  }
}
