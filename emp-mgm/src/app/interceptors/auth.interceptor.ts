import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { EmployeeService } from "../services/employee.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private employeeService: EmployeeService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!window.navigator.onLine) {
      const error = {
        status: 0,
        error: {
          description: 'Slow Internet Connectivity Detected!. Please Check your internet and refresh again.'
        },
        statusText: 'Slow Internet Connectivity Detected!. Please Check your internet and refresh again.'
      };
      return throwError('Slow Internet Connectivity Detected!. Please Check your internet and refresh again.');
    }
    else {
      if (req.headers.get('noauth')) {
        return next.handle(req.clone()).pipe(
          catchError((error: HttpErrorResponse) => {
            console.log(error)
            let errorMsg = '';
            if (error.error instanceof ErrorEvent) {
              console.log('this is client side error');
              errorMsg = `Error: ${error.error.message.toString()}`;
            }
            else {
              console.log('this is server side error');
              errorMsg = `Error Code: ${error.status},  Error: ${error.error.toString()}`;
            }
            console.log(errorMsg);
            return throwError(error.error.toString());
          })
        );
      }
      else {
        const clonedreq = req.clone({
          headers: req.headers.set("Authorization", "Bearer " + this.employeeService.getToken())
        });
        return next.handle(clonedreq).pipe(
          catchError((error: HttpErrorResponse) => {

            let errorMsg = '';
            if (error.error instanceof ErrorEvent) {
              console.log('this is client side error');
              errorMsg = `Error: ${error.error.message.toString()}`;
            } else if (error.error instanceof ProgressEvent) {
              console.log('this is Progress Event error');
              errorMsg = `Slow Internet Connectivity Detected!. Please Check your internet and refresh again.`;
            }
            else {
              console.log('this is server side error');
              errorMsg = `Error Code: ${error.status},  Error: ${error.error.toString()}`;
              if (error.status == 401) {
                this.employeeService.logout();
              } else if (error.status == 403) {
                this.router.navigate(['/error/401']);
              } else if (error.status === 504) {
                console.log(error)
                console.log(errorMsg);
                return throwError("This Page is taking way too long to load. Please refresh again.");
              }
            }
            console.log(error)
            console.log(errorMsg);
            return throwError(errorMsg);
          })
        );
      }
    }
  }
}