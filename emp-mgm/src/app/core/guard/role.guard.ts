import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private router: Router,private employeeService : EmployeeService) { }

  canActivate(route:ActivatedRouteSnapshot){
    let roleArray = route.data.Role;
    var payload = this.employeeService.getUserPayload()
    for(let i=0; i<roleArray.length; i++){
      if(roleArray[i]==payload.role){
        //console.log('Allowed')
        return true;
      }
    }
    if(payload.role=='student')
      window.location.href="https://invesmate.com/"
    else if(payload.role=='instructor')
      window.location.href="https://online.invesmate.com/instructor/"
    else
      window.location.href="https://online.invesmate.com/auth/login"
    return false;
  }

  
}