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

    const botonEliminar = e.target.closest('.btn-eliminar');
    if (botonEliminar) {
        const id = botonEliminar.dataset.id;
        pedirConfirmacion(id, botonEliminar);
        return; 
    }

    const botonEditar = e.target.closest('.btn-editar');
    if (botonEditar) {
        const id = botonEditar.dataset.id;
        abrirPopupModificarPerfil(id); 
    } 
    
});


cardContainer.addEventListener('submit', (e) => {
    if (e.target.classList.contains('form-editar-perfil')) {
        e.preventDefault(); 
        const id = e.target.dataset.id;
        modificarPerfil(id); 
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

function renderizarPerfiles(perfiles) {
    cardContainer.innerHTML = ' ';
    let htmlAcumulado = '';

    perfiles.forEach(perfil => {
        htmlAcumulado += `
            <div class="masonry-item" data-id="${perfil.id_user}">
                
                <div class="card card-mentor-perfil">
                    <div class="mentor-perfil-image-container">
                        <img src="${perfil.foto_user}" alt="${perfil.nombre}" class="mentor-perfil-image">
                    </div>
                    <div class="mentor-perfil-content has-text-centered">
                        <p class="title is-4 has-text-weight-bold mb-5" style="color: #1a202c;">${perfil.nombre} ${perfil.apellido}</p>
                        <p class="subtitle is-6 mb-3 has-text-grey-light" style="font-weight: 500;">${perfil.carrera}</p>
                        <p class="mb-4 is-size-7 mentor-email">${perfil.email}</p>
                        <div class="mentor-perfil-stats mb-5">
                            <div class="mentor-stat-item"><i class="far fa-user"></i><span><strong>${perfil.aura}</strong> Aura</span></div>
                        </div>
                        <div class="mentor-perfil-actions">
                            <button class="button btn-mentor-action btn-editar" data-id="${perfil.id_user}"><span>Editar</span><i class="fas fa-plus ml-1"></i></button>
                            <button class="button btn-mentor-action is-delete btn-eliminar" data-id="${perfil.id_user}" title="Eliminar perfil"><i class="far fa-trash-alt"></i></button>
                        </div>
                    </div>
                </div>

                <div class="modal" id="popupOverlayModificarPerfil${perfil.id_user}">
                    <div class="modal-background"></div>
                    <div class="modal-card">
                        <header class="modal-card-head has-background-white border-bottom">
                            <p class="modal-card-title has-text-link has-text-weight-bold">Editar Perfil</p>
                            <button class="delete" aria-label="close" onclick="cerrarPopupModificarPerfil(${perfil.id_user})"></button>
                        </header>
                        <section class="modal-card-body">
                            <form id="formModificarPerfil${perfil.id_user}" class="form-editar-perfil" data-id="${perfil.id_user}">
                                
                                <div class="field"><label class="label">Nombre:</label><div class="control">
                                    <input class="input" type="text" name="Nombre" id="Nombre-${perfil.id_user}" value="${perfil.nombre}" required>
                                </div></div>
                                
                                <div class="field"><label class="label">Apellido:</label><div class="control">
                                    <input class="input" type="text" name="Apellido" id="Apellido-${perfil.id_user}" value="${perfil.apellido}" required>
                                </div></div>
                                
                                <div class="field"><label class="label">Carrera:</label><div class="control">
                                    <input class="input" type="text" name="Carrera" id="Carrera-${perfil.id_user}" value="${perfil.carrera}" required>
                                </div></div>
                                
                                <div class="field"><label class="label">Email:</label><div class="control">
                                    <input class="input" type="email" name="Email" id="Email-${perfil.id_user}" value="${perfil.email}" required>
                                </div></div>
                                
                                <div class="field"><label class="label">Foto URL:</label><div class="control">
                                    <input class="input" type="url" name="Foto" id="Foto-${perfil.id_user}" value="${perfil.foto_user}">
                                </div></div>

                                <div class="field is-grouped is-grouped-right mt-5">
                                    <p class="control"><button class="button is-rounded" type="button" onclick="cerrarPopupModificarPerfil(${perfil.id_user})">Cancelar</button></p>
                                    <p class="control"><button class="button is-link is-rounded" type="submit">Guardar Cambios</button></p>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        `;
    });
    cardContainer.innerHTML = htmlAcumulado;
}


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