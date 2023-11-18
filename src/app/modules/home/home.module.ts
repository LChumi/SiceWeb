import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import {SharedModule} from "../../shared/shared.module";
import {FormsModule} from "@angular/forms";
import {ComponentsModule} from "../../components/components.module";


@NgModule({
  declarations: [
    LoginComponent,
    InicioComponent
  ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        SharedModule,
        FormsModule,
        ComponentsModule
    ]
})
export class HomeModule { }
