import {
  HttpEvent,
  HttpHandler,
  HttpErrorResponse,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, throwError, EMPTY, concat } from "rxjs";
import { catchError, concatMap, map } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse, caught: Observable<any>) => {
        console.log("error occurred");

        if (error.status === 404) {
          const snackBarRef = this.snackBar.open("Error occurred", "Retry", {
            duration: 5000
          }); 

          return snackBarRef.onAction().pipe(concatMap(() => caught)); 
        }
        return throwError(error.statusText);
      })
    );
  }
}
