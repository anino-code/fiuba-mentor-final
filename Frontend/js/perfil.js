const cardContainer = document.getElementById('grid-tarjetas-perfil');

let perfilesDisponibles = [];

const form = document.getElementById('formCrearPerfil');



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
    await new Promise(resolve => setTimeout(resolve, 500));

    renderizarPerfiles(datos);

    } catch (error){
        console.error("Error critico: ", error);
        cardContainer.innerHTML = `<p style = "color:red"> Error al cargar los datos: ${error.message}</p>`;

    }
}


function renderizarPerfiles(perfiles){
    cardContainer.innerHTML = ' ';

    perfiles.forEach(perfil => {
            const cardHTML = `
                <div class="masonry-item" data-id="${perfil.id_user}">
                    <div class="card">

                        <div class="card-content has-text-centered">

                            <figure class="image is-128x128 is-inline-block mb-3">
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
                            <a class="card-footer-item button is-white is-small" onclick="confirmacionEliminarPerfil(${perfil.id_user})">Eliminar Perfil</a>
                            <a class="card-footer-item button is-white is-small" onclick="abrirPopupModificarPerfil(${perfil.id_user})">Modificar Perfil</a>
                        </footer>

                    </div>
                    
                    <div class="popup-overlay" id="popupOverlayModificarPerfil${perfil.id_user}">
                        <div class="popup-content" id="popupContent">
                            <h2 class="tituloPopup">Modificar Perfil</h2>
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
                            <div class="botones-popup">
                                <button class="button botonPopup is-link is-normal" onclick="cerrarPopupModificarPerfil(${perfil.id_user})">
                                    Cancelar
                                </button>
                                <button class="button botonPopup is-link is-normal" type="submit" id="botonModificar" form="formModificarPerfil${perfil.id_user}">
                                    Modificar
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

// Funcion para eliminar perfiles
async function eliminarPerfil(id) {
    if (!id) {
        console.error("Error: No hay ID de Perfil");
        return;
    }
    try {
        console.log(`Eliminando perfil ${id}...`);

        const response = await fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'DELETE'
        });
        const resultado = await response.json();

        if (!response.ok) {
            throw new Error(resultado.error || "Error en servidor");
        }

        await cargarUsuarios();
        await cargarCard();

    } catch (error) {
        console.error("Fallo eliminar perfil:", error);
        alert(error.message); 
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

function confirmacionEliminarPerfil(id) {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar este perfil?");
    if (confirmar) {
        eliminarPerfil(id);
    }
}

cargarUsuarios();
cargarCard();