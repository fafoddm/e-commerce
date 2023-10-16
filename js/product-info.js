//solicitud adecuada para obtener la información de dicho producto.
document.addEventListener("DOMContentLoaded", async () => {
  try {
    let prodID = localStorage.getItem("prodID");

    let endpoint = `https://japceibal.github.io/emercado-api/products/${prodID}.json`;

    const res = await fetch(endpoint);
    const productData = await res.json();

    //FUNCION QUE MUESTRA LA INFO DEL PRODUCTO
    console.log(productData);

    let comentEndpoint = `https://japceibal.github.io/emercado-api/products_comments/${prodID}.json`;
    const comentRes = await fetch(comentEndpoint);
    const comentData = await comentRes.json();
    console.log(comentData);

    showInfoProducts(productData, comentData);
  } catch (err) {
    console.error(err);
  }

  // Obtén una lista de todas las miniaturas
  const miniaturas = document.querySelectorAll(".miniatura");
  const mainImage = document.getElementById("main-image");

  // Agrega un controlador de eventos a cada miniatura
  miniaturas.forEach((miniatura) => {
    miniatura.addEventListener("click", () => {
      mainImage.src = miniatura.src;
      mainImage.alt = miniatura.alt;
    });
  });

  // Obtén una lista de todas las estrellas
  let stars = document.querySelectorAll(".star");
  let ratingInput = document.getElementById("rating");
  let botonEnv = document.getElementById("botonEnv");

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      const clickedIndex = parseInt(star.getAttribute("data-index"));
      let selectedRating = clickedIndex + 1; // Almacena la puntuación en una variable

      // Marca como activa todas las estrellas hasta la que se hizo clic
      for (let i = 0; i <= clickedIndex; i++) {
        stars[i].classList.add("active");
      }

      // Desmarca las estrellas después de la que se hizo clic
      for (let i = clickedIndex + 1; i < stars.length; i++) {
        stars[i].classList.remove("active");
      }

      // Almacena la puntuación en el campo oculto
      ratingInput.value = selectedRating;
    });
  });

  botonEnv.addEventListener("click", () => {
    agregarComentario();
  });

  //AL HACER CLICK TE LLEVA AL CARRITO, toma el id del boton "añadir al carrito"
  function getProdId() {
    window.location = "cart.html";
  }


      //AL HACER CLICK TE LLEVA AL CARRITO, toma el id del boton "añadir al carrito"
        let addCart = document.getElementById("addCart");
        addCart.addEventListener("click", ()=> {
          getProdId();
         
          console.log("click");
        });
       

});

function showInfoProducts(productData, comentData) {
  const container = document.getElementById("container-product");
  const cajaComentarios = document.getElementById("comentarios");

  const productosRelacionados = document.getElementById("relacionados");

  let tucomentario = document.getElementById("tucomentario");
  let comentariosProducto = "";

  let productInfoHTML = `
    <div class="row product-container">
      <div class="col-7 product-images">
        <div class="miniatura-images">
          <img src="${productData.images[0]}" alt="${productData.name}" class="miniatura">
          <img src="${productData.images[1]}" alt="${productData.name}" class="miniatura">
          <img src="${productData.images[2]}" alt="${productData.name}" class="miniatura">
          <img src="${productData.images[3]}" alt="${productData.name}" class="miniatura">
        </div>
        <div class="principal-image">
          <img src="${productData.images[0]}" alt="${productData.name}" id="main-image">
        </div>
      </div>

      <div class="col-5 caractproducto">
        <h2>${productData.name}</h2>
        <p class="descrip">${productData.description}</p>
        <p id="precio"><span id="moneda-productinfo">${productData.currency}</span> ${productData.cost}</p>
        <p> <b>Categoria:</b> ${productData.category}</p>
        <p> <b>Cantidad de vendidos: </b> ${productData.soldCount}</p>
       <button class="btn btn-success" id="addCart" >Añadir al carrito</button>
      </div>
    </div>`;

  comentData.forEach((comentario) => {
    comentariosProducto = `

    <div class="comentario light2" style="color: #161515;">

        <p class="puntuacion">
          ${generarEstrellas(comentario.score)}
          <span class="fecha">${comentario.dateTime}</span></p>
        <p class="comentario-texto">${comentario.description}</p>
        <p class="usuario"><b>-${comentario.user}</b></p>
    </div>
    `;

    cajaComentarios.innerHTML += comentariosProducto;
  });

  let tucomentarioHTML = `<h4>Agrega un comentario</h4>
        <label for="estrellas">Toca una estrella para calificar
          <div id="puntos" class="custom-select star-rating" style="color: #161515;">
            <input type="hidden" id="rating" value="0">
            <span class="star" data-index="0">&#9733;</span>
            <span class="star" data-index="1">&#9733;</span>
            <span class="star" data-index="2">&#9733;</span>
            <span class="star" data-index="3">&#9733;</span>
            <span class="star" data-index="4">&#9733;</span>
          </div>
        </label><br>
        <textarea class="form-control" id="comment-nuevo" placeholder="Escriba aquí su comentario..."></textarea><br>
        <button class="btn btn-primary" id="botonEnv" style=>Enviar</button>

    `;
  container.innerHTML = productInfoHTML;
  tucomentario.innerHTML = tucomentarioHTML;

  productData.relatedProducts.forEach((relatedProduct) => {
    console.log(relatedProduct);
    productosRelacionados.innerHTML += `
    <div class="col-lg-3 col-md-4 col-sm-6 mb-4" onclick="setProdID(${relatedProduct.id})">
    <div class="card light2 mb-4 custom-shadow h-100 bg-light cursor-active">
        <img src="./${relatedProduct.image}" style="pointer-events: none;" class="card-img-top" alt="${relatedProduct.name}">
        <div class="card-body">
            <p class="card-text" style="color: #161515;"> 
                <p class="nameCar" style="color: #161515;">${relatedProduct.name}</p>
            </p>
        </div>    
    </div>
  </div>`;
  });
}

function agregarComentario() {
  let comentar = document.getElementById("comment-nuevo").value;
  let puntaje = parseInt(document.getElementById("rating").value); // Obtén la puntuación del campo oculto
  let usuario = username; // Reemplaza esto con el nombre de usuario real
  let fecha = obtenerFechaActual(); // Obtén la fecha actual
  let stars = document.querySelectorAll(".star");

  if (puntaje > 0 && puntaje <= 5) {
    let estrellasHTML = generarEstrellas(puntaje);

    const nuevoComentario = `
          <div class="comentario" style="color: #161515;">
              <p class="puntuacion">${estrellasHTML}<span class="fecha"> ${fecha}</span></p>
              <p class="comentario-texto">${comentar}</p>
              <p class="usuario"><b>-${usuario}</b></p>
          </div>
      `;

    document.getElementById("comentarios").innerHTML += nuevoComentario;
    console.log(stars);
    // Restaura la selección de estrellas y el campo de comentario
    stars.forEach((star) => star.classList.remove("active"));
    document.getElementById("comment-nuevo").value = "";
    document.getElementById("rating").value = "0";
  } else {
    alert("Por favor, selecciona una puntuación válida.");
  }
}

function obtenerFechaActual() {
  const fecha = new Date();
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return fecha.toLocaleDateString("es-ES", options);
}

function generarEstrellas(puntaje) {
  let estrellaLlena =
    "<img src='img/estrellaCompleta.svg' alt='Estrella completa' width='15px'>";
  let estrellaVacia =
    "<img src='img/estrellaVacia.svg' alt='Estrella vacía'  width='15px'>";

  let estrellasHTML = "";

  for (let i = 0; i < 5; i++) {
    if (i < puntaje) {
      estrellasHTML += estrellaLlena;
    } else {
      estrellasHTML += estrellaVacia;
    }
  }

  return estrellasHTML;
}

const nuevoComentario = `
          <div class="comentario">
              <p class="puntuacion">${estrellasHTML}<span class="fecha"> ${fecha}</span></p>
              <p class="comentario-texto">${comentar}</p>
              <p class="usuario"><b>-${usuario}</b></p>
          </div>
      `;

document.getElementById("comentarios").innerHTML += nuevoComentario;

document.getElementById("comentarios").innerHTML += nuevoComentario;

function setProdID(id) {
  localStorage.setItem("prodID", id);
  window.location = "product-info.html";
}
