const form = document.getElementById('solicitudForm');
const mensajeExito = document.getElementById('mensajeExito');

form.addEventListener('submit', function(event) {
  event.preventDefault(); 

  const materia = form.materia.value.trim();
  const tema = form.tema.value.trim();
  const descripcion = form.descripcion.value.trim();

  if (!materia || !tema || !descripcion) {
    alert("Por favor completa todos los campos.");
    return;
  }

  mensajeExito.style.display = "block";

  form.reset();
});

