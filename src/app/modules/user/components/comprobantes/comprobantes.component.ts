import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
  faCheck, faFileCode,
  faFileInvoice,
  faFileLines, faLockOpen,
  faSearch,
  faWindowClose
} from "@fortawesome/free-solid-svg-icons";
import {ComprobElecGrande} from "../../../../core/models/ComprobElecGrande";
import {ComprobElecGrandeService} from "../../services/comprob-elec-grande.service";
import {SoapService} from "../../services/soap.service";
import {finalize} from "rxjs";


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

  constructor(private comprobanteService:ComprobElecGrandeService,private soapService:SoapService,private cdr:ChangeDetectorRef) {}

  ngOnInit():void {
    this.mostrarTodosComprobantes()
  }

  //---------------------------------Metodos a nivel de base----------------------------
  mostrarTodosComprobantes():void{
    this.loading=true;
    this.comprobanteService.getComprobantes()
      .pipe(finalize(()=> this.loading=false))
      .subscribe(
        (listaComprobantes:ComprobElecGrande[])=> {
          this.actualizarListaComprobantes(listaComprobantes);
        },
        error => {
          console.error('No se puede obtener la lista ',error);
          this.listaComprobantes=[];
          this.totalComprobantes=0;
        }
      );
  }
  mostrarComprobantesEmpresa():void{
    this.loading=true;
    this.comprobanteService.getComprobantePorEmpresa(this.empresa)
      .pipe(finalize(()=> this.loading=false))
      .subscribe(
        (listaComprobantes:ComprobElecGrande[])=> {
          this.actualizarListaComprobantes(listaComprobantes);
        },
        error => {
          console.error('No se puede obtener la lista ',error)
          this.listaComprobantes=[];
          this.totalComprobantes=0;
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
    console.log(this.pAutorizacion)
    await this.verificarComprobante(this.selectedComprobante);

    setTimeout(async () =>{
      this.closeNotification();
      this.verAutorizacion(this.selectedComprobante);
      await this.obtenerEstado(this.selectedComprobante)
      await this.verRespuesta(this.selectedComprobante);
    },3000);
  }
  async comprobantesListados(lista:ComprobElecGrande[]): Promise<void> {
    this.loading=true;

    for (const comprobante of lista){
      await this.obtenerEstadosAsync(comprobante);
    }
    this.loading=false;
  }

  async obtenerEstadosAsync(comprobante :ComprobElecGrande): Promise<void> {
    return new Promise<void> ( (resolve)=>{
      this.obtenerEstado(comprobante);
      this.verRespuesta(comprobante);
      this.cdr.detectChanges(); //forzar la deteccion de cambios
      resolve();
    });
  }
  //-------------------------Metodos a nivel de aplicacion y funciones--------------------
  private actualizarListaComprobantes(listaComprobantes:ComprobElecGrande[]){
    this.comprobantesListados(listaComprobantes);//metodos soap
    this.listaComprobantes = listaComprobantes;//se agrega la lista que llega del servicio a nuestra variable
    this.filterComrpobantes = listaComprobantes;//cuando se filtran el array[] se guarda para poder buscar
    this.totalComprobantes = listaComprobantes.length;//se usa para mandar a mostrar el total de documentos
  }
  listarComprobantes():void{
    if (this.empresa !== undefined){
      if (this.empresa === 'Todos'){
        this.mostrarTodosComprobantes();
      } else {
        this.mostrarComprobantesEmpresa();
      }
    }
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

  //----------------------Iconos Fontawesome-----------------
  protected readonly faFileInvoice = faFileInvoice;
  protected readonly faSearch = faSearch;
  protected readonly faFileLines = faFileLines;
  protected readonly faCheck = faCheck;
  protected readonly faWindowClose = faWindowClose;
  protected readonly faFileCode = faFileCode;
  protected readonly faLockOpen = faLockOpen;
}
