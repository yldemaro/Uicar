import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  uid: any;

  constructor(
    private statusBar: StatusBar,
    private platform: Platform,
    private splashScreen: SplashScreen,
    public aut: AngularFireAuth,
    private rout: Router
  ) {
    this.initializeApp();
    // let status bar overlay webview
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.hide();
      this.splashScreen.hide();
      this.logueado();
    });


  }

  logueado() {
    // this.aut.authState
    //   .subscribe(
    //     user => {
    //       if (user) {
    //         this.rout.navigate(['home']);
    //       } else {
    //         this.rout.navigate(['login']);
    //       }
    //     },
    //     () => {
    //       this.rout.navigate(['login']);
    //     }
    //   );
    this.platform.ready().then(() => {
      this.aut.user.subscribe(user => {
        if (user) {
          this.rout.navigate(['/home']);
        } else {
          this.rout.navigate(['/login']);
        }
      }, err => {
        this.rout.navigate(['/login']);
      }, () => {
        this.splashScreen.hide();
      });
      this.statusBar.styleDefault();
    });
  }


}
