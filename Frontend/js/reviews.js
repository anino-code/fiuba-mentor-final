let usuariosDisponibles = [];
const cardContainer = document.getElementById('grid-tarjetas-review');

const form = document.getElementById("formCrearReview");
const inputBuscadorPuntuado = document.getElementById("input-buscador-puntuado");
const inputBuscadorPuntuador = document.getElementById("input-buscador-puntuador");
const inputOcultoPuntuado = document.getElementById("input-oculto-puntuado");
const inputOcultoPuntuador = document.getElementById("input-oculto-puntuador");
const listaSugerenciasPuntuado = document.getElementById("lista-sugerencias-puntuado");
const listaSugerenciasPuntuador = document.getElementById("lista-sugerencias-puntuador");
const mensajeError = document.getElementById("mensajeError");
const mensajeExito = document.getElementById("mensajeExito");

function contieneLetra(texto) {
  return /[a-zA-Z]/.test(texto);
}

async function cargarUsuarios() {
  try {
    const respuesta = await fetch("http://localhost:3000/api/users");
    usuariosDisponibles = await respuesta.json();
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
  }
}
cargarUsuarios();

async function cargarCard() {
    try{
    const response = await fetch('http://localhost:3000/api/reviews');
    const datos = await response.json();
    renderizarReviews(datos);
    } catch (error){
        console.error("Error critico: ", error);
        cardContainer.innerHTML = `<p style = "color:red"> Error al cargar los datos: ${error.message}</p>`;
    }
}

cargarCard();

function renderizarReviews(reviews){
    cardContainer.innerHTML = ' ';
    let htmlAcomulado ='';
    reviews.forEach(review => {
        const cardHTML = `
            <div class="masonry-item" data-id="${review.id_review}">
                <div class="card">
                    <div class="card-content has-text-centered">
                        <p class="content is-size-6 has-text-black mb-4">
                            ${review.descripcion}
                        </p>
                        <p class="is-size-7 mb-2">Aura: ${review.aura}</p>
                    </div>
                    <div class="media is-vcentered has-text-centered border-top pt-1 mb-2 footer-card">
                        <div class="media-content">
                            <figure class="image is-32x32 is-inline-block">
                                <img class="author-avatar" src="${review.puntuador.foto_user}" alt="Avatar">
                            </figure>
                        </div>
                        <div class="media-content">
                            <p class="is-size-6 has-text-weight-semibold mt-2 has-text-dark">${review.puntuador.nombre} ${review.puntuador.apellido}</p>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a class="card-footer-item button is-white is-small" onclick="confirmacionEliminarReview(${review.id_review}, this)">Eliminar review</a>
                    </footer>
                </div>
            </div>
        `;
        cardContainer.innerHTML += cardHTML;
    });
}

function cerrarPopupCrearReview() {
    const popup = document.getElementById('popupOverlayCrearReview');
    const form = document.getElementById('formCrearReview');
    if (form) {
        form.reset();
    }
    if (popup) {
        popup.style.display = 'none';
    }
}

function abrirPopupCrearReview() {
    const popup = document.getElementById('popupOverlayCrearReview');
    if (popup) {
        popup.style.display = 'flex';
    }
    mensajeError.style.display = "none";
    mensajeExito.classList.remove("show");
}

function manejarBuscador(input, lista, inputOculto) {
  input.addEventListener("input", () => {
    const textoEscrito = input.value.toLowerCase().trim();

    if (!textoEscrito) {
      lista.style.display = "none";
      inputOculto.value = "";
      return;
    }

    const coincidencias = usuariosDisponibles.filter(usuario =>
      usuario.nombre.toLowerCase().includes(textoEscrito)
    );

    renderizarSugerencias(coincidencias, lista, input, inputOculto);
  });
}

form.addEventListener('submit', async function(event) {
  event.preventDefault();

  const puntuadoId = inputOcultoPuntuado.value;
  const puntuadorId = inputOcultoPuntuador.value;
  const descripcion = form.descripcion.value.trim();
  const aura = Number(form.aura.value);

  if (!puntuadoId || !puntuadorId || !descripcion) {
    mostrarError("Por favor completa todos los campos obligatorios.");
    return;
  }

  if (Number.isNaN(aura)) {
        mostrarError("El aura debe ser un número válido");
        return;
    }

  if (!contieneLetra(descripcion)) {
    mostrarError("Cada campo debe contener al menos una letra.");
    return;
  }
  const datos = {
    id_puntuado: parseInt(puntuadoId),
    id_puntuador: parseInt(puntuadorId),
    descripcion,
    aura,
  };

  try {
    const respuesta = await fetch('http://localhost:3000/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    const resultado = await respuesta.json();
    if (!respuesta.ok) {
        alert(resultado.error || "Error desconocido");
        return;
        } 
    form.reset();
    cerrarPopupCrearReview();
    cargarUsuarios();
    cargarCard();
  } catch (error) {
    console.error("Error al enviar:", error);
    mostrarError("Error de conexión con el servidor.");
  } finally {
    inputBuscadorPuntuado.value = "";
    inputOcultoPuntuado.value = "";
    inputBuscadorPuntuador.value = "";
    inputOcultoPuntuador.value = "";
}
});

function mostrarError(msg) {
  mensajeError.textContent = msg;
  mensajeError.style.display = "block";
  mensajeExito.classList.remove("show");
}

function mostrarExito(msg) {
  mensajeExito.textContent = msg;
  mensajeExito.classList.add("show");
  mensajeError.style.display = "none";
}

function renderizarSugerencias(listaUsuarios, contenedor, input, inputOculto) {
  if (!contenedor) {
    console.error("Contenedor de sugerencias no encontrado");
    return;
  }

  if (listaUsuarios.length === 0) {
    contenedor.innerHTML =
      `<div class="dropdown-item has-text-grey">No se encontraron resultados</div>`;
    contenedor.style.display = "block";
    return;
  }

  contenedor.innerHTML = listaUsuarios.map(u => `
    <a class="custom-dropdown-item">
      <div class="sugerencia-nombre">${u.nombre}</div>
      <div class="sugerencia-email">${u.email}</div>
    </a>
  `).join("");

  contenedor.style.maxHeight = "220px";
  contenedor.style.overflowY = "auto";

  contenedor.querySelectorAll(".custom-dropdown-item").forEach((item, i) => {
    item.addEventListener("click", () => {
      input.value = listaUsuarios[i].nombre;
      inputOculto.value = listaUsuarios[i].id_user;
      contenedor.closest(".dropdown").classList.remove("is-active");
    });
  });

  contenedor.closest(".dropdown").classList.add("is-active");
}

manejarBuscador(
  inputBuscadorPuntuado,
  listaSugerenciasPuntuado,
  inputOcultoPuntuado
);

manejarBuscador(
  inputBuscadorPuntuador,
  listaSugerenciasPuntuador,
  inputOcultoPuntuador
);

function confirmacionEliminarReview(id_review, boton) {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar este review?");
    if (confirmar) {
        eliminarReview(id_review, boton);
    }
}

async function eliminarReview(id_review, boton) {
    if (!id_review) return console.error("Error: No hay ID de Review");
    try {
        console.log(`Eliminando review ${id_review}...`);
        const response = await fetch(`http://localhost:3000/api/reviews/${id_review}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Error en servidor");
        }
        const masonryItem = boton.closest(".masonry-item");
        if (masonryItem) {
            masonryItem.remove();
        }
        const review = await response.json();
        console.log("Review eliminada:", review);
    } catch (error) {
        console.error("Fallo eliminar review:", error);
        alert(error.message); 
    }
}