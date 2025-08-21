import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAP7x9QPyt1DAKw8uvWqo_WHqg2X_kDiA4',
  authDomain: 'whatsbroadcast-41407.firebaseapp.com',
  projectId: 'whatsbroadcast-41407',
  storageBucket: 'whatsbroadcast-41407.firebasestorage.app',
  messagingSenderId: '310802247044',
  appId: '1:310802247044:web:9aca3039e496353cf881d1',
  measurementId: 'G-MD0JFFPS2W',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


