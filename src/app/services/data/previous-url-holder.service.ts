import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreviousUrlHolderService {

  private url:string;

  constructor() { }

  setPreviousUrl(url:string){
    this.url = url;
  }

  getPreviousUrl(){
    return this.url;
  }
}
