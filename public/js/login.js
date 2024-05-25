function signup() {
    window.location.href = './signup';
    // Κάνουμε το μήνυμα invisible όταν πατάει το κουμπί "Sign Up"
    document.getElementById("loginMessage").style.display = "none";
    // Εμφανίζουμε τη φόρμα εγγραφής
   // document.querySelector(".login-form-container").style.cssText = "display: none;";
    document.querySelector(".signup-form-container").style.cssText = "display: block;";
   document.querySelector(".container").style.cssText = "background: linear-gradient(to bottom, rgb(6, 108, 100),  rgb(80, 130, 133));";
   document.querySelector(".button-1").style.cssText = "display: none";
   document.querySelector(".button-2").style.cssText = "display: block";
   
}

function login() {

    window.location.href = './login';
}

// Επιλέγουμε τη φόρμα εγγραφής
const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", function(event) {
    // Κάνουμε το μήνυμα visible όταν υποβάλλεται η φόρμα "Sign Up"
    document.getElementById("loginMessage").style.display = "block";
});

// Επιλέγουμε τη φόρμα σύνδεσης
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", function(event) {
    // Κάνουμε το μήνυμα visible όταν υποβάλλεται η φόρμα "Login"
    document.getElementById("loginMessage").style.display = "block";
});
