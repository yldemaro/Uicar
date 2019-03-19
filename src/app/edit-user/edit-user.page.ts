import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit, OnDestroy {

  uidprofile: string;
  uid: string;
  zones: any;
  telefono: any;
  nombre: any;
  zona: any;

  url: any;

  constructor(public router: Router, public active: ActivatedRoute, private aut: AngularFireAuth
    , private http: HttpClient, private cargaImagen: ServicesService) {
    console.log(this.cargaImagen.url);

    if (this.cargaImagen.url === undefined) {
      this.cargaImagen.url = '/assets/icons/user.svg';
    }
  }

  ngOnInit() {
    this.logueado();
    this.cargaruid();
    this.zonasload();
  }

  logueado() {

    this.aut.authState
      .subscribe(
        user => {
          console.log(user.uid);
          if (user.uid != null) {
            this.uid = user.uid;
          } else {
            this.router.navigate([`/login`]);
          }
        }
      );
  }

  gotouser() {
    this.router.navigate([`/profile/${this.uid}`]);
  }

  gotocreate() {
    this.router.navigate([`/create`]);
  }
  async cargaruid() {
    await this.active.params.subscribe((data2: any) => {
      this.uidprofile = data2.id;
    });
  }

  async zonasload() {


    await this.http
    .get(`https://apiv1.geoapi.es/municipios?CPRO=28&type=JSON&key=ee1d04ad4e6bf0c30ac856d457c3cf25b8f342061277ba5a76f384cba4d06dd6`)
    .subscribe((data: any) => {
      // console.log(data.data);
      this.zones = data.data;
      // console.log(this.zones);
    });

    // await this.http.get(`http://uicar.openode.io/zonas/`).subscribe((data: any) => {
    //   this.zones = data;
    // });
  }

  async makepost() {
    const telf = '34' + this.telefono;
    const { nombre, zona, url } = this;
    console.log(nombre, telf, zona);


    if (this.cargaImagen.url === undefined) {
      this.cargaImagen.url = '/assets/icons/user.svg';
    }

    await this.http.post('http://uicar.openode.io/edituser/', {
      nombre: nombre,
      uid: this.uid,
      img: this.cargaImagen.url,
      ubication: zona,
      whatsapp: telf
    }).subscribe((response) => {
      console.log(response);
      this.router.navigate([`home`]);
    }, error => {
      console.log(error);
      this.router.navigate([`profile/${this.uid}`]);
    });
  }

  ngOnDestroy() {
    console.log('se va');
  }

  cargarImagen() {
    this.cargaImagen.cargarImagen(this.url);
  }
}
