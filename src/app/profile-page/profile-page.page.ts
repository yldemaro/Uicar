import { Component, OnInit } from '@angular/core';
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
export class ProfilePagePage implements OnInit {

  profiledata = [];
  profiletrayectos = [];

  uid: string;
  uidprofile: string;
  userprofile: boolean;



  constructor(private http: HttpClient, private aut: AngularFireAuth,
    private router: Router, public active: ActivatedRoute, private auth: ServicesService) {

    this.uid = this.active.snapshot.paramMap.get('id');
    console.log(this.active.snapshot.paramMap.get('id'));

    this.profileload(this.uid);

    this.trayectosload(this.uid);
  }

  ngOnInit() { }

  async profileload(id: string) {

    await this.http.get(`http://uicar.openode.io/users/` + id + '/info').subscribe((data: any) => {
      this.profiledata = data;
    });
  }

  async trayectosload(id: string) {
    await this.http.get(`http://uicar.openode.io/users/` + id + '/trayectos').subscribe((data2: any) => {
      this.profiletrayectos = data2;
    });
  }

  gotomain() {
    this.router.navigateByUrl('/');
  }
  gotoedit() {
    this.router.navigateByUrl('/edituser/' + this.uid);
  }
  create() {
    this.router.navigateByUrl('create');
  }

  gotowhatsapp(telf: string) {
    console.log(telf);
    const newurl = 'https://api.whatsapp.com/send?phone=' + telf;
    window.open(newurl, '_system', '_blank');

  }

  async doRefresh(event) {

    await this.http.get(`http://uicar.openode.io/users/` + this.uid + '/info').subscribe((data: any) => {
      this.profiledata = data;
      event.target.complete();
    });

    await this.http.get(`http://uicar.openode.io/users/` + this.uid + '/trayectos').subscribe((data2: any) => {
      this.profiletrayectos = data2;
      event.target.complete();
    });

  }


}
