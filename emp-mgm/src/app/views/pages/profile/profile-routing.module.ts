import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteBlock } from 'src/app/core/guard/route.block';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: '',
        redirectTo: 'my-profile',
        pathMatch: 'full'
      },
      {
        path: 'my-profile',
        component: MyProfileComponent,
        canDeactivate:[RouteBlock]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
