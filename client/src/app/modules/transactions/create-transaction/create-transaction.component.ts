import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  TransactionCreateOrUpdate,
  TransactionList,
} from '../../../core/interfaces/transaction.interface';
import { UpdateTransactionComponent } from '../update-transaction/update-transaction.component';
import { TransactionService } from '../../../core/services/transaction.service';

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss'],
})
export class CreateTransactionComponent implements OnInit {
  transactionForm!: FormGroup;
  _id!: string;
  returnedData!: TransactionList;

  statusDropdown = [
    {
      name: 'COMPLETED',
    },
    {
      name: 'IN PROGRESS',
    },
    {
      name: 'REJECTED',
    },
    {
      name: 'PENDING'     
    }

  ];

  constructor(
    public dialogRef: MatDialogRef<UpdateTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    let validPattern = "^[a-zA-Z0-9 ]*$"
    this.transactionForm = this.fb.group({
      comments: ['', [Validators.required, Validators.pattern(validPattern)]],
      status: ['', [Validators.required]],
      date: ['', [Validators.required]],
    });
  }

  onSubmit(model: TransactionCreateOrUpdate) {
    if (!this.transactionForm.valid) return;
    this._transactionService.create(model).subscribe(
      (result: any) => {
        this.dialogRef.close();
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
