import {Directive, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appEstadoColor]'
})
export class EstadoColorDirective implements OnChanges{

  @Input() appEstadoColor:string='';

  constructor(private el:ElementRef){}

  ngOnChanges(changes: SimpleChanges) {
    this.setColor()
  }

  setColor(){
    switch (this.appEstadoColor.toLowerCase()) {
      case 'autorizado':
        this.el.nativeElement.style.color='green';
        break;
      case 'devuelto':
        this.el.nativeElement.style.color='red'
    }
  }

}
