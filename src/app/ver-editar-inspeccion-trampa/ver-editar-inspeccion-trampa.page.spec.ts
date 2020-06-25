import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerEditarInspeccionTrampaPage } from './ver-editar-inspeccion-trampa.page';

describe('VerEditarInspeccionTrampaPage', () => {
  let component: VerEditarInspeccionTrampaPage;
  let fixture: ComponentFixture<VerEditarInspeccionTrampaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerEditarInspeccionTrampaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerEditarInspeccionTrampaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
