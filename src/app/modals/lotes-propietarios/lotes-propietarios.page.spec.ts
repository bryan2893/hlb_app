import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LotesPropietariosPage } from './lotes-propietarios.page';

describe('LotesPropietariosPage', () => {
  let component: LotesPropietariosPage;
  let fixture: ComponentFixture<LotesPropietariosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LotesPropietariosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LotesPropietariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
