import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { StockListComponent } from './stock-list/stock-list.component';
import { StockComponent } from './stock.component';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [StockListComponent, StockComponent],
  imports: [
    CommonModule,
    StockRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    NgbModule
  ]
})
export class StockModule { }
