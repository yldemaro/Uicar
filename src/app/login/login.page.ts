import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { ServicesService } from '../services.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  username: string;
  password: string;

  constructor(public afs: AngularFireAuth,
    public rout: Router,
    public service: ServicesService,
    public alertController: AlertController,
    private googlePlus: GooglePlus,
    public loadingController: LoadingController,
    private nativeStorage: NativeStorage, ) {

  }

  async login() {

    const { username, password } = this;
    try {
      const res = await this.afs.auth.signInWithEmailAndPassword(username, password).then(data => {
        this.rout.navigate(['/home']);
      });
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        this.errorContrasena();
      } else if (error.code === 'auth/user-not-found') {
        this.errorUsuario();
      }
    }
  }

  async loginGmail() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    this.googlePlus.login({
      'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': environment.googleWebClientId, // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
    })
      .then(user => {
        loading.dismiss();

        this.nativeStorage.setItem('google_user', {
          name: user.displayName,
          email: user.email,
          picture: user.imageUrl
        })
          .then(() => {
            this.rout.navigate(['/home']);
          }, error => {
            console.log(error);
          });
        loading.dismiss();
      }, err => {
        console.log(err)
        loading.dismiss();
      });
  }

  goRegister() {
    this.rout.navigate(['/register']);
  }

  async presentAlert(username) {
    const alert = await this.alertController.create({
      header: 'Logueado como: ',
      message: `${username}`,
      buttons: ['OK']
    });

    await alert.present();
  }

  async errorContrasena() {
    const alert = await this.alertController.create({
      message: 'Lo siento su contraseña es incorrecta',
      buttons: ['OK']
    });

    await alert.present();
  }

  async errorUsuario() {
    const alert = await this.alertController.create({
      message: 'Lo siento su email o usuario no se encuentra registrado',
      buttons: ['OK']
    });

    await alert.present();
  }


  async presentLoading(loading) {
    return await loading.present();
  }

}
