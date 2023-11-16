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
    console.log(loginForm.value)
    this.userService.login(loginForm.value).subscribe(
      (tokenInfo:TokenInfo) =>{
        if(tokenInfo){
          console.log(tokenInfo.jwtToken);
          // Puedes guardar el token donde lo necesites en tu aplicación
          localStorage.setItem('token', tokenInfo.jwtToken);
          this.router.navigate(['/Cumpleaños/sice/comprobantes'])
        }else{
          console.error('Sin respuesta')
        }
      },
      (error)=>{
        console.error(error)
      }
    )
  }
}
