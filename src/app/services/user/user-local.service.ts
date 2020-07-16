import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import {UserLoged} from '../../../DTO/UserLoged.dto';
import {UsuarioNubeBajada} from '../../../DTO/server/UsuarioNubeBajada';

@Injectable({
  providedIn: 'root'
})
export class UserLocalService {

  db:SQLiteObject = null;

  constructor() {}

  setDatabase(db:SQLiteObject){
    if(this.db === null){
      this.db = db;
    }
  }

  createTable(){
    let sql = 'create table IF NOT EXISTS usuarios(nombre_completo TEXT NOT NULL,usuario TEXT NOT NULL,contraseña TEXT NOT NULL,accion TEXT NOT NULL)';
    return this.db.executeSql(sql,[]);
  }

  getAUserByCredentials(usuario:string,contraseña:string){

    let sql = 'SELECT * FROM usuarios where usuario = ? AND contraseña = ? limit 1';
    return new Promise((resolve,reject)=>{

        this.db.executeSql(sql,[usuario,contraseña]).then((data)=>{

        let userFounded = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) { 
            userFounded.push(data.rows.item(i));
          }
        }

        resolve(userFounded);

        }).catch((e) => {
          reject(e);
        });

    });
    
  }

  insertManyUsers(usuariosDesdeLaNube:UsuarioNubeBajada[]){

    let createTableQuery = 'create table IF NOT EXISTS usuarios(nombre_completo TEXT NOT NULL,usuario TEXT NOT NULL,contraseña TEXT NOT NULL,accion TEXT NOT NULL)';
    let sql = 'INSERT INTO usuarios(nombre_completo,usuario,contraseña,accion) VALUES (?,?,?,?)';
    return new Promise((resolve,reject) => {
          let generalStatement = [];
          generalStatement.push(createTableQuery);
          for(let i=0;i<usuariosDesdeLaNube.length;i++){
            let usuario = usuariosDesdeLaNube[i];
            let valuesArray = [usuario.nombre_completo,usuario.usuario,usuario.contraseña,usuario.accion];
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

  buildUserLogued(usuario:string):Promise<UserLoged>{
    let sql = 'SELECT * FROM usuarios where usuario = ?';
    return new Promise((resolve,reject)=>{

        this.db.executeSql(sql,[usuario]).then((data)=>{
        
        let userBuilded = null;
        if (data.rows.length > 0) {
          userBuilded = {};
          let firstRow = data.rows.item(0);
          userBuilded["fullName"] = firstRow.fullName;
          userBuilded["username"] = firstRow.username;
          userBuilded["password"] = firstRow.password;
          userBuilded["actions"] = [];
          userBuilded["token"] = "";
          for (var i = 0; i < data.rows.length; i++) {
            let userRow = data.rows.item(i);
            userBuilded.actions.push(userRow.accion);
          }
        }

        if(userBuilded === null){
          reject(new Error("Usuario '"+usuario+"' no existe!"));
        }

        resolve(userBuilded);

        }).catch((e) => {
          reject(e);
        });

    });
  }

  deleteAllInfo(){
    let sql = 'DELETE FROM usuarios';
    return new Promise((resolve,reject) => {
      this.db.executeSql(sql,[]).then(()=>{
        resolve(true);
      }).catch((error) => {
        reject(error);
      });
    });
  }

}
