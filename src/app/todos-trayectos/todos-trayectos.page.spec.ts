import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosTrayectosPage } from './todos-trayectos.page';

describe('TodosTrayectosPage', () => {
  let component: TodosTrayectosPage;
  let fixture: ComponentFixture<TodosTrayectosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodosTrayectosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosTrayectosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
