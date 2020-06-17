import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';

import {TrampaAmarillaNuevo} from '../../../DTO/local/TrampaAmarillaNuevo.dto';
import {TrampaAmarillaNubeBajada} from '../../../DTO/server/TrampaAmarillaNubeBajada';

@Injectable({
  providedIn: 'root'
})
export class TrampaAmarillaLocalService {

  db:SQLiteObject = null;

  constructor() {}

  setDatabase(db:SQLiteObject){
    if(this.db === null){
      this.db = db;
    }
  }

  createTable(){
    let sql = 'create table IF NOT EXISTS trampas_amarillas(id_local INTEGER PRIMARY KEY AUTOINCREMENT,id_trampa INTEGER NOT NULL,tipo TEXT NOT NULL,pais TEXT NOT NULL,num_trampa INTEGER NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,latitud REAL,longitud REAL,estado INTEGER NOT NULL,sincronizado INTEGER NOT NULL)';
    return this.db.executeSql(sql,[]);
  }

  getTrapsPage(pageNumber:number,rowsPerPage:number){
    let sql = 'SELECT * FROM trampas_amarillas limit ?,?';
    return new Promise((resolve,reject)=>{
        let offset = (pageNumber - 1) * rowsPerPage;
        this.db.executeSql(sql,[offset,rowsPerPage]).then((registrosTrampas)=>{

          let trapsPage = [];
          if (registrosTrampas.rows.length > 0) {
            for (var i = 0; i < registrosTrampas.rows.length; i++) { 
              trapsPage.push(registrosTrampas.rows.item(i));
            }
          }
          resolve(trapsPage);
        }).catch((e) => {
          reject(e);
        });
      
    });
  }

  getNoSincronizedTrapsPage(pageNumber:number,rowsPerPage:number){
    
    let sql = 'SELECT id_trampa,tipo,pais,num_trampa,finca_poblado,lote_propietario,latitud,longitud,estado FROM trampas_amarillas where sincronizado = ? limit ?,?';
    return new Promise((resolve,reject)=>{
        let offset = (pageNumber - 1) * rowsPerPage;
        this.db.executeSql(sql,[0,offset,rowsPerPage]).then((registrosTrampas)=>{

          let trapsPage = [];
          if (registrosTrampas.rows.length > 0) {
            for (var i = 0; i < registrosTrampas.rows.length; i++) { 
              trapsPage.push(registrosTrampas.rows.item(i));
            }
          }
          resolve(trapsPage);
        }).catch((e) => {
          reject(e);
        });
      
    });
  }

  countTraps():any{
    let sql = 'SELECT COUNT(*) AS cantidad FROM trampas_amarillas';
    return new Promise((resolve,reject) => {

      this.db.executeSql(sql,[]).then((data)=>{
        resolve(data.rows.item(0));
      }).catch((e) => {
        reject(e);
      });

    });
  }

  getPagesQuantity(rowsPerPage:number){
    return new Promise((resolve,reject)=>{
      this.countTraps().then((data)=>{
        let trapsQuantity = data.cantidad;

        if(trapsQuantity === 0){
          resolve(0);
        }

        let divisionResiduo = trapsQuantity % rowsPerPage;
        let divsionEntera = Math.trunc(trapsQuantity / rowsPerPage);

        let num_paginas = divsionEntera;

        if(divisionResiduo > 0){
            num_paginas += 1;
        }

        resolve(num_paginas);
      }).catch((error:any)=>{
        reject(error);
      });
    });
  }

  countNoSincronizedTraps(){
    let sql = 'SELECT COUNT(*) AS cantidad FROM trampas_amarillas where sincronizado = ?';
    return new Promise((resolve,reject) => {

      this.db.executeSql(sql,[0]).then((data)=>{
        resolve(data.rows.item(0));
      }).catch((e) => {
        reject(e);
      });

    });
  }

  getPagesQuantityForNoSincronizedTraps(rowsPerPage:number){
    return new Promise((resolve,reject)=>{
      this.countNoSincronizedTraps().then((data:any)=>{
        let trapsQuantity = data.cantidad;

        if(trapsQuantity === 0){
          resolve(0);
        }

        let divisionResiduo = trapsQuantity % rowsPerPage;
        let divsionEntera = Math.trunc(trapsQuantity / rowsPerPage);

        let num_paginas = divsionEntera;

        if(divisionResiduo > 0){
            num_paginas += 1;
        }
        resolve(num_paginas);
      }).catch((error:any)=>{
        reject(error);
      });
    });
  }

  insertAtrap(trap:TrampaAmarillaNuevo){
    let sql = 'INSERT INTO trampas_amarillas(id_trampa,num_trampa,tipo,pais,finca_poblado,lote_propietario,latitud,longitud,estado,sincronizado) VALUES (?,?,?,?,?,?,?,?,?,?)';
    return new Promise((resolve,reject) => {
      this.db.executeSql(sql,[trap.id_trampa,trap.num_trampa,trap.tipo,trap.pais,trap.finca_poblado,trap.lote_propietario,trap.latitud,trap.longitud,trap.estado,trap.sincronizado]).then(()=>{
        resolve(trap);
      }).catch((error) => {
        reject(error);
      });

    });
    
  }

  insertManyTraps(traps:TrampaAmarillaNubeBajada[]){

    let sql = 'INSERT INTO trampas_amarillas(id_trampa,tipo,pais,num_trampa,finca_poblado,lote_propietario,latitud,longitud,estado,sincronizado) VALUES (?,?,?,?,?,?,?,?,?,?)';
    let createTableQuery = 'create table IF NOT EXISTS trampas_amarillas(id_local INTEGER PRIMARY KEY AUTOINCREMENT,id_trampa INTEGER NOT NULL,tipo TEXT NOT NULL,pais TEXT NOT NULL,num_trampa INTEGER NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,latitud REAL,longitud REAL,estado INTEGER NOT NULL,sincronizado INTEGER NOT NULL)';
    return new Promise((resolve,reject) => {
      let generalStatement = [];
      generalStatement.push(createTableQuery);
      for(let i=0;i<traps.length;i++){
        let trap = traps[i];
        let valuesArray = [trap.ID_TRAMPA,trap.TIPO,trap.PAIS,trap.NUM_TRAMPA,trap.FINCA_POBLADO,trap.LOTE_PROPIETARIO,trap.LATITUD,trap.LONGITUD,trap.ESTADO,1];
        let insertionListStatement = [];
        insertionListStatement.push(sql);
        insertionListStatement.push(valuesArray);
        generalStatement.push(insertionListStatement);
      }

      this.db.sqlBatch(generalStatement).then(()=>{
        resolve(true);
      }).catch((error)=>{
        reject(error);
      });

    });

  }

  deleteAllInfo(){
    let sql = 'DELETE FROM trampas_amarillas';
    return new Promise((resolve,reject) => {
      this.db.executeSql(sql,[]).then(()=>{
        resolve(true);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  //devuelve lista con elemento o lista vacía.
  findAtrap(trapNumber:number){
    let sql = 'SELECT * FROM trampas_amarillas where num_trampa = ?';
    return new Promise((resolve,reject) => {
      this.db.executeSql(sql,[trapNumber]).then((data)=>{
        let trampasEncontradas = [];
        for(let i= 0;i<data.rows.length;i++){
          trampasEncontradas.push(data.rows.item(i));
        }
        resolve(trampasEncontradas);
      }).catch((error) => {
        reject(error);
      });
    });
  }

}
