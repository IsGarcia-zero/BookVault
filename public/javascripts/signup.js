const Signup = document.querySelector("#signup-form");
Signup.addEventListener("submit", (e) => {
    e.preventDefault(); console.log("enviando")
    const SignupEmail = document.querySelector("#email").value;
    const SignupPass = document.querySelector("#pass").value;
    const SignupNombre = document.querySelector("#nombre").value;
    const SignupEdad = document.querySelector("#edad").value;
    console.log(SignupEdad, SignupEmail, SignupPass, SignupNombre)

    auth
        .createUserwithEmailandPassword(SignupEmail, SignupPass).then(userCredential => {
            console.log("signedUp")
        })

})