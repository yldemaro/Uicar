import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  email: string;
  password: string;
  cpassword: string;

  passwordType = 'password';
  passwordIcon = 'eye-off';

  constructor(public afr: AngularFireAuth,
    public rout: Router,
    public alertController: AlertController,
    public loadingController: LoadingController, ) { }

  async register() {

    const { email, password, cpassword } = this;

    if (password !== cpassword) {
      this.errorpassIguales();
      this.rout.navigate(['/register']);
    } else {
      try {
        await this.afr.auth.createUserWithEmailAndPassword(email, password).then(data => {
          console.log(data);
          this.rout.navigate(['/home']);
        });

      } catch (error) {
        if (error.code === 'auth/wrong-password') {
          this.error('Contraseña incorrecta');
        }  if (error.code === 'auth/user-not-found') {
          this.error('Ese gmail no pertenece a ningún usuario');
        }
        if ( error.code === 'auth/argument-error') {
          this.error('Revisa los campos');
         }
         if ( error.code === 'auth/invalid-email') {
          this.error('Email es invalido');
         }
      }
    }
  }

  async registerGmail() {

    const loading = await this.loadingController.create({
      message: 'No se encuentra disponible'
    });
    this.presentLoading(loading);

    setTimeout(() => {
      loading.dismiss();
    }, 3000);


  }
  goLogin() {
    this.rout.navigate(['/login']);
  }

  async errorpassIguales() {
    const alert = await this.alertController.create({
      message: 'Lo siento sus contraseñas son diferentes',
      buttons: ['OK']
    });

    await alert.present();
  }

  async errorServ() {
    const alert = await this.alertController.create({
      message: 'Lo siento no se pudo crear su usuario, vuelva a intentar',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  async error(mensaje: string) {
    const alert = await this.alertController.create({
      message: mensaje,
      buttons: ['OK']
    });
  }
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}
moveFocus(nextElement) {
  nextElement.setFocus();
}
}
