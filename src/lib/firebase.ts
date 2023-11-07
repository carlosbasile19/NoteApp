// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { StorageReference, getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "note-app-dbbb6.firebaseapp.com",
  projectId: "note-app-dbbb6",
  storageBucket: "note-app-dbbb6.appspot.com",
  messagingSenderId: "580954712692",
  appId: "1:580954712692:web:1d5854ded910e7b5733f21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadImageToFirebase(imageUrl: string, name: string){
    try {
        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();
        const file_name = name.replace(' ', '') + Date.now() + '.jpeg';
        const storageRef = ref(storage, file_name);
        await uploadBytes(storageRef, buffer,{
            contentType: 'image/jpeg'
        });

        const firebaseUrl = await getDownloadURL(storageRef);
        return firebaseUrl;
    } catch (error) {
        console.error(error); 
    }
    
}

