import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
  faArrowRotateRight,
  faFileCode,
  faFileInvoice,
  faHomeAlt,
  faSearch,
  faWindowClose
} from "@fortawesome/free-solid-svg-icons";
import {ComprobElecGrande} from "../../../../core/models/ComprobElecGrande";
import {ComprobElecGrandeService} from "../../services/comprob-elec-grande.service";
import {SoapService} from "../../services/soap.service";
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
  filterComrpobantes: ComprobElecGrande[]=[];
  totalComprobantes:number=0;
  loading:boolean=false;
  empresa:any

  showModal:boolean=false;
  xml:any='';

  notificacionVisible:boolean=false;
  notificacionMensaje:string='';

  botonBloq:boolean=false;
  isResend:boolean=false;

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
    this.comprobanteService.getComprobantes().subscribe({
      next: listaComprobantes => {
        this.actualizarListas(listaComprobantes);
      },
      error: err => {
        console.error('No se puede obtener la lista ')
        this.listaComprobantes = [];
        this.totalComprobantes = 0;
        this.loading = false;
      }
    });
  }
  mostrarComprobantesEmpresa():void{
    this.loading=true;
    this.comprobanteService.getComprobantePorEmpresa(this.empresa)
      .subscribe({
        next: listaComprobantes=> {
          this.actualizarListas(listaComprobantes);
        },
        error: err => {
          console.error('No se puede obtener la lista ',err)
          this.listaComprobantes=[];
          this.totalComprobantes=0;
          this.loading = false;
        }
      });
  }

  mostrarXml(comprobante:ComprobElecGrande):void{
    this.xml=''
    this.comprobanteService.getXml(comprobante.cco_codigo,comprobante.xmlf_empresa).subscribe(
      (dato:any) =>{
        this.xml= dato;
      }
    )
  }

  crearXml(comprobante:ComprobElecGrande):void{
    this.isResend=true
    this.comprobanteService.crearXml(comprobante.cco_codigo,comprobante.xmlf_empresa).subscribe({
      next: data => {
        if (data === 'ok'){
          this.mostrarXml(comprobante)
          this.isResend=false;
        } else {
          this.notificacionVisible=true;
          this.notificacionMensaje=data;
          this.cdr.detectChanges();
        }
      }
      }
    )
  }


  reenviarComprobante(comprobante:ComprobElecGrande){
    this.isResend=true
    this.soapService.reenviarComprobante(comprobante.xmlf_caracter,comprobante.cli_mail).subscribe(
      (verificacion:string)=>{
        this.pVerificar=verificacion
        this.isResend=false;
      }
    )
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
    this.loading = false;
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

  selectComprobante(comprobante:ComprobElecGrande){
    this.selectedComprobante=comprobante
  }
  guardarCambios(comprobante:ComprobElecGrande){
    const modalBody=document.querySelector(".modal-body");
    if (modalBody){
      this.xml=modalBody.textContent;
      //this.renviarComprobante(comprobante);
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
  protected readonly faWindowClose = faWindowClose;
  protected readonly faFileCode = faFileCode;
  protected readonly faHomeAlt = faHomeAlt;
  protected readonly faArrowRotateRight = faArrowRotateRight;
}
