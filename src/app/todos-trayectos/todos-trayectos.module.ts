import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TodosTrayectosPage } from './todos-trayectos.page';

const routes: Routes = [
  {
    path: '',
    component: TodosTrayectosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TodosTrayectosPage]
})
export class TodosTrayectosPageModule {}
