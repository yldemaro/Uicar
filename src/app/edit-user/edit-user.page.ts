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
  profiledata: any;

  url: any;

  constructor(public router: Router, public active: ActivatedRoute, private aut: AngularFireAuth
    , private http: HttpClient, private cargaImagen: ServicesService) {

    if (this.cargaImagen.url === undefined) {
      this.cargaImagen.url = '/assets/icons/user.svg';
    }

    this.uid = this.active.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    // this.logueado();
    // this.cargaruid();

    this.profileload();
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

  async profileload() {

    await this.http.get(`http://uicar.openode.io/users/` + this.uid + '/info').subscribe((data: any) => {
      console.log(data);
      this.cargaImagen.url = data[0].img;
      this.nombre = data[0].nombre;
      this.telefono = data[0].whatsapp;
      this.zona = data[0].ubication;
    });
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
    this.http.get(`http://uicar.openode.io/zonas/`).subscribe((data2: any) => {
      this.zones = data2;
    });
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
