import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import {UserLoged} from '../../../DTO/UserLoged.dto';
import {UsuarioProvenienteDelServerDTO} from '../../../DTO/usuario/usuario-proveniente-del-server.dto';
import {UsuarioLocalDTO} from '../../../DTO/usuario/usuario-local.dto';
import {AlmacenamientoNativoService} from '../almacenamiento-interno/almacenamiento-nativo.service';

@Injectable({
  providedIn: 'root'
})
export class UserLocalService {

  db:SQLiteObject = null;

  constructor(private almacenamientoNativoService:AlmacenamientoNativoService) {}

  setDatabase(db:SQLiteObject){
    if(this.db === null){
      this.db = db;
    }
  }

  /*
  USER_ID: string,
  CLAVE: string,
  NOMBRE: string,
  APELLIDO_1: string,
  ACTION_ID: string
  */
  createTable(){
    let sql = 'create table IF NOT EXISTS usuarios(user_id TEXT NOT NULL,clave TEXT NOT NULL,nombre TEXT NOT NULL,apellido_1 TEXT NOT NULL,action_id TEXT NOT NULL)';
    return this.db.executeSql(sql,[]);
  }

  getAUserByCredentials(usuario:string,contraseña:string):Promise<UsuarioLocalDTO>{

    let sql = 'SELECT user_id,clave,nombre,apellido_1 FROM usuarios where user_id = ? AND clave = ? limit 1';
    return new Promise((resolve,reject)=>{

        this.db.executeSql(sql,[usuario,contraseña]).then((data)=>{

        let user = null;
        if (data.rows.length > 0) {
          user = data.rows.item(0);
          resolve(user);
        }else{
          reject(new Error("Las credenciales no existen para el usuario!"));
        }

        }).catch((e) => {
          reject(e);
        });

    });
    
  }

  insertManyUsers(usuariosDesdeLaNube:UsuarioProvenienteDelServerDTO[]){

    let createTableQuery = 'create table IF NOT EXISTS usuarios(user_id TEXT NOT NULL,clave TEXT NOT NULL,nombre TEXT NOT NULL,apellido_1 TEXT NOT NULL,action_id TEXT NOT NULL)';
    let sql = 'INSERT INTO usuarios(user_id,clave,nombre,apellido_1,action_id) VALUES (?,?,?,?,?)';
    return new Promise((resolve,reject) => {
          let generalStatement = [];
          generalStatement.push(createTableQuery);
          for(let i=0;i<usuariosDesdeLaNube.length;i++){
            let usuario = usuariosDesdeLaNube[i];
            let valuesArray = [usuario.USER_ID,usuario.CLAVE,usuario.NOMBRE,usuario.APELLIDO_1,usuario.ACTION_ID];
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
    let sql = 'SELECT * FROM usuarios where user_id = ?';
    return new Promise((resolve,reject)=>{

        this.db.executeSql(sql,[usuario]).then((data)=>{
        
        let userLogued = null;
        if (data.rows.length > 0) {
          userLogued = {};
          let firstRow = data.rows.item(0);
          userLogued["fullName"] = firstRow.nombre +" "+ firstRow.apellido_1;
          userLogued["username"] = firstRow.user_id;
          userLogued["password"] = firstRow.clave;
          userLogued["actions"] = [];
          userLogued["token"] = "";
          for (var i = 0; i < data.rows.length; i++) {
            let userRow = data.rows.item(i);
            userLogued.actions.push(userRow.action_id);
          }
        }

        if(userLogued === null){
          reject(new Error("Usuario '"+usuario+"' no existe!"));
        }

        resolve(userLogued);

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

  getDefaultUser():Promise<UserLoged>{
    return new Promise((resolve,reject)=>{
      this.almacenamientoNativoService.obtenerUsuarioPorDefault().then((usuario:UserLoged)=>{
        resolve(usuario);
      }).catch((error)=>{
        reject(error);
      });
    });
  }

  setDefaultUser(user:UserLoged):Promise<UserLoged>{
    return new Promise((resolve,reject)=>{
      this.almacenamientoNativoService.almacenarUsuarioPorDefault(user).then((user)=>{
        resolve(user);
      }).catch((error)=>{
        reject(error);
      });
    });
  }

}
