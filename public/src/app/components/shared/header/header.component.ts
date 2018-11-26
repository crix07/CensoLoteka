import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { UsersService } from '../../../services/users.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  public identity;

  constructor(public _userservice: UsersService ) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.identity = user;
      }
    });
  }

  onSignOut() {
    this._userservice.logOut();
  }


  toggle() {
    let sidebar = document.getElementById('sidebar');

    if (sidebar.style.left === '-100%') {
      sidebar.style.left = '0';
      sidebar.style.visibility = 'visible';
    } else {
      sidebar.style.left = '-100%';
      sidebar.style.visibility = 'hidden';
    }
  }

  ngOnInit() {
  }

}
