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

  constructor(private localDbService: TrampaAmarillaLocalService) {}

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.traps = [];
    this.pageCounter = 1;
    this.localDbService.isDatabaseReady().subscribe((response)=>{
      if(response){
        this.localDbService.getPagesQuantity(this.rowsPerPage).then((quantity:number)=>{
          this.pagesQuantity = quantity;
        }).then(()=>{
          this.localDbService.getTrapsPage(this.pageCounter,this.rowsPerPage).then((trapsList)=>{
            this.addMoreTrapItems(trapsList);
            this.pageCounter += 1;
          });
        });
      }
    });
  }

  obtenerPaginaTrampas(){
    this.localDbService.getTrapsPage(1,0).then((data)=>{
      alert(JSON.stringify(data));
    });
  }

  whenUserPressAKey(event:any){
    let value = event.target.value;
    
    console.log(event.target.value);
  }

  alCancelar(){
    alert("todo bien");
  }

  change(){
    
    this.searchBarActive = !this.searchBarActive;

    if(!this.searchBarActive){
      return;
    }else{
      setTimeout(() => {
        this.searchBar.setFocus();
      },100);
    }
  }

  loadTraps(event:any){
    this.localDbService.getTrapsPage(this.pageCounter,this.rowsPerPage).then((trapsList)=>{
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
