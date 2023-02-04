import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  TransactionCreateOrUpdate,
  TransactionList,
} from '../../../core/interfaces/transaction.interface';
import { TransactionService } from '../../../core/services/transaction.service';

@Component({
  selector: 'app-update-transaction',
  templateUrl: './update-transaction.component.html',
  styleUrls: ['./update-transaction.component.scss'],
})
export class UpdateTransactionComponent implements OnInit {
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

    this._transactionService
      .getById(this.data.transactionId)
      .subscribe((result: any) => {
        this.returnedData = result.data.data;
        this._id = this.returnedData._id ? this.returnedData._id : '';
        this.transactionForm.patchValue({
          _id: this._id,
          id:this.returnedData.id,
          status: this.returnedData.status,
          comments: this.returnedData.comments,
          date: new Date(this.returnedData.date).toLocaleDateString(),
        });
      });
  }

  createForm() {
    let validPattern = "^[a-zA-Z0-9 ]*$";
    let validNumberattern = "^[0-9]*$"

    this.transactionForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern(validNumberattern)]],
      status: ['', [Validators.required]],
      comments: ['', [Validators.required, Validators.pattern(validPattern)]],
      date: ['', [Validators.required]],
    });
  }

  onSubmit(model: TransactionCreateOrUpdate) {
    if (!this.transactionForm.valid) return;
    this._transactionService.update(this._id, model).subscribe(
      (result: any) => {
        this.dialogRef.close(result.data.data);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
