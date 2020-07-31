import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {DataResolverService} from './services/data/data-resolver.service';
import {PreviousUrlResolver} from './services/data/previous-url-resolver.service';
import {LoginPageGuardService} from './guards/login-page-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    pathMatch:'full',
    canActivate:[LoginPageGuardService]
  },
  {
    path: 'main',
    loadChildren: () => import('./main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'menu-inspecciones',
    loadChildren: () => import('./menu-inspecciones/menu-inspecciones.module').then( m => m.MenuInspeccionesPageModule)
  },
  {
    path: 'menu-mantenimientos',
    loadChildren: () => import('./menu-mantenimientos/menu-mantenimientos.module').then( m => m.MenuMantenimientosPageModule)
  },
  {
    path: 'main-trampas-amarillas',
    loadChildren: () => import('./main-trampas-amarillas/main-trampas-amarillas.module').then( m => m.MainTrampasAmarillasPageModule)
  },
  {
    path: 'agregar-trampa',
    resolve:{
      data: DataResolverService
    },
    loadChildren: () => import('./agregar-trampa/agregar-trampa.module').then( m => m.AgregarTrampaPageModule)
  },
  {
    path: 'main-mante-hlb',
    loadChildren: () => import('./main-mante-hlb/main-mante-hlb.module').then( m => m.MainManteHlbPageModule)
  },
  {
    path: 'agregar-mante-hlb',
    resolve:{
      data: DataResolverService
    },
    loadChildren: () => import('./agregar-mante-hlb/agregar-mante-hlb.module').then( m => m.AgregarManteHlbPageModule)
  },
  
  {
    path: 'map-viewer',
    resolve:{
      data: PreviousUrlResolver
    },
    loadChildren: () => import('./map-viewer/map-viewer.module').then( m => m.MapViewerPageModule)
  },
  {
    path: 'fincas-poblados',
    loadChildren: () => import('./modals/fincas-poblados/fincas-poblados.module').then( m => m.FincasPobladosPageModule)
  },
  {
    path: 'main-inspeccion-hlb',
    loadChildren: () => import('./main-inspeccion-hlb/main-inspeccion-hlb.module').then( m => m.MainInspeccionHlbPageModule)
  },
  {
    path: 'main-inspeccion-trampa',
    loadChildren: () => import('./main-inspeccion-trampa/main-inspeccion-trampa.module').then( m => m.MainInspeccionTrampaPageModule)
  },
  {
    path: 'agregar-inspeccion-hlb',
    resolve:{
      data: DataResolverService
    },
    loadChildren: () => import('./agregar-inspeccion-hlb/agregar-inspeccion-hlb.module').then( m => m.AgregarInspeccionHlbPageModule)
  },
  {
    path: 'ver-editar-inspeccion-hlb',
    resolve:{
      data: DataResolverService
    },
    loadChildren: () => import('./ver-editar-inspeccion-hlb/ver-editar-inspeccion-hlb.module').then( m => m.VerEditarInspeccionHlbPageModule)
  },
  {
    path: 'ver-editar-trampa-amarilla',
    resolve:{
      data: DataResolverService
    },
    loadChildren: () => import('./ver-editar-trampa-amarilla/ver-editar-trampa-amarilla.module').then( m => m.VerEditarTrampaAmarillaPageModule)
  },
  {
    path: 'ver-editar-traspatio-finca',
    resolve:{
      data: DataResolverService
    },
    loadChildren: () => import('./ver-editar-traspatio-finca/ver-editar-traspatio-finca.module').then( m => m.VerEditarTraspatioFincaPageModule)
  },
  {
    path: 'agregar-inspeccion-trampa',
    loadChildren: () => import('./agregar-inspeccion-trampa/agregar-inspeccion-trampa.module').then( m => m.AgregarInspeccionTrampaPageModule)
  },
  {
    path: 'ver-editar-inspeccion-trampa',
    resolve:{
      data: DataResolverService
    },
    loadChildren: () => import('./ver-editar-inspeccion-trampa/ver-editar-inspeccion-trampa.module').then( m => m.VerEditarInspeccionTrampaPageModule)
  },
  {
    path: 'busqueda-traspatios-gps',
    resolve:{
      data: DataResolverService
    },
    loadChildren: () => import('./busqueda-traspatios-gps/busqueda-traspatios-gps.module').then( m => m.BusquedaTraspatiosGpsPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }