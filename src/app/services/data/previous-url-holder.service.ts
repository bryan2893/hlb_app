import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreviousUrlHolderService {

  private data:any;

  constructor() { }

  setDataForPreviousUrl(data:any){
    this.data = data;
  }

  getDataFromPreviousUrl(){
    return this.data;
  }
}
