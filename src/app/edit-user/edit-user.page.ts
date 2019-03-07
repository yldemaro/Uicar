import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {

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
      this.cargaImagen.url = '/assets/icons/selectimage.png';
    }

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
    this.cargaruid();
    this.zonasload();
  }

  ngOnInit() {
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

    await this.http.get(`http://uicar.openode.io/zonas/`).subscribe((data: any) => {
      this.zones = data;
    });
  }

  async makepost() {
    const fecha = Date.now();
    console.log(fecha);
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
      whatsapp: telf,
      fecha: fecha
    }).subscribe((response) => {
      console.log(response);
      if (response) {
        this.router.navigate([`home`]);
      }
    }, error => {
      console.log(error);
    });
  }

  cargarImagen() {
    this.cargaImagen.cargarImagen(this.url);
  }
}
