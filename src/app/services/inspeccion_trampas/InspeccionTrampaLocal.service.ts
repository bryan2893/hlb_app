import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';

import {InspeccionTrampaNuevo} from '../../../DTO/local/InspeccionTrampaNuevo';
import {InspeccionTrampaNubeBajada} from '../../../DTO/server/InspeccionTrampaNubeBajada';
import {InspeccionHlbGuardado} from '../../../DTO/local/InspeccionHlbGuardado';

@Injectable({
  providedIn: 'root'
})
export class InspeccionTrampaLocalService {

  db:SQLiteObject = null;

  constructor() {}

  setDatabase(db:SQLiteObject){
    if(this.db === null){
      this.db = db;
    }
  }


  createTable(){
    let sql = 'create table IF NOT EXISTS inspecciones_trampas(id_local INTEGER PRIMARY KEY AUTOINCREMENT,id_inspec_tramp INTEGER NOT NULL,fecha_hora TEXT NOT NULL,codigo_responsable TEXT NOT NULL,nombre_responsable TEXT NOT NULL,tipo TEXT NOT NULL,pais TEXT NOT NULL,num_trampa INTEGER NOT NULL,latitud_trampa REAL NOT NULL,longitud_trampa REAL NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,cantidad_total INTEGER NOT NULL,diagnostico INTEGER NOT NULL,cantidad_diagnostico INTEGER NOT NULL,notas TEXT NOT NULL,sincronizado INTEGER NOT NULL)';
    return this.db.executeSql(sql,[]);
  }

  getInspTrampaPage(pageNumber:number,rowsPerPage:number){
    let sql = 'SELECT * FROM inspecciones_trampas limit ?,?';
    return new Promise((resolve,reject)=>{
        let offset = (pageNumber - 1) * rowsPerPage;
        this.db.executeSql(sql,[offset,rowsPerPage]).then((registrosInspTrampas)=>{

          let inspTrampaPage = [];
          if (registrosInspTrampas.rows.length > 0) {
            for (var i = 0; i < registrosInspTrampas.rows.length; i++) { 
              inspTrampaPage.push(registrosInspTrampas.rows.item(i));
            }
          }
          resolve(inspTrampaPage);
        }).catch((e) => {
          reject(e);
        });
      
    });
  }

  getNoSincronizedInspTrampasPage(pageNumber:number,rowsPerPage:number){
    
    let sql = 'SELECT id_inspec_tramp,fecha_hora,codigo_responsable,nombre_responsable,tipo,pais,num_trampa,latitud_trampa,longitud_trampa,finca_poblado,lote_propietario,cantidad_total,diagnostico,cantidad_diagnostico,notas FROM inspecciones_trampas where sincronizado = ? limit ?,?';
    return new Promise((resolve,reject)=>{
        let offset = (pageNumber - 1) * rowsPerPage;
        this.db.executeSql(sql,[0,offset,rowsPerPage]).then((registrosInspTrampas)=>{

          let inspTrampasPage = [];
          if (registrosInspTrampas.rows.length > 0) {
            for (var i = 0; i < registrosInspTrampas.rows.length; i++) { 
              inspTrampasPage.push(registrosInspTrampas.rows.item(i));
            }
          }
          resolve(inspTrampasPage);
        }).catch((e) => {
          reject(e);
        });
      
    });
  }

  countTrapsInspections():any{
    let sql = 'SELECT COUNT(*) AS cantidad FROM inspecciones_trampas';
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
      this.countTrapsInspections().then((data:any)=>{
        let hlbInspectionsQuantity = data.cantidad;

        if(hlbInspectionsQuantity === 0){
          resolve(0);
        }

        let divisionResiduo = hlbInspectionsQuantity % rowsPerPage;
        let divsionEntera = Math.trunc(hlbInspectionsQuantity / rowsPerPage);

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

  countNoSincronizedTrapsInspections(){
    let sql = 'SELECT COUNT(*) AS cantidad FROM inspecciones_trampas where sincronizado = ?';
    return new Promise((resolve,reject) => {

      this.db.executeSql(sql,[0]).then((data)=>{
        resolve(data.rows.item(0));
      }).catch((e) => {
        reject(e);
      });

    });
  }

  getPagesQuantityForNoSincronizedTrapsInspections(rowsPerPage:number){
    return new Promise((resolve,reject)=>{
      this.countNoSincronizedTrapsInspections().then((data:any)=>{
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

  insertATrapInspection(trapInspection:InspeccionTrampaNuevo){
    let sql = 'INSERT INTO inspecciones_trampas(id_inspec_tramp,fecha_hora,codigo_responsable,nombre_responsable,tipo,pais,num_trampa,latitud_trampa,longitud_trampa,finca_poblado,lote_propietario,cantidad_total,diagnostico,cantidad_diagnostico,notas,sincronizado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    return new Promise((resolve,reject) => {

      this.db.executeSql(sql,[trapInspection.id_inspec_tramp,trapInspection.fecha_hora,trapInspection.codigo_responsable,trapInspection.nombre_responsable,trapInspection.tipo,trapInspection.pais,trapInspection.num_trampa,trapInspection.latitud_trampa,trapInspection.longitud_trampa,trapInspection.finca_poblado,trapInspection.lote_propietario,trapInspection.cantidad_total,trapInspection.diagnostico,trapInspection.cantidad_diagnostico,trapInspection.notas,trapInspection.sincronizado]).then(()=>{
        resolve(trapInspection);
      }).catch((error) => {
        reject(new Error("Error intentando ingresar un registro de inspeccion trampa amarilla en sqlite: "+error.message));
      });

    });
  }

  updateAnTrapInspection(id_local:string,trapInspection:InspeccionTrampaNuevo){
    let sql = 'UPDATE inspecciones_trampas SET tipo = ?,pais = ?,num_trampa = ?,latitud_trampa = ?,longitud_trampa = ?,finca_poblado = ?,lote_propietario = ?,cantidad_total = ?,diagnostico = ?,cantidad_diagnostico = ?,notas = ?,sincronizado = ? WHERE id_local = ?';
    return new Promise((resolve,reject) => {
      
      this.db.executeSql(sql,[trapInspection.tipo,trapInspection.pais,trapInspection.num_trampa,trapInspection.latitud_trampa,trapInspection.longitud_trampa,trapInspection.finca_poblado,trapInspection.lote_propietario,trapInspection.cantidad_total,trapInspection.diagnostico,trapInspection.cantidad_diagnostico,trapInspection.notas,trapInspection.sincronizado,id_local]).then(()=>{
        resolve(trapInspection);
      }).catch((error) => {
        reject(new Error("Error intentando actualiar un registro de inspeccion trampa amarilla en sqlite: "+error.message));
      });
    });
  }

  insertManyTrapInspections(trapsInspecList:InspeccionTrampaNubeBajada[]){

    let sql = 'INSERT INTO inspecciones_trampas(id_inspec_tramp,fecha_hora,codigo_responsable,nombre_responsable,tipo,pais,num_trampa,latitud_trampa,longitud_trampa,finca_poblado,lote_propietario,cantidad_total,diagnostico,cantidad_diagnostico,notas,sincronizado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    let createTableQuery = 'create table IF NOT EXISTS inspecciones_trampas(id_local INTEGER PRIMARY KEY AUTOINCREMENT,id_inspec_tramp INTEGER NOT NULL,fecha_hora TEXT NOT NULL,codigo_responsable TEXT NOT NULL,nombre_responsable TEXT NOT NULL,tipo TEXT NOT NULL,pais TEXT NOT NULL,num_trampa INTEGER NOT NULL,latitud_trampa REAL NOT NULL,longitud_trampa REAL NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,cantidad_total INTEGER NOT NULL,diagnostico INTEGER NOT NULL,cantidad_diagnostico INTEGER NOT NULL,notas TEXT NOT NULL,sincronizado INTEGER NOT NULL)';
    return new Promise((resolve,reject) => {
      let generalStatement = [];
      generalStatement.push(createTableQuery);
      for(let i=0;i<trapsInspecList.length;i++){
        let trapInspection = trapsInspecList[i];
        let valuesArray = [trapInspection.ID_INSPEC_TRAMP,trapInspection.FECHA_HORA,trapInspection.CODIGO_RESPONSABLE,trapInspection.NOMBRE_RESPONSABLE,trapInspection.TIPO,trapInspection.PAIS,trapInspection.NUM_TRAMPA,trapInspection.LATITUD_TRAMPA,trapInspection.LONGITUD_TRAMPA,trapInspection.FINCA_POBLADO,trapInspection.LOTE_PROPIETARIO,trapInspection.CANTIDAD_TOTAL,trapInspection.DIAGNOSTICO,trapInspection.CANTIDAD_DIAGNOSTICO,trapInspection.NOTAS,1]
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
    let sql = 'DELETE FROM inspecciones_trampas';
    return new Promise((resolve,reject) => {
      this.db.executeSql(sql,[]).then(()=>{
        resolve(true);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  //devuelve lista con elemento o lista vacía.
  findTrapInspections(finca_poblado_o_lote_propietario:string){
    let sql = 'SELECT * FROM inspecciones_trampas where finca_poblado = ? OR lote_propietario = ?';
    return new Promise((resolve,reject) => {
      this.db.executeSql(sql,[finca_poblado_o_lote_propietario,finca_poblado_o_lote_propietario]).then((data)=>{
        let inspTrampasEncontrados = [];
        for(let i= 0;i<data.rows.length;i++){
          inspTrampasEncontrados.push(data.rows.item(i));
        }
        resolve(inspTrampasEncontrados);
      }).catch((error) => {
        reject(error);
      });
    });
  }
  
}
