import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.page.html',
  styleUrls: ['./modal-page.page.scss'],
})
export class ModalPagePage implements OnInit, OnDestroy {

  links: any;
  constructor(public modalcontroler: ModalController, private http: HttpClient
    , private aut: AngularFireAuth, private router: Router) {

  }

  ngOnInit() {
    this.linksload();
  }

  ngOnDestroy(){
    
  }
  dismiss() {
    this.modalcontroler.dismiss();
  }

  async signOut() {
    const res = this.aut.auth.signOut().then(data => {
      console.log(data);
      this.modalcontroler.dismiss();
      this.router.navigate(['login']);
    }).catch(error => {
      console.log(error);
    });
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
