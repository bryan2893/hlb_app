import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {SQLite,SQLiteObject} from '@ionic-native/sqlite/ngx';
import {Platform} from '@ionic/angular';
import {TrampaAmarillaNuevo} from '../../../DTO/local/TrampaAmarillaNuevo.dto';
import {TrampaAmarillaNubeBajada} from '../../../DTO/server/TrampaAmarillaNubeBajada';

@Injectable({
  providedIn: 'root'
})
export class LocalDbService {
  private storage: SQLiteObject;
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private createTableQuery = 'create table IF NOT EXISTS trampas_amarillas(id_local INTEGER PRIMARY KEY AUTOINCREMENT,id_trampa INTEGER NOT NULL,tipo TEXT NOT NULL,pais TEXT NOT NULL,num_trampa INTEGER NOT NULL,finca_poblado TEXT NOT NULL,lote_propietario TEXT NOT NULL,latitud REAL,longitud REAL,estado INTEGER NOT NULL,sincronizado INTEGER NOT NULL)';

  constructor(private sqlite: SQLite,private platform: Platform) { 
    this.platform.ready().then(()=>{
      this.sqlite.create({name:'hlb_db.db',location:'default'}).then((db:SQLiteObject)=>{
        this.storage = db;
        this.isDbReady.next(true);
      }).catch((error)=>{
        
      });

    }).catch((error) => {

    });
  }

  isDatabaseReady(){
    return this.isDbReady.asObservable();
  }

  getTrapsPage(pageNumber:number,rowsPerPage:number){
    
    return new Promise((resolve,reject)=>{
      this.isDatabaseReady().subscribe((dbIsReady)=>{
        if(dbIsReady){

          this.storage.executeSql(this.createTableQuery, [])
          .then(() => {
            let offset = (pageNumber - 1) * rowsPerPage;
            this.storage.executeSql('SELECT * FROM trampas_amarillas limit ?,?',[offset,rowsPerPage]).then((registrosTrampas)=>{

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

  getNoSincronizedTrapsPage(pageNumber:number,rowsPerPage:number){
    
    return new Promise((resolve,reject)=>{
      this.isDatabaseReady().subscribe((dbIsReady)=>{
        if(dbIsReady){

          this.storage.executeSql(this.createTableQuery, [])
          .then(() => {
            let offset = (pageNumber - 1) * rowsPerPage;
            this.storage.executeSql('SELECT id_trampa,tipo,pais,num_trampa,finca_poblado,lote_propietario,latitud,longitud,estado FROM trampas_amarillas where sincronizado = ? limit ?,?',[0,offset,rowsPerPage]).then((registrosTrampas)=>{

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

  countTraps():any{
    return new Promise((resolve,reject) => {

      this.isDatabaseReady().subscribe((dbIsReady)=>{
        if(dbIsReady){
          this.storage.executeSql(this.createTableQuery, [])
          .then(() => {
            this.storage.executeSql('SELECT COUNT(*) AS cantidad FROM trampas_amarillas',[]).then((data)=>{
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

  getPagesQuantity(rowsPerPage:number){
    return new Promise((resolve,reject)=>{
      this.countTraps().then((data)=>{
        let trapsQuantity = data.cantidad;

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
    return new Promise((resolve,reject) => {

      this.isDatabaseReady().subscribe((dbIsReady)=>{
        if(dbIsReady){
          this.storage.executeSql(this.createTableQuery, [])
          .then(() => {
            this.storage.executeSql('SELECT COUNT(*) AS cantidad FROM trampas_amarillas where sincronizado = ?',[0]).then((data)=>{
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

    return new Promise((resolve,reject) => {
      this.isDatabaseReady().subscribe((dbIsReady)=>{
        if(dbIsReady){
          
          this.storage.executeSql(this.createTableQuery, [])
          .then(() => {
            this.storage.executeSql('INSERT INTO trampas_amarillas(id_trampa,num_trampa,tipo,pais,finca_poblado,lote_propietario,latitud,longitud,estado,sincronizado) VALUES (?,?,?,?,?,?,?,?,?,?)',[trap.id_trampa,trap.num_trampa,trap.tipo,trap.pais,trap.finca_poblado,trap.lote_propietario,trap.latitud,trap.longitud,trap.estado,trap.sincronizado]).then(()=>{
              resolve(trap);
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

  insertManyTraps(traps:TrampaAmarillaNubeBajada[]){

    return new Promise((resolve,reject) => {

      const insertStatement = 'INSERT INTO trampas_amarillas(id_trampa,tipo,pais,num_trampa,finca_poblado,lote_propietario,latitud,longitud,estado,sincronizado) VALUES (?,?,?,?,?,?,?,?,?,?)';
      let generalStatement = [];
      generalStatement.push(this.createTableQuery);
      for(let i=0;i<traps.length;i++){
        let trap = traps[i];
        let valuesArray = [trap.ID_TRAMPA,trap.TIPO,trap.PAIS,trap.NUM_TRAMPA,trap.FINCA_POBLADO,trap.LOTE_PROPIETARIO,trap.LATITUD,trap.LONGITUD,trap.ESTADO,1];
        let insertionListStatement = [];
        insertionListStatement.push(insertStatement);
        insertionListStatement.push(valuesArray);
        generalStatement.push(insertionListStatement);
      }

      this.storage.sqlBatch(generalStatement).then(()=>{
        resolve(true);
      }).catch((error)=>{
        reject(error);
      });

    });
    
  }


  deleteAllInfo(){
      return new Promise((resolve,reject) => {
        this.isDatabaseReady().subscribe((dbIsReady)=>{
          if(dbIsReady){
            this.storage.executeSql(this.createTableQuery, [])
            .then(() => {
              this.storage.executeSql('DELETE FROM trampas_amarillas',[]).then(()=>{
                resolve();
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

  findAtrap(trapNumber:number){
    
  }

}
