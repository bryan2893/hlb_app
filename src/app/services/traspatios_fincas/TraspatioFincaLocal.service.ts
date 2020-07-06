import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import {TraspatioFincaNuevo} from '../../../DTO/local/TraspatioFincaNuevo';
import {TraspatioFincaNubeBajada} from '../../../DTO/server/TraspatioFincaNubeBajada';

@Injectable({
  providedIn: 'root'
})
export class TraspatioFincaLocalService {

  db:SQLiteObject = null;

  constructor() {}

  setDatabase(db:SQLiteObject){
    if(this.db === null){
      this.db = db;
    }
  }

  createTable(){
    let sql = 'create table IF NOT EXISTS traspatios_fincas(id_local INTEGER PRIMARY KEY AUTOINCREMENT,id_traspatio_finca INTEGER NOT NULL,pais TEXT NOT NULL,tipo TEXT NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,latitud REAL,longitud REAL,estado INTEGER NOT NULL,sincronizado INTEGER NOT NULL)';
    return this.db.executeSql(sql,[]);
  }

  getTraspatiosFincasPage(pageNumber:number,rowsPerPage:number){

    let sql = 'SELECT * FROM traspatios_fincas limit ?,?';
    return new Promise((resolve,reject)=>{

          let offset = (pageNumber - 1) * rowsPerPage;
          this.db.executeSql(sql,[offset,rowsPerPage]).then((data)=>{

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

    });
    
  }

  getAllTraspatiosFincas(){

    let sql = 'SELECT * FROM traspatios_fincas';
    return new Promise((resolve,reject)=>{

          
          this.db.executeSql(sql,[]).then((data)=>{

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

    });
    
  }

  getNoSincronizedTraspatiosFincasPage(pageNumber:number,rowsPerPage:number){
    
    let sql = 'SELECT id_traspatio_finca,pais,tipo,finca_poblado,lote_propietario,latitud,longitud,estado FROM traspatios_fincas where sincronizado = ? limit ?,?';
    return new Promise((resolve,reject)=>{

          let offset = (pageNumber - 1) * rowsPerPage;
          this.db.executeSql(sql,[0,offset,rowsPerPage]).then((registrosTraspatiosFincas)=>{

            let trapsPage = [];
            if (registrosTraspatiosFincas.rows.length > 0) {
              for (var i = 0; i < registrosTraspatiosFincas.rows.length; i++) { 
                trapsPage.push(registrosTraspatiosFincas.rows.item(i));
              }
            }
            resolve(trapsPage);
          }).catch((e) => {
            reject(e);
          });
      
    });
  }

  countTraspatiosFincas():any{

    let sql = 'SELECT COUNT(*) AS cantidad FROM traspatios_fincas';
    return new Promise((resolve,reject) => {

      this.db.executeSql(sql,[]).then((data)=>{
        resolve(data.rows.item(0));
      }).catch((error) => {
        reject(error);
      });

    });

  }

  getPagesQuantity(rowsPerPage:number){
    return new Promise((resolve,reject)=>{
      this.countTraspatiosFincas().then((data:any)=>{
        let hlbMantainQuantity = data.cantidad;

        if(hlbMantainQuantity === 0){
          resolve(0);
        }

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

  countNoSincronizedTraspatiosFincas(){
    let sql = 'SELECT COUNT(*) AS cantidad FROM traspatios_fincas where sincronizado = ?';
    return new Promise((resolve,reject) => {

      this.db.executeSql(sql,[0]).then((data)=>{
        resolve(data.rows.item(0));
      }).catch((e) => {
        reject(e);
      });

    });
  }

  getPagesQuantityForNoSincronizedTraspatiosFincas(rowsPerPage:number){
    return new Promise((resolve,reject)=>{
      this.countNoSincronizedTraspatiosFincas().then((data:any)=>{
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

  insertATraspatioFinca(traspatioFincaRecord:TraspatioFincaNuevo){

    let sql = 'INSERT INTO traspatios_fincas(id_traspatio_finca,pais,tipo,finca_poblado,lote_propietario,latitud,longitud,estado,sincronizado) VALUES (?,?,?,?,?,?,?,?,?)';
    return new Promise((resolve,reject) => {

      this.db.executeSql(sql,[traspatioFincaRecord.id_traspatio_finca,traspatioFincaRecord.pais,traspatioFincaRecord.tipo,traspatioFincaRecord.finca_poblado,traspatioFincaRecord.lote_propietario,traspatioFincaRecord.latitud,traspatioFincaRecord.longitud,traspatioFincaRecord.estado,traspatioFincaRecord.sincronizado]).then(()=>{
              resolve(traspatioFincaRecord);
            }).catch((error) => {
              reject(error);
            });
    });
    
  }

  updateATraspatioFinca(id_local:string,traspatioFincaRecord:TraspatioFincaNuevo){

    let sql = 'UPDATE traspatios_fincas set tipo = ?, finca_poblado = ?,lote_propietario = ?,latitud = ?,longitud = ?,estado = ?,sincronizado = ? WHERE id_local = ?';
    return new Promise((resolve,reject) => {

      this.db.executeSql(sql,[traspatioFincaRecord.tipo,traspatioFincaRecord.finca_poblado,traspatioFincaRecord.lote_propietario,traspatioFincaRecord.latitud,traspatioFincaRecord.longitud,traspatioFincaRecord.estado,traspatioFincaRecord.sincronizado,id_local]).then(()=>{
              resolve(traspatioFincaRecord);
            }).catch((error) => {
              reject(error);
            });
    });

  }

  insertManyTraspatiosFincas(hlbMantains:TraspatioFincaNubeBajada[]){

    let createTableQuery = 'create table IF NOT EXISTS traspatios_fincas(id_local INTEGER PRIMARY KEY AUTOINCREMENT,id_traspatio_finca INTEGER NOT NULL,pais TEXT NOT NULL,tipo TEXT NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,latitud REAL,longitud REAL,estado INTEGER NOT NULL,sincronizado INTEGER NOT NULL)';
    let sql = 'INSERT INTO traspatios_fincas(id_traspatio_finca,pais,tipo,finca_poblado,lote_propietario,latitud,longitud,estado,sincronizado) VALUES (?,?,?,?,?,?,?,?,?)';
    return new Promise((resolve,reject) => {
          let generalStatement = [];
          generalStatement.push(createTableQuery);
          for(let i=0;i<hlbMantains.length;i++){
            let hlbMantain = hlbMantains[i];
            let valuesArray = [hlbMantain.ID_TRASPATIO_FINCA,hlbMantain.PAIS,hlbMantain.TIPO,hlbMantain.FINCA_POBLADO,hlbMantain.LOTE_PROPIETARIO,hlbMantain.LATITUD,hlbMantain.LONGITUD,hlbMantain.ESTADO,1];
            let insertionListStatement = [];
            insertionListStatement.push(sql);
            insertionListStatement.push(valuesArray);
            generalStatement.push(insertionListStatement);
          }

          this.db.sqlBatch(generalStatement).then((data)=>{
            resolve(data);
          }).catch((error)=>{
            reject(error);
          });
    });

  }

  getTraspatiosFincasByType(tipo:string){//tipo puede ser = 'traspatio', 'productor' ó 'ticofrut'
    let sql = 'SELECT DISTINCT finca_poblado FROM traspatios_fincas where tipo = ?';
    return new Promise((resolve,reject) => {
      this.db.executeSql(sql,[tipo]).then((data)=>{
        let fincasPoblados = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) { 
            fincasPoblados.push(data.rows.item(i).finca_poblado);
          }
        }
        resolve(fincasPoblados);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  getPropietariosLotesByFincaPobladoName(fincaPoblado:string){//fincaPoblado = nombre de una finca o poblado.
    let sql = 'SELECT lote_propietario FROM traspatios_fincas where finca_poblado = ?';
    return new Promise((resolve,reject) => {
      this.db.executeSql(sql,[fincaPoblado]).then((data)=>{
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
    });
  }

  deleteAllInfo(){
    let sql = 'DELETE FROM traspatios_fincas';
    return new Promise((resolve,reject) => {
      this.db.executeSql(sql,[]).then(()=>{
        resolve(true);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  findTraspatiosFincas(finca_poblado_o_lote_propietario_o_tipo:string){
    let sql = 'SELECT * FROM traspatios_fincas where finca_poblado = ? OR lote_propietario = ? OR tipo = ?';
    return new Promise((resolve,reject) => {
      this.db.executeSql(sql,[finca_poblado_o_lote_propietario_o_tipo,finca_poblado_o_lote_propietario_o_tipo,finca_poblado_o_lote_propietario_o_tipo]).then((data)=>{
        let traspatiosFincasEncontrados = [];
        for(let i= 0;i<data.rows.length;i++){
          traspatiosFincasEncontrados.push(data.rows.item(i));
        }
        resolve(traspatiosFincasEncontrados);
      }).catch((error) => {
        reject(error);
      });
    });
  }

}
