import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ComprobantesComponent} from "./components/comprobantes/comprobantes.component";

const routes: Routes = [
      {path:'monitoreo',component:ComprobantesComponent},
      {path:'',redirectTo:'monitoreo',pathMatch:'full'},
      {path:'**',redirectTo:'monitoreo'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
