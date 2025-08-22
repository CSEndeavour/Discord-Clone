import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyAW0CuI8_M-TP00VJAFCqVjTBOFUxWX7Wc",
    authDomain: "discord-clone-e6bd3.firebaseapp.com",
    projectId: "discord-clone-e6bd3",
    storageBucket: "discord-clone-e6bd3.firebasestorage.app",
    messagingSenderId: "547956437193",
    appId: "1:547956437193:web:be4f9c169f760f82ea1d18",
    measurementId: "G-FSMQ23B129"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { auth, provider }
export default db