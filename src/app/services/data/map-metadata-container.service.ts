import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapMetaDataHolderService {

  private data:any;

  constructor() { }

  setMapMetaData(data:any){
    this.data = data;
  }

  getMapMetaDataFromPreviousPage(){
    return this.data;
  }
  
}
