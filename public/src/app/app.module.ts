import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
// import { FileSelectDirective } from 'ng2-file-upload';
import * as firebase from 'firebase/app';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AgmCoreModule } from '@agm/core';
import { APP_ROUTES } from './app.routes';
import { UsersService } from './services/users.service';
import { LoginGuardGuard } from './services/guards/login-guard.guard';
import { UnloginGuard } from './services/guards/unlogin-guard.guard';
import { MaterialModule } from './material.module';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireDatabaseModule } from 'angularfire2/database';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { CloudinaryModule } from '@cloudinary/angular-5.x';
import * as cloudinary from 'cloudinary-core';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { NopagefoundComponent } from './components/shared/nopagefound/nopagefound.component';
import { environment } from '../environments/environment';
import { AddAgenComponent } from './components/add-agen/add-agen.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { FileUploadModule } from 'ng2-file-upload';
import { CloudinarySettings } from './settings';
import { EditComponent } from './components/edit/edit.component';
import { ViewComponent } from './components/view/view.component';
import { KeysPipe } from './pipes/keys.pipe';
firebase.initializeApp (environment.firebase);
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ServiceWorkerModule } from '@angular/service-worker';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    NopagefoundComponent,
    // FileSelectDirective,
    AddAgenComponent,
    SidebarComponent,
    EditComponent,
    ViewComponent,
    KeysPipe
  ],
  imports: [
    CloudinaryModule.forRoot(cloudinary, CloudinarySettings),
    BrowserModule,
    NgbModule.forRoot(),
    FileUploadModule,
    APP_ROUTES,
    MaterialModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDCw0sfl5bgpped8RgqUfbCfaeqP875YpA',
      libraries: ['geometry']
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    FileUploadModule,
    AngularFireDatabaseModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    LoginGuardGuard,
    UsersService,
    UnloginGuard,
    FormBuilder
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
