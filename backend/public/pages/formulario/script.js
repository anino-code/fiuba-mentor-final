let usuariosDisponibles = [];

const form = document.getElementById('solicitudForm');
const mensajeExito = document.getElementById('mensajeExito');
const mensajeError = document.getElementById('mensajeError');
const inputBuscador = document.getElementById('input-buscador-remitente');
const listaSugerencias = document.getElementById('lista-sugerencias');
const inputOcultoId = document.getElementById('input-remitente-id');

function contieneLetra(texto) {
  return /[a-zA-Z]/.test(texto);
}

// Cargar usuarios desde el backend
async function cargarUsuarios() {
  try {
    const respuesta = await fetch("/api/users");
    usuariosDisponibles = await respuesta.json();
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
  }
}
cargarUsuarios();

form.addEventListener('submit', async function(event) {
  event.preventDefault();

  const materia = form.materia.value.trim();
  const tema = form.tema.value.trim();
  const descripcion = form.descripcion.value.trim();
  const remitenteId = inputOcultoId.value;
  const tipoPost = form.tipo_post.value;

  if (!materia || !tema || !descripcion || !remitenteId || !tipoPost) {
    mostrarError("Por favor completa todos los campos obligatorios.");
    return;
  }

  if (!contieneLetra(materia) || !contieneLetra(tema) || !contieneLetra(descripcion)) {
    mostrarError("Cada campo debe contener al menos una letra.");
    return;
  }

  const datos = {
    id_user: parseInt(remitenteId),
    materia,
    tema,
    descripcion,
    tipo: tipoPost
  };

  try {
    const respuesta = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    const resultado = await respuesta.json();

    if (respuesta.ok) {
      mostrarExito(resultado.message || "¡Solicitud enviada correctamente!");
      form.reset();
      inputBuscador.value = "";
      inputOcultoId.value = "";
    } else {
      mostrarError(resultado.error || "Error desconocido");
    }
  } catch (error) {
    console.error("Error al enviar:", error);
    mostrarError("Error de conexión con el servidor.");
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

inputBuscador.addEventListener('input', function() {
  const textoEscrito = this.value.toLowerCase();

  if (textoEscrito.length === 0) {
    listaSugerencias.style.display = 'none';
    inputOcultoId.value = '';
    return;
  }

  const coincidencias = usuariosDisponibles.filter(usuario =>
    usuario.nombre.toLowerCase().includes(textoEscrito)
  );

  renderizarSugerencias(coincidencias);
});

function renderizarSugerencias(lista) {
  if (lista.length === 0) {
    listaSugerencias.innerHTML = `<div class="dropdown-item has-text-grey">No se encontraron resultados</div>`;
    listaSugerencias.style.display = 'block';
    return;
  }

  let html = '';
  lista.forEach(usuario => {
    html += `
      <a class="custom-dropdown-item" 
         onclick="seleccionarUsuario('${usuario.id_user}', '${usuario.nombre}')">
         <div class="sugerencia-nombre">${usuario.nombre}</div>
         <div class="sugerencia-email">${usuario.email}</div>
      </a>
    `;
  });

  listaSugerencias.innerHTML = html;
  listaSugerencias.style.display = 'block';
}

function seleccionarUsuario(id, nombre) {
  inputBuscador.value = nombre;
  inputOcultoId.value = id;
  listaSugerencias.style.display = 'none';
}

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

