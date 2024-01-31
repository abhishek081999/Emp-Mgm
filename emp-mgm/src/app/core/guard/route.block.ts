import { Injectable } from '@angular/core';
import { CanDeactivate} from '@angular/router';
import { MyProfileComponent } from 'src/app/views/pages/profile/my-profile/my-profile.component';

@Injectable()
export class RouteBlock implements CanDeactivate<MyProfileComponent>{

  constructor() { }
  canDeactivate(component: MyProfileComponent): boolean {
    if (component && component.issavedform == false && component.iseditedform==true){
      if(confirm('You Have unsaved changes that will be lost')==false){
        return false
      }
    }
    return true
  }
}
