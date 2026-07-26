import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDbd7ryoSxwYRB8ut_HuHZb4W-qihYpgNg',
  authDomain: 'flikz-filmes.firebaseapp.com',
  projectId: 'flikz-filmes',
  storageBucket: 'flikz-filmes.firebasestorage.app',
  messagingSenderId: '143663669632',
  appId: '1:143663669632:web:5ba031c31718985595e165',
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
