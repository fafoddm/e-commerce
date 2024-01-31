const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL =
  "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL =
  "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
};

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
};

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = "ok";
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = "error";
      result.data = error;
      hideSpinner();
      return result;
    });
};

const botonDropdown = document.querySelector(".dropdown");
const contenidoDropdown = document.querySelector(".dropdown-content");

botonDropdown.addEventListener("click", () => {
  contenidoDropdown.classList.toggle("active");
});

// Modo oscuro //
// Obtén una referencia al botón
const toggleButton = document.getElementById("toggle");

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") == "light") {
    localStorage.setItem("theme", "light");
  } else if (localStorage.getItem("theme") == "dark") {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }

  /*   FUNCION QUE LE QUITA UNA CLASE CUANDO SE REDUCE LA PANTALLA */
  function adjustVhClass() {
    const images = document.querySelectorAll(".carousel-item img");
    if (window.innerWidth < 768) {
      // Pantalla estrecha
      images.forEach((img) => {
        img.classList.remove("vh-100");
      });
    } else {
      // Pantalla ancha
      images.forEach((img) => {
        img.classList.add("vh-100");
      });
    }
    
  }

  // Agregar un controlador de evento de redimensionamiento
  window.addEventListener("resize", adjustVhClass);

  // Llamar a la función al cargar la página
  adjustVhClass();

});

// Obtén todos los elementos con la clase "light" y "light2"
const elementsToToggle = document.querySelectorAll(".light, .light2");

// Agrega un evento de clic al botón
toggleButton.addEventListener("click", () => {
  if (localStorage.getItem("theme") == "light") {
    localStorage.setItem("theme", "dark");
    setTheme();
  } else if (localStorage.getItem("theme") == "dark") {
    localStorage.setItem("theme", "light");
    setTheme();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Verifica si localStorage.theme ya está configurado
  if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "light");
  }
  setTheme();
});

function setTheme() {
  elementsToToggle.forEach((element) => {
    if (localStorage.getItem("theme") == "light") {
      element.classList.replace("dark-mode", "light");
      element.classList.replace("dark-mode2", "light2");
      toggleButton.checked = false;
      console.log("light");
    } else if (localStorage.getItem("theme") == "dark") {
      console.log("dark");
      toggleButton.checked = true;
      element.classList.replace("light", "dark-mode");
      element.classList.replace("light2", "dark-mode2");
    }
  });
}

const itemsCarrusel = document.getElementById("carouselChance");

itemsCarrusel.addEventListener("click", () => {
  window.location = "categories.html";
  console.log("click");
});

