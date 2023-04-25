import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAoxZnknPAcsAcXoxtcfw6jfVJBGxwgAUA",
    authDomain: "appointment-app-40161.firebaseapp.com",
    projectId: "appointment-app-40161",
    storageBucket: "appointment-app-40161.appspot.com",
    messagingSenderId: "512802757226",
    appId: "1:512802757226:web:90360f295da9a149784813"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);