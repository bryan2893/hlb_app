import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';

import {InspeccionHlbNuevo} from '../../../DTO/local/InspeccionHlbNuevo';
import {InspeccionHlbNubeBajada} from '../../../DTO/server/InspeccionHlbNubeBajada';

@Injectable({
  providedIn: 'root'
})
export class InspeccionHlbLocalService {

  db:SQLiteObject = null;

  constructor() {}

  setDatabase(db:SQLiteObject){
    if(this.db === null){
      this.db = db;
    }
  }

  createTable(){
    let sql = 'create table IF NOT EXISTS inspecciones_hlb(id_local INTEGER PRIMARY KEY AUTOINCREMENT,id_inspec_hlb INTEGER NOT NULL,fecha_hora TEXT NOT NULL,codigo_responsable TEXT NOT NULL,nombre_responsable TEXT NOT NULL,tipo TEXT NOT NULL,pais TEXT NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,ciclo INTEGER NOT NULL,labor TEXT,categoria TEXT,variedad TEXT NOT NULL,sintomatologia INTEGER NOT NULL,estado INTEGER NOT NULL,diagnostico INTEGER NOT NULL,latitud REAL NOT NULL,longitud REAL NOT NULL,patron TEXT,calle INTEGER,direccion_calle TEXT,numero_arbol INTEGER,dir_arbol TEXT,notas TEXT NOT NULL,sincronizado INTEGER NOT NULL)';
    return this.db.executeSql(sql,[]);
  }

  getInspHlbPage(pageNumber:number,rowsPerPage:number){
    let sql = 'SELECT * FROM inspecciones_hlb limit ?,?';
    return new Promise((resolve,reject)=>{
        let offset = (pageNumber - 1) * rowsPerPage;
        this.db.executeSql(sql,[offset,rowsPerPage]).then((resgistrosInspHlb)=>{

          let inspHlbPage = [];
          if (resgistrosInspHlb.rows.length > 0) {
            for (var i = 0; i < resgistrosInspHlb.rows.length; i++) { 
              inspHlbPage.push(resgistrosInspHlb.rows.item(i));
            }
          }
          resolve(inspHlbPage);
        }).catch((e) => {
          reject(e);
        });
      
    });
  }

  getNoSincronizedInspHlbPage(pageNumber:number,rowsPerPage:number){
    
    let sql = 'SELECT id_inspec_hlb,fecha_hora,codigo_responsable,nombre_responsable,tipo,pais,finca_poblado,lote_propietario,ciclo,labor,categoria,variedad,sintomatologia,estado,diagnostico,latitud,longitud,patron,calle,direccion_calle,numero_arbol,dir_arbol,notas FROM trampas_amarillas where sincronizado = ? limit ?,?';
    return new Promise((resolve,reject)=>{
        let offset = (pageNumber - 1) * rowsPerPage;
        this.db.executeSql(sql,[0,offset,rowsPerPage]).then((registrosInspHlb)=>{

          let inspHlbPage = [];
          if (registrosInspHlb.rows.length > 0) {
            for (var i = 0; i < registrosInspHlb.rows.length; i++) { 
              inspHlbPage.push(registrosInspHlb.rows.item(i));
            }
          }
          resolve(inspHlbPage);
        }).catch((e) => {
          reject(e);
        });
      
    });
  }

  countHlbInspections():any{
    let sql = 'SELECT COUNT(*) AS cantidad FROM inspecciones_hlb';
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
      this.countHlbInspections().then((data:any)=>{
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

  countNoSincronizedHlbInspections(){
    let sql = 'SELECT COUNT(*) AS cantidad FROM inspecciones_hlb where sincronizado = ?';
    return new Promise((resolve,reject) => {

      this.db.executeSql(sql,[0]).then((data)=>{
        resolve(data.rows.item(0));
      }).catch((e) => {
        reject(e);
      });

    });
  }

  getPagesQuantityForNoSincronizedHlbInspections(rowsPerPage:number){
    return new Promise((resolve,reject)=>{
      this.countNoSincronizedHlbInspections().then((data:any)=>{
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

  insertAnHlbInspection(hlbInspection:InspeccionHlbNuevo){
    let sql = 'INSERT INTO inspecciones_hlb(id_inspec_hlb,fecha_hora,codigo_responsable,nombre_responsable,tipo,pais,finca_poblado,lote_propietario,ciclo,labor,categoria,variedad,sintomatologia,estado,diagnostico,latitud,longitud,patron,calle,direccion_calle,numero_arbol,dir_arbol,notas,sincronizado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    return new Promise((resolve,reject) => {

      
      if(hlbInspection.tipo === "traspatio"){
        this.db.executeSql(sql,[hlbInspection.id_inspec_hlb,hlbInspection.fecha_hora,hlbInspection.codigo_responsable,hlbInspection.tipo,hlbInspection.pais,hlbInspection.finca_poblado,hlbInspection.lote_propietario,hlbInspection.ciclo,hlbInspection.labor,hlbInspection.categoria,hlbInspection.variedad,hlbInspection.sintomatologia,hlbInspection.estado,hlbInspection.diagnostico,hlbInspection.latitud,hlbInspection.longitud,'na',0,'na',0,'na',hlbInspection.notas,hlbInspection.sincronizado]).then(()=>{
          resolve(hlbInspection);
        }).catch((error) => {
          reject(error);
        });
      }else{//Suponer que es tipo "ticofrut" o "productor"
        this.db.executeSql(sql,[hlbInspection.id_inspec_hlb,hlbInspection.fecha_hora,hlbInspection.codigo_responsable,hlbInspection.tipo,hlbInspection.pais,hlbInspection.finca_poblado,hlbInspection.lote_propietario,hlbInspection.ciclo,'na','na',hlbInspection.variedad,hlbInspection.sintomatologia,hlbInspection.estado,hlbInspection.diagnostico,hlbInspection.latitud,hlbInspection.longitud,hlbInspection.patron,hlbInspection.calle,hlbInspection.direccion_calle,hlbInspection.numero_arbol,hlbInspection.dir_arbol,hlbInspection.notas,hlbInspection.sincronizado]).then(()=>{
          resolve(hlbInspection);
        }).catch((error) => {
          reject(error);
        });
      }

    });
  }

  insertManyHlbInspections(inspHlbList:InspeccionHlbNubeBajada[]){

    console.log("Registros en insertManyHlbInp = "+ JSON.stringify(inspHlbList));

    let sql = 'INSERT INTO inspecciones_hlb(id_inspec_hlb,fecha_hora,codigo_responsable,nombre_responsable,tipo,pais,finca_poblado,lote_propietario,ciclo,labor,categoria,variedad,sintomatologia,estado,diagnostico,latitud,longitud,patron,calle,direccion_calle,numero_arbol,dir_arbol,notas,sincronizado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    let createTableQuery = 'create table IF NOT EXISTS inspecciones_hlb(id_local INTEGER PRIMARY KEY AUTOINCREMENT,id_inspec_hlb INTEGER NOT NULL,fecha_hora TEXT NOT NULL,codigo_responsable TEXT NOT NULL,nombre_responsable TEXT NOT NULL,tipo TEXT NOT NULL,pais TEXT NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,ciclo INTEGER NOT NULL,labor TEXT,categoria TEXT,variedad TEXT NOT NULL,sintomatologia INTEGER NOT NULL,estado INTEGER NOT NULL,diagnostico INTEGER NOT NULL,latitud REAL NOT NULL,longitud REAL NOT NULL,patron TEXT,calle INTEGER,direccion_calle TEXT,numero_arbol INTEGER,dir_arbol TEXT,notas TEXT NOT NULL,sincronizado INTEGER NOT NULL)';
    return new Promise((resolve,reject) => {
      let generalStatement = [];
      generalStatement.push(createTableQuery);
      for(let i=0;i<inspHlbList.length;i++){
        let hlbInspection = inspHlbList[i];
        let valuesArray = [hlbInspection.ID_INSPEC_HLB,hlbInspection.FECHA_HORA,hlbInspection.CODIGO_RESPONSABLE,hlbInspection.NOMBRE_RESPONSABLE,hlbInspection.TIPO,hlbInspection.PAIS,hlbInspection.FINCA_POBLADO,hlbInspection.LOTE_PROPIETARIO,hlbInspection.CICLO,hlbInspection.LABOR,hlbInspection.CATEGORIA,hlbInspection.VARIEDAD,hlbInspection.SINTOMATOLOGIA,hlbInspection.ESTADO,hlbInspection.DIAGNOSTICO,hlbInspection.LATITUD,hlbInspection.LONGITUD,hlbInspection.PATRON,hlbInspection.CALLE,hlbInspection.DIRECCION_CALLE,hlbInspection.NUMERO_ARBOL,hlbInspection.DIR_ARBOL,hlbInspection.NOTAS,1]
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
    let sql = 'DELETE FROM inspecciones_hlb';
    return new Promise((resolve,reject) => {
      this.db.executeSql(sql,[]).then(()=>{
        resolve(true);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  //devuelve lista con elemento o lista vacía.
  findHlbInspections(finca_poblado_o_lote_propietario:string){
    let sql = 'SELECT * FROM inspecciones_hlb where finca_poblado = ? OR lote_propietario = ?';
    return new Promise((resolve,reject) => {
      this.db.executeSql(sql,[finca_poblado_o_lote_propietario,finca_poblado_o_lote_propietario]).then((data)=>{
        let inspHlbEncontradas = [];
        for(let i= 0;i<data.rows.length;i++){
          inspHlbEncontradas.push(data.rows.item(i));
        }
        resolve(inspHlbEncontradas);
      }).catch((error) => {
        reject(error);
      });
    });
  }

}