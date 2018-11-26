import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { UsersService } from '../../services/users.service';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
declare var $;
declare var google;
@Component({
  selector: 'app-add-agen',
  templateUrl: './add-agen.component.html',
  styles: []
})
export class AddAgenComponent implements OnInit {

 public agencia: FormGroup;
 public searchForm: FormGroup;
  listaImagenes: any [] = [];

  public agencias: any[] = [];

  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;
  public imageDataArray;
  public name_address: string;

  public agenciaForm: any;
  public selectAgencia: any[] = [];
  public latitude: number = 18.4860575;
  public longitude: number = -69.9312117;
  locationChosen = false;
  public distancias: any[] = [];
  public data: any;

  public locationActived: boolean = true;

  constructor(public fb: FormBuilder, public router: Router, public activateRoute: ActivatedRoute, public _userservice: UsersService,
     public cloudinary: Cloudinary, public _http: HttpClient) {
  }

  ngOnInit() {
    this.agencia = new FormGroup({
      'empresa': new FormControl('', Validators.required ),
      'idterminal': new FormControl('', Validators.required),
      'usuario': new FormControl('', Validators.required ),
      'permiso': new FormControl('', Validators.required),
      'region': new FormControl({value: '', disabled: true}, Validators.required),
      'provincia': new FormControl({value: '', disabled: true}, Validators.required),
      'municipio': new FormControl({value: '', disabled: true}, Validators.required ),
      'ciudad': new FormControl({value: '', disabled: true}, Validators.required),
      'sector': new FormControl({value: '', disabled: true}, Validators.required ),
      'calle': new FormControl({value: '', disabled: true}, Validators.required),
      'referencia': new FormControl('', Validators.required),
      'distanciaRef': new FormControl({value: '', disabled: true}, Validators.required ),
      'georeferencia': new FormControl({value: '', disabled: true}, Validators.required),
    });

    this.searchForm = this.fb.group({
      'latitude': ['', Validators.required],
      'longitude': ['', Validators.required]
     });

    this.activateRoute.params.subscribe(params => {
      this.data = params;
    });

    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/image/upload`,
      autoUpload: false, // Cargar archivos automáticamente al agregarlos a la cola de carga
      isHTML5: true, // Use xhrTransport a favor de iframeTransport
      removeAfterUpload: true, // Calcule el progreso de forma independiente para cada archivo cargado
      headers: [ // XHR request headers
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    };

    const upsertResponse = fileItem => {
      this.listaImagenes = [];
      // Check if HTTP request was successful
      if (fileItem.status !== 200) {
        console.log('Upload to cloudinary Failed');
        console.log(fileItem);
        return false;
      }
      this.listaImagenes.push(fileItem.data.url)
    }

    this.uploader = new FileUploader(uploaderOptions);
    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Agregue el preajuste de carga sin firmar de Cloudinary al formulario de carga
      form.append('upload_preset', this.cloudinary.config().upload_preset);
      // Usar el valor predeterminado "withCredentials" para las solicitudes CORS
      fileItem.withCredentials = false;
      return { fileItem, form };
    }

    // Actualizar el modelo al finalizar la carga de un archivo
    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) =>
      upsertResponse(
        {
          file: item.file, status,
          data: JSON.parse(response),
        }
      )

  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }


  calcDistance(p1, p2) {
    return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2));
  }


  eligir(latitude, longitude) {
    console.log(latitude, longitude)
  }

  compare(a,b) {
    if (parseFloat(a.distance) < parseFloat(b.distance))
        return -1;
    if (parseFloat(a.distance) > parseFloat(b.distance))
        return 1;
    return 0;
  }


  siguiente() {
    if (this.name_address) {
      this.locationActived = false;
    } else {
      swal('Importante', 'Tienes que selecionar una ubicación', 'warning');
    }
  }

  onChoseLocation(event) {

    this.agencia.controls['region'].reset();
    this.agencia.controls['provincia'].reset();
    this.agencia.controls['municipio'].reset();
    this.agencia.controls['ciudad'].reset();
    this.agencia.controls['sector'].reset();
    this.agencia.controls['calle'].reset();

    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    this.locationChosen = true;
    let uri = `https://maps.googleapis.com/maps/api/geocode/json?latlng=
    ${event.coords.lat},${event.coords.lng}&key=AIzaSyDCw0sfl5bgpped8RgqUfbCfaeqP875YpA`;
    this._http.get(uri).subscribe((response: any) => {
      response.results.length > 0 ? this.name_address = response.results[0].formatted_address : null;
      let region = [];
      let municipio = [];
      let ciudad = [];
      let sector = [];
      response.results.length > 0 ? region = response.results[0].address_components.filter(res => res.types[0] === 'locality') : null;
      response.results.length > 0 ? municipio = response.results[0].address_components.filter((res: any) => {
        return res.types[0] === 'administrative_area_level_1';
      }) : null;
      response.results.length > 0 ? ciudad = response.results[0].address_components.filter(res => res.types[1] === 'sublocality') : null;
      response.results.length > 0 ? sector = response.results[0].address_components.filter(res => res.types[0] === 'route') : null;

      region.length > 0 ? this.agencia.controls['region'].setValue(region[0].long_name) : null;
      municipio.length > 0 ? this.agencia.controls['provincia'].setValue(municipio[0].long_name) : null;
      municipio.length > 0 ? this.agencia.controls['municipio'].setValue(municipio[0].long_name) : null;
      ciudad.length > 0 ? this.agencia.controls['ciudad'].setValue(ciudad[0].long_name) : null;
      sector.length > 0 ? this.agencia.controls['sector'].setValue(sector[0].long_name) : null;
      response.results.length > 0 ? this.agencia.controls['calle'].setValue(response.results[0].formatted_address) : null;
    });
    let agencias = [];
    let distancias = [];
    let minDistancia: any;
    let p1 = {
      latitude: event.coords.lat,
      longitude: event.coords.lng
    }
    for (let k in this._userservice.agencias) {
      distancias.push(Math.round(this.calculateDistance(p1, this._userservice.agencias[k].agencia)));
      agencias.push(this._userservice.agencias[k]);
    }
    distancias.forEach((obj, i) => {
      agencias[i].distancia = obj;
    });
    minDistancia = Math.min.apply(Math, distancias);
    this.selectAgencia = agencias.filter(agencia => agencia.distancia === minDistancia);
    this.setValues();
  }

  setValues () {
    this.selectAgencia.length > 0 ? this.agencia.controls['distanciaRef']
    .setValue(`A ${this.selectAgencia[0].distancia} METROS DE LA AGENCIA ${this.agencia.controls['idterminal'].value ?
    this.agencia.controls['idterminal'].value : null} ${this.agencia.controls['empresa'].value
    ? this.agencia.controls['empresa'].value : null}, POR LA ${this.selectAgencia[0].agencia.calle}`) : null;

    this.selectAgencia.length > 0 ? this.agencia.controls['georeferencia']
    .setValue(`${String(this.selectAgencia[0].agencia.latitude).substring(0, 7)}, ${String(this.selectAgencia[0]
      .agencia.longitude).substring(0, 8)}`) : null;
  }


  calculateDistance(pointA, pointB) {
    const lat1 = pointA.latitude;
    const lon1 = pointA.longitude;

    const lat2 = pointB.latitude;
    const lon2 = pointB.longitude;

    const R = 6371e3; // earth radius in meters
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a = (Math.sin(Δφ / 2) * Math.sin(Δφ / 2)) +
              ((Math.cos(φ1) * Math.cos(φ2)) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2)));

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance; // in meters
  }


  agregarAgen() {
    if (this.listaImagenes.length < 1) {
      swal('Advertencia', 'Tienes que subir las imagenes', 'error');
    }
    if (!this.name_address) {
      swal('Advertencia', 'Por favor selecciona una ubicación', 'error');
    }
    if (this.listaImagenes.length > 0 && this.name_address) {
      let agenciaObject: Object = {
        empresa: this.agencia.controls['empresa'].value,
        idterminal: this.agencia.controls['idterminal'].value,
        usuario: this.agencia.controls['usuario'].value,
        permiso: this.agencia.controls['permiso'].value,
        region: this.agencia.controls['region'].value,
        provincia: this.agencia.controls['provincia'].value,
        municipio: this.agencia.controls['municipio'].value,
        ciudad: this.agencia.controls['ciudad'].value,
        sector: this.agencia.controls['sector'].value,
        calle: this.agencia.controls['calle'].value,
        referencia: this.agencia.controls['referencia'].value,
        distanciaRef: this.agencia.controls['distanciaRef'].value,
        georeferencia: this.agencia.controls['georeferencia'].value,
        latitude: this.latitude,
        longitude: this.longitude
      }
      if (this.agencia.valid) {
        this._userservice.addAgencia(agenciaObject, this.listaImagenes, this.selectAgencia).subscribe((data) => {
          this._userservice.getAgencias().subscribe();
          this.router.navigate(['/']);
          swal('Bien', 'Has Actualizado la agencia correctamente', 'success');
        }, err => console.log(err));
      } else {
        swal('Importante', 'Tienes que Llenar el formulario', 'warning');
      }
    }
  }

}
