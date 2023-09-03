
// Area para integracion de productos en HTML.

let objeto_productos = [];
let container = document.querySelector("#productsContainer");
let minCount = undefined; // Variable para valor minimo de precio
let maxCount = undefined; // Variable para valor maximo de precio
let tarjeta = '';
let valorBusqueda;
let botonBusqueda = document.querySelector('#search-button')

document.addEventListener("DOMContentLoaded", async () => {
    try {
        let catID = localStorage.getItem("catID");
        catID = parseInt(catID);

        let endpoint = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;
        const res = await fetch(endpoint);
        const data = await res.json();
        objeto_productos = data.products;

        let catName = data.catName;
        let catArticulos = document.querySelector(".lead");
        catArticulos.innerHTML = `Verás aquí todos los productos de la categoría ${catName}`

        
    showProducts(objeto_productos);

    } catch (err) {
        console.error(err);
    }
});


let btnAsc = document.getElementById("ordenAsc");
let btnDesc = document.getElementById("ordenDesc");
let btnRelv = document.getElementById("ordenRelv");


btnAsc.addEventListener('click', e => {
    ordenarProductos('shortAsc');
});
btnDesc.addEventListener('click', e => {
    ordenarProductos('shortDesc');
});
btnRelv.addEventListener('click', e => {
    ordenarProductos('shortRelv');
});

function ordenarProductos(sortType) {
    let objetosFiltrados = [];
    container.innerHTML = "";
    tarjeta = "";

    if (sortType == 'shortAsc') {
        objeto_productos.sort((a, b) => a.cost - b.cost);
        objetosFiltrados = objeto_productos;

    } else if (sortType == 'shortDesc') {
        objeto_productos.sort((a, b) => b.cost - a.cost);
        objetosFiltrados = objeto_productos;
    } else if (sortType == 'shortRelv') {
        objeto_productos.sort((a, b) => b.soldCount - a.soldCount);
        objetosFiltrados = objeto_productos;
    } 

    showProducts(objetosFiltrados);
};



// Falta hacer que se muestre la lista de los productos según rango de precio al filtrar por rango de precio y al limpiar (crear función para eso)
document.addEventListener("DOMContentLoaded", function(e){

    // Función de Filtrar por rango de precio
    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        filtrarPorRangoDePrecio();

        //Mostrar los productos con el filtro, Ej: showProductsList();
    });

    // Función de Limpiar los filtros
    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";
        
        cleanFilter()
        //Ej: showProductsList();
    });

});

function createCard(producto){
    tarjeta += `
    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div class="card mb-4 custom-shadow h-100 bg-light cursor-active">
            <img src="./${producto.image}" class="card-img-top" alt="${producto.name}">
            <div class="card-body">
                <p class="card-text"> 
                    <p class="nameCar">${producto.name}</p>
                    <p class="desCar">${producto.description}</p>
                </p>    
            </div>    
                <div class="priceAmount d-flex justify-content-between align-items-center">
                    <p class="priceCar">USD ${producto.cost}</p>
                    <p class="amountCar ms-auto me-0">${producto.soldCount}</p>
                </div>
        </div>
    </div>`
};

function addProduct(){
    container.innerHTML += `
    <div class="album py-5">
        <div class="container">
            <div class="row">
                ${tarjeta}
            </div>
        </div>
    </div>`
};

function showProducts(objetos){
    container.innerHTML = "";    
    for (let producto of objetos) {
        createCard(producto);
    };
    addProduct();
}

function filtrarPorRangoDePrecio(){
    let precioMinimo = document.getElementById("rangeFilterCountMin").value;
    let precioMaximo = document.getElementById("rangeFilterCountMax").value;
    let objetosFiltrados = [];
    container.innerHTML = "";
    tarjeta = "";

    if (precioMaximo != "" && precioMinimo != ""){
        objetosFiltrados = objeto_productos.filter((element) =>
            element.cost >= precioMinimo && element.cost <= precioMaximo 
        );
    }
    
    else if (precioMinimo == ""){
        objetosFiltrados = objeto_productos.filter((element) => 
            element.cost <= precioMaximo 
        );
    }

    else if (precioMaximo == ""){
        objetosFiltrados = objeto_productos.filter((element) =>
            element.cost >= precioMinimo 
        );
    };

    showProducts(objetosFiltrados);

};

function barrraDeBusqueda() {
    container.innerHTML = "";
    tarjeta = "";

    valorBusqueda = valorBusqueda.toLowerCase();

    objeto_productos.forEach(producto => {
        const productName = producto.name.toLowerCase();
        const productDescription = producto.description.toLowerCase();

        if (productName.includes(valorBusqueda) || productDescription.includes(valorBusqueda)) {
            createCard(producto);
        }
    });

    addProduct();
}

botonBusqueda.addEventListener('click', () => {
    valorBusqueda = document.querySelector('#search').value;
    barrraDeBusqueda()
})

document.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      valorBusqueda = document.querySelector('#search').value;
      barrraDeBusqueda()
    }
  });

function cleanFilter(){
    container.innerHTML = "";
    tarjeta = "";

    for (let producto of objeto_productos) {
        createCard(producto);
    };

    addProduct()
}