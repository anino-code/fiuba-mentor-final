const form = document.getElementById('solicitudForm');
const mensajeExito = document.getElementById('mensajeExito');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const nombre = form.nombre.value.trim();
  const correo = form.correo.value.trim();
  const materia = form.materia.value.trim();
  const descripcion = form.mensaje.value.trim();

  if (!nombre || !correo || !materia || !descripcion) {
    alert("Por favor completa todos los campos.");
    return;
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(correo)) {
    alert("Por favor ingresa un correo válido.");
    return;
  }

  mensajeExito.style.display = "block";

  form.reset();
});

