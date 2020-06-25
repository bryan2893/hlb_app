import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgregarInspeccionTrampaPage } from './agregar-inspeccion-trampa.page';

describe('AgregarInspeccionTrampaPage', () => {
  let component: AgregarInspeccionTrampaPage;
  let fixture: ComponentFixture<AgregarInspeccionTrampaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarInspeccionTrampaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarInspeccionTrampaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
