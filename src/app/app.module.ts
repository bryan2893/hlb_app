import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {SQLite} from '@ionic-native/sqlite/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {GoogleMaps} from '@ionic-native/google-maps/ngx';
import {HTTP} from '@ionic-native/http/ngx';
import { Device } from '@ionic-native/device/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    NativeStorage,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    GoogleMaps,
    HTTP,
    Device
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
