import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductsComponent } from './products/products.component';
import { CreateProductsComponent } from './create-products/create-products.component';
import { ProductPurchaseComponent } from './product-purchase/product-purchase.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProductListComponent } from './product-list/product-list.component';
import { MentorshipScheduleComponent } from './mentorship-schedule/mentorship-schedule.component';
import { MultipleDatePickerComponent } from './multiple-date-picker/multiple-date-picker.component';
import { PortfolioCheckupListComponent } from './portfolio-checkup-list/portfolio-checkup-list.component';
import { PortfolioCheckupDetailsComponent } from './portfolio-checkup-details/portfolio-checkup-details.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MentorshipListComponent } from './mentorship-list/mentorship-list.component';
import { MentorshipDetailsComponent } from './mentorship-details/mentorship-details.component';
import { ClipboardModule } from 'ngx-clipboard';
import { LiveMarketPracticeScheduleComponent } from './live-market-practice-schedule/live-market-practice-schedule.component';
import { LiveMarketPracticeListComponent } from './live-market-practice-list/live-market-practice-list.component';
import { ProductSubscriptionComponent } from './product-subscription/product-subscription.component';
import { PendingBookingsComponent } from './pending-bookings/pending-bookings.component';
import { AllScheduleComponent } from './all-schedule/all-schedule.component';
import { MarketResearchSubscriptionComponent } from './market-research-subscription/market-research-subscription.component';
import { SendResearchComponent } from './send-research/send-research.component';
import { QuillModule } from 'ngx-quill';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { InvesletterComponent } from './invesletter/invesletter.component';
import { FollowMyPortfolioComponent } from './follow-my-portfolio/follow-my-portfolio.component';
import { FollowMyPortfolioStocklistComponent } from './follow-my-portfolio-stocklist/follow-my-portfolio-stocklist.component';
import { FollowMyPortfoliofoAddedModelComponent } from './follow-my-portfoliofo-added-model/follow-my-portfoliofo-added-model.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SendWealthInsightsComponent } from './send-wealth-insights/send-wealth-insights.component';
import { AwarenessVideosComponent } from './awareness-videos/awareness-videos.component';


@NgModule({
  declarations: [
    ProductsComponent, 
    CreateProductsComponent, 
    ProductPurchaseComponent, 
    ProductListComponent, 
    MentorshipScheduleComponent, 
    MultipleDatePickerComponent, 
    PortfolioCheckupListComponent, 
    PortfolioCheckupDetailsComponent,
    MentorshipListComponent, 
    MentorshipDetailsComponent, 
    LiveMarketPracticeScheduleComponent, 
    LiveMarketPracticeListComponent, 
    ProductSubscriptionComponent, 
    PendingBookingsComponent, 
    AllScheduleComponent, 
    MarketResearchSubscriptionComponent, 
    SendResearchComponent, 
    InvesletterComponent, 
    FollowMyPortfolioComponent, 
    FollowMyPortfolioStocklistComponent, 
    FollowMyPortfoliofoAddedModelComponent,
    SendWealthInsightsComponent,
    AwarenessVideosComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    FeahterIconModule,
    NgbModule,
    NgSelectModule,
    MatCheckboxModule,
    NgSelectModule,
    ClipboardModule,
    QuillModule.forRoot(),
    PipesModule,
    NgApexchartsModule,
    MatButtonToggleModule
  ]
})
export class ProductModule { }
