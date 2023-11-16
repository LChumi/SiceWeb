import { Injectable } from '@angular/core';
import {API_URL} from "../../../core/constants/constants";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationReq} from "../../../core/models/AuthenticationReq";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationReqService {

  private baseUrl:string=API_URL+'auth/';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http:HttpClient) { }

  login(usuario:AuthenticationReq):Observable<any>{
    return this.http.post<any>(this.baseUrl+'login/',usuario,{headers:this.httpHeaders})
  }
}
