import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainInspeccionTrampaPage } from './main-inspeccion-trampa.page';

describe('MainInspeccionTrampaPage', () => {
  let component: MainInspeccionTrampaPage;
  let fixture: ComponentFixture<MainInspeccionTrampaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainInspeccionTrampaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainInspeccionTrampaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
