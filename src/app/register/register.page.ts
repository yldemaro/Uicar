import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  email: string;
  password: string;
  cpassword: string;

  constructor(public afr: AngularFireAuth,
    public rout: Router, public alertController: AlertController) { }

  async register() {

    const { email, password, cpassword } = this;

    if (password !== cpassword) {
      this.errorpassIguales();
      this.rout.navigate(['/register']);
    } else {
      try {
        const res = this.afr.auth.createUserWithEmailAndPassword(email, password);
        this.rout.navigate(['/home']);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async registerGmail() {

    try {
      const res = await this.afr.auth.signInWithPopup(new auth.GoogleAuthProvider());
      console.log(res);
      this.rout.navigate(['/home']);
    } catch (error) {
      this.errorServ();
    }


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
}
