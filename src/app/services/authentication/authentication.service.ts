import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateEmail,
  updatePassword, 
  updateProfile
} from '@angular/fire/auth';
import { getFirestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public currentUser: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, fetch their data
        this.getUserData(user.uid).then((userData) => {
          this.currentUser.next(userData);
        });
      } else {
        // User is signed out
        this.currentUser.next(null);
      }
    });
  }

  async register({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user) {
        const db = getFirestore();
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: name,
          email: email,
        });
      }
      this.currentUser.next({ name, email, password });
      return user;
    } catch (error: any) {
      console.log('Error during registration: ', error); // Log the error
      if (error.code === 'auth/email-already-in-use') {
        throw new Error(
          'The email address is already in use by another account.'
        );
      } else {
        throw new Error(
          'An error occurred during registration. Please try again.'
        );
      }
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;
      return user;
    } catch (error) {
      console.log('Error during login: ', error); // Log the error
      throw new Error('Invalid email or password. Please try again.');
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('An error occurred while signing out. Please try again.');
    }
  }

  async googleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      if (user) {
        const { displayName: name, email } = user;
        const db = getFirestore();
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: name,
          email: email,
        });
        this.currentUser.next({ name, email });
      }
      return user;
    } catch (error) {
      console.log('Error during Google login: ', error); // Log the error
      throw new Error('Google login failed. Please try again.');
    }
  }

  async forgotPassword({ email }: { email: string }) {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.log('Error during password reset: ', error); // Log the error
      throw new Error(
        'An error occurred while sending the password reset email. Please try again.'
      );
    }
  }

  async getUserData(uid: string) {
    const db = getFirestore();
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      this.currentUser.next(userData);
      return userData;
    } else {
      console.log('No such document!');
      return null;
    }
  }

  //Not used because it required user to veriying new email before changing
  async updateEmail(newEmail: string) {
    try {
      if (this.auth.currentUser) {
        await updateEmail(this.auth.currentUser, newEmail);
        await sendEmailVerification(this.auth.currentUser);
        const db = getFirestore();
        await setDoc(doc(db, 'users', this.auth.currentUser.uid), {
          email: newEmail,
        }, { merge: true });
        const userData = await this.getUserData(this.auth.currentUser.uid);
        this.currentUser.next(userData);
      }
    } catch (error) {
      console.error('Error updating email:', error);
      throw new Error('An error occurred while updating the email. Please try again.');
    }
  }

  async updatePassword(newPassword: string) {
    try {
      if (this.auth.currentUser) {
        await updatePassword(this.auth.currentUser, newPassword);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      throw new Error('An error occurred while updating the password. Please try again.');
    }
  }

  async updateName(newName: string) {
    try {
      if (this.auth.currentUser) {
        const db = getFirestore();
        await setDoc(doc(db, 'users', this.auth.currentUser.uid), {
          name: newName,
        }, { merge: true });
        await updateProfile(this.auth.currentUser, { displayName: newName });
        const userData = await this.getUserData(this.auth.currentUser.uid);
        this.currentUser.next(userData);
      }
    } catch (error) {
      console.error('Error updating name:', error);
      throw new Error('An error occurred while updating the name. Please try again.');
    }
  }
}
