import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockListComponent } from './stock-list/stock-list.component';
import { StockComponent } from './stock.component';

const routes: Routes = [
  {
    path: '',
    component: StockComponent,
    children: [
      {
        path: 'stock-list',
        component: StockListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }
