import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal-tablon',
  templateUrl: './modal-tablon.page.html',
  styleUrls: ['./modal-tablon.page.scss'],
})
export class ModalTablonPage implements OnInit {

  uid: string;
  profiledata = [];
  info: string;
  zona;
  nombre;
  profiledetails: any;


  constructor(public modalcontroler: ModalController, private aut: AngularFireAuth,
    private http: HttpClient, public router: Router, public active: ActivatedRoute, ) {
    this.aut.authState
      .subscribe(
        user => {
          this.uid = user.uid;
          console.log(user.uid);
        },
        () => {
          // this.rout.navigateByUrl('/login');
        }
      );

  }

  ngOnInit() {
    console.log(this.zona, this.nombre);
  }
  dismiss() {
    this.modalcontroler.dismiss();
  }

  async makepost() {

    const { info, uid, zona, nombre } = this;
    console.log(nombre);
    console.log(info, uid);
    const url = 'http://uicar.openode.io/tablon/' + zona;
    await this.http.post(url, {
      nombre: nombre,
      uid: uid,
      zona: zona,
      info: info,
      fecha: new Date().getTime(),

    }).subscribe((response) => {
      console.log(response);
    });
    this.dismiss();
    this.router.navigateByUrl('/');
  }


}
