// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

const Signup = document.querySelector("#signup-form");
Signup.addEventListener("submit", (e) => {
  e.preventDefault(); console.log("enviando")
  const signupEmail = document.querySelector("#email").value;
  const signupPass = document.querySelector("#pass").value;
  const signupNombre = document.querySelector("#nombre").value;
  const signupEdad = document.querySelector("#edad").value;
  console.log(signupEdad, signupEmail, signupPass, signupNombre)

  createUserWithEmailAndPassword(auth, signupEmail, signupPass).then(userCredential => {
    window.location.assign('/')
  });

})