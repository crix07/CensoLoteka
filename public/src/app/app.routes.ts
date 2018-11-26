import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { NopagefoundComponent } from './components/shared/nopagefound/nopagefound.component';
import { LoginGuardGuard } from './services/guards/login-guard.guard';
import { UnloginGuard } from './services/guards/unlogin-guard.guard';
import { HomeComponent } from './components/home/home.component';
import { AddAgenComponent } from './components/add-agen/add-agen.component';
import { EditComponent } from './components/edit/edit.component';
import { ViewComponent } from './components/view/view.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'add_agen', component: AddAgenComponent, canActivate: [ LoginGuardGuard ] },
    { path: 'login', component: LoginComponent, canActivate: [ UnloginGuard ] },
    { path: 'edit/:id', component: EditComponent, canActivate: [ LoginGuardGuard ] },
    { path: 'view/:id', component: ViewComponent },

    { path: '**', component: NopagefoundComponent }
];


export const APP_ROUTES = RouterModule.forRoot( appRoutes );
