import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthenticationReqService} from "../../services/authentication-req.service";
import {Router} from "@angular/router";
import {TokenInfo} from "../../../../core/guards/TokenInfo";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(private userService:AuthenticationReqService, private router:Router) { }

  ngOnInit() {
  }

  login(loginForm:NgForm){
    this.userService.login(loginForm.value).subscribe(
      (tokenInfo:TokenInfo) =>{
        if(tokenInfo){
          sessionStorage.setItem('token', tokenInfo.jwtToken);
          sessionStorage.setItem('usuario',loginForm.value.usuario);
          this.userService.setIsLoggedIn(true)
          loginForm.reset();
          this.router.navigate(['/Cumpleaños/sice/comprobantes'])
        }
      },
      (error)=>{
        console.error(error)
        alert('Ha ocurrido un problema en el inicio de sesión. Por favor, inténtalo de nuevo. ')
      }
    )
  }

}
