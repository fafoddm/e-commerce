let idusuario = 25801;
let carritoendpoint = `https://japceibal.github.io/emercado-api/user_cart/${idusuario}.json`;

fetch(carritoendpoint)
  
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    return response.json();
  })
  .then((data) => {
    let cartContainer = document.getElementById("cart-list");
    let cartProd = data.articles;

    // Itera sobre los productos en el carrito y crea las filas de la tabla
    cartProd.forEach((producto, index) => {
      let tr = document.createElement("tr");
      let cantidad = producto.count;
      let precio = producto.unitCost;
      let subtotalProducto = cantidad * precio;

      tr.innerHTML = `
        <td class="imgProd"><img src="${producto.image}" alt="imagenDeProducto" /></td>
        <td>${producto.name}</td>
        <td>${producto.currency} ${precio}</td>
        <td>
          <input type="number" class="cantProd" value="${cantidad}" min="1" data-product-index="${index}"/>
        </td>
        <td id="subtotalProducto${index}">${producto.currency}${subtotalProducto}</td>
        
      `;

      cartContainer.appendChild(tr);
    });

    // Obtén todos los elementos de cantidad y configura los event listeners
    let cantidadInputs = document.querySelectorAll(".cantProd");
    cantidadInputs.forEach((input) => {
      input.addEventListener("input", () => {
        let cantidad = parseInt(input.value);
        let productoIndex = parseInt(input.dataset.productIndex);
        let producto = cartProd[productoIndex];
        let nuevoSubtotal = cantidad * producto.unitCost;

        producto.count = cantidad;
        producto.subtotal = nuevoSubtotal;

        // Actualiza el subtotal en la fila de la tabla
        document.getElementById(
          `subtotalProducto${productoIndex}`
        ).textContent = `${producto.currency}${nuevoSubtotal}`;

        // Recalcula el subtotal total
        let subtotal = cartProd.reduce(
          (total, prod) => total + prod.subtotal,
          0
        );
        document.getElementById(
          "subtotal"
        ).textContent = `Subtotal: ${data.articles[0].currency}${subtotal}`;
      });
    });
  })
  .catch((error) => {
    console.error("Error de conexión:", error);
  });

// Recuperar el carrito desde el almacenamiento local (si existe)
let allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    let prodID = localStorage.getItem("prodID");
    let endpoint = `https://japceibal.github.io/emercado-api/products/${prodID}.json`;
    const response = await fetch(endpoint);
    const productCart = await response.json();

    // Verificar si el producto ya está en el carrito
    const productIndex = allProducts.findIndex(
      (item) => item.id === productCart.id
    );

    if (productIndex === -1) {
      // El producto no está en el carrito, agregarlo y establecer su subtotal
      productCart.subtotal = productCart.cost;
      allProducts.push(productCart);

      // Almacenar el carrito actualizado en el almacenamiento local
      localStorage.setItem("allProducts", JSON.stringify(allProducts));
    }

    // FUNCION QUE MUESTRA LA INFO DEL PRODUCTO
    console.log(productCart);

    // Mostrar el carrito completo
    console.log(allProducts);

    updateCartTable();
  } catch (err) {
    console.error(err);
  }
});

//BORRAR DATOS DE LOCALSTORAGE DE CARRITO

function borrarElementosCarrito(idElemento){
  let productos = JSON.parse(localStorage.getItem("allProducts"));
  let indiceEliminar = productos.findIndex(objeto => objeto.id === idElemento);

  if (indiceEliminar !== -1){
    productos.splice(indiceEliminar,1);
    localStorage.setItem("allProducts", JSON.stringify(productos));
    allProducts = allProducts.filter(objeto => objeto.id !== idElemento);
    console.log(allProducts);
    if (localStorage.getItem("prodID") == idElemento){
      localStorage.setItem("prodID", 0);
    }
    location.reload();
  } 
  
}

// Función para actualizar la tabla del carrito
function updateCartTable() {
  const tbody = document.getElementById("cart-list");
  console.log("test")

  // Limpiar el contenido existente de la tabla
  tbody.innerHTML = "";

  // Recorrer los productos en el carrito y agregar filas a la tabla
  allProducts.forEach((product, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="imgProd"><img src="${product.images[0]}" alt="imagenDeProducto"/></td>
      <td>${product.name}</td>
      <td>${product.currency} ${product.cost}</td>
      <td><input type="number" class="cantProd" value="1" min="1" data-product-index="${index}" /></td>
      <td><span id="subProduct${index}">${product.currency}${product.subtotal}</span></td>
      <td><span class="btnEliminar" id="${product.id}" onClick=" borrarElementosCarrito(${product.id})">X</span></td>
    `;
    tbody.appendChild(row);
  });

  // Agrega un evento input a los elementos de cantidad
  const cantidadInputs = document.querySelectorAll(".cantProd");
  cantidadInputs.forEach((input) => {
    input.addEventListener("input", () => {
      const cantidad = parseInt(input.value);
      const productoIndex = parseInt(input.dataset.productIndex);
      const producto = allProducts[productoIndex];
      const nuevoSubtotal = producto.cost * cantidad;
      producto.subtotal = nuevoSubtotal;
      producto.count = cantidad;
      document.getElementById(
        `subProduct${productoIndex}`
      ).textContent = `${producto.currency}${nuevoSubtotal}`;
      calcularTotal();
    });
  });
}

//CALCULAR TOTAL
function calcularTotal() {
  let subtotal = 0;
  let costoEnvio = 100;

  allProducts.forEach((product) => {
    if (product.currency == "UYU") {
      subtotal += Math.round(product.subtotal / 39);
    } else {
      subtotal += product.subtotal;
    }
  });

  let inputsRadios = document.getElementsByName("envio");

  for (let i = 0; i < inputsRadios.length; i++) {
    if (inputsRadios[i].checked && i == 0) {
      porcentajeEnvio = 15;
    } else if (inputsRadios[i].checked && i == 1) {
      porcentajeEnvio = 7;
    } else if (inputsRadios[i].checked && i == 2) {
      porcentajeEnvio = 5;
    }
  }

  let total = document.getElementById("total");
  let envio = parseInt(subtotal * (porcentajeEnvio / 100));
  total.innerHTML = `TOTAL: USD ${
    subtotal + envio
  }`;

  let subtotalp = document.getElementById("subtotal");
  subtotalp.innerHTML = `<span id="totalp">Subtotal: USD ${
    subtotal
  }</span>`

  let enviop = document.getElementById("envio");
  enviop.innerHTML = `<span id="totalp">Envío: USD ${
    envio
  }</span>`
}

calcularTotal();

Array.from(document.getElementsByName("envio")).forEach((element) => {
  element.addEventListener("click", () => {
    calcularTotal();
  });
});

Array.from(document.getElementsByClassName("cantProd")).forEach((element) => {
  element.addEventListener("input", () => {
    calcularTotal();
  });
});

/* VALIDACIONES */

let nroTarjeta = document.getElementById("nTarjeta");
let segCod = document.getElementById("codigoSeg");
let vtoTar = document.getElementById("fechaVto");
let titularName = document.getElementById("nombre");
let nDeCuenta = document.getElementById("nDeCuenta");
let nDeCI = document.getElementById("nDeCI");

//Validacion de tarjeta
function validacionMetodoDePagoTar(){
 
  if(nroTarjeta.value.length==16 && segCod.value.length==3 && vtoTar.value!==""){
   alert("Tarjeta ingresada con exito")
   
  }else{
    alert("Ingrese todos los campos correctamente: recuerde ingresar los 16 digitos de la tarjeta, el codigo de seguridad que contiene 3 numeros y la fecha de vencimiento")
   
  }
}

function validarEnvio() {
  const envioRadios = document.getElementsByName("envio");
  for (const radio of envioRadios) {
    if (radio.checked) {
      return true; // Se seleccionó al menos una opción de envío
    }
  }
  return false; // Ninguna opción de envío seleccionada
}



function validarPago() {
  const pagoRadios = document.getElementsByName("pago");
  for (const radio of pagoRadios) {
    if (radio.checked) {
      if (radio.id === "credito-debito" && nroTarjeta.value !== "" && segCod.value !== "" && vtoTar.value !== "" && titularName.value !== "") {
        // Si es tarjeta de crédito o débito //
        return true;
      } else if (radio.id === "transf" && nDeTransf.value !== "" && nDeTransf.value.length >= 10) {
        // Si es transferencia bancaria //
        return true;
      } else if (radio.id === "red-cobra" && nDeCI.value !== "" && nDeCI.value.length === 8) {
        // Si es redes de cobranza //
        return true;
      }
      
      // Alertas personalizadas para cada caso
      if (radio.id === "credito-debito" && (nroTarjeta.value === "" || segCod.value === "" || vtoTar.value === "" || titularName.value === "")) {
        alert("Por favor, complete todos los campos de la tarjeta.");
      } else if (radio.id === "transf" && nDeCuenta.value === "" ||  nDeCuenta.value.length <= 10) {
        alert("Por favor, ingrese el número de cuenta correcto.");
      } else if (radio.id === "red-cobra" && (nDeCI.value === "" || nDeCI.value.length !== 8)) {
        alert("Por favor, ingrese un número de CI válido de 8 digitos.");
      }
    }
  }
  return false;
}


function validacionCuenta(){
  let nroCuenta = document.getElementById("nDeCuenta");
  let nroCI = document.getElementById("nDeCI");

  if(nroCuenta.value!=="" || nroCI.value!==""){
    alert("registro con exito");
    nroCI.value="";
    nroCuenta.value="";
    vtoTar.value = "";
  }else{
    alert("Ingrese los datos correctamente")
  }
}
 
let botonGuardarTar = document.getElementById("validacionTar");
botonGuardarTar.addEventListener("click",()=>{
  validacionMetodoDePagoTar();
});


/* VALACIONES TRASFERENCIA */
function validacionTrasferencia(){
  const numeroDeCuenta = document.getElementById("nDeTransf").value;

  if(nDeTransf >= 10 && nDeTransf !== " "){
    alert("Datos guardados");
  }if (nDeTransf < 10){
    alert("Debe ingresar un numero de cuenta valido")
  }
};

const validaTrasferencia = document.getElementById("validacionTrasferencia");
 validaTrasferencia.addEventListener("click", ()=> {
  validacionTrasferencia();
  console.log("click");
 });


 function validacionRedes() {
  const numeroCedula = document.getElementById("nDeCI").value;
 
  if (numeroCedula.length === 8 && numeroCedula.trim() !== "") {
    alert("Datos guardados");
  } else if (numeroCedula.length < 8 ) {
    alert("Debe ingresar un número de cédula válido");
  }
};

const validacionCI = document.getElementById("validacionCI");
validacionCI.addEventListener("click", ()=> {
  validacionRedes();
  console.log("click");
 });


/* Avisar de errores y compra exitosa */

const button = document.getElementById("btn-realizar-compra");
button.addEventListener("click", function() {
  // Validar dirección
  const calle = document.getElementById("calle").value;
  const numero = document.getElementById("numero").value;
  const esquina = document.getElementById("esquina").value;

  if (!calle.trim() || !numero.trim() || !esquina.trim()) {
    alert("Por favor, complete todos los campos de dirección.");
    return;
  }

  // Contar cuántas opciones de método de pago están seleccionadas
  const pagoRadios = document.getElementsByName("pago");
  let selectedCount = 0;
  let selectedPaymentMethod = null;
  for (const radio of pagoRadios) {
    if (radio.checked) {
      selectedCount++;
      selectedPaymentMethod = radio;
    }
  }

  if (selectedCount !== 1) {
    alert("Por favor, elija una única opción de método de pago.");
    return;
  }

  // Validar los campos de la opción de método de pago seleccionada
  if (selectedPaymentMethod.id === "credito-debito") {
    if (nroTarjeta.value.length !== 16 || segCod.value.length !== 3 || vtoTar.value === "" || titularName.value === "") {
      alert("Por favor, complete los campos del método de pago tarjeta.");
      return;
    }
  } else if (selectedPaymentMethod.id === "transf") {
    if (nDeCuenta.value === "" || nDeCuenta.value.length < 10) {
      alert("Por favor, ingrese un número de cuenta válido para transferencia bancaria.");
      return;
    }
  } else if (selectedPaymentMethod.id === "red-cobra") {
    if (nDeCI.value === "" || nDeCI.value.length !== 8) {
      alert("Por favor, ingrese un número de CI válido de 8 dígitos para redes de cobranza.");
      return;
    }
  }

  // Verificar cantidad de productos
  const cantProdInputs = document.getElementsByClassName("cantProd");
  for (let i = 0; i < cantProdInputs.length; i++) {
    if (parseInt(cantProdInputs[i].value, 10) === 0) {
      alert("La cantidad de productos no puede ser 0.");
      return;
    }
  }

  // Si todas las validaciones pasan, mostramos el mensaje de compra exitosa
  alert("Su compra ha sido exitosa");

  // Limpiar todos los campos
  nroTarjeta.value = "";
  segCod.value = "";
  vtoTar.value = "";
  titularName.value = "";
  nDeCuenta.value = "";
  nDeCI.value = "";
  document.getElementById("calle").value = "";
  document.getElementById("numero").value = "";
  document.getElementById("esquina").value = "";
  for (let i = 0; i < cantProdInputs.length; i++) {
    cantProdInputs[i].value = "";
  }
});



