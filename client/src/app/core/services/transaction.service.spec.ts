import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TransactionList } from '../interfaces/transaction.interface';
import { TransactionService } from './transaction.service';

describe('DataService', () => {
  let httpTestingController: HttpTestingController;
  let service: TransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpTestingController = TestBed.get(HttpTestingController);

    service = TestBed.get(TransactionService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('#getData should return expected data', (done) => {
    const expectedData: TransactionList[] = [
      {
        id:1,
        status: "PENDING",
        comments: "UtilityBill",
        date: new Date(),
      },
    ];

    service.getAllTransactions().subscribe((result: any) => {
      console.log(result)
      expect(result).toEqual(expectedData);
      done();
    });

    const testRequest = httpTestingController.expectOne(
      'http://localhost:8080/api/transactions/'
    );

    testRequest.flush(expectedData);
  });

  it('#getData should use GET to retrieve data', () => {
    service.getAllTransactions().subscribe();

    const testRequest = httpTestingController.expectOne(
      'http://localhost:8080/api/transactions/'
    );

    expect(testRequest.request.method).toEqual('GET');
  });

  describe('create', () => {
    it('should call create POST api', () => {
      const fnPost = jest.spyOn(service['_http'], "post");
      const model = {
        id:1,
        status: "PENDING",
        comments: "UtilityBill",
        date: new Date(),
      }
      service.create(model);
      expect(fnPost).toHaveBeenCalledWith(`${service.baseUrl}`, model)
    });
  });

  describe('update', () => {
    it('should call update PATCH api', () => {
      const fnPatch = jest.spyOn(service['_http'], "patch");
      const model = {
        id:1,
        status: "PENDING",
        comments: "UtilityBill",
        date: new Date(),
      }
      const id = "123";
      service.update(id, model);
      expect(fnPatch).toHaveBeenCalledWith(`${service.baseUrl + id}`, model)
    });
  });

  describe('delete', () => {
    it('should call DELETE api request', () => {
      const fnDelete = jest.spyOn(service['_http'], "delete");
      const id = "123";
      service.delete(id);
      expect(fnDelete).toHaveBeenCalledWith(`${service.baseUrl + id}`)
    });
  });
});
