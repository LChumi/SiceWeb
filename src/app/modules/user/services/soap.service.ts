import { Injectable } from '@angular/core';
import {API_URL} from "../../../core/constants/constants";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
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

  verAutorizacion(clave:string):Observable<any>{
    const body=`clave=${clave}`
    return this.http.post<any>(this.baseurl+'obtieneAutorizacion',body,{headers:this.httpHeaders})
  }

  verificarComprobante(clave:string):Observable<any>{
    const body=`clave=${clave}`
    return this.http.post<any>(this.baseurl+'verificarComprobante',body,{headers:this.httpHeaders})
  }

  enviarComrpobante(xml:string ,email:string, tipo:number):Observable<any>{

    const params=new HttpParams()
      .set('email',email)
      .set('tipo',tipo.toString());

    const httpOptions={
      headers:new HttpHeaders({'Content-Type':'application/json'}),
      params:params
    }
    return this.http.post<any>(this.baseurl+'recibirComprobante/',xml,httpOptions)
  }

}
