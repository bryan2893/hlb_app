import { Injectable } from '@angular/core';
import {Resolve} from '@angular/router';
import {PreviousUrlHolderService} from './previous-url-holder.service';

@Injectable({
  providedIn: 'root'
})
export class PreviousUrlResolver implements Resolve<any>{

  constructor(private previousUrlHolderService:PreviousUrlHolderService) { }

  resolve(){
    return this.previousUrlHolderService.getDataFromPreviousUrl();
  }

}
