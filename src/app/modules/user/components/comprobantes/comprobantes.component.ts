import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {
  faCheck, faFileCode,
  faFileInvoice,
  faFileLines,
  faSearch,
  faWindowClose
} from "@fortawesome/free-solid-svg-icons";
import {ComprobElecGrande} from "../../../../core/models/ComprobElecGrande";
import {ComprobElecGrandeService} from "../../services/comprob-elec-grande.service";
import {SoapService} from "../../services/soap.service";


@Component({
  selector: 'app-comprobantes',
  templateUrl: './comprobantes.component.html',
  styleUrls: ['./comprobantes.component.css']
})
export class ComprobantesComponent implements OnInit{

  selectedComprobante!:ComprobElecGrande;
  listaComprobantes:ComprobElecGrande[]=[];

  searchText: string = '';
  filterComrpobantes: ComprobElecGrande[]=[];
  totalComprobantes:number=0;
  isBuscando:boolean=false;
  empresa:any

  showModal:boolean=false;
  xml:any='';

  notificacionVisible:boolean=false;
  notificacionMensaje:string='';

  botonBloqueado:boolean=false;

  constructor(private comprobanteService:ComprobElecGrandeService,private soapService:SoapService,private render:Renderer2) {}

  ngOnInit():void {
    this.mostrarTodosComprobantes()
  }

  //---------------------------------Metodos a nivel de base----------------------------

  mostrarTodosComprobantes():void{
    this.comprobanteService.getComprobantes().subscribe(
      (listaComprobantes:ComprobElecGrande[])=> {
        listaComprobantes.forEach(comprobante =>{
          this.obtenerEstado(comprobante);
        });
        this.listaComprobantes = listaComprobantes;
        this.filterComrpobantes=listaComprobantes;
        this.isBuscando=false
        this.totalComprobantes=listaComprobantes.length
      },
      error => {
        console.error('No se pudo obtener la lista ',error)
        this.isBuscando=false
      },

    )
  }


  mostrarComprobantesEmpresa():void{
    this.isBuscando=true;
    this.comprobanteService.getComprobantePorEmpresa(this.empresa).subscribe(
      (listaComprobantes:ComprobElecGrande[])=> {
        listaComprobantes.forEach(comprobante =>{
          this.obtenerEstado(comprobante);
          this.verRespuesta(comprobante);
        });
        this.listaComprobantes = listaComprobantes
        this.isBuscando=false;
        this.totalComprobantes=listaComprobantes.length
      },
      error => {
        console.error('No se pudo obtener la lista ',error)
        this.isBuscando=false;
      }
    )
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
      },
      error => {
        console.error('Error al obtener respuesta ', error)
      }
    );
  }

  obtenerEstado(comprobante:ComprobElecGrande){
    this.soapService.obtenerEstado(comprobante.xmlf_clave).subscribe(
      (estado: string) => {
        comprobante.estado=estado;
      },
      error => {
        console.error('Error al obtener estado ',error)
      }
    );
  }

  verAutorizacion(comprobante:ComprobElecGrande){
    this.soapService.verAutorizacion(comprobante.xmlf_clave).subscribe(
      (autorizacion:string)=>{
        console.log(autorizacion)
      }
    )
  }

  verificarComprobante(comprobante:ComprobElecGrande){
    this.soapService.verificarComprobante(comprobante.xmlf_clave).subscribe(
      (verificacion:string)=>{
        console.log(verificacion)
      }
    )
  }

  renviarComprobante(comprobante:ComprobElecGrande){
    this.botonBloqueado=true;
    console.log(comprobante.cli_mail,comprobante.xml_tipoComprobante)
    this.soapService.enviarComrpobante(this.xml,comprobante.cli_mail,comprobante.xml_tipoComprobante).subscribe(
      response =>{
        console.log(response)
        this.showNotification('Reenvio satisfactorio ' + response)
        this.verificarComprobante(this.selectedComprobante);
      },
      error=>{
        console.error('No se pudo reenviar');
        this.botonBloqueado=false;
      },
      ()=>{
        setTimeout(()=>{
          this.botonBloqueado=false;
        },5000)
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

  actualizar(comprobante:ComprobElecGrande){
    this.verAutorizacion(comprobante);
    this.obtenerEstado(comprobante)
  }

  searchComprobantes(){
    this.listaComprobantes = this.filterComrpobantes.filter((comprobante)=>
      comprobante.xmlf_comprobante.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.totalComprobantes=this.listaComprobantes.length
  }
  searchComprobantesTipo(){
    this.listaComprobantes = this.filterComrpobantes.filter((comprobante)=>
      comprobante.xmlf_comprobante.toLowerCase().includes(this.searchText.toLowerCase())
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
      console.log(this.xml);
      this.renviarComprobante(comprobante);
    }
  }

 showNotification(message:string){
    this.notificacionMensaje=message;
    this.notificacionVisible=true;
   this.verificarComprobante(this.selectedComprobante);
   this.verAutorizacion(this.selectedComprobante);

    setTimeout(() =>{
      this.closeNotification();
      this.obtenerEstado(this.selectedComprobante)
      this.verRespuesta(this.selectedComprobante);
    },3000);
 }
 closeNotification(){
    this.notificacionVisible=false;
 }

  verOpciones(){
    this.verRespuesta(this.selectedComprobante);
    this.showModal=true;
  }
  cerrarOpciones(){
    this.showModal=false;
  }




  //----------------------Iconos Fontawesome-----------------
  protected readonly faFileInvoice = faFileInvoice;
  protected readonly faSearch = faSearch;
  protected readonly faFileLines = faFileLines;
  protected readonly faCheck = faCheck;
  protected readonly faWindowClose = faWindowClose;
  protected readonly faFileCode = faFileCode;
}
