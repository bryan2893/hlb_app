import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {SQLite,SQLiteObject} from '@ionic-native/sqlite/ngx';
import {TraspatioFincaLocalService} from './services/traspatios_fincas/TraspatioFincaLocal.service';
import {TrampaAmarillaLocalService} from './services/trampas_amarillas/TrampaAmarillaLocal.service';
import {InspeccionHlbLocalService} from './services/inspecciones_hlb/InspeccionHlbLocal.service';

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
    private inspeccionHlbLocaService:InspeccionHlbLocalService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      //this.splashScreen.hide();
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
}
