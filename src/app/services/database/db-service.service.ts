import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {SQLite,SQLiteObject} from '@ionic-native/sqlite/ngx';
import {Platform} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {
  public storage: SQLiteObject;
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite,private platform: Platform) { 

    this.platform.ready().then(()=>{
      this.sqlite.create({name:'hlb_db.db',location:'default'}).then((db:SQLiteObject)=>{
        this.storage = db;
        this.isDbReady.next(true);
      });

    }).catch((error) => {
      alert(error.message);
    });
    
  }
  
  isDatabaseReady(){
    return this.isDbReady.asObservable();
  }

}
