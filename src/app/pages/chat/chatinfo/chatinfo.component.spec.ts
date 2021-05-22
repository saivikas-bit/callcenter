import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatinfoComponent } from './chatinfo.component';

describe('ChatinfoComponent', () => {
  let component: ChatinfoComponent;
  let fixture: ComponentFixture<ChatinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
