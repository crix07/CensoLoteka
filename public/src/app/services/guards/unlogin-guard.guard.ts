import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UsersService } from '../users.service';

@Injectable()
export class UnloginGuard implements CanActivate {
  constructor(public router: Router, public _userservice: UsersService ) {

  }

  canActivate() {
    if (!this._userservice.estaLogueado()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
