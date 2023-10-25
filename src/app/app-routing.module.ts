import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes =[
  {
    path: 'CumlpeañosSice',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path:'**',
    redirectTo: '/CumlpeañosSice/inicio'
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class AppRoutingModule { }
