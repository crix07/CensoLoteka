import { Component, ViewChild, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
declare var google: any;
import { AgmMap } from '@agm/core';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  public latitude: number = 18.4860575;
  public longitude: number = -69.9312117;
  public selectAgen: any;
  public agencias: any = [];

  openedWindow: number = 0;

  constructor(public _userservice: UsersService, public router: Router) {}


  ngOnInit() {}


  VerAgencia(event) {
    this.openedWindow = event;
  }

  openWindow(id) {
    this.openedWindow = id;
  }

  isInfoWindowOpen(id) {
    return this.openedWindow == id;
  }

  viewAgen(agencia) {
    this.router.navigate(['/view/', agencia]);
  }

  editAgen(agencia) {
    this.router.navigate(['/edit/', agencia]);
  }

  deleteAgen(agencia) {
    swal({
      title: '¿Estas Segudo?',
      text: 'Esta a punto de borrar una Agencia',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    })
    .then( (borrar) => {
      if (borrar.value) {
        this._userservice.deleteAgencia(agencia).subscribe((data) => {
          this._userservice.getAgencias().subscribe();
        })
      }
    });
  }

  addAgen() {
    this.router.navigate(['/add_agen'])
  }

}

