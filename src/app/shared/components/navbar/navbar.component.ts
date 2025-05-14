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
    this.router.navigate(["cumple/inicio/login"])
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(["cumple/inicio/login"])
  }

  toComprobantes(){
    this.router.navigate(["cumple/comprobantes/monitoreo"])
  }

  protected readonly faRightFromBracket = faRightFromBracket;
}
