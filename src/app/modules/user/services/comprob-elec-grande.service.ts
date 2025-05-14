import { Injectable } from '@angular/core';
import {API_URL} from "../../../core/constants/constants";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ComprobElecGrande} from "../../../core/models/ComprobElecGrande";

@Injectable({
  providedIn: 'root'
})
export class ComprobElecGrandeService {

  private baseUrl:string=API_URL+'comprobantesVista/';

  constructor(private http:HttpClient) { }

  private getHeaders():HttpHeaders{
  const token=sessionStorage.getItem('token');

  return new HttpHeaders({
    'Content-type': 'application/xml',
    'Authorization': ` Bearer ${token}`
  })
}

  getComprobantes():Observable<ComprobElecGrande[]>{
    return this.http.get<ComprobElecGrande[]>(this.baseUrl+'listar',{headers:this.getHeaders()});
  }

  getComprobantePorEmpresa(empresa:any):Observable<ComprobElecGrande[]>{
    return this.http.get<ComprobElecGrande[]>(this.baseUrl+'listaEmpresa/'+empresa ,{headers:this.getHeaders()})
  }

  getXml(cco:any, empresa:any):Observable<string>{
    return this.http.get(this.baseUrl+'verXml/'+cco+'/'+empresa,{headers:this.getHeaders(), responseType:'text'})
  }

  crearXml(cco:any, empresa:any):Observable<any>{
    return this.http.get(this.baseUrl+'creaXml/'+cco+'/empresa/'+empresa,{headers:this.getHeaders(), responseType:'text'})
  }

}
