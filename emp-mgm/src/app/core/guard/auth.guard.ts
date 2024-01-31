import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private employeeService: EmployeeService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (!this.employeeService.isLoggedIn()) {
      //console.log(state.url)
      this.employeeService.redirectedurl = state.url;

      this.router.navigateByUrl('/auth/login');
      this.employeeService.deleteToken();
      return false;
    }
    return true;
  }
}