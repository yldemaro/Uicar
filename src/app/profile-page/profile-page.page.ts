import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { JsonPipe } from '@angular/common';
import { ServicesService } from '../services.service';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.page.html',
  styleUrls: ['./profile-page.page.scss'],
})
export class ProfilePagePage implements AfterViewInit {

  profiledata = [];
  profiletrayectos = [];

  uid: string;
  id: any;
  tamano: number;


  constructor(private http: HttpClient, private aut: AngularFireAuth,
    private router: Router, public active: ActivatedRoute, private auth: ServicesService) {
    this.uid = this.active.snapshot.paramMap.get('id');
  }

  ngAfterViewInit() {

    this.logueado();
    this.profileload(this.uid);
    
    setTimeout(() => {
      console.log(this.uid);
      this.id = this.id;
      this.profileload(this.uid);
      this.trayectosload(this.uid);
    }, 2000);

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
      this.profiledata = data;
    });
  }

  async trayectosload(id: string) {
    await this.http.get(`http://uicar.openode.io/users/` + id + '/trayectos').subscribe((data2: any) => {
      // console.log(data2);
      this.profiletrayectos = data2;
    });
  }

  gotomain() {
    this.router.navigate(['home']);
  }
  gotoedit() {
    this.router.navigate(['edituser', this.uid]);
  }
  create() {
    this.router.navigate(['create']);
  }

  gotowhatsapp(telf: string) {
    // console.log(telf);
    const newurl = 'https://api.whatsapp.com/send?phone=' + telf;
    window.open(newurl, '_system', '_blank');

  }
}
