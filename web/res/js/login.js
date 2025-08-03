// login.js

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

// Your Firebase config here
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

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;
    const loginBtn = form.querySelector("button[type='submit']");
    const originalBtnText = loginBtn.textContent;

    // Disable button and show loading
    loginBtn.disabled = true;
    loginBtn.style.fontStyle = "italic"
    loginBtn.textContent = "Please wait...";

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Welcome back, ${user.displayName || user.email}`,
        timer: 2000,
        showConfirmButton: false,
      });

      // Redirect to dashboard or home
      window.location.href = "dashboard";
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
      });
    } finally {
      loginBtn.disabled = false;
      loginBtn.style.fontStyle = "normal"
      loginBtn.textContent = originalBtnText;
    }
  });
});