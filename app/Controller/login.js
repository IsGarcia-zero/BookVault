import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDIPU2kRQAplS2jMhW5U_35SV3yr3lYuok",
    authDomain: "codevaultin.firebaseapp.com",
    projectId: "codevaultin",
    storageBucket: "codevaultin.appspot.com",
    messagingSenderId: "696211604749",
    appId: "1:696211604749:web:818da3f6f1d48c36a15c44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

const SignIn = document.querySelector(".form-login");


SignIn.addEventListener("submit", (e) => {
    e.preventDefault(); console.log("Logeando")
    const loginEmail = document.querySelector("#usuario").value;
    const loginPass = document.querySelector("#contrasena").value;
    console.log(loginEmail, loginPass)  

    
    signInWithEmailAndPassword(auth, loginEmail, loginPass)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        alert("TU UID ES:"+user.uid);
        window.location.assign('../View/index.html')
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`Error ${errorCode}: ${errorMessage}`);
    });
    
    })



   
