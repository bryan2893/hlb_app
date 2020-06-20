import { Component, OnInit, ViewChild } from '@angular/core';
import {IonSearchbar} from '@ionic/angular';

import {TrampaAmarillaLocalService} from '../services/trampas_amarillas/TrampaAmarillaLocal.service';

@Component({
  selector: 'app-main-trampas-amarillas',
  templateUrl: './main-trampas-amarillas.page.html',
  styleUrls: ['./main-trampas-amarillas.page.scss'],
})
export class MainTrampasAmarillasPage implements OnInit {

  @ViewChild('searchbar',{static:false}) searchBar: IonSearchbar;
  searchBarActive = false;
  private rowsPerPage = 13;
  private pageCounter = 1;
  pagesQuantity = 0;
  traps = [];

  constructor(private trampaAmarillaLocalService: TrampaAmarillaLocalService) {}

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.traps = [];
    this.pageCounter = 1;
    this.trampaAmarillaLocalService.getPagesQuantity(this.rowsPerPage).then((pagesQuantity:number)=>{
      this.pagesQuantity = pagesQuantity;
    }).then(()=>{
      this.trampaAmarillaLocalService.getTrapsPage(this.pageCounter,this.rowsPerPage).then((trapsList)=>{
        this.addMoreTrapItems(trapsList);
        this.pageCounter += 1;
      });
    });
  }

  whenUserPressAKey(event:any){
    let value = event.target.value;
    this.trampaAmarillaLocalService.findAtrap(value).then((listaDeTrampasEncontradas:any)=>{
      this.traps = listaDeTrampasEncontradas;
    }).catch((error)=>{
      console.log(error);
    });
  }

  change(event:any){
    this.searchBarActive = !this.searchBarActive;
    if(this.searchBarActive){
      setTimeout(() => {
        this.searchBar.setFocus();
      },100);
    }else{
      this.pageCounter = 1;
      this.trampaAmarillaLocalService.getTrapsPage(this.pageCounter,this.rowsPerPage).then((trapsList:any)=>{
        this.traps = trapsList;
        this.pageCounter += 1;
      });
    }
  }

  loadTraps(event:any){
    this.trampaAmarillaLocalService.getTrapsPage(this.pageCounter,this.rowsPerPage).then((trapsList)=>{
      this.addMoreTrapItems(trapsList);
      this.pageCounter += 1;
      event.target.complete();
    });
  }

  addMoreTrapItems(trapsPage:any) {
    for (let i = 0; i < trapsPage.length; i++) {  
      this.traps.push(trapsPage[i]);   
    }
  }

}
