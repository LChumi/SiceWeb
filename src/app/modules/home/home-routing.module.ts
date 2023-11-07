import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InicioComponent} from "./components/inicio/inicio.component";
import {LoginComponent} from "./components/login/login.component";

const routes: Routes = [
      {path:'',component:InicioComponent},
      {path:'login',component:LoginComponent},
      {path:'',redirectTo:'inicio',pathMatch:'full'},
      {path:'**',redirectTo:'inicio'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
