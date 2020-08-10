import { Component, OnInit, ViewChild } from '@angular/core';
import {IonSearchbar} from '@ionic/angular';

import {TrampaAmarillaLocalService} from '../services/trampas_amarillas/TrampaAmarillaLocal.service';
import {DataContainerService} from '../services/data/data-container.service';
import {Router} from '@angular/router';

import {AuthService} from '../services/auth/auth.service';
import {USER_ACTIONS} from '../../constants/user_actions';

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
  actions = USER_ACTIONS;

  constructor(private trampaAmarillaLocalService: TrampaAmarillaLocalService,
    private dataContainerService:DataContainerService,
    private router: Router,
    private authService:AuthService) {}

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.traps = [];
    this.pageCounter = 1;
    this.trampaAmarillaLocalService.getPagesQuantity(this.rowsPerPage).then((pagesQuantity:number)=>{
      this.pagesQuantity = pagesQuantity;
    }).then(()=>{
      this.trampaAmarillaLocalService.getTrapsPage(this.pageCounter,this.rowsPerPage).then((trapsList)=>{
        console.log("datos de trampas amarillas ---> "+JSON.stringify(trapsList));
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

  onItemClick(inspHlbItem:any){
    this.dataContainerService.setData(inspHlbItem);
    this.router.navigateByUrl('/ver-editar-trampa-amarilla');
  }

}
