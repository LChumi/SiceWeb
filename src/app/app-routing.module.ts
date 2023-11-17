import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {authGuard} from "./core/guards/auth.guard";

const routes: Routes = [
  {
    path: 'Cumpleaños', // Ruta principal 'Cumpleaños'
    children: [ // Rutas secundarias bajo 'Cumpleaños'
      {
        path: 'inicio',
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'sice',
        canActivate:[authGuard],
        loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
      },
      {
        path: '', // Ruta predeterminada bajo 'Cumpleaños' (por ejemplo, /Cumpleaños/)
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
      {
        path: '**', // Cualquier otra ruta no reconocida bajo 'Cumpleaños' (por ejemplo, /Cumpleaños/otra)
        redirectTo: 'inicio'
      }
    ]
  },
  {
    path: '', // Ruta predeterminada en caso de acceso directo a / (por ejemplo, /inicio)
    redirectTo: 'Cumpleaños/',
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
