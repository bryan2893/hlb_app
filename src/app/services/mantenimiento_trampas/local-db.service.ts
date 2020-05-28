import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {SQLite,SQLiteObject} from '@ionic-native/sqlite/ngx';
import {Platform} from '@ionic/angular';
import Mantenimiento_Trampa_Guardado from '../../../DTO/local/mantenimiento_trampa_guardado.dto';
import Mantenimiento_Trampa_Nuevo from '../../../DTO/local/mantenimiento_trampa_nuevo.dto';

@Injectable({
  providedIn: 'root'
})
export class LocalDbService {
  private storage: SQLiteObject;
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

  getTrapsPage(pageNumber:number,rowsPerPage:number){
    
    return new Promise((resolve,reject)=>{

      this.storage.executeSql('create table IF NOT EXISTS mantenimiento_trampas_amarillas(id_local INTEGER PRIMARY KEY,id_original INTEGER NOT NULL,num_trampa TEXT NOT NULL,tipo TEXT NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,latitud REAL,longitud REAL,estado INTEGER NOT NULL,sincronizado INTEGER)', [])
          .then(() => {
            let offset = (pageNumber - 1) * rowsPerPage;
            this.storage.executeSql('SELECT * FROM mantenimiento_trampas_amarillas limit ?,?',[offset,rowsPerPage]).then((data)=>{

              let trapsPage = [];
              if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) { 
                  trapsPage.push(data.rows.item(i));
                }
              }
              resolve(trapsPage);

            }).catch((e) => {
              reject(e);
            });
          }).catch((e) => {
            reject(e);
          });

    });

  }

  getPagesQuantity(rowsPerPage:number){
    return new Promise((resolve,reject)=>{
      this.count_traps().then((data)=>{
        let trapsQuantity = data.cantidad;

        let divisionResiduo = trapsQuantity % rowsPerPage;
        let divsionEntera = Math.trunc(trapsQuantity / rowsPerPage);

        let num_paginas = divsionEntera;

        if(divisionResiduo > 0){
            num_paginas += 1;
        }

        resolve(num_paginas);
      }).catch((error)=>{
        reject(error);
      });
    })
  }

  count_traps():any{

    return new Promise((resolve,reject) => {
      this.storage.executeSql('create table IF NOT EXISTS mantenimiento_trampas_amarillas(id_local INTEGER PRIMARY KEY,id_original INTEGER NOT NULL,num_trampa TEXT NOT NULL,tipo TEXT NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,latitud REAL,longitud REAL,estado INTEGER NOT NULL,sincronizado INTEGER)', [])
          .then(() => {
            this.storage.executeSql('SELECT COUNT(*) AS cantidad FROM mantenimiento_trampas_amarillas',[]).then((data)=>{
              resolve(data.rows.item(0));
            }).catch((e) => {
              reject(e);
            });
          }).catch((e) => {
            reject(e);
          });
    });

  }

  get_fake_traps(){
    
    return new Promise((resolve,reject) => {
      this.storage.executeSql('create table IF NOT EXISTS mantenimiento_trampas_amarillas(id_local INTEGER PRIMARY KEY,id_original INTEGER NOT NULL,num_trampa TEXT NOT NULL,tipo TEXT NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,latitud REAL,longitud REAL,estado INTEGER NOT NULL,sincronizado INTEGER)', [])
          .then(() => {
            this.storage.executeSql('SELECT * FROM mantenimiento_trampas_amarillas',[]).then((data)=>{
              let traps = [];
              if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) { 
                  traps.push(data.rows.item(i));
                }
              }
              resolve(traps);
            }).catch((e) => {
              reject(e);
            });
          }).catch((e) => {
            reject(e);
          });
    });

  }

  insertAtrap(trap:Mantenimiento_Trampa_Nuevo){

    return new Promise((resolve,reject) => {

      this.storage.executeSql('create table IF NOT EXISTS mantenimiento_trampas_amarillas(id_local INTEGER PRIMARY KEY AUTOINCREMENT,id_original INTEGER NOT NULL,num_trampa TEXT NOT NULL,tipo TEXT NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,latitud REAL,longitud REAL,estado INTEGER NOT NULL,sincronizado INTEGER)', [])
          .then(() => {
            this.storage.executeSql('INSERT INTO mantenimiento_trampas_amarillas(id_original,num_trampa,tipo,finca_poblado,lote_propietario,latitud,longitud,estado,sincronizado) VALUES (?,?,?,?,?,?,?,?,?)',[trap.id_original,trap.num_trampa,trap.tipo,trap.finca_poblado,trap.lote_propietario,trap.latitud,trap.longitud,trap.estado,trap.sincronizado]).then(()=>{
              resolve(trap);
            }).catch((error) => {
              reject(error);
            });
          }).catch((error) => {
            reject(error);
          });
    });
    
  }

  insert_many_traps(traps:Mantenimiento_Trampa_Guardado[]){

    const createTableStatement = 'CREATE TABLE IF NOT EXISTS mantenimiento_trampas_amarillas (id_local,id_original,num_trampa,tipo,finca_poblado,lote_propietario,latitud,longitud,estado,sincronizado)';
    const insertStatement = 'INSERT INTO mantenimiento_trampas_amarillas VALUES (?,?,?,?,?,?,?,?,?,?)';
    let generalStatement = [];
    generalStatement.push(createTableStatement);
    for(let i=0;i<traps.length;i++){
      let trap = traps[i];
      let valuesArray = [trap.id_local,trap.id_original,trap.num_trampa,trap.tipo,trap.finca_poblado,trap.lote_propietario,trap.latitud,trap.longitud,trap.estado,trap.sincronizado];
      let insertionListStatement = [];
      insertionListStatement.push(insertStatement);
      insertionListStatement.push(valuesArray);
      generalStatement.push(insertionListStatement);
    }

    return new Promise((resolve,reject) => {
      this.storage.sqlBatch(generalStatement).then(()=>{
        resolve(true);
      }).catch((error)=>{
        reject(error);
      });
    });
    
  }

}
