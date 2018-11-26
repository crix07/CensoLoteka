import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';
import global from '../global';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Agencia } from '../models/agencias';
import { Subject } from 'rxjs';

interface User {
  uid: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  public agencias: any;
  public id: string;
  public usuario: User;

  agenciasSeach: any[] = [];
  allagencias: any[] = [];

  agenciasURL: string = 'https://censoloteka-1530206550406.firebaseio.com/agencias.json';
  agenciaURL: string = 'https://censoloteka-1530206550406.firebaseio.com/agencias/';

  constructor(public db: AngularFireDatabase, public afAuth: AngularFireAuth, public router: Router, public afs: AngularFirestore,
    public afd: AngularFireDatabase, public _http: HttpClient) {
    this.afAuth.authState.subscribe( user => {
      if ( !user ) {
        return;
      }
      this.usuario = user;
    });
    // this.getAgencias().subscribe();
    this.initAll();
    // this.search();
  }

  getAgencia(key$) {
    let uri = `${this.agenciaURL}${key$}.json`;
    return this._http.get( uri )
      .pipe(map((data) => {
        return data;
      }));
  }

  initAll () {
    this.allagencias = [];
    this.agenciasSeach = [];
    this.getAgencias().subscribe((data) => {
      for (let k in this.agencias) {
       this.agencias[k].key = k
       this.agencias[k].key = k
       this.allagencias.push(this.agencias[k])
       this.agenciasSeach.push(this.agencias[k])
      }
    });
  }


  getAgencias() {
    return this._http.get( this.agenciasURL )
      .pipe(map((data) => {
        this.agencias = data;
      }));
  }

  addAgencia(agencia: any, images, agenciaSelect) {
    let body = {agencia, images, agenciaSelect};
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post( this.agenciasURL, body, {headers} )
            .pipe(map(data => {
              return data;
            }));
  }

  deleteAgencia(key$: any) {
    let uri = `${this.agenciaURL}${key$}.json`;
    return this._http.delete( uri )
            .pipe(map(data => {
              swal('Bien', 'Se elimino Correctamente', 'success');
              return data;
            }));
  }

  search($event: any = '') {
    let q;
    if ($event && $event.target.value) {
      q = new RegExp($event.target.value);
    }    
      if (q) {
        this.agenciasSeach = this.allagencias.filter(({agencia}) => {
          return q.test(agencia.empresa || agencia.provincia || agencia.idterminal);
        });
      } else {
        this.initAll();
      }
  }

  updateAgencia(agencia: any, images, key$: string, agenciaSelect) {
    let body = {agencia, images, agenciaSelect};
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let uri = `${this.agenciaURL}${key$}.json`;

    return this._http.put( uri, body, {headers} )
            .pipe(map(data => {
              return data;
            }));
  }


  estaLogueado() {
    return ( this.usuario && this.usuario.email.length > 5 ) ? true : false;
  }

  logOut() {
    this.usuario = null;
    this.afAuth.auth.signOut();
  }

  handlerError(err) {
    swal(err.code, err.message, 'error');
    if (err.code == 'auth/user-not-found') {
      swal('Advertencia', err.message, 'error');
    } else if (err.code == 'auth/invalid-email') {
      swal('Advertencia', 'La dirección de correo electrónico está mal formateada.', 'error');
    } else if(err.code == 'auth/wrong-password') {
      swal('Advertencia', err.message, 'error');
    } else if(err.code == 'auth/email-already-in-use') {
      swal('Advertencia', 'La dirección de correo electrónico ya está siendo utilizada por otra cuenta.', 'error');
    } else if(err.code == 'auth/wrong-password') {
      swal('Advertencia', err.message, 'error');
    }
  }

  setUserDoc(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.user.uid}`);

    const data: User = {
      uid: user.user.uid,
      email: user.user.email
    }
    this.router.navigate(['/']);
    return userRef.set(data);

  }

  crearUsuario(email: string, password: string) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        return this.setUserDoc(user);
      }).catch((err) => {
        return this.handlerError(err);
      });
  }

  ingresar(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password) .then((user) => {
      this.router.navigate(['/']);
    }).catch((err) => {
      return this.handlerError(err);
    });
  }

}
