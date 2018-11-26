import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsersService } from '../users.service';
@Injectable()
export class LoginGuardGuard implements CanActivate {

  constructor(public router: Router, public _userservice: UsersService) {

  }

  canActivate() {
    if (this._userservice.estaLogueado()) {
      return true;
    } else {
      this._userservice.logOut();
      return false;
    }
  }
}
