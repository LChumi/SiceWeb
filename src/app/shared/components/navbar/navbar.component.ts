import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {AuthenticationReqService} from "../../../modules/home/services/authentication-req.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  isLoggedIn=false;
  nombre:any;

  constructor(private router:Router,private userService:AuthenticationReqService) {
  }

  ngOnInit() {
    this.userService.getIsLoggedTn().subscribe((isLoggedIn:boolean) => {
      this.isLoggedIn=isLoggedIn;
      if (isLoggedIn){
        this.nombre=sessionStorage.getItem('usuario');
      }
    })
  }

  login():void{
    this.router.navigate(["Cumpleaños/inicio/login"])
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(["Cumpleaños/inicio/login"])
  }

  toComprobantes(){
    this.router.navigate(["Cumpleaños/sice/comprobantes"])
  }

  protected readonly faRightFromBracket = faRightFromBracket;
}
