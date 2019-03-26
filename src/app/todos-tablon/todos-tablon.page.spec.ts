import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosTablonPage } from './todos-tablon.page';

describe('TodosTablonPage', () => {
  let component: TodosTablonPage;
  let fixture: ComponentFixture<TodosTablonPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodosTablonPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosTablonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
