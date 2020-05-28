import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {SQLite,SQLiteObject} from '@ionic-native/sqlite/ngx';
import {Platform} from '@ionic/angular';
import Mantenimiento_Hlb from '../../../DTO/local/mantenimiento_hlb._guardado.dto';

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

  getHlbMantainPage(pageNumber:number,rowsPerPage:number){

    return new Promise((resolve,reject)=>{

      this.storage.executeSql('create table IF NOT EXISTS mantenimiento_hlb(id_local INTEGER PRIMARY KEY AUTOINCREMENT,id_original INTEGER NOT NULL,pais TEXT NOT NULL,tipo TEXT NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,latitud REAL,longitud REAL,estado INTEGER NOT NULL,sincronizado INTEGER)', [])
          .then(() => {
            let offset = (pageNumber - 1) * rowsPerPage;
            this.storage.executeSql('SELECT * FROM mantenimiento_hlb limit ?,?',[offset,rowsPerPage]).then((data)=>{

              let hlbMantainPage = [];
              if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) { 
                  hlbMantainPage.push(data.rows.item(i));
                }
              }
              resolve(hlbMantainPage);

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
      this.count_hlb_mantains().then((data)=>{
        let hlbMantainQuantity = data.cantidad;

        let divisionResiduo = hlbMantainQuantity % rowsPerPage;
        let divsionEntera = Math.trunc(hlbMantainQuantity / rowsPerPage);

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

  count_hlb_mantains():any{

    return new Promise((resolve,reject) => {
      this.storage.executeSql('create table IF NOT EXISTS mantenimiento_hlb(id_local INTEGER PRIMARY KEY AUTOINCREMENT,id_original INTEGER NOT NULL,pais TEXT NOT NULL,tipo TEXT NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,latitud REAL,longitud REAL,estado INTEGER NOT NULL,sincronizado INTEGER)', [])
          .then(() => {
            this.storage.executeSql('SELECT COUNT(*) AS cantidad FROM mantenimiento_hlb',[]).then((data)=>{
              resolve(data.rows.item(0));
            }).catch((e) => {
              reject(e);
            });
          }).catch((e) => {
            reject(e);
          });
    });

  }

  get_fake_hlb_mantains(){
    
    return new Promise((resolve,reject) => {
      this.storage.executeSql('create table IF NOT EXISTS mantenimiento_hlb(id_local INTEGER PRIMARY KEY AUTOINCREMENT,id_original INTEGER NOT NULL,pais TEXT NOT NULL,tipo TEXT NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,latitud REAL,longitud REAL,estado INTEGER NOT NULL,sincronizado INTEGER)', [])
          .then(() => {
            this.storage.executeSql('SELECT * FROM mantenimiento_hlb',[]).then((data)=>{
              let hlbMantains = [];
              if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) { 
                  hlbMantains.push(data.rows.item(i));
                }
              }
              resolve(hlbMantains);
            }).catch((e) => {
              reject(e);
            });
          }).catch((e) => {
            reject(e);
          });
    });

  }

  insertAnHlbMantain(hlbMantainRecord:Mantenimiento_Hlb){

    return new Promise((resolve,reject) => {

      this.storage.executeSql('create table IF NOT EXISTS mantenimiento_hlb(id_local INTEGER PRIMARY KEY AUTOINCREMENT,id_original INTEGER NOT NULL,pais TEXT NOT NULL,tipo TEXT NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,latitud REAL,longitud REAL,estado INTEGER NOT NULL,sincronizado INTEGER)', [])
          .then(() => {
            this.storage.executeSql('INSERT INTO mantenimiento_hlb VALUES (?,?,?,?,?,?,?,?,?,?)',[hlbMantainRecord.id_local,hlbMantainRecord.id_original,hlbMantainRecord.pais,hlbMantainRecord.tipo,hlbMantainRecord.finca_poblado,hlbMantainRecord.lote_propietario,hlbMantainRecord.latitud,hlbMantainRecord.longitud,hlbMantainRecord.estado,hlbMantainRecord.sincronizado]).then(()=>{
              resolve(hlbMantainRecord);
            }).catch((error) => {
              reject(error);
            });
          }).catch((error) => {
            reject(error);
          });
    });

  }

  insert_many_hlb_mantains(hlbMantains:Mantenimiento_Hlb[]){

    const createTableStatement = 'create table IF NOT EXISTS mantenimiento_hlb(id_local INTEGER PRIMARY KEY AUTOINCREMENT,id_original INTEGER NOT NULL,pais TEXT NOT NULL,tipo TEXT NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,latitud REAL,longitud REAL,estado INTEGER NOT NULL,sincronizado INTEGER)';
    const insertStatement = 'INSERT INTO mantenimiento_hlb VALUES (?,?,?,?,?,?,?,?,?,?)';
    let generalStatement = [];
    generalStatement.push(createTableStatement);
    for(let i=0;i<hlbMantains.length;i++){
      let hlbMantain = hlbMantains[i];
      let valuesArray = [hlbMantain.id_local,hlbMantain.id_original,hlbMantain.pais,hlbMantain.tipo,hlbMantain.finca_poblado,hlbMantain.lote_propietario,hlbMantain.latitud,hlbMantain.longitud,hlbMantain.estado,hlbMantain.sincronizado];
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

  getFincaPobladosByType(tipo:string){//tipo puede ser = 'traspatio', 'productor' ó 'ticofrut'
    return new Promise((resolve,reject) => {
      this.storage.executeSql('create table IF NOT EXISTS mantenimiento_hlb(id_local INTEGER PRIMARY KEY AUTOINCREMENT,id_original INTEGER NOT NULL,pais TEXT NOT NULL,tipo TEXT NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,latitud REAL,longitud REAL,estado INTEGER NOT NULL,sincronizado INTEGER)', [])
          .then(() => {
            this.storage.executeSql('SELECT DISTINCT finca_poblado FROM mantenimiento_hlb where tipo = ?',[tipo]).then((data)=>{
              let traspatios = [];
              if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) { 
                  traspatios.push(data.rows.item(i).finca_poblado);
                }
              }
              resolve(traspatios);
            }).catch((e) => {
              reject(e);
            });
          }).catch((e) => {
            reject(e);
          });
    });
  }

  getPropietariosLotesByFincaPobladoName(fincaPoblado:string){//fincaPoblado = alguna finca o poblado seleccionado por el usuario.
    return new Promise((resolve,reject) => {
      this.storage.executeSql('create table IF NOT EXISTS mantenimiento_hlb(id_local INTEGER PRIMARY KEY AUTOINCREMENT,id_original INTEGER NOT NULL,pais TEXT NOT NULL,tipo TEXT NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,latitud REAL,longitud REAL,estado INTEGER NOT NULL,sincronizado INTEGER)', [])
          .then(() => {
            this.storage.executeSql('SELECT lote_propietario FROM mantenimiento_hlb where finca_poblado = ?',[fincaPoblado]).then((data)=>{
              let lotesPropietarios = [];
              if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) { 
                  lotesPropietarios.push(data.rows.item(i).lote_propietario);
                }
              }
              resolve(lotesPropietarios);
            }).catch((e) => {
              reject(e);
            });
          }).catch((e) => {
            reject(e);
          });
    });
  }

}
