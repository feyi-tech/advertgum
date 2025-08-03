import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

// Initialize Firebase (replace with your Firebase config)
const firebaseConfig = {
  apiKey: "AIzaSyBL8Ow_JfdpBg6jBv_1GqzjQrrofRdQmes",
  authDomain: "cinegum-com.firebaseapp.com",
  projectId: "cinegum-com",
  storageBucket: "cinegum-com.firebasestorage.app",
  messagingSenderId: "137389099636",
  appId: "1:137389099636:web:eeeed95885e01802a9df21",
  measurementId: "G-YBQETG45RQ"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;

    const registerBtn = form.querySelector("button[type='submit']");
    const originalBtnText = registerBtn.textContent;

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Passwords do not match",
        text: "Please confirm your password again.",
      });
      return;
    }

    try {
        // Disable the button and change text
        registerBtn.disabled = true;
        registerBtn.style.fontStyle = "italic"
        registerBtn.textContent = "Please wait...";

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "You can now proceed to your dashboard.",
      }).then(() => {
        window.location.href = "/dashboard"; // or wherever your dashboard is
      });

    } catch (error) {
      console.log("error", error)
      let message = "An error occurred. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        message = "This email is already in use.";
      } else if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email.";
      } else if (error.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      }

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: message,
      });

    } finally {
        // Disable the button and change text
        registerBtn.disabled = false;
        registerBtn.style.fontStyle = "normal"
        registerBtn.textContent = originalBtnText;
    }
  });
});