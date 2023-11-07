import { Injectable } from '@angular/core';
import {API_URL} from "../../../core/constants/constants";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SoapService {

  private baseurl:string=API_URL+'apiWsdl/';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})

  constructor(private http:HttpClient) { }

  obtenerEstado(clave:string):Observable<any>{
    const body= `clave=${clave}`
    return this.http.post<any>(this.baseurl+'obtenerEstado',body,{headers:this.httpHeaders})
  }

  verRespuesta(clave:string):Observable<any>{
    const body=`clave=${clave}`
    return this.http.post<any>(this.baseurl+'verRespuesta',body,{headers:this.httpHeaders})
  }

}
