import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FincasPobladosPage } from './fincas-poblados.page';

describe('FincasPobladosPage', () => {
  let component: FincasPobladosPage;
  let fixture: ComponentFixture<FincasPobladosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FincasPobladosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FincasPobladosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
