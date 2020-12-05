import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

       //if user is logged in

      
      //if statement, returns true or false
      //else returns false or a true
      //true = allows access to route
      //false = doesn't allow access to route


    return true;
  }
  
}



// check if user logs in 
// check if the refresh token is stored on the database
// if both conditions are met, then set to true??????????
// 