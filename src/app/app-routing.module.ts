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
      {
        path: '', // Ruta predeterminada 'cumple' (por ejemplo, /cumple/)
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
      {
        path: '**', // Cualquier otra ruta no reconocida bajo 'cumple' (por ejemplo, /cumple/otra)
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '', // Ruta predeterminada en caso de acceso directo a / (por ejemplo, /inicio)
    redirectTo: 'cumple/',
    pathMatch: 'full'
  }
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
