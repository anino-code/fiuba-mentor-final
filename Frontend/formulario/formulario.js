const usuariosDisponibles = [
  { id: 1, nombre: "tomas", email: "tomas@fiuba.ar" },
  { id: 2, nombre: "Arleys", email: "arleys@fiuba.ar" },
  { id: 3, nombre: "esteban", email: "esteban@fiuba.ar" },
  { id: 4, nombre: "nico", email: "nico@fiuba.ar" },
  { id: 5, nombre: "Juan", email: "juan@fiuba.ar" }
];

const form = document.getElementById('solicitudForm');
const mensajeExito = document.getElementById('mensajeExito');
const inputBuscador = document.getElementById('input-buscador-remitente');
const listaSugerencias = document.getElementById('lista-sugerencias');
const inputOcultoId = document.getElementById('input-remitente-id');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const materia = form.materia.value.trim();
  const tema = form.tema.value.trim();
  const descripcion = form.descripcion.value.trim();
  const remitenteId = inputOcultoId.value;

  if (!materia || !tema || !descripcion || !remitenteId) {
    alert("Por favor completa todos los campos y selecciona un remitente.");
    return;
  }

  mensajeExito.style.display = "block";

  form.reset();
  inputBuscador.value = "";
  inputOcultoId.value = "";
});

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
         onclick="seleccionarUsuario('${usuario.id}', '${usuario.nombre
