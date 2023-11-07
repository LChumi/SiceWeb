import {Component, OnInit} from '@angular/core';
import {
  faArrowUp,
  faCheck, faFileCode,
  faFileInvoice,
  faFileLines,
  faSearch, faSeedling,
  faShareNodes, faStarOfLife,
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
  showModal:boolean=false;
  xml:any='';


  constructor(private comprobanteService:ComprobElecGrandeService,private soapService:SoapService) {}

  ngOnInit():void {
    this.mostrarTodosComprobantes()
  }

  //---------------------------------Metodos a nivel de base----------------------------
  isBuscando:boolean=false;
  mostrarTodosComprobantes():void{
    this.comprobanteService.getComprobantes().subscribe(
      (listaComprobantes:ComprobElecGrande[])=> {
        listaComprobantes.forEach(comprobante =>{
          this.obtenerEstado(comprobante);
          this.verRespuesta(comprobante);
        });
        this.listaComprobantes = listaComprobantes;
        this.filterComrpobantes=listaComprobantes;
        this.isBuscando=false
      },
      error => {
        console.error('No se pudo obtener la lista ',error)
        this.isBuscando=false
      },

    )
  }

  empresa:any
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
      },
      error => {
        console.error('No se pudo obtener la lista ',error)
        this.isBuscando=false;
      }
    )
  }

  mostrarXml(comprobante:ComprobElecGrande):void{
    this.comprobanteService.getXml(comprobante.cco_codigo,comprobante.xmlf_empresa).subscribe(
      (dato:any) =>{
        this.xml= dato;
        console.log(dato)
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

  //----------------------Metodos a nivel de aplicacion y funciones-----------------
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
  }

  selectComprobante(comprobante:ComprobElecGrande){
    this.selectedComprobante=comprobante
  }

  verOpciones(){
    this.showModal=true;
  }
  cerrarOpciones(){
    this.showModal=false;
  }

  protected readonly faFileInvoice = faFileInvoice;
  protected readonly faSearch = faSearch;
  protected readonly faFileLines = faFileLines;
  protected readonly faCheck = faCheck;
  protected readonly faWindowClose = faWindowClose;
  protected readonly faFileCode = faFileCode;
}
