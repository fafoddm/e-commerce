document.addEventListener("DOMContentLoaded",()=>{
    if(localStorage.getItem("loggedIn")!== "true"){
    location.href="login.html"
}
const logout=document.getElementById("logout");
    logout.addEventListener("click",()=>{
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      localStorage.setItem("loggedIn","false");
      location.href="login.html";
});
});

document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
   
});

const botonuser=document.getElementById("logoutDropdown")
let username=localStorage.getItem("username");
let imagenuser=document.createElement("img");
imagenuser.src ='img/img-iconos/logoPerfil.png';
imagenuser.style.width = "30px";
botonuser.innerHTML='';
botonuser.appendChild(imagenuser);
botonuser.appendChild(document.createTextNode(username));