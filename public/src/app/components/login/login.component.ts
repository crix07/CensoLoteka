import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UsersService } from '../../services/users.service';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  public identity;
  public loginForm: FormGroup;
  public registroForm: FormGroup;
  public status: String;
  public token;
  public err: string;

  constructor(public _userservice: UsersService, public fb: FormBuilder) {

  }

  ngOnInit() {

     this.loginForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]],
      'password': ['', Validators.required]
     });


     this.registroForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
      ]]
     });

  }

   get emailRegistro() { return this.registroForm.get('email') }
   get passwordRegistro() { return this.registroForm.get('password') }

   registroFire() {
     return this._userservice.crearUsuario(this.emailRegistro.value, this.passwordRegistro.value);
   }

   get emailLogin() { return this.loginForm.get('email') }
   get passwordLogin() { return this.loginForm.get('password') }

  loginFire() {
    return this._userservice.ingresar(this.emailLogin.value, this.passwordLogin.value);
  }


}
