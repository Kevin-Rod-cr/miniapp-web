document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  const lista = document.getElementById("listaProductos");

  // Cargar productos guardados (sin eliminar los existentes)
  let productos = JSON.parse(localStorage.getItem("productos")) || [];

  // Mostrar productos al cargar
  renderProductos();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);
    const stock = parseInt(document.getElementById("stock").value);
    const descripcion = document.getElementById("descripcion").value.trim();
    const imagenURL = document.getElementById("imagen").value.trim();
    const imagenArchivo = document.getElementById("imagenArchivo").files[0];

    let imagenFinal = "";

    if (imagenArchivo) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagenFinal = e.target.result;
        guardarProducto(nombre, precio, stock, descripcion, imagenFinal);
      };
      reader.readAsDataURL(imagenArchivo);
    } else {
      imagenFinal = imagenURL || "https://via.placeholder.com/150";
      guardarProducto(nombre, precio, stock, descripcion, imagenFinal);
    }

    form.reset();
  });

  function guardarProducto(nombre, precio, stock, descripcion, imagen) {
    const nuevoProducto = {
      id: Date.now(),
      nombre,
      precio,
      stock,
      descripcion,
      imagen,
    };
    productos.push(nuevoProducto);
    localStorage.setItem("productos", JSON.stringify(productos));
    renderProductos();
  }

  function renderProductos() {
    lista.innerHTML = "";

    if (productos.length === 0) {
      lista.innerHTML = `<p class="text-center text-muted">No hay productos registrados.</p>`;
      return;
    }

    productos.forEach((prod) => {
      const col = document.createElement("div");
      col.className = "col-md-4";

      col.innerHTML = `
        <div class="card h-100 shadow-sm text-white" style="background-color: rgba(255,255,255,0.1);">
          <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
          <div class="card-body">
            <h5 class="card-title">${prod.nombre}</h5>
            <p class="card-text">${prod.descripcion}</p>
            <p class="fw-bold" style="color:#00ffcc;">$${prod.precio.toLocaleString('es-CO')}</p>
            <p class="text-light">Stock: ${prod.stock}</p>
            <div class="d-flex justify-content-between">
              <button class="btn btn-warning btn-sm editar">Editar</button>
              <button class="btn btn-danger btn-sm eliminar">Eliminar</button>
            </div>
          </div>
        </div>
      `;

      // Botón eliminar
      col.querySelector(".eliminar").addEventListener("click", () => {
        if (confirm(`¿Eliminar "${prod.nombre}"?`)) {
          productos = productos.filter((p) => p.id !== prod.id);
          localStorage.setItem("productos", JSON.stringify(productos));
          renderProductos();
        }
      });

      // Botón editar
      col.querySelector(".editar").addEventListener("click", () => {
        editarProducto(prod);
      });

      lista.appendChild(col);
    });
  }

  function editarProducto(prod) {
    // Rellenar los campos del formulario
    document.getElementById("nombre").value = prod.nombre;
    document.getElementById("precio").value = prod.precio;
    document.getElementById("stock").value = prod.stock;
    document.getElementById("descripcion").value = prod.descripcion;
    document.getElementById("imagen").value = prod.imagen;

    // Eliminar el producto viejo
    productos = productos.filter((p) => p.id !== prod.id);
    localStorage.setItem("productos", JSON.stringify(productos));

    // Enfocar el campo nombre para edición
    document.getElementById("nombre").focus();
  }

  // 🔁 Sincronización automática con el catálogo
  window.addEventListener("storage", (e) => {
    if (e.key === "productos") {
      productos = JSON.parse(localStorage.getItem("productos")) || [];
      renderProductos();
    }
  });
});
