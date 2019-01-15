import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService,
    private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      return this.authenticationService.getStatus().pipe(
        map(status => {
          if (status) {
            return true;
          } else {
            this.router.navigate(['login']);
            return false;
          }
        })
      );

    /*return  this.authenticationService.getStatus().pipe(
      map( status => {
        if (status) {
          return true;
        } else {
          this.router.navigate(['login']);
          return false;
        }
      })
    );*/
  }
}
