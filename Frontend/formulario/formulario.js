let usuariosDisponibles = [];

const form = document.getElementById('solicitudForm');
const mensajeExito = document.getElementById('mensajeExito');
const mensajeError = document.getElementById('mensajeError');
const inputBuscador = document.getElementById('input-buscador-remitente');
const listaSugerencias = document.getElementById('lista-sugerencias');
const inputOcultoId = document.getElementById('input-remitente-id');
const fotoInput = document.getElementById('foto_form');

function contieneLetra(texto) {
  return /[a-zA-Z]/.test(texto);
}

// Cargar usuarios desde el back
async function cargarUsuarios() {
  try {
    const respuesta = await fetch("http://localhost:3000/api/users");
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

  // convertir imagen a base64
  let fotoBase64 = "";
  if (fotoInput.files.length > 0) {
    const file = fotoInput.files[0];
    fotoBase64 = await toBase64(file);
  }

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
    tipo: tipoPost,
    foto_form: fotoBase64
  };

  try {
    const respuesta = await fetch('http://localhost:3000/api/forms', {
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
      setTimeout(cargarSolicitudes, 500);
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

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
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
         <strong>${usuario.nombre}</strong> <br>
         <small class="has-text-grey">${usuario.email}</small>
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

const contenedorSolicitudes = document.getElementById("contenedorSolicitudes");

function renderizarSolicitudes(lista) {
  if (lista.length === 0) {
    contenedorSolicitudes.innerHTML = "<p class='has-text-grey'>No hay solicitudes guardadas.</p>";
    return;
  }

  let html = `<h2 class="titulo-form">Solicitudes Guardadas</h2>`;

  lista.forEach(form => {
    const tipoTag = form.tipo === "mentor" 
      ? `<span class="tag is-info">Mentor</span>` 
      : `<span class="tag is-success">Solicitante</span>`;

    html += `
      <div class="card card-solicitud">
        <header class="card-header">
          <p class="card-header-title">
            ${form.materia} - ${form.tema}
          </p>
          ${tipoTag}
        </header>
        <div class="card-content">
          <div class="content">
            ${form.descripcion}
            <br>
            <small>Remitente: ${form.usuario?.nombre || "N/A"} (${form.usuario?.email || ""})</small>
            <br>
            <small>Fecha: ${new Date(form.fecha_creado).toLocaleString()}</small>
          </div>
        </div>
      </div>
    `;
  });

  contenedorSolicitudes.innerHTML = html;
}

async function cargarSolicitudes() {
  try {
    const respuesta = await fetch("http://localhost:3000/api/forms");
    const datos = await respuesta.json();
    renderizarSolicitudes(datos);
  } catch (error) {
    console.error("Error al cargar solicitudes:", error);
    contenedorSolicitudes.innerHTML = "<p class='has-text-danger'>Error al cargar solicitudes.</p>";
  }
}

cargarSolicitudes();

