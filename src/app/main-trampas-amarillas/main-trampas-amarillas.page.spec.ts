import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainTrampasAmarillasPage } from './main-trampas-amarillas.page';

describe('MainTrampasAmarillasPage', () => {
  let component: MainTrampasAmarillasPage;
  let fixture: ComponentFixture<MainTrampasAmarillasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainTrampasAmarillasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainTrampasAmarillasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
