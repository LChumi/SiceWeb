/*
 * Copyright (c) 2023. Luis Chumi
 * Este programa es software libre: usted puede redistribuirlo y/o modificarlo bajo los términos de la Licencia Pública General GNU
 */

export class ComprobElecGrande{
  cco_codigo: string='';
  xmlf_comprobante: string='';
  cco_fecha!: Date;
  xmlf_empresa: number=0;
  xmlf_mensaje:string='';
  xmlf_error:string='';
  xmlf_clave:string='';
  xml_tipoComprobante:number=0;
  cli_mail:string='';
  xmlf_caracter:string='';
  estado: string='';
  respuesta:string='';
}
