const cardContainer = document.getElementById('grid-tarjetas-perfil');


async function cargarCard() {

    try{
    cardContainer.innerHTML = '<p>Cargando datos del servidor simulado...</p>';

    //const response = await fetch('../js/data/perfil.json');

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
                <div class="masonry-item" data-id="${perfil.id}">
                    <div class="card">

                        <div class="card-content has-text-centered">

                            <figure class="image is-128x128 is-inline-block mb-3">
                                <img class="author-avatar"
                                    src="${perfil.fotoPerfil}"
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
                            <a class="card-footer-item button is-white is-small" onclick="confirmacionEliminarPerfil(${perfil.id})">Eliminar Perfil</a>
                            <a class="card-footer-item button is-white is-small" onclick="abrirPopupModificarPerfil(${perfil.id})">Modificar Perfil</a>
                            <a class="card-footer-item button is-white is-small">Crear Review</a>
                        </footer>

                    </div>
                    
                    <div class="popup-overlay" id="popupOverlayModificarPerfil${perfil.id}">
                        <div class="popup-content" id="popupContent">
                            <h2 class="tituloPopup">Modificar Perfil</h2>
                            <form id="formModificarPerfil">
                                <div class="field">
                                    <label class="label" for="Nombre">Nombre:</label>
                                    <div class="control">
                                        <input class="input" type="text" id="Nombre" value="${perfil.nombre}" name="Nombre" required>
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label" for="Apellido">Apellido:</label>
                                    <div class="control">
                                        <input class="input" type="text" id="Apellido" value="${perfil.apellido}" name="Apellido" required>
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label" for="Carrera">Carrera:</label>
                                    <div class="control">
                                        <input class="input" type="text" id="Carrera" value="${perfil.carrera}" name="Carrera" required>
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label" for="Email">Email:</label>
                                    <div class="control">
                                        <input class="input" type="email" id="Email" value="${perfil.email}" name="Email" required>
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label" for="Foto">Foto de Perfil:</label>
                                    <div class="control">
                                        <input class="input" type="url" id="Foto" value="${perfil.fotoPerfil}" name="Foto" required>
                                    </div>
                                </div>
                            </form>
                            <div class="botones-popup">
                                <button class="button botonPopup is-link is-normal" onclick="cerrarPopupModificarPerfil(${perfil.id})">
                                    Cancelar
                                </button>
                                <button class="button botonPopup is-link is-normal" type="submit" id="botonModificar" form="formModificarPerfil">
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

function eliminarPerfil(id) {
    const perfilElement = document.querySelector(`.masonry-item[data-id='${id}']`);
    if (perfilElement) {
        perfilElement.remove();
    }
}

cargarCard();