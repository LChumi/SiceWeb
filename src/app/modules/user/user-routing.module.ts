import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ComprobantesComponent} from "./components/comprobantes/comprobantes.component";

const routes: Routes = [
      {path:'comprobantes',component:ComprobantesComponent},
      {path:'',redirectTo:'comprobantes',pathMatch:'full'},
      {path:'**',redirectTo:'comprobantes'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
