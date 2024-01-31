import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllScheduleComponent } from './all-schedule/all-schedule.component';
import { CreateProductsComponent } from './create-products/create-products.component';
import { LiveMarketPracticeListComponent } from './live-market-practice-list/live-market-practice-list.component';
import { LiveMarketPracticeScheduleComponent } from './live-market-practice-schedule/live-market-practice-schedule.component';
import { MarketResearchSubscriptionComponent } from './market-research-subscription/market-research-subscription.component';
import { MentorshipDetailsComponent } from './mentorship-details/mentorship-details.component';
import { MentorshipListComponent } from './mentorship-list/mentorship-list.component';
import { MentorshipScheduleComponent } from './mentorship-schedule/mentorship-schedule.component';
import { PendingBookingsComponent } from './pending-bookings/pending-bookings.component';
import { PortfolioCheckupDetailsComponent } from './portfolio-checkup-details/portfolio-checkup-details.component';
import { PortfolioCheckupListComponent } from './portfolio-checkup-list/portfolio-checkup-list.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductPurchaseComponent } from './product-purchase/product-purchase.component';
import { ProductSubscriptionComponent } from './product-subscription/product-subscription.component';
import { ProductsComponent } from './products/products.component';
import { SendResearchComponent } from './send-research/send-research.component';
import { InvesletterComponent } from './invesletter/invesletter.component';
import { FollowMyPortfolioComponent } from './follow-my-portfolio/follow-my-portfolio.component';
import { FollowMyPortfolioStocklistComponent } from './follow-my-portfolio-stocklist/follow-my-portfolio-stocklist.component';
import { SendWealthInsightsComponent } from './send-wealth-insights/send-wealth-insights.component';
import { AwarenessVideosComponent } from './awareness-videos/awareness-videos.component';

const routes: Routes = [
  {
  path: '',
  component: ProductsComponent,
  children: [
    {
      path: '',
      redirectTo: 'products',
      pathMatch: 'full'
    },
    {
      path: 'add-products',
      component: CreateProductsComponent
    },
    {
      path: 'edit-products/:id',
      component: CreateProductsComponent
    },
    {
      path: 'products',
      component: ProductListComponent
    },
    {
      path: 'product-purchase-history',
      component: ProductPurchaseComponent
    },
    {
      path: 'product-subscription-history',
      component: ProductSubscriptionComponent
    },
    {
      path: 'mentorship-schedule',
      component: MentorshipScheduleComponent
    },
    {
      path: 'all-schedule',
      component: AllScheduleComponent
    },
    {
      path: 'market-research-subscription',
      component: MarketResearchSubscriptionComponent
    },
    {
      path: 'send-research',
      component: SendResearchComponent
    },
    {
      path: 'portfolio-checkup',
      component: PortfolioCheckupListComponent
    },
    {
      path: 'portfolio-checkup/:id',
      component: PortfolioCheckupDetailsComponent
    },
    {
      path: 'one-to-one-mentorship',
      component: MentorshipListComponent
    },
    {
      path: 'one-to-one-mentorship/:id',
      component: MentorshipDetailsComponent
    },
    {
      path: 'live-market-practice-schedule',
      component: LiveMarketPracticeScheduleComponent
    },
    {
      path: 'live-market-practice',
      component: LiveMarketPracticeListComponent
    },
    {
      path: 'pending-product-booking',
      component: PendingBookingsComponent
    },
    {
      path: 'invesletter',
      component: InvesletterComponent
    },
    {
      path: 'follow-my-portfolio',
      component: FollowMyPortfolioComponent
    },
    {
      path: 'follow-my-portfolio-stocklist/:id',
      component: FollowMyPortfolioStocklistComponent
    },
    {
      path: 'send-wealth-insights',
      component: SendWealthInsightsComponent
    },
    {
      path: 'awareness-videos',
      component: AwarenessVideosComponent
    },
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
