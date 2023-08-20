document.getElementById("loginForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    
    const username=document.querySelector('[name="nombre"]').value;
    const password=document.querySelector('[name="contraseña"]').value;
    
    if(username!=="" && (password!=="" && password.length >= 6)){
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username",username);
        location.href="index.html";
    }else{alert("Usuario invalido");
    }
});

// document.getElementById("loginButton").addEventListener("click", function() {
//     // Obtén el valor del campo de contraseña
//     let password = document.getElementById("password").value;

//     // Verifica si la contraseña cumple con los criterios (por ejemplo, al menos 6 caracteres)
//     if (password.length >= 6) {
//         // Redirige al usuario a la página de inicio
//         window.location.href = "index.html";
//     } else {
//         alert("La contraseña debe tener al menos 6 caracteres.");
//     }
// });
