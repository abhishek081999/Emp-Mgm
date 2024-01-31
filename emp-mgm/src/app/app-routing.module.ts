import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { ErrorPageComponent } from './views/pages/error-page/error-page.component';
import { AdminBaseComponent } from './views/layout/admin-base/admin-base.component';
import { RoleGuard } from './core/guard/role.guard';


const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
  { path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  {
    path: 'admin',
    component: AdminBaseComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { Role: ['admin'] },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'courses',
        loadChildren: () => import('./views/pages/courses/courses.module').then(m => m.CoursesModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./views/pages/reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'insignia',
        loadChildren: () => import('./views/pages/insignia/insignia.module').then(m => m.InsigniaModule)
      },
      {
        path: 'referral',
        loadChildren: () => import('./views/pages/referral/referral.module').then(m => m.ReferralModule)
      },
      {
        path: 'communication',
        loadChildren: () => import('./views/pages/communication/communication.module').then(m => m.CommunicationModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./views/pages/product/product.module').then(m => m.ProductModule)
      },
      {
        path: 'employees',
        loadChildren: () => import('./views/pages/employess/employess.module').then(m => m.EmployessModule)
      },
      {
        path: 'attendance-and-leave',
        loadChildren: () => import('./views/pages/attendance-and-leave/attendance-and-leave.module').then(m => m.AttendanceAndLeaveModule)
      },
      {
        path: 'students',
        loadChildren: () => import('./views/pages/students/students.module').then(m => m.StudentsModule)
      },
      {
        path: 'instructor',
        loadChildren: () => import('./views/pages/instructor/instructor.module').then(m => m.InstructorModule)
      },
      {
        path: 'staff',
        loadChildren: () => import('./views/pages/staff/staff.module').then(m => m.StaffModule)
      },
      {
        path: 'sales',
        loadChildren: () => import('./views/pages/sales/sales.module').then(m => m.SalesModule)
      },
      {
        path: 'jobs',
        loadChildren: () => import('./views/pages/jobs/jobs.module').then(m => m.JobsModule)
      },
      {
        path: 'leads',
        loadChildren: () => import('./views/pages/leads/leads.module').then(m => m.LeadsModule)
      },
      {
        path: 'others',
        loadChildren: () => import('./views/pages/others/others.module').then(m => m.OthersModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./views/pages/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'logs',
        loadChildren: () => import('./views/pages/logs/logs.module').then(m => m.LogsModule)
      },
      {
        path: 'app',
        loadChildren: () => import('./views/pages/mobile-app/mobile-app.module').then(m => m.MobileAppModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./views/pages/orders/orders.module').then(m => m.OrdersModule)
      },
      {
        path: 'stocks',
        loadChildren: () => import('./views/pages/stock/stock.module').then(m => m.StockModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./views/pages/settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'support',
        loadChildren: () => import('./views/pages/support/support.module').then(m => m.SupportModule)
      },
      {
        path:'setting',
        loadChildren: () => import('./views/pages/setting/setting.module').then(m => m.SettingModule)
      },
      {
        path:'support-group',
        loadChildren: () => import('./views/pages/support-group/support-group.module').then(m => m.SupportGroupModule)
      },
      {
        path: 'invesmentor',
        loadChildren: () => import('./views/pages/invesmentor/invesmentor.module').then(m => m.InvesmentorModule)
      },
      // { path: '**', redirectTo: 'error', pathMatch: 'full' }
      // { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  /*{
    path: '',
    component: AdminBaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'apps',
        loadChildren: () => import('./views/pages/apps/apps.module').then(m => m.AppsModule)
      },
      {
        path: 'ui-components',
        loadChildren: () => import('./views/pages/ui-components/ui-components.module').then(m => m.UiComponentsModule)
      },
      {
        path: 'advanced-ui',
        loadChildren: () => import('./views/pages/advanced-ui/advanced-ui.module').then(m => m.AdvancedUiModule)
      },
      {
        path: 'form-elements',
        loadChildren: () => import('./views/pages/form-elements/form-elements.module').then(m => m.FormElementsModule)
      },
      {
        path: 'advanced-form-elements',
        loadChildren: () => import('./views/pages/advanced-form-elements/advanced-form-elements.module').then(m => m.AdvancedFormElementsModule)
      },
      {
        path: 'charts-graphs',
        loadChildren: () => import('./views/pages/charts-graphs/charts-graphs.module').then(m => m.ChartsGraphsModule)
      },
      {
        path: 'tables',
        loadChildren: () => import('./views/pages/tables/tables.module').then(m => m.TablesModule)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/pages/icons/icons.module').then(m => m.IconsModule)
      },
      {
        path: 'general',
        loadChildren: () => import('./views/pages/general/general.module').then(m => m.GeneralModule)
      },

      // { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },*/
  {
    path: 'error',
    component: ErrorPageComponent,
    data: {
      'type': 404,
      'title': 'Page Not Found',
      'desc': 'Oopps!! The page you were looking for doesn\'t exist.'
    }
  },
  {
    path: 'error/:type',
    component: ErrorPageComponent
  },
  { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
