import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {authGuard} from "./core/guards/auth.guard";

const routes: Routes = [
  {
    path: 'cumple', // Ruta principal 'cumple'
    children: [ // Rutas secundarias seguidas de 'cumple'
      {
        path: 'inicio',
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'comprobantes',
        canActivate:[authGuard],
        loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
      },
      {path: '', redirectTo: 'inicio', pathMatch: 'full'},
      {path: '**', redirectTo: 'inicio', pathMatch: 'full'}
    ]
  },
  {path: '', redirectTo: 'cumple/inicio', pathMatch: 'full'},
  {path: '**', redirectTo: 'cumple/inicio', pathMatch: 'full'}
];

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
