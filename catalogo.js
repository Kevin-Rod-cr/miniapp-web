document.addEventListener("DOMContentLoaded", () => {
  const listaCatalogo = document.getElementById("listaCatalogo");
  const carritoDiv = document.getElementById("carrito");
  const totalSpan = document.getElementById("total");
  const btnVaciar = document.getElementById("vaciarCarrito");
  const btnComprar = document.getElementById("comprar");

  let productos = JSON.parse(localStorage.getItem("productos")) || [];
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  renderCatalogo();
  renderCarrito();

  function renderCatalogo() {
    listaCatalogo.innerHTML = "";

    if (productos.length === 0) {
      listaCatalogo.innerHTML = `<p class="text-center text-muted">No hay productos disponibles.</p>`;
      return;
    }

    productos.forEach((prod) => {
      const col = document.createElement("div");
      col.className = "col-md-4";

      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${prod.nombre}</h5>
            <p class="card-text">${prod.descripcion}</p>
            <p class="text-success fw-bold">$${prod.precio}</p>
            <p class="text-muted">Stock disponible: ${prod.stock}</p>
            <div class="mt-auto">
              <input type="number" min="1" max="${prod.stock}" value="1" class="form-control mb-2 cantidadInput">
              <button class="btn btn-primary w-100 agregar">Agregar al carrito</button>
            </div>
          </div>
        </div>
      `;

      col.querySelector(".agregar").addEventListener("click", () => {
        const cantidad = parseInt(col.querySelector(".cantidadInput").value);
        agregarAlCarrito(prod, cantidad);
      });

      listaCatalogo.appendChild(col);
    });
  }

  function agregarAlCarrito(prod, cantidad) {
    if (cantidad <= 0 || cantidad > prod.stock) {
      alert("Cantidad no válida o sin stock disponible.");
      return;
    }

    const itemExistente = carrito.find((p) => p.id === prod.id);
    if (itemExistente) {
      if (itemExistente.cantidad + cantidad > prod.stock) {
        alert("No hay suficiente stock disponible.");
        return;
      }
      itemExistente.cantidad += cantidad;
    } else {
      carrito.push({ ...prod, cantidad });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
  }

  function renderCarrito() {
    carritoDiv.innerHTML = "";

    if (carrito.length === 0) {
      carritoDiv.innerHTML = `<p class="text-center text-muted">Tu carrito está vacío.</p>`;
      totalSpan.textContent = "0";
      return;
    }

    let total = 0;

    carrito.forEach((item) => {
      total += item.precio * item.cantidad;

      const div = document.createElement("div");
      div.className = "d-flex justify-content-between align-items-center border-bottom py-2";
      div.innerHTML = `
        <div>
          <strong>${item.nombre}</strong> <br>
          <small>Cantidad: ${item.cantidad}</small>
        </div>
        <div>
          <span>$${item.precio * item.cantidad}</span>
          <button class="btn btn-sm btn-outline-danger ms-2 eliminar">X</button>
        </div>
      `;

      div.querySelector(".eliminar").addEventListener("click", () => {
        eliminarDelCarrito(item.id);
      });

      carritoDiv.appendChild(div);
    });

    totalSpan.textContent = total.toFixed(2);
  }

  function eliminarDelCarrito(id) {
    carrito = carrito.filter((item) => item.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
  }

  btnVaciar.addEventListener("click", () => {
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
  });

  btnComprar.addEventListener("click", () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    // Reducir stock de los productos
    carrito.forEach((item) => {
      const prod = productos.find((p) => p.id === item.id);
      if (prod) prod.stock -= item.cantidad;
    });

    localStorage.setItem("productos", JSON.stringify(productos));
    carrito = [];
    localStorage.removeItem("carrito");

    renderCatalogo();
    renderCarrito();

    const toastEl = document.getElementById("toastCompra");
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  });
});
