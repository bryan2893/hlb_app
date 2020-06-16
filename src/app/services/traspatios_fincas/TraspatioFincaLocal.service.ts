import { Injectable } from '@angular/core';
import {DbServiceService} from '../database/db-service.service';
import {TraspatioFincaNuevo} from '../../../DTO/local/TraspatioFincaNuevo';
import {TraspatioFincaNubeBajada} from '../../../DTO/server/TraspatioFincaNubeBajada';

@Injectable({
  providedIn: 'root'
})
export class TraspatioFincaLocalService {
  private createTableQuery = 'create table IF NOT EXISTS traspatios_fincas(id_local INTEGER PRIMARY KEY AUTOINCREMENT,id_traspatio_finca INTEGER NOT NULL,pais TEXT NOT NULL,tipo TEXT NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,latitud REAL,longitud REAL,estado INTEGER NOT NULL,sincronizado INTEGER NOT NULL)';

  constructor(private dbService: DbServiceService) {}

  getTraspatiosFincasPage(pageNumber:number,rowsPerPage:number){

    return new Promise((resolve,reject)=>{
      this.dbService.isDatabaseReady().subscribe((isDataBaseReady)=>{
        if(isDataBaseReady){
          this.dbService.storage.executeSql(this.createTableQuery, [])
          .then(() => {
            let offset = (pageNumber - 1) * rowsPerPage;
            this.dbService.storage.executeSql('SELECT * FROM traspatios_fincas limit ?,?',[offset,rowsPerPage]).then((data)=>{

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
        }else{

        }
      });
          
    });
    
  }

  getNoSincronizedTraspatiosFincasPage(pageNumber:number,rowsPerPage:number){
    
    return new Promise((resolve,reject)=>{
      this.dbService.isDatabaseReady().subscribe((dbIsReady)=>{
        if(dbIsReady){

          this.dbService.storage.executeSql(this.createTableQuery, [])
          .then(() => {
            let offset = (pageNumber - 1) * rowsPerPage;
            this.dbService.storage.executeSql('SELECT id_traspatio_finca,pais,tipo,finca_poblado,lote_propietario,latitud,longitud,estado FROM traspatios_fincas where sincronizado = ? limit ?,?',[0,offset,rowsPerPage]).then((registrosTraspatiosFincas)=>{

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
          }).catch((e) => {
            reject(e);
          });
        }
        else{
          reject({message:"La base de datos no se ha creado aún!"});
        }
      });
      
    });
  }

  getPagesQuantity(rowsPerPage:number){
    return new Promise((resolve,reject)=>{
      this.countTraspatiosFincas().then((data:any)=>{
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

  countTraspatiosFincas():any{

    return new Promise((resolve,reject) => {

      this.dbService.isDatabaseReady().subscribe((isDataBaseReady)=>{
        if(isDataBaseReady){
          this.dbService.storage.executeSql(this.createTableQuery, [])
          .then(() => {
            this.dbService.storage.executeSql('SELECT COUNT(*) AS cantidad FROM traspatios_fincas',[]).then((data)=>{
              resolve(data.rows.item(0));
            }).catch((e) => {
              reject(e);
            });
          }).catch((e) => {
            reject(e);
          });
        }else{
          reject(new Error("La base de datos no se ha creado aún!"));
        }
      });

    });

  }

  countNoSincronizedTraspatiosFincas(){
    return new Promise((resolve,reject) => {

      this.dbService.isDatabaseReady().subscribe((dbIsReady)=>{
        if(dbIsReady){
          this.dbService.storage.executeSql(this.createTableQuery, [])
          .then(() => {
            this.dbService.storage.executeSql('SELECT COUNT(*) AS cantidad FROM traspatios_fincas where sincronizado = ?',[0]).then((data)=>{
              resolve(data.rows.item(0));
            }).catch((e) => {
              reject(e);
            });
          }).catch((e) => {
            reject(e);
          });
        }else{
          reject({message:"La base de datos no se ha creado aún!"});
        }
      });

    });
  }

  insertATraspatioFinca(traspatioFincaRecord:TraspatioFincaNuevo){

    return new Promise((resolve,reject) => {

      this.dbService.isDatabaseReady().subscribe((isDataBaseReady)=>{
        if(isDataBaseReady){
          this.dbService.storage.executeSql(this.createTableQuery, [])
          .then(() => {
            this.dbService.storage.executeSql('INSERT INTO traspatios_fincas(id_traspatio_finca,pais,tipo,finca_poblado,lote_propietario,latitud,longitud,estado,sincronizado) VALUES (?,?,?,?,?,?,?,?,?)',[traspatioFincaRecord.id_traspatio_finca,traspatioFincaRecord.pais,traspatioFincaRecord.tipo,traspatioFincaRecord.finca_poblado,traspatioFincaRecord.lote_propietario,traspatioFincaRecord.latitud,traspatioFincaRecord.longitud,traspatioFincaRecord.estado,traspatioFincaRecord.sincronizado]).then(()=>{
              resolve(traspatioFincaRecord);
            }).catch((error) => {
              reject(error);
            });
          }).catch((error) => {
            reject(error);
          });
        }else{
          reject(new Error("La base de datos no se ha creado aún!"));
        }
      });
      
    });

  }

  insertManyTraspatiosFincas(hlbMantains:TraspatioFincaNubeBajada[]){

    return new Promise((resolve,reject) => {
      

      this.dbService.isDatabaseReady().subscribe((isDataBaseReady)=>{
        if(isDataBaseReady){

          const insertStatement = 'INSERT INTO traspatios_fincas(id_traspatio_finca,pais,tipo,finca_poblado,lote_propietario,latitud,longitud,estado,sincronizado) VALUES (?,?,?,?,?,?,?,?,?)';
          let generalStatement = [];
          generalStatement.push(this.createTableQuery);
          for(let i=0;i<hlbMantains.length;i++){
            let hlbMantain = hlbMantains[i];
            let valuesArray = [hlbMantain.ID_TRASPATIO_FINCA,hlbMantain.PAIS,hlbMantain.TIPO,hlbMantain.FINCA_POBLADO,hlbMantain.LOTE_PROPIETARIO,hlbMantain.LATITUD,hlbMantain.LONGITUD,hlbMantain.ESTADO,1];
            let insertionListStatement = [];
            insertionListStatement.push(insertStatement);
            insertionListStatement.push(valuesArray);
            generalStatement.push(insertionListStatement);
          }

          this.dbService.storage.sqlBatch(generalStatement).then(()=>{
            resolve(true);
          }).catch((error)=>{
            reject(error);
          });

        }else{
          reject(new Error("La base de datos no se ha creado aún!"));
        }

      });

    });

  }

  getFincaPobladosByType(tipo:string){//tipo puede ser = 'traspatio', 'productor' ó 'ticofrut'
    return new Promise((resolve,reject) => {
      this.dbService.storage.executeSql(this.createTableQuery, [])
          .then(() => {
            this.dbService.storage.executeSql('SELECT DISTINCT finca_poblado FROM traspatios_fincas where tipo = ?',[tipo]).then((data)=>{
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

  getPropietariosLotesByFincaPobladoName(fincaPoblado:string){//fincaPoblado = nombre de una finca o poblado.
    return new Promise((resolve,reject) => {
      this.dbService.storage.executeSql(this.createTableQuery, [])
          .then(() => {
            this.dbService.storage.executeSql('SELECT lote_propietario FROM traspatios_fincas where finca_poblado = ?',[fincaPoblado]).then((data)=>{
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

  deleteAllInfo(){
    return new Promise((resolve,reject) => {
      this.dbService.isDatabaseReady().subscribe((dbIsReady)=>{
        if(dbIsReady){
          this.dbService.storage.executeSql(this.createTableQuery, [])
          .then(() => {
            this.dbService.storage.executeSql('DELETE FROM traspatios_fincas',[]).then(()=>{
              resolve(true);
            }).catch((error) => {
              reject(error);
            });
          }).catch((error) => {
            reject(error);
          });
        }else{
          reject({message:"La base de datos no se ha creado aún!"});
        }
      });
    });
}

}
