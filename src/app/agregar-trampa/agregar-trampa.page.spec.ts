import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgregarTrampaPage } from './agregar-trampa.page';

describe('AgregarTrampaPage', () => {
  let component: AgregarTrampaPage;
  let fixture: ComponentFixture<AgregarTrampaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarTrampaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarTrampaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
