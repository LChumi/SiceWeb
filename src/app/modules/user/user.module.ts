import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ComprobantesComponent } from './components/comprobantes/comprobantes.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {ComponentsModule} from "../../components/components.module";


@NgModule({
  declarations: [
    ComprobantesComponent
  ],
    imports: [
        CommonModule,
        UserRoutingModule,
        FontAwesomeModule,
        FormsModule,
        ComponentsModule
    ]
})
export class UserModule { }
