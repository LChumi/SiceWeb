import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {RouterLink, RouterLinkActive} from "@angular/router";


@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterLinkActive,
    RouterLink,
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    NavbarComponent
  ]
})
export class SharedModule { }
