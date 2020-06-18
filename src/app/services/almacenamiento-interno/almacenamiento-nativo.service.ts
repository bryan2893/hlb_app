import { Injectable } from '@angular/core';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import Settings from '../../../DTO/settings.dto';

@Injectable({
  providedIn: 'root'
})
export class AlmacenamientoNativoService {

  private llaveConfiguracionesGenerales = "configuraciones";

  constructor(private nativeStorage: NativeStorage) {}

  obtenerParametrosDeConfiguracion(){

    return new Promise((resolve,reject)=>{
      this.nativeStorage.getItem(this.llaveConfiguracionesGenerales).then((parametrosDeConfiguracion:Settings)=>{
        resolve(parametrosDeConfiguracion);
      }).catch(()=>{
        reject(new Error("Configuraciones generales no existen!"));
      });
    });
    
  }

  validarParametrosDeConfiguracion(parametrosDeConfiguracion:Settings){
    if(parametrosDeConfiguracion.radio_de_alcance && parametrosDeConfiguracion.volumen_de_registros && 
      parametrosDeConfiguracion.link_de_sincronizacion && parametrosDeConfiguracion.pais && 
      parametrosDeConfiguracion.dias_permitidos && parametrosDeConfiguracion.version ){
      return true;
      }else{
        return false;
      }
  }

  almacenarParametrosDeConfiguracion(parametrosDeConfiguracion:Settings){

    return new Promise((resolve,reject)=>{
        if(this.validarParametrosDeConfiguracion(parametrosDeConfiguracion)){
          this.nativeStorage.setItem(this.llaveConfiguracionesGenerales,parametrosDeConfiguracion).then(()=> {
            resolve(parametrosDeConfiguracion);
          }).catch(()=>{
            reject(new Error("Error al intentar guardar las configuraciones generales!"));
          });
        }else{
          reject(new Error("Error al intentar guardar configuraciones generales, parametros no válidos"));
        }
        
    });
    
  }

}
