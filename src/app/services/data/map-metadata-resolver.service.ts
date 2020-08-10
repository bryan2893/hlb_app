import { Injectable } from '@angular/core';
import {Resolve} from '@angular/router';
import {MapMetaDataHolderService} from './map-metadata-container.service';

@Injectable({
  providedIn: 'root'
})
export class MapMetaDataResolverService implements Resolve<any>{

  constructor(private mapMetaDataHolderService:MapMetaDataHolderService) { }

  resolve(){
    return this.mapMetaDataHolderService.getMapMetaDataFromPreviousPage();
  }

}
