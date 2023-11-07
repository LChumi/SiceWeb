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
  private headers = new HttpHeaders({'Content-Type' : 'application/xml', 'Accept': 'application/xml'});

  constructor(private http:HttpClient) { }

  getComprobantes():Observable<ComprobElecGrande[]>{
    return this.http.get<ComprobElecGrande[]>(this.baseUrl+'listar');
  }

  getComprobantePorEmpresa(empresa:any):Observable<ComprobElecGrande[]>{
    return this.http.get<ComprobElecGrande[]>(this.baseUrl+'listaEmpresa/'+empresa)
  }

  getXml(cco:any, empresa:any):Observable<string>{
    return this.http.get(this.baseUrl+'verXml/'+cco+'/'+empresa,{headers:this.headers, responseType:'text'})
  }

}
