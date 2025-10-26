// Al hacer clic en el nombre del negocio
document.getElementById("nombre-negocio").addEventListener("click", function() {
  alert("Mira ve! la mejor tienda de Cali ois!😎");
});

// Funcionalidad del botón "Agregar al carrito"
const botones = document.querySelectorAll(".btn-agregar");
botones.forEach(boton => {
  boton.addEventListener("click", () => {
    alert("Tu producto fue agregado al carrito");
  });
});

// Formulario de contacto
const formulario = document.getElementById("form-contacto");
formulario.addEventListener("submit", function(event) {
  event.preventDefault(); // Evita que se recargue la página
  alert("Gracias por contactarnos");
  formulario.reset(); // Limpia los campos después del mensaje
});

 