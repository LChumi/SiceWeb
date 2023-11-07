import { Component } from '@angular/core';
import {faHome, faUser} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  protected readonly faHome = faHome;
  protected readonly faUser = faUser;

}
