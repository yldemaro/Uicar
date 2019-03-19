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
    this.statusBar.overlaysWebView(true);

    // set status bar to white
    this.statusBar.backgroundColorByHexString('#ffffff');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.logueado();
    });


  }

  logueado() {
    this.aut.authState
      .subscribe(
        user => {
          console.log(user.uid);
          if (user.uid === null) {
            this.rout.navigate(['login']);
          } else {
            this.uid = user.uid;
            this.rout.navigate([`home`]);
          }
        }
      );
  }



}
