import { Injectable } from '@angular/core';
import { AlmacenamientoNativoService } from '../almacenamiento-interno/almacenamiento-nativo.service';
import {UserLoged} from '../../../DTO/UserLoged.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  logedUser:UserLoged;

  constructor(private almacenamientoNativoService:AlmacenamientoNativoService) { }

  createTable(){

  }

  findUser(){
    
  }

}
