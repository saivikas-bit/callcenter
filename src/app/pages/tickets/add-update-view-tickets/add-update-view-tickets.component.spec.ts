import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateViewTicketsComponent } from './add-update-view-tickets.component';

describe('AddUpdateViewTicketsComponent', () => {
  let component: AddUpdateViewTicketsComponent;
  let fixture: ComponentFixture<AddUpdateViewTicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateViewTicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateViewTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
