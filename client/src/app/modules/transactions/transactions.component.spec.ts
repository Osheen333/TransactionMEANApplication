import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { TransactionService } from '../../core/services/transaction.service';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';

import { TransactionsComponent } from './transactions.component';
import { UpdateTransactionComponent } from './update-transaction/update-transaction.component';
import Swal from 'sweetalert2';

// jest.mock("sweetalert2", () => ({
//   fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
// }));

describe('TransactionsComponent', () => {
  let component: TransactionsComponent;
  let service: TransactionService;
  let fixture: ComponentFixture<TransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionsComponent],
      imports: [MatDatepickerModule, BrowserAnimationsModule, HttpClientModule, MatSnackBarModule, MatDialogModule, MatProgressSpinnerModule, MatOptionModule, MatPaginatorModule
        , MatTableModule,MatNativeDateModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule, MatSelectModule, MatIconModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load data', () => {
      const spy = jest.spyOn(component, 'loadData');
      component.loadData();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should load data', () => {
      const spy = jest.spyOn(component, 'loadData');
      component.refresh();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('loadData', () => {
    it('should set the params', () => {
      component.loadData();
      expect(component.transactionServiceToPass).toBeDefined();
      expect(component.dataSource).toBeDefined();
    });
  });

  describe('applyFilter', () => {
    it('should apply filter', () => {
      component.applyFilter({ value: "Test" } as any);
      expect(component.dataSource.filter).toBe("Test".toLowerCase())
    });
  });

  describe('updateTransactionModal', () => {
    it('should update transaction modal', (done) => {
      const fnOpen = jest.spyOn(component['dialog'], 'open');
      const fnRefresh = jest.spyOn(component, 'refresh');

      jest.spyOn(component['dialog'], 'open').mockReturnValue({ afterClosed: () => of({}) } as any)

      const row = { _id: "147" };
      component.updateTransactionModal(row as any);
      done();
      expect(fnOpen).toHaveBeenCalledWith(UpdateTransactionComponent, {
        data: {
          detail: row,
          transactionId: row._id,
        },
        height: '70%',
        width: '20%',
      });
      expect(fnRefresh).toHaveBeenCalled();
    });
  });

  describe('createTransactionModal', () => {
    it('should create transaction modal', (done) => {
      const fnOpen = jest.spyOn(component['dialog'], 'open');
      const fnRefresh = jest.spyOn(component, 'refresh');

      jest.spyOn(component['dialog'], 'open').mockReturnValue({ afterClosed: () => of({}) } as any)

      component.createTransactionModal();
      done();
      expect(fnOpen).toHaveBeenCalledWith(CreateTransactionComponent, {
        data: {},
        height: '70%',
        width: '20%',
      });
      expect(fnRefresh).toHaveBeenCalled();
    });
  });

  describe('deleteTransaction', () => {
    it('should ', (done) => {
      const value = { value: true }
      jest.spyOn(Swal, "fire").mockReturnValue(Promise.resolve(value as any));
      component.deleteTransaction("147");
      expect(Swal.fire).toHaveBeenCalledWith({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4758B8',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });
      done();
    });
  });
});
