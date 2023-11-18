import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
  faCheck, faFileCode,
  faFileInvoice,
  faFileLines, faHomeAlt, faLockOpen, faRightFromBracket,
  faSearch,
  faWindowClose
} from "@fortawesome/free-solid-svg-icons";
import {ComprobElecGrande} from "../../../../core/models/ComprobElecGrande";
import {ComprobElecGrandeService} from "../../services/comprob-elec-grande.service";
import {SoapService} from "../../services/soap.service";
import {concatMap, from, of, takeUntil, tap} from "rxjs";
import {Router} from "@angular/router";
import {AuthenticationReqService} from "../../../home/services/authentication-req.service";

@Component({
  selector: 'app-comprobantes',
  templateUrl: './comprobantes.component.html',
  styleUrls: ['./comprobantes.component.css']
})
export class ComprobantesComponent implements OnInit{

  selectedComprobante!:ComprobElecGrande;
  listaComprobantes:ComprobElecGrande[]=[];

  searchText: string = '';
  searchDoc:string='';
  searchEst:string='';
  filterComrpobantes: ComprobElecGrande[]=[];
  totalComprobantes:number=0;
  loading:boolean=false;
  empresa:any

  showModal:boolean=false;
  xml:any='';

  notificacionVisible:boolean=false;
  notificacionMensaje:string='';

  botonBloqueado:boolean=false;
  botonBloq:boolean=false;

  pAutorizacion:string='';
  pVerificar:string='';
  token:any='';

  constructor(private comprobanteService:ComprobElecGrandeService,private authService:AuthenticationReqService,private soapService:SoapService,private cdr:ChangeDetectorRef,private route:Router) {}

  ngOnInit():void {
    this.mostrarTodosComprobantes();
  }

  //---------------------------------Metodos a nivel de base----------------------------
  mostrarTodosComprobantes():void{
    this.loading=true;
    this.comprobanteService.getComprobantes().subscribe(
        (listaComprobantes:ComprobElecGrande[])=> {
            this.cargarEstados(listaComprobantes);
          this.actualizarListas(listaComprobantes);
        },
        error => {
          console.error('No se puede obtener la lista ')
          this.listaComprobantes=[];
          this.totalComprobantes=0;
        }
      );
  }
  mostrarComprobantesEmpresa():void{
    this.loading=true;
    this.comprobanteService.getComprobantePorEmpresa(this.empresa)
      .subscribe(
        (listaComprobantes:ComprobElecGrande[])=> {
          this.cargarEstados(listaComprobantes);
          this.actualizarListas(listaComprobantes);
        },
        error => {
          console.error('No se puede obtener la lista ',error)
          this.listaComprobantes=[];
          this.totalComprobantes=0;
          this.loading = false;
        }
      );
  }

  mostrarXml(comprobante:ComprobElecGrande):void{
    this.xml=''
    this.comprobanteService.getXml(comprobante.cco_codigo,comprobante.xmlf_empresa).subscribe(
      (dato:any) =>{
        this.xml= dato;
      }
    )
  }

  //-*--------------------------------Metodos SOAP------------------------------
  verRespuesta(comprobante:ComprobElecGrande){
    this.soapService.verRespuesta(comprobante.xmlf_clave).subscribe(
      (respuesta:string)=>{
        comprobante.respuesta=respuesta
      }
    );
  }

  obtenerEstado(comprobante: ComprobElecGrande): Promise<void> {
    return new Promise<void>((resolve) => {
      this.soapService.obtenerEstado(comprobante.xmlf_clave).subscribe(
        (estado: string) => {
          comprobante.estado = estado;
          resolve();
        },
        (error) => {
          console.error('Error al obtener estado ', error);
          resolve();
        }
      );
    });
  }

  verAutorizacion(comprobante:ComprobElecGrande){
    this.botonBloq=true;
    this.soapService.verAutorizacion(comprobante.xmlf_clave).subscribe(
      (autorizacion:string)=>{
        if (autorizacion===comprobante.xmlf_clave){
          this.pAutorizacion='Comprobante Autorizado'
        }else{
          this.pAutorizacion=autorizacion
        }
      }
    )
  }

  verificarComprobante(comprobante:ComprobElecGrande){
    this.botonBloqueado=true;
    this.soapService.verificarComprobante(comprobante.xmlf_clave).subscribe(
      (verificacion:string)=>{
        this.pVerificar=verificacion
      }
    )
  }

  renviarComprobante(comprobante:ComprobElecGrande){
    this.soapService.enviarComrpobante(this.xml,comprobante.cli_mail,comprobante.xml_tipoComprobante).subscribe(
      response =>{
        this.verificarComprobante(this.selectedComprobante);
        this.showNotification('Reenvio satisfactorio ' + response)
      },
      error=>{
        console.error('No se pudo reenviar',error);
      }
    )
  }

  //-------------------------Metodos asincronos--------------------
  async  showNotification(message:string){
    this.notificacionMensaje=message;
    this.notificacionVisible=true;
    await this.verificarComprobante(this.selectedComprobante);

    setTimeout(async () =>{
      this.closeNotification();
      this.verAutorizacion(this.selectedComprobante);
      await this.obtenerEstado(this.selectedComprobante)
      await this.verRespuesta(this.selectedComprobante);
    },3000);
  }
  async cargarEstados(lista:ComprobElecGrande[]): Promise<void> {
    try {
      await Promise.all(lista.map(comprobante => this.obtenerEstadosAsync(comprobante)))
    }catch (error){
      console.error(error, 'Ocurrio un problema al cargar estados ')
    }finally {
      this.loading = false;
    }
  }

  async obtenerEstadosAsync(comprobante :ComprobElecGrande): Promise<void> {
    try {
      await this.obtenerEstado(comprobante);
      await this.verRespuesta(comprobante);
      this.cdr.detectChanges(); // forzar la detección de cambios
    }catch (error){
      console.error(error)
    }
  }
  //-------------------------Metodos a nivel de aplicacion y funciones--------------------
  listarComprobantes():void{
    if (this.empresa !== undefined){
      if (this.empresa === 'Todos'){
        this.mostrarTodosComprobantes();
      } else {
        this.mostrarComprobantesEmpresa();
      }
    }
  }

  actualizarListas(listaComprobantes:ComprobElecGrande[]){
    this.listaComprobantes = listaComprobantes;
    this.filterComrpobantes = listaComprobantes;
    this.totalComprobantes = listaComprobantes.length;
  }
  searchComprobantes(){
    this.listaComprobantes = this.filterComrpobantes.filter((comprobante)=>
      comprobante.xmlf_comprobante.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.totalComprobantes=this.listaComprobantes.length
  }
  searchComprobantesTipo(){
    this.listaComprobantes = this.filterComrpobantes.filter((comprobante)=>
      comprobante.xmlf_comprobante.toLowerCase().includes(this.searchDoc.toLowerCase())
    );
    this.totalComprobantes=this.listaComprobantes.length
  }
  searchComprobantesEstado(){
    this.listaComprobantes = this.filterComrpobantes.filter((comprobante)=> {
      if (comprobante.estado !==null && comprobante.estado !== undefined){
        return comprobante.estado.toLowerCase().includes(this.searchEst.toLowerCase());
      }
      return false;
      });
    this.totalComprobantes=this.listaComprobantes.length
  }
  selectComprobante(comprobante:ComprobElecGrande){
    this.selectedComprobante=comprobante
  }
  guardarCambios(comprobante:ComprobElecGrande){
    const modalBody=document.querySelector(".modal-body");
    if (modalBody){
      this.xml=modalBody.textContent;
      this.renviarComprobante(comprobante);
    }
  }

  //----------------------logica presentacion modals notifications-----------------
 closeNotification(){
    this.notificacionVisible=false;
 }
  verOpciones(){
    this.limpiarP()
    this.showModal=true;
  }
  cerrarOpciones(){
    this.showModal=false;
    this.botonBloq=false;
  }
  limpiarP(){
    this.pAutorizacion=''
    this.pVerificar=''
  }

  toInicio(){
    this.route.navigate(['Cumpleaños/inicio'])
  }

  //----------------------Iconos Fontawesome-----------------
  protected readonly faFileInvoice = faFileInvoice;
  protected readonly faSearch = faSearch;
  protected readonly faCheck = faCheck;
  protected readonly faWindowClose = faWindowClose;
  protected readonly faFileCode = faFileCode;
  protected readonly faLockOpen = faLockOpen;
  protected readonly faHomeAlt = faHomeAlt;
}
