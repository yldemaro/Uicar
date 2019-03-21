import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.page.html',
  styleUrls: ['./modal-page.page.scss'],
})
export class ModalPagePage implements OnInit {

  links: any;
  constructor(public modalcontroler: ModalController, private http: HttpClient
    , private aut: AngularFireAuth, private router: Router) {

  }

  ngOnInit() {
    this.linksload();
  }

  dismiss() {
    this.modalcontroler.dismiss();
  }

  async signOut() {
    this.modalcontroler.dismiss();
    this.aut.auth.signOut();
    this.router.navigate(['login']);
  }


  async linksload() {

    await this.http.get(`http://uicar.openode.io/links/`).subscribe((data: any) => {
      this.links = data;
    });
  }
  gotopage(url: string) {
    console.log(url);
    window.open(url, '_system');

  }

}
