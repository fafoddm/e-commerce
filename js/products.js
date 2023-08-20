
// Area para integracion de productos en HTML.

const objeto_productos = [];
let container = document.querySelector("#productsContainer")

document.addEventListener("DOMContentLoaded", async () => {
    try {
        let endpoint = "https://japceibal.github.io/emercado-api/cats_products/101.json";
        const res = await fetch(endpoint);
        const data = await res.json();
        const objeto_productos = data;

        let tarjeta = '';

        for (let producto of objeto_productos.products) {
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
                </div>`;
        }
    
        container.innerHTML += `
            <div class="album py-5">
                <div class="container">
                    <div class="row">
                        ${tarjeta}
                    </div>
                </div>
            </div>`;
    
    } catch (err) {
        console.error(err);
    }
    });