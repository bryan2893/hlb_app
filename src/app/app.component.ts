import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {SQLite,SQLiteObject} from '@ionic-native/sqlite/ngx';

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
    private sqlite:SQLite
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.createDatabase();
    });
  }

  //En este método se crea la base de datos sqlite.
  createDatabase(){
    this.sqlite.create({name:'hlb_db.db',location:'default'}).then((db:SQLiteObject)=>{
      console.log("Base de datos creada!" + JSON.stringify(db));
    }).catch((error)=>{
      console.log(error);
    });
  }
}
