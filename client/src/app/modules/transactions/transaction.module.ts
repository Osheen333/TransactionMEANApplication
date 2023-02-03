import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { TransactionRoutingModule } from './transaction-routing.module';
import { TransactionsComponent } from './transactions.component';
import { UpdateTransactionComponent } from './update-transaction/update-transaction.component';

@NgModule({
  declarations: [
    TransactionsComponent,
    CreateTransactionComponent,
    UpdateTransactionComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TransactionRoutingModule,
    FlexLayoutModule,
  ],
  exports: [CommonModule],
})
export class TransactionModule {}
