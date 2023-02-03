import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, fromEvent, map, merge, Observable } from 'rxjs';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { TransactionList } from '../../core/interfaces/transaction.interface';
import { TransactionService } from '../../core/services/transaction.service';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { UpdateTransactionComponent } from './update-transaction/update-transaction.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  displayedColumns = ['comments','status','date','actions'];

  statusDropdown = [
    {
      name: 'COMPLETED',
    },
    {
      name: 'IN PROGRESS',
    },
    {
      name: 'REJECTED',
    }
  ];

  dataSource!: TransactionDataSource;
  selection = new SelectionModel<TransactionList>(true, []);

  transactionServiceToPass!: TransactionService | null;

  constructor(
    private _transactionService: TransactionService,
    public httpClient: HttpClient,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true })
  filter!: ElementRef;
  @ViewChild(MatSelect, { static: true })
  selectCity!: MatSelect;
  @ViewChild(MatSelect, { static: true })
  selectProvince!: MatSelect;

  ngOnInit(): void {
    this.loadData();
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  refresh() {
    this.loadData();
  }

  public loadData() {
    this.transactionServiceToPass = new TransactionService(this.httpClient);

    this.dataSource = new TransactionDataSource(
      this.transactionServiceToPass,
      this.paginator,
      this.sort
    );
    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }

  applyFilter(event: MatSelectChange) {
    console.log(event);
    // const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = event.value.trim().toLowerCase();
  }

  updateTransactionModal(row: TransactionList) {
    const dialogRef = this.dialog.open(UpdateTransactionComponent, {
      data: {
        detail: row,
        transactionId: row._id,
      },
      height: '70%',
      width: '20%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refresh();
      }
    });
  }

  createTransactionModal() {
    const dialogRef = this.dialog.open(CreateTransactionComponent, {
      data: {},
      height: '70%',
      width: '20%',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.refresh();
    });
  }

  deleteTransaction(id: string) {
    console.log(id);
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4758B8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        this._transactionService.delete(id).subscribe(
          (data) => {
            const deletedTransactionIndex =
              this.transactionServiceToPass?.dataChange.value.findIndex(
                (x) => x._id === id
              );
            this.transactionServiceToPass?.dataChange.value.splice(
              deletedTransactionIndex == null ? 0 : deletedTransactionIndex,
              1
            );
            Swal.fire(
              'Deleted!',
              'Your transaction has been deleted.',
              'success'
            );

            this.refresh();
          },
          (error) => {
            this.snackBar.open(error, 'x', {
              panelClass: 'sbError',
              verticalPosition: 'top',
              duration: 3000,
            });
          }
        );
      }
    });
  }
}

export class TransactionDataSource extends DataSource<TransactionList> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: TransactionList[] = [];
  renderedData: TransactionList[] = [];

  constructor(
    public _transactionService: TransactionService,
    public _paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    this._filterChange.subscribe(() => {
      this._paginator.pageIndex = 0;
    });
  }

  connect(): Observable<readonly TransactionList[]> {
    const displayDataChanges = [
      this._transactionService.dataChange,
      this._sort?.sortChange,
      this._filterChange,
      this._paginator.page,
    ];

    this._transactionService.getAll();

    return merge(...displayDataChanges).pipe(
      map(() => {
        this.filteredData = this._transactionService.data
          .slice()
          .filter((transaction: TransactionList) => {
            const searchStr = (
              transaction.status
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        const sortedData = this.sortData(this.filteredData.slice());
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this._paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }

  sortData(data: TransactionList[]): TransactionList[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: any  = '';
      let propertyB: any = '';
      switch (this._sort.active) {
        case 'date':
          [propertyA, propertyB] = [a.date, b.date];
          break;
        case 'status':
          [propertyA, propertyB] = [a.status, b.status];
          break;
        case 'comments':
          [propertyA, propertyB] = [a.comments, b.comments];
          break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }

  disconnect(): void {}
}
