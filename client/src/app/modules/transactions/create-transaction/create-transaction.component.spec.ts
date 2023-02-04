import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { CreateTransactionComponent } from './create-transaction.component';

describe('CreateTransactionComponent', () => {
  let component: CreateTransactionComponent;
  let fixture: ComponentFixture<CreateTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateTransactionComponent],
      imports: [BrowserAnimationsModule,MatNativeDateModule, MatDatepickerModule, CommonModule, MatDialogModule, MatSelectModule, ReactiveFormsModule, FormsModule, HttpClientModule, MatFormFieldModule, MatInputModule, MatDividerModule],
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

    fixture = TestBed.createComponent(CreateTransactionComponent);
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
        date: new Date(),
      });

      const dialogRef: any = { close: jest.fn() };
      component.dialogRef = dialogRef;

      jest.spyOn(component['_transactionService'], 'create').mockReturnValue(of([]) as any);

      const spy = jest.spyOn(component['_transactionService'], 'create');
      const model: any = {};
      component.onSubmit(model);
      expect(component.transactionForm.valid).toBeTruthy();
      expect(spy).toHaveBeenCalled();
      expect(dialogRef.close).toHaveBeenCalled();
      done();
    });
  });
});
