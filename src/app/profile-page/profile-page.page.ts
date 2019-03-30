import { Component, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ServicesService } from '../services.service';
import { ModalController } from '@ionic/angular';
import { ModalPagePage } from '../modal-page/modal-page.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.page.html',
  styleUrls: ['./profile-page.page.scss'],
})
export class ProfilePagePage implements AfterViewInit, OnInit {

  profiledata = [];
  profiletrayectos = [];

  uid: string;
  id: any;
  tamano: number;
  cargado: boolean;


  constructor(private http: HttpClient,
    private aut: AngularFireAuth,
    private router: Router,
    private iab: InAppBrowser,
    public active: ActivatedRoute,
    private auth: ServicesService,
    public modalController: ModalController) {
    this.uid = this.active.snapshot.paramMap.get('id');
    this.cargado = true;
  }

  ngOnInit() {
    this.id = this.id;
    this.logueado();
  }

  ngAfterViewInit() {
    this.profileload(this.uid);
    this.trayectosload(this.uid);

    setTimeout(() => {
      this.profileload(this.uid);
      this.trayectosload(this.uid);
    }, 1000);
  }



  logueado() {
    this.aut.authState
      .subscribe(
        user => {
          if (!user) {
            this.router.navigate(['/login']);
          } else {
            this.id = user.uid;
          }
        }
      );
  }



  async profileload(id: string) {

    await this.http.get(`http://uicar.openode.io/users/` + id + '/info').subscribe((data: any) => {
      console.log(data);
      this.cargado = false;
      this.profiledata = data;
    });
  }

  async trayectosload(id: string) {
    await this.http.get(`http://uicar.openode.io/users/` + id + '/trayectos').subscribe((data2: any) => {
      // console.log(data2);
      this.cargado = false;
      this.profiletrayectos = data2;
    });
  }

  gotomain() {
    this.router.navigate(['/home']);
  }
  gotoedit() {
    this.router.navigate(['/edituser', this.uid]);
  }
  gotoinfotrayecto(id: string) {
    this.router.navigate(['/info-trayecto', id]);
  }
  create() {
    this.router.navigate(['create']);
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPagePage,
    });
    return await modal.present();
  }

  gotowhatsapp(telf: string) {
    // console.log(telf);
    this.iab.create(`https://api.whatsapp.com/send?phone=${telf}`);
  }
}
