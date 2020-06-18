import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataContainerService {

  private data = [];

  constructor() { }

  setData(data:any){
    this.data = [];
    this.data.push(data);
  }

  getData(){
    let data = this.data[0];
    this.data = [];
    return data;
  }
}
