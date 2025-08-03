// auth-menu.js

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import Swal from 'https://cdn.skypack.dev/sweetalert2';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBL8Ow_JfdpBg6jBv_1GqzjQrrofRdQmes",
  authDomain: "cinegum-com.firebaseapp.com",
  projectId: "cinegum-com",
  storageBucket: "cinegum-com.appspot.com",
  messagingSenderId: "137389099636",
  appId: "1:137389099636:web:eeeed95885e01802a9df21",
  measurementId: "G-YBQETG45RQ"
};

// Initialize Firebase app if not already initialized
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Create link element
function createNavLink(href, text, className = "") {
  const a = document.createElement("a");
  a.href = href;
  a.textContent = text;
  a.className = className || "text-gray-600 hover:text-indigo-600";
  return a;
}

// Helper to create sign-out button
function createSignOutButton(text, className = "") {
  const button = document.createElement("button");
  button.textContent = text || "Log Out";
  button.className = className || "text-gray-600 hover:text-red-600";
  button.onclick = async () => {
    const confirmed = await Swal.fire({
      title: "Sign Out?",
      text: "Are you sure you want to sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366F1", // Indigo
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, sign out"
    });

    if (confirmed.isConfirmed) {
      try {
        await signOut(auth);
        Swal.fire("Signed out!", "You have been logged out.", "success").then(() => {
          window.location.href = "/";
        });
      } catch (error) {
        Swal.fire("Error", "Something went wrong during sign out.", "error");
      }
    }
  };
  return button;
}

// Update nav menus
function updateMenus(user) {
  const username = document.querySelector("#username")
  if(username && user) username.textContent = user.displayName || user.email
  const menu = document.getElementById("menu");
  const mobileMenu = document.getElementById("mobileMenu");
  if (!menu || !mobileMenu) return;

  // Clear existing links
  menu.innerHTML = "";
  mobileMenu.innerHTML = "";

  const links = [
    { href: "/", text: "Home" },
    { href: "/about", text: "About" },
    { href: "/browse-packs", text: "Browse Cards" },
    { href: "/create-pack", text: "Create Cards" },
  ];

  links.forEach(link => {
    menu.appendChild(createNavLink(link.href, link.text));
    mobileMenu.appendChild(createNavLink(link.href, link.text));
  });

  if (user) {
    // Logged in
    menu.appendChild(createNavLink("/dashboard", "Dashboard"));
    mobileMenu.appendChild(createNavLink("/dashboard", "Dashboard"));

    //Logout
    menu.appendChild(createSignOutButton("Sign Out", "bg-indigo-600 text-white px-4 py-2 rounded-lg"));
    mobileMenu.appendChild(createSignOutButton("Sign Out", "bg-indigo-600 text-white px-4 py-2 rounded-lg"));
  } else {
    // Logged out
    menu.appendChild(createNavLink("/login", "Login"));
    menu.appendChild(createNavLink("/register", "Sign Up", "bg-indigo-600 text-white px-4 py-2 rounded-lg"));

    mobileMenu.appendChild(createNavLink("/login", "Login"));
    mobileMenu.appendChild(createNavLink("/register", "Sign Up", "bg-indigo-600 text-white px-4 py-2 rounded-lg"));
  }
}

const redirectInvalidPage = (user) => {
  const invalidForLoginUser = ["/login", "/login.html", "/register", "/register.html"]
  const invalidForLogoutUser = ["/dashboard", "/dashboard.html", "/kyc", "/kyc.html", "/create-pack", "/create-pack.html"]

  if(user && invalidForLoginUser.includes(document.location.pathname)) {
    document.location.href = "/dashboard"

  } else if(!user && invalidForLogoutUser.includes(document.location.pathname)) {
    document.location.href = "/login"
  }
}
// Auth state listener
const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
  redirectInvalidPage(user)
  updateMenus(user);
});

document.addEventListener("DOMContentLoaded", () => {
  const menuToggler = document.querySelector("#menu-toggler");
  const body = document.querySelector("body");
  

  menuToggler.addEventListener("click", async (e) => {
    document.getElementById('mobileMenu').classList.toggle('hidden');
  })

  body.addEventListener("click", async (e) => {
    if(!document.getElementById('mobileMenu').classList.contains("hidden") && e.target.id != "menu-toggler") {
      document.getElementById('mobileMenu').classList.add('hidden');
    }
  })
})