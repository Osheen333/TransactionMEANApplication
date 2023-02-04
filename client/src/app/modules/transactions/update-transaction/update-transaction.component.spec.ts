import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { of } from 'rxjs';

import { UpdateTransactionComponent } from './update-transaction.component';
import { MatNativeDateModule } from '@angular/material/core';

describe('UpdateTransactionComponent', () => {
  let component: UpdateTransactionComponent;
  let fixture: ComponentFixture<UpdateTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateTransactionComponent],
      imports: [BrowserAnimationsModule, CommonModule, MatDialogModule, MatSelectModule,MatNativeDateModule,
        ReactiveFormsModule, FormsModule, HttpClientModule, MatFormFieldModule, MatInputModule, MatDividerModule,MatDatepickerModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call createForm Method', () => {
      const spy = jest.spyOn(component, 'createForm');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('should patchValue to form', (done) => {
      const result = {
        data: {
          data: {
            id:1,
            status: "PENDING",
            comments: "UtilityBill",
            date: '8/8/2022',
          }
        }
      }

      jest.spyOn(component['_transactionService'], 'getById').mockReturnValue(of(result) as any);

      component.ngOnInit();

      done();

      const value = component.transactionForm.value;
      expect(value.id).toBe(result.data.data.id);
      expect(value.status).toBe(result.data.data.status);
      expect(value.comments).toBe(result.data.data.comments);
      expect(value.date).toBe(result.data.data.date);
    });

    it('test id', (done) => {
      const result = {
        data: {
          data: {
            _id: "123",
            id:1,
            status: "PENDING",
            comments: "UtilityBill",
            date: "08/08/2020",
          }
        }
      }

      jest.spyOn(component['_transactionService'], 'getById').mockReturnValue(of(result) as any);

      component.ngOnInit();

      done();

      expect(component._id).toBe(result.data.data._id);
    });
  });

  describe('createForm', () => {
    it('should create the form', () => {
      component.createForm();
      expect(component.transactionForm).toBeDefined();
      expect(Object.keys(component.transactionForm.controls).length).toBe(4);
    });
  });

  describe('onSubmit', () => {
    it('should call the create the method if form is valid', (done) => {
      component.transactionForm.setValue({
        id:1,
        status: "PENDING",
        comments: "UtilityBill",
        date: "08/08/2020",
      });

      const dialogRef: any = { close: jest.fn() };
      component.dialogRef = dialogRef;

      jest.spyOn(component['_transactionService'], 'update').mockReturnValue(of({ data: { data: {} } }) as any);

      const spy = jest.spyOn(component['_transactionService'], 'update');
      const model: any = {};
      component.onSubmit(model);
      done();
      expect(component.transactionForm.valid).toBeTruthy();
      expect(spy).toHaveBeenCalled();
      expect(dialogRef.close).toHaveBeenCalled();
    });
  });
});
