import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UsersService } from '../../../services/users.service';
import { Observable, Subject, combineLatest, forkJoin } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  searchterm: string;

  @Output() AgenciaClick = new EventEmitter();

  constructor(private afs: AngularFirestore,  public _userservice: UsersService, public router: Router) {}

  search(event) {
    this._userservice.search(event);
  }

  ngOnInit() {
    
  }

  addAgen() {
    this.router.navigate(['/add_agen'])
  }

  onSignOut() {
    this._userservice.logOut();
  }

  clickAgencia(key$) {
    this.AgenciaClick.emit(key$);
  }



}
