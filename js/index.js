document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("loggedIn") !== "true") {
    location.href = "login.html";
  }
  const logout = document.getElementById("logout");
  logout.addEventListener("click", () => {
    localStorage.clear();
    localStorage.setItem("loggedIn", "false");
    location.href = "login.html";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("autos").addEventListener("click", function () {
    localStorage.setItem("catID", 101);
    window.location = "products.html";
  });
  document.getElementById("juguetes").addEventListener("click", function () {
    localStorage.setItem("catID", 102);
    window.location = "products.html";
  });
  document.getElementById("muebles").addEventListener("click", function () {
    localStorage.setItem("catID", 103);
    window.location = "products.html";
  });
});

const botonuser = document.getElementById("logoutDropdown");
const usernameSpan = document.getElementById("usernameSpan");

let username = localStorage.getItem("username");
let imagenuser = document.createElement("img");

if (localStorage.getItem("profileImage")) {
  imagenuser.src = localStorage.getItem("profileImage");
} else {
  imagenuser.src = "img/img_perfil.png";
}
localStorage.getItem("profileImage");
imagenuser.style.width = "25px";
imagenuser.style.margin = "5px";
imagenuser.style.borderRadius = "50%";

botonuser.appendChild(imagenuser);
usernameSpan.textContent = username;
