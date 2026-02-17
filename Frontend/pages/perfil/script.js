const cardContainer = document.getElementById('grid-tarjetas-perfil');

let perfilesDisponibles = [];

const form = document.getElementById('formCrearPerfil');
const modalEliminar = document.getElementById('modal-eliminar');


async function cargarUsuarios() {
    
    try {
        const respuesta = await fetch("http://localhost:3000/api/users");
        perfilesDisponibles = await respuesta.json();
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}


async function cargarCard() {

    try{
    cardContainer.innerHTML = '<p>Cargando datos del servidor simulado...</p>';

    const response = await fetch('http://localhost:3000/api/users');


    if(!response.ok){
        throw new Error('No se pudo conectar con el servidor');
    }
    const datos = await response.json();
    await new Promise(resolve => setTimeout(resolve, 100));

    renderizarPerfiles(datos);

    } catch (error){
        console.error("Error critico: ", error);
        cardContainer.innerHTML = `<p style = "color:red"> Error al cargar los datos: ${error.message}</p>`;

    }
}

cardContainer.addEventListener('click', (e) => {

  console.log("Hiciste clic en:", e.target);

  const btnEliminar = e.target.closest('.btn-eliminar');
    if (btnEliminar) {
        const idUser = btnEliminar.dataset.id;

        pedirConfirmacion(idUser, btnEliminar);
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

        await eliminarPerfil(idParaEliminar, elementoParaEliminar);
    }
});

async function eliminarPerfil(id, boton) {
    if (!id) {
        console.error("Error: No hay ID de Perfil");
        return;
    }
    try {
        console.log(`Eliminando perfil ${id}...`);

        const respuesta = await fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'DELETE'
        });
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.error || "Error en servidor");
        }

        await cargarUsuarios();
        await cargarCard();

    } catch (error) {
        console.error("Fallo eliminar perfil:", error);
        alert(error.message); 
    }
}

function renderizarPerfiles(perfiles){
    cardContainer.innerHTML = ' ';

    perfiles.forEach(perfil => {
            const cardHTML = `
                <div class="masonry-item" data-id="${perfil.id_user}">
                    <div class="card">

                        <div class="card-content has-text-centered">

                            <figure class="image is-inline-block mb-4">
                                <img class="author-avatar"
                                    src="${perfil.foto_user}"
                                    alt="Foto de ${perfil.nombre} ${perfil.apellido}">
                            </figure>

                            <p class="title is-5 mb-1">${perfil.nombre} ${perfil.apellido}</p>

                            <p class="is-size-7 has-text-grey mb-2">${perfil.carrera}</p>

                            <p class="is-size-7 mb-2">Aura: ${perfil.aura}</p>

                            <p class="is-size-7">
                                <a href="mailto:${perfil.email}">${perfil.email}</a>
                            </p>

                        </div>

                        <footer class="card-footer">
                            <a class="card-footer-item button is-white is-small" onclick="abrirPopupModificarPerfil(${perfil.id_user})">Editar Perfil</a>
                            <a class="card-footer-item button is-small is-white has-text-danger p-1 btn-eliminar"
                                data-id="${perfil.id_user}">
                                <span class="icon is-small">
                                    <i class="fas fa-trash"></i>
                                </span>
                                <span>Eliminar Perfil</span>
                            </a>
                        </footer>

                    </div>
                    
                    <div class="popup-overlay" id="popupOverlayModificarPerfil${perfil.id_user}">
                        <div class="popup-content" id="popupContent">
                            <header class="modal-card-head has-background-white border-bottom">
                                <p class="modal-card-title has-text-link has-text-weight-bold">Editar Perfil</p>
                                <button class="delete" aria-label="close" onclick="cerrarPopupModificarPerfil(${perfil.id_user})"></button>
                            </header>
                            <form id="formModificarPerfil${perfil.id_user}" onsubmit="event.preventDefault(); modificarPerfil(${perfil.id_user});">
                                <div class="field">
                                    <label class="label" for="Nombre">Nombre:</label>
                                    <div class="control">
                                        <input class="input" type="text" id="Nombre-${perfil.id_user}" value="${perfil.nombre}" name="Nombre" required>
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label" for="Apellido">Apellido:</label>
                                    <div class="control">
                                        <input class="input" type="text" id="Apellido-${perfil.id_user}" value="${perfil.apellido}" name="Apellido" required>
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label" for="Carrera">Carrera:</label>
                                    <div class="control">
                                        <input class="input" type="text" id="Carrera-${perfil.id_user}" value="${perfil.carrera}" name="Carrera" required>
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label" for="Email">Email:</label>
                                    <div class="control">
                                        <input class="input" type="email" id="Email-${perfil.id_user}" value="${perfil.email}" name="Email" required>
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label" for="Foto">Foto de Perfil:</label>
                                    <div class="control">
                                        <input class="input" type="url" id="Foto-${perfil.id_user}" value="${perfil.foto_user}" name="Foto">
                                    </div>
                                </div>
                            </form>
                            <div class="botones-popup modal-card-foot has-background-white is-justify-content-flex-end">
                                <button class="button is-rounded" onclick="cerrarPopupModificarPerfil(${perfil.id_user})">
                                    Cancelar
                                </button>
                                <button class="button is-link is-rounded" type="submit" id="botonModificar" form="formModificarPerfil${perfil.id_user}">
                                    <span class="icon is-small"><i class="fas fa-save"></i></span>
                                    <span>Guardar Cambios</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            `;
                cardContainer.innerHTML += cardHTML;
        });
}

// Funcion para crear perfiles
form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const datos = {
        nombre: form.Nombre.value,
        apellido: form.Apellido.value,
        carrera: form.Carrera.value,
        email: form.Email.value,
        foto_user: form.Foto.value
    };

    try {
    const respuesta = await fetch('http://localhost:3000/api/users', {
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
    cerrarPopupCrearPerfil();

    await cargarUsuarios();
    await cargarCard();

  } catch (error) {
    console.error("Error al Crear:", error);
    alert("Error de conexión con el servidor.");
  }
});

// Funcion para modificar perfiles
async function modificarPerfil(id) {
    const formModificar = document.getElementById(`formModificarPerfil${id}`);
    if (!formModificar) {
        return;
    }

    const nombre = formModificar.Nombre.value;
    const apellido = formModificar.Apellido.value;
    const carrera = formModificar.Carrera.value;
    const email = formModificar.Email.value;
    const fotoPerfil = formModificar.Foto.value;

    const datos = {
        nombre,
        apellido,
        carrera,
        email,
        foto_user: fotoPerfil
    };

    try {
        const respuesta = await fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.error || "Error en servidor");
        }
        
    await cargarUsuarios();
    await cargarCard();
    cerrarPopupModificarPerfil(id);

    } catch (error) {
        alert(error.message || "Error al modificar el perfil");
    }
}

function abrirPopupCrearPerfil() {
    const popup = document.getElementById('popupOverlayCrearPerfil');
    if (popup) {
        popup.style.display = 'flex';
    }
}

function cerrarPopupCrearPerfil() {
    const popup = document.getElementById('popupOverlayCrearPerfil');
    const form = document.getElementById('formCrearPerfil');
    if (form) {
        form.reset();
    }
    if (popup) {
        popup.style.display = 'none';
    }
}

function abrirPopupModificarPerfil(id) {
    const popup = document.getElementById('popupOverlayModificarPerfil' + id);
    if (popup) {
        popup.style.display = 'flex';
    }
}

function cerrarPopupModificarPerfil(id) {
    const popup = document.getElementById('popupOverlayModificarPerfil' + id);
    const form = document.getElementById('formModificarPerfil');
    if (form) {
        form.reset();
    }
    if (popup) {
        popup.style.display = 'none';
    }
}

cargarUsuarios();
cargarCard();


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