import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
declare var $;
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styles: []
})
export class ViewComponent implements OnInit {

  listaImagenes: any [] = [];
  public agencia: any;
  public latitude: number;
  public longitude: number;
  locationChosen = false;
  public name_address: string;

  constructor(public activateRoute: ActivatedRoute, public _userservice: UsersService,
     public _http: HttpClient) {}

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      this._userservice.getAgencia(params['id']).subscribe((data: any) => {
        this.listaImagenes = data.images;
        this.agencia = data;
        this.name_address = data.agencia.calle;
        this.latitude = data.agencia.latitude;
        this.longitude = data.agencia.longitude;
        this.locationChosen = true;

        setTimeout(() => {
          $('#slides').owlCarousel({
            items: 2,
            autoPlay: 4500,
            singleItem: true,
            navigation: false,
            pagination: false,
            nav: false
          });
        }, 1000);
      });
    });
  }


}
