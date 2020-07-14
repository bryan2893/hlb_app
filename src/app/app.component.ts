import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {SQLite,SQLiteObject} from '@ionic-native/sqlite/ngx';
import {TraspatioFincaLocalService} from './services/traspatios_fincas/TraspatioFincaLocal.service';
import {TrampaAmarillaLocalService} from './services/trampas_amarillas/TrampaAmarillaLocal.service';
import {InspeccionHlbLocalService} from './services/inspecciones_hlb/InspeccionHlbLocal.service';
import {InspeccionTrampaLocalService} from './services/inspeccion_trampas/InspeccionTrampaLocal.service';
import {DateService} from './services/date/date.service';
import {AlmacenamientoNativoService} from './services/almacenamiento-interno/almacenamiento-nativo.service';
import {AuthService} from './services/auth/auth.service';
import {ACTIONS} from '../constants/user_actions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private sqlite:SQLite,
    private traspatioFincaLocalService:TraspatioFincaLocalService,
    private trampaAmarillasLocalService:TrampaAmarillaLocalService,
    private inspeccionHlbLocaService:InspeccionHlbLocalService,
    private inspeccionTrampaLocalService:InspeccionTrampaLocalService,
    private dateService:DateService,
    private almacenamientoNativoService:AlmacenamientoNativoService,
    private authService:AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      //this.splashScreen.hide();
      this.setDefaultUser();
      this.logueoPaPruebas();
      this.setFirstDate();
      this.createDatabase();
    });
  }

  //En este método se crea la base de datos sqlite.
  createDatabase(){
    this.sqlite.create({name:'hlb_db.db',location:'default'}).then((db:SQLiteObject)=>{
      console.log("Base de datos creada!" + JSON.stringify(db));
      this.traspatioFincaLocalService.setDatabase(db);
      this.trampaAmarillasLocalService.setDatabase(db);
      this.inspeccionHlbLocaService.setDatabase(db);
      this.inspeccionTrampaLocalService.setDatabase(db);
    }).then(()=>{
      //Create first table
      return this.traspatioFincaLocalService.createTable();
    }).then(()=>{
      return this.trampaAmarillasLocalService.createTable();
    }).then(()=>{
      return this.inspeccionHlbLocaService.createTable();
    }).then(()=>{
      return this.inspeccionTrampaLocalService.createTable();
    }).then(()=>{
      this.splashScreen.hide();
    }).catch((error)=>{
      console.log("Error:"+error.message);
    });
  }

  //En este método registra la fecha en que la aplicación arrancó por primera vez.
  setFirstDate(){
    this.almacenamientoNativoService.almacenarFechaDeSincronizacion(this.dateService.getCurrentDateOnly()).then((result)=>{
      console.log("se almacenó la fecha: "+ result);
    }).catch((error)=>{
      console.log(error);
    });
  }

  //Se almacena usuario por defecto para la aplicacion.
  setDefaultUser(){
    this.almacenamientoNativoService.almacenarUsuarioPorDefault({fullName:"AREA TI",username:"areati",password:'areati',actions:[ACTIONS.ACCESO_A_CONFIGURACIONES,ACTIONS.LEER_REGISTROS_TRAMPAS,
      ACTIONS.EDITAR_REGISTROS_TRAMPAS,ACTIONS.AGREGAR_REGISTROS_TRAMPAS,ACTIONS.LEER_REGISTROS_TRASPATIOS_FINCAS,
      ACTIONS.EDITAR_REGISTROS_TRASPATIOS_FINCAS,ACTIONS.AGREGAR_REGISTROS_TRASPATIOS_FINCAS,
      ACTIONS.LEER_REGISTROS_INSP_TRASPATIOS_FINCAS,ACTIONS.EDITAR_REGISTROS_INSP_TRASPATIOS_FINCAS,ACTIONS.AGREGAR_REGISTROS_INSP_TRASPATIOS_FINCAS,
      ACTIONS.LEER_REGISTROS_INSP_TRAMPAS,ACTIONS.EDITAR_REGISTROS_INSP_TRAMPAS,ACTIONS.AGREGAR_REGISTROS_INSP_TRAMPAS,ACTIONS.EDITAR_MARCA_A_INSPECCION
  ],token:''}).then((usuario)=>{
      console.log("Usuario por defecto almacenado!");
    }).catch((error)=>{
      console.log("Error al intentar almacenar usuario por defecto "+ error);
    });
  }

  //Esta funcion es para loguear a un usuario y no tener que estar haciendolo cada vez que se entra a la aplcacion mienstras se desarrolla.
  logueoPaPruebas(){
    let user = {
      fullName:"BRYAN HERNANDEZ ARGUELLO",
      username:"bhernandeza",
      password:"Az123456",
      actions:[/*ACTIONS.ACCESO_A_CONFIGURACIONES,*/ACTIONS.LEER_REGISTROS_TRAMPAS,
        /*ACTIONS.EDITAR_REGISTROS_TRAMPAS,ACTIONS.AGREGAR_REGISTROS_TRAMPAS,*/ACTIONS.LEER_REGISTROS_TRASPATIOS_FINCAS,
        /*ACTIONS.EDITAR_REGISTROS_TRASPATIOS_FINCAS,*//*ACTIONS.AGREGAR_REGISTROS_TRASPATIOS_FINCAS,*/
        ACTIONS.LEER_REGISTROS_INSP_TRASPATIOS_FINCAS,ACTIONS.EDITAR_REGISTROS_INSP_TRASPATIOS_FINCAS,/*ACTIONS.AGREGAR_REGISTROS_INSP_TRASPATIOS_FINCAS,*/
        ACTIONS.LEER_REGISTROS_INSP_TRAMPAS/*,ACTIONS.EDITAR_REGISTROS_INSP_TRAMPAS*//*,ACTIONS.AGREGAR_REGISTROS_INSP_TRAMPAS*/,ACTIONS.EDITAR_MARCA_A_INSPECCION
    ],
      token:""
    }
    this.authService.setLogedUser(user);
  }

}
