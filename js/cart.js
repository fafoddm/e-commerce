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

// Función para actualizar la tabla del carrito
function updateCartTable() {
  const tbody = document.getElementById("cart-list");

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
  let total = 0;
  let costoEnvio = 100;

  allProducts.forEach((product) => {
    if (product.currency == "USD") {
      total += Math.round(product.subtotal * 39);
    } else {
      total += product.subtotal;
    }
  });

  let inputsRadios = document.getElementsByName("envio");

  for (let i = 0; i < inputsRadios.length; i++) {
    if (inputsRadios[i].checked && i == 0) {
      costoEnvio = 15;
    } else if (inputsRadios[i].checked && i == 1) {
      costoEnvio = 7;
    } else if (inputsRadios[i].checked && i == 2) {
      costoEnvio = 5;
    }
  }

  let totalp = document.getElementById("total");
  totalp.innerHTML = `<span id="totalp">TOTAL: </span>UYU ${
    total + parseInt(total * (costoEnvio / 100))
  }`;
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
