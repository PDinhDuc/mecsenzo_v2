import { getFirestore } from '@firebase/firestore'
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCilhC7lUYvFJlxlO3wnkCl_KpvYckRomI",
  authDomain: "mecsenzo-301e5.firebaseapp.com",
  databaseURL: "https://mecsenzo-301e5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mecsenzo-301e5",
  storageBucket: "mecsenzo-301e5.firebasestorage.app",
  messagingSenderId: "26987904737",
  appId: "1:26987904737:web:e12e825634c9eff7d641a0",
  measurementId: "G-0DYKBHXM5F"
}

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const storage = getStorage(app)
// connectFirestoreEmulator(db, 'localhost', 8080)

export { storage, db }