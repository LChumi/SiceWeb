import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationReqService} from "../../modules/home/services/authentication-req.service";

export const authGuard: CanActivateFn = (route, state) => {

  const router =inject(Router)
  const authService= inject(AuthenticationReqService);

  if (authService.isTokenExpired()){
    router.navigate(['/Cumpleaños/inicio/login']);
    return false;
  }
  return true;

};
