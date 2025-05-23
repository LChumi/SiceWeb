import { Injectable } from '@angular/core';
import {API_URL} from "../../../core/constants/constants";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SoapService {

  private baseurl:string=API_URL+'apiWsdl/';

  private getHeaders(): HttpHeaders {
    // Obtén el token almacenado en sessionStorage o donde lo tengas guardado
    const token = sessionStorage.getItem('token');

    // Configura los encabezados con el token
    return new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token}`
    });
  }

  constructor(private http:HttpClient) { }

  verAutorizacion(clave:string):Observable<any>{
    const body=`clave=${clave}`
    return this.http.post<any>(this.baseurl+'obtieneAutorizacion',body,{headers:this.getHeaders()})
  }

  reenviarComprobante(xml:string , email:string):Observable<any>{
    const token = sessionStorage.getItem('token');

    const params=new HttpParams()
      .set('email',email)

    const httpOptions={
      headers:new HttpHeaders({'Content-Type':'application/json','Authorization': `Bearer ${token}`}),
      params:params,
      responseType: 'Text' as 'json'
    }
    return this.http.post<any>(this.baseurl+'reenviarComprobante/',xml,httpOptions)
  }

}
