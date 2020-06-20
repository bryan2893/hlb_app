import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {SQLite,SQLiteObject} from '@ionic-native/sqlite/ngx';
import {TraspatioFincaLocalService} from './services/traspatios_fincas/TraspatioFincaLocal.service';
import {TrampaAmarillaLocalService} from './services/trampas_amarillas/TrampaAmarillaLocal.service';
import {InspeccionHlbLocalService} from './services/inspecciones_hlb/InspeccionHlbLocal.service';
import {DateService} from './services/date/date.service';
import {AlmacenamientoNativoService} from './services/almacenamiento-interno/almacenamiento-nativo.service';
import {UserService} from './services/user/user.service';

//PROBANDO
import {Device} from '@ionic-native/device/ngx';

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
    private dateService:DateService,
    private almacenamientoNativoService:AlmacenamientoNativoService,
    private userService:UserService
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
    }).then(()=>{
      //Create first table
      return this.traspatioFincaLocalService.createTable();
    }).then(()=>{
      return this.trampaAmarillasLocalService.createTable();
    }).then(()=>{
      return this.inspeccionHlbLocaService.createTable();
    }).then(()=>{
      this.splashScreen.hide();
    }).catch((error)=>{
      console.log("Error:"+error.message);
    });
  }

  //En este método se registra la fecha en que la aplicación arranco por primera vez.
  //
  setFirstDate(){
    this.almacenamientoNativoService.almacenarFechaDeSincronizacion(this.dateService.getCurrentDateOnly()).then((result)=>{
      console.log("se almacenó la fecha: "+result);
    }).catch((error)=>{
      console.log(error);
    });
  }

  setDefaultUser(){
    this.almacenamientoNativoService.almacenarUsuarioPorDefault({fullName:"Default User HLB APP",username:"aa",password:'aa',permissions:['super usuario'],token:''}).then((usuario)=>{
      console.log("Usuario por defecto almacenado!");
    }).catch((error)=>{
      console.log("Error al intentar almacenar usuario por defecto "+ error);
    });
  }

  //Esta funcion es para loguear a un usuario y no tener que estar haciendolo cada vez que se entra a la aplcacion mienstras se desarrolla.
  logueoPaPruebas(){
    let user = {
      fullName:"super usuario",
      username:"bhernandeza",
      password:"casajaja",
      permissions:['super administrador'],
      token:""
    }
    this.userService.setLogedUser(user);
  }

}
