import { Injectable } from '@angular/core';
import {API_URL} from "../../../core/constants/constants";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationReq} from "../../../core/models/AuthenticationReq";
import {BehaviorSubject, Observable, startWith, Subject, tap} from "rxjs";
import {TokenInfo} from "../../../core/guards/TokenInfo";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationReqService {

  private baseUrl:string=API_URL+'auth/';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  private isLoggedInSubject: BehaviorSubject<boolean> =new BehaviorSubject<boolean>(false);//obserbable para notificar cambios de usuario

  constructor(private http:HttpClient ) {
    const token =sessionStorage.getItem('token');
    this.isLoggedInSubject.next(token === 'true')
  }

  login(usuario:AuthenticationReq):Observable<TokenInfo>{
    return this.http.post<any>(this.baseUrl+'login/',usuario,{headers:this.httpHeaders})
      .pipe(
        tap((tokenInfo:TokenInfo)=>{
          if (tokenInfo && tokenInfo.jwtToken){
            sessionStorage.setItem('token',tokenInfo.jwtToken);
          }
        })
      )
  }

  setIsLoggedIn(value: boolean){
    this.isLoggedInSubject.next(value);
  }
  getIsLoggedTn():Observable<boolean>{
    return this.isLoggedInSubject.asObservable().pipe(startWith(this.isLoggedInSubject.value))
  }

  isLoggedIn(){
    return !!this.getToken();
  }
   expJwtToken(){
    const token =this.getDecodeToken();
    if (token && token.exp !== undefined){
      const ahora = Date.now() / 1000;
      const falta =token.exp - ahora;
      return falta;
    }
    return null;
  }
  getToken(){
    return sessionStorage.getItem('token');
  }
  private getDecodeToken(){
    const token = this.getToken();

    if (token){
      try {
        return jwtDecode(token);
      }catch (error){
        console.error('Error al decodificar token',error)
        return null;
      }
    }
    return null;
  }

  isTokenExpired():boolean{
    const  token=sessionStorage.getItem('token');
    if (token){
      const tokenParts = token.split('.');

      if (tokenParts.length === 3){
        try{
          const tokenData=JSON.parse(atob(tokenParts[1]));
          const expirationTime = tokenData.exp *1000;
            return expirationTime <Date.now();//false
        }catch (error){
          console.error('Error al decodificar el token:',error);
          sessionStorage.clear();
          return true; // En caso de error, considera el token como expirado
        }
      }else {
        console.error('El formato del token no es el esperado.')
        sessionStorage.clear();
      }
    }
    return true; // Si no hay token cuenta como expirado
  }

}
