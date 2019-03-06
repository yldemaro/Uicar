import { Component, AfterViewInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { ServicesService } from '../services.service';
import { HttpClient } from '@angular/common/http';
import { ModalController, Platform } from '@ionic/angular';
import { ModalPagePage } from '../modal-page/modal-page.page';
import { ModalTablonPage } from '../modal-tablon/modal-tablon.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';



declare var google;


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements AfterViewInit {
  uid: string;
  profiledata = [{ nombre: 'Usuario', ubication: 'Madrid' }];
  tablondata = [];
  data = [];
  trayectos = [];
  zona = 'Madrid';
  nombre = 'Usuario';

  // Variables mapa

  key = 'AIzaSyATy7pX219NlBc9Sac6Biz0JgWR-cTB2f8';
  map: any;
  directionsDisplay: any;
  usuario: any;
  lat: number;
  lng: number;

  directionsService = new google.maps.DirectionsService();


  constructor(private aut: AngularFireAuth, public modalController: ModalController,
    private router: Router, public _servicie: ServicesService, private http: HttpClient,
    private geolocation: Geolocation) {

  }

  ngAfterViewInit() {

    this.posicion();
    this.logueado();

    setTimeout(() => {
      this.profileload(this.uid);
    }, 1000);

    setTimeout(() => {
      this.zona = this.profiledata[0].ubication;
      this.nombre = this.profiledata[0].nombre;
    }, 2000);

    setTimeout(() => {
      this.trayectosload(this.zona);
      this.tablonload(this.zona);
      this.rutas(this.zona);
    }, 3000);
  }

  posicion() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      console.log('tus cordenadas', this.lng, this.lat);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  async logueado() {
    await this.aut.authState
      .subscribe(
        user => {
          console.log(user.uid);
          if (!user) {
            this.router.navigate(['/login']);
          } else {
            console.log('logueado');
            this.uid = user.uid;
          }
        });

    return this.uid;
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPagePage,
    });
    return await modal.present();
  }

  async presentModal2() {
    const modal2 = await this.modalController.create({
      component: ModalTablonPage,
      componentProps: { zona: this.zona, nombre: this.nombre }
    });
    return await modal2.present();
  }

  gotoprofile() {
    this.router.navigate([`/profile/${this.uid}`]);
  }

  gotoinfoTrayecto(id: string) {
    this.router.navigate([`/info-trayecto/${id}`]);
  }

  gotoPerfil(id: string) {
    this.router.navigate([`/profile/${id}`]);
  }




  async profileload(id: string) {
    await this.http.get(`http://uicar.openode.io/users/${id}/info`).subscribe((data: any) => {
      this.profiledata = data;
    });
    return this.profiledata;
  }

  async tablonload(id: string) {

    await this.http.get(`http://uicar.openode.io/zonas/${id}/tablon`).subscribe((data: any) => {

      this.tablondata = data;

    });
    return this.tablondata;
  }

  async trayectosload(id: string) {
    await this.http.get(`http://uicar.openode.io/zonas/${id}`).subscribe((data: any) => {


      this.trayectos = data;

    });

    return this.trayectos;
  }



  // Mapa

  // Mapa

  async rutas(zona: string) {

    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 11,
      center: { lat: this.lat, lng: this.lng },
      mapTypeId: 'terrain'
    });
    this.directionsDisplay.setMap(this.map);

    await this.http.get(`http://uicar.openode.io/zonas/${zona}`).subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {
        this.directionsService.route({
          origin: data[i].inicio,
          destination: data[i].destino,
          travelMode: 'DRIVING'
        }, (response, status) => {
          if (status === 'OK') {
            // this.directionsDisplay.setDirections(response);
            this.directionsDisplay = new google.maps.DirectionsRenderer({
              suppressBicyclingLayer: false,
              suppressMarkers: true
            });
            this.directionsDisplay.setMap(this.map);
            this.directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }
    });
  }


  doRefresh(event) {

    this.posicion();
    this.logueado();

    setTimeout(() => {
      this.profileload(this.uid);
    }, 1000);

    setTimeout(() => {
      this.zona = this.profiledata[0].ubication;
      this.nombre = this.profiledata[0].nombre;
      this.trayectosload(this.zona);
      this.tablonload(this.zona);
    }, 2000);

    setTimeout(() => {
      this.rutas(this.zona);
      event.target.complete();
    }, 3000);

  }

}
