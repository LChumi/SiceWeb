import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InicioComponent} from "./components/inicio/inicio.component";

const routes: Routes = [
  {
    path:'',
    children:[
      {path:'inicio',component:InicioComponent},
      {path:'**',redirectTo:'inicio'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
