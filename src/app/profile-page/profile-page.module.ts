import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalPagePage } from '../modal-page/modal-page.page';

import { ProfilePagePage } from './profile-page.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfilePagePage , ModalPagePage ],
  entryComponents: [ ModalPagePage  ]
})
export class ProfilePagePageModule {}
