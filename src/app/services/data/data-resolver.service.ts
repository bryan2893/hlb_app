import { Injectable } from '@angular/core';
import {DataContainerService} from './data-container.service';
import {Resolve} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataResolverService implements Resolve<any>{

  constructor(private dataContainerService: DataContainerService) { }

  resolve(){
    return this.dataContainerService.getData();
  }
  
}
