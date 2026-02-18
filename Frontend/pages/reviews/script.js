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
const modalEliminar = document.getElementById('modal-eliminar');

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

cardContainer.addEventListener('click', (e) => {

  console.log("Hiciste clic en:", e.target);

  const btnEliminar = e.target.closest('.btn-eliminar');
    if (btnEliminar) {
        const idReview = btnEliminar.dataset.id;

        pedirConfirmacion(idReview, btnEliminar);
    }    
});

function pedirConfirmacion(id, elementoHTML) {
    
    idParaEliminar = id;
    elementoParaEliminar = elementoHTML;

    modalEliminar.classList.add('is-active');
}

function cerrarModalEliminar() {
    modalEliminar.classList.remove('is-active');
    idParaEliminar = null;
    elementoParaEliminar = null;
}

document.getElementById('btn-cancelar-eliminar').addEventListener('click', cerrarModalEliminar);
document.getElementById('btn-cerrar-x-eliminar').addEventListener('click', cerrarModalEliminar);
document.querySelector('#modal-eliminar .modal-background').addEventListener('click', cerrarModalEliminar);

document.getElementById('btn-confirmar-eliminar').addEventListener('click', async () => {
    
    if (idParaEliminar && elementoParaEliminar) {
        modalEliminar.classList.remove('is-active');

        await eliminarReview(idParaEliminar, elementoParaEliminar);
    }
});

async function eliminarReview(id_review, boton) {
    if (!id_review) return console.error("Error: No hay ID de Review");
    try {
        const response = await fetch(`http://localhost:3000/api/reviews/${id_review}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Error en servidor");
        }
        cargarCard();
    } catch (error) {
        console.error("Fallo eliminar review:", error);
        alert(error.message); 
    }
}

function renderizarReviews(reviews) {
    cardContainer.innerHTML = ' ';
    reviews.forEach(review => {
        const cardHTML = `
            <div class="masonry-item" data-id="${review.id_review}">
                <div class="card">
                    <div class="card-content has-text-centered">
                        <div class="media-content">
                            <figure class="image is-32x32 is-inline-block">
                                <img class="author-avatar" src="${review.puntuado.foto_user}" alt="Avatar">
                            </figure>
                        </div>
                        <h2 class="is-size-5 has-text-weight-bold mb-3">${review.puntuado.nombre} ${review.puntuado.apellido}</h2>
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
                        <a class="card-footer-item button is-white is-small has-text-info" onclick="abrirPopupModificarReview(${review.id_review})">
                          <span class="icon">
                                    <i class="fas fa-pen-nib fa-lg"></i>
                                </span>  
                          <span>Editar Review</span>
                        </a>
                        <a class="card-footer-item button is-small is-white has-text-danger p-1 btn-eliminar"
                                data-id="${review.id_review}">
                                <span class="icon is-small">
                                    <i class="fas fa-trash"></i>
                                </span>
                                <span>Eliminar Review</span>
                        </a>
                    </footer>
                </div>

                <div class="modal" id="popupOverlayModificarReview${review.id_review}">
                    <div class="modal-background"></div>
                    <div class="modal-card">
                        <header class="modal-card-head has-background-white border-bottom">
                            <p class="modal-card-title has-text-link has-text-weight-bold">Editar Review</p>
                            <button class="delete" aria-label="close" onclick="cerrarPopupModificarReview(${review.id_review})"></button>
                        </header>
                        <section class="modal-card-body">
                          <form id="formModificarReview${review.id_review}" onsubmit="event.preventDefault(); modificarReview(${review.id_review});">
                              
                              <div class="field">
                                  <label class="label">Puntuado (Seleccionar Perfil):</label>
                                  <div class="control dropdown is-fullwidth">
                                      <input class="input input-busqueda-edit" type="text" placeholder="Escribe para buscar (ej: Juan, Tomas...)"
                                          id="input-edit-puntuado-${review.id_review}"
                                          value="${review.puntuado.nombre} ${review.puntuado.apellido}"
                                          data-type="puntuado" data-id="${review.id_review}" autocomplete="off">
                                      <input type="hidden" name="id_puntuado" id="hidden-edit-puntuado-${review.id_review}" value="${review.puntuado.id_user}">
                                      <div class="lista-sugerencias-edit" id="lista-edit-puntuado-${review.id_review}"></div>
                                  </div>
                              </div>

                              <div class="field">
                                  <label class="label">Puntuador (Seleccionar Perfil):</label>
                                  <div class="control dropdown is-fullwidth">
                                      <input class="input input-busqueda-edit" type="text" placeholder="Escribe para buscar (ej: Juan, Tomas...)"
                                          id="input-edit-puntuador-${review.id_review}"
                                          value="${review.puntuador.nombre} ${review.puntuador.apellido}"
                                          data-type="puntuador" data-id="${review.id_review}" autocomplete="off">
                                      <input type="hidden" name="id_puntuador" id="hidden-edit-puntuador-${review.id_review}" value="${review.puntuador.id_user}">
                                      <div class="lista-sugerencias-edit" id="lista-edit-puntuador-${review.id_review}"></div>
                                  </div>
                              </div>

                              <div class="field">
                                  <label class="label">Descripción:</label>
                                  <div class="control">
                                      <textarea class="textarea" name="descripcion" required>${review.descripcion}</textarea>
                                  </div>
                              </div>
                              <div class="field">
                                  <label class="label">Aura:</label>
                                  <div class="control">
                                      <input class="input" type="number" name="aura" value="${review.aura}" required>
                                  </div>
                              </div>
                            </form>
                        </section>
                        <footer class="modal-card-foot has-background-white is-justify-content-flex-end">
                          <button class="button is-rounded" onclick="cerrarPopupModificarReview(${review.id_review})">Cancelar</button>
                              <button class="button is-link is-rounded" type="submit" form="formModificarReview${review.id_review}">
                                <span class="icon is-small"><i class="fas fa-save"></i></span>
                                <span>Guardar Cambios</span>
                              </button>
                        </footer>
                    </div>
                  </div>
                </div>
            </div>
        `;
        cardContainer.innerHTML += cardHTML;
    });
    inicializarBuscadoresEdicion();
}


function abrirPopupModificarReview(id) {
    const popup = document.getElementById('popupOverlayModificarReview' + id);
    if (popup) popup.style.display = 'flex';
}

function cerrarPopupModificarReview(id) {
    const popup = document.getElementById('popupOverlayModificarReview' + id);
    if (popup) popup.style.display = 'none';
}

async function modificarReview(id) {
    const formModificar = document.getElementById(`formModificarReview${id}`);
    if (!formModificar) return;

    const descripcion = formModificar.descripcion.value.trim();
    const aura = Number(formModificar.aura.value);
    const id_puntuado = Number(formModificar.id_puntuado.value);
    const id_puntuador = Number(formModificar.id_puntuador.value);

    if (!id_puntuado || !id_puntuador || !descripcion) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (aura<=0 || Number.isNaN(aura)) {
        alert("Aura debe ser un numero positivo");
        return;
    }

    const datos = {
        id_puntuado,
        id_puntuador,
        descripcion,
        aura
    };

    try {
        const respuesta = await fetch(`http://localhost:3000/api/reviews/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.error || "Error en servidor");
        }
        
        cerrarPopupModificarReview(id);
        cargarCard();

    } catch (error) {
        alert(error.message || "Error al modificar la review");
    }
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

function renderizarSugerencias(listaUsuarios, contenedor, input, inputOculto) {
  if (!contenedor) {
    console.error("Contenedor de sugerencias no encontrado");
    return;
  }

  if (listaUsuarios.length === 0) {
    contenedor.innerHTML =
      `<div class="dropdown-item has-text-grey">No hay resultados</div>`;
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

manejarBuscador(inputBuscadorPuntuado, listaSugerenciasPuntuado, inputOcultoPuntuado);
manejarBuscador(inputBuscadorPuntuador, listaSugerenciasPuntuador, inputOcultoPuntuador);

document.addEventListener('DOMContentLoaded', () => {
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {
        const target = el.dataset.target;
        const $target = document.getElementById(target);
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
});

function inicializarBuscadoresEdicion() {
  const inputsBusqueda = document.querySelectorAll('.input-busqueda-edit');

  inputsBusqueda.forEach(input => {
    input.addEventListener('input', () => {
      const texto = input.value.toLowerCase().trim();
      const reviewId = input.dataset.id;
      const tipo = input.dataset.type;
      const listaSugerencias = document.getElementById(`lista-edit-${tipo}-${reviewId}`);
      const inputOculto = document.getElementById(`hidden-edit-${tipo}-${reviewId}`);

      if (!texto) {
        listaSugerencias.style.display = "none";
        inputOculto.value = "";
        return;
      }

      const coincidencias = usuariosDisponibles.filter(u =>
        u.nombre.toLowerCase().includes(texto) || u.apellido.toLowerCase().includes(texto)
      );

      renderizarSugerenciasEdicion(coincidencias, listaSugerencias, input, inputOculto);
    });
  });
}

function renderizarSugerenciasEdicion(usuarios, contenedor, input, inputOculto) {
  if (usuarios.length === 0) {
    contenedor.innerHTML = `<div class="dropdown-item has-text-grey">No hay resultados</div>`;
  } else {
    contenedor.innerHTML = usuarios.map(u => `
            <a class="custom-dropdown-item dropdown-item">
                <div><strong>${u.nombre} ${u.apellido}</strong></div>
                <div class="is-size-7">${u.email}</div>
            </a>
        `).join("");
  }

  contenedor.style.display = "block";
  const parentDropdown = contenedor.closest('.dropdown');
  parentDropdown.classList.add('is-active');

  contenedor.querySelectorAll(".custom-dropdown-item").forEach((item, i) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      input.value = `${usuarios[i].nombre} ${usuarios[i].apellido}`;
      inputOculto.value = usuarios[i].id_user;
      parentDropdown.classList.remove('is-active');
      contenedor.style.display = "none";
    });
  });
}