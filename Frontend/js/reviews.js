const cardContainer = document.getElementById('grid-tarjetas-review');


async function cargarCard() {

    try{
    cardContainer.innerHTML = '<p>Cargando datos del servidor simulado...</p>';

    const response = await fetch('../js/data/perfil.json');

    if(!response.ok){
        throw new Error('No se pudo conectar con el servidor');
    }
    const datos = await response.json();
    await new Promise(resolve => setTimeout(resolve, 500));

    renderizarReviews(datos);

    } catch (error){
        console.error("Error critico: ", error);
        cardContainer.innerHTML = `<p style = "color:red"> Error al cargar los datos: ${error.message}</p>`;

    }
}


function renderizarReviews(reviews){
    cardContainer.innerHTML = ' ';

    reviews.forEach(review => {
            const cardHTML = `
                <div class="masonry-item" data-id="${review.id}">
                    <div class="card">

                        <div class="card-content has-text-centered">

                            <figure class="image is-128x128 is-inline-block mb-3">
                                <img class="author-avatar"
                                    src="${review.fotoPerfil}"
                                    alt="Foto de ${review.nombre} ${review.apellido}">
                            </figure>

                            <p class="title is-5 mb-1">${review.nombre} ${review.apellido}</p>

                            <p class="is-size-7 has-text-grey mb-2">${review.carrera}</p>

                            <p class="is-size-7 mb-2">Aura: ${review.aura}</p>

                            <p class="is-size-7">
                                <a href="mailto:${review.email}">${review.email}</a>
                            </p>

                        </div>

                        <footer class="card-footer">
                            <a class="card-footer-item button is-white is-small" onclick="confirmacionEliminarReview(${review.id})">Eliminar review</a>
                            <a class="card-footer-item button is-white is-small" onclick="abrirPopupModificarReview(${review.id})">Modificar review</a>
                            <a class="card-footer-item button is-white is-small">Crear Review</a>
                        </footer>

                    </div>
                    
                    <div class="popup-overlay" id="popupOverlayModificarReview${review.id}">
                        <div class="popup-content" id="popupContent">
                            <h2 class="tituloPopup">Modificar review</h2>
                            <form id="formModificarReview">
                                <div class="field">
                                    <label class="label" for="Nombre">Nombre:</label>
                                    <div class="control">
                                        <input class="input" type="text" id="Nombre" value="${review.nombre}" name="Nombre" required>
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label" for="Apellido">Apellido:</label>
                                    <div class="control">
                                        <input class="input" type="text" id="Apellido" value="${review.apellido}" name="Apellido" required>
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label" for="Carrera">Carrera:</label>
                                    <div class="control">
                                        <input class="input" type="text" id="Carrera" value="${review.carrera}" name="Carrera" required>
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label" for="Email">Email:</label>
                                    <div class="control">
                                        <input class="input" type="email" id="Email" value="${review.email}" name="Email" required>
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label" for="Foto">Foto de review:</label>
                                    <div class="control">
                                        <input class="input" type="url" id="Foto" value="${review.fotoreview}" name="Foto" required>
                                    </div>
                                </div>
                            </form>
                            <div class="botones-popup">
                                <button class="button botonPopup is-link is-normal" onclick="cerrarPopupModificarReview(${review.id})">
                                    Cancelar
                                </button>
                                <button class="button botonPopup is-link is-normal" type="submit" id="botonModificar" form="formModificarReview">
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


function abrirPopupCrearReview() {
    const popup = document.getElementById('popupOverlayCrearReview');
    if (popup) {
        popup.style.display = 'flex';
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

function abrirPopupModificarReview(id) {
    const popup = document.getElementById('popupOverlayModificarReview' + id);
    if (popup) {
        popup.style.display = 'flex';
    }
}

function cerrarPopupModificarReview(id) {
    const popup = document.getElementById('popupOverlayModificarReview' + id);
    const form = document.getElementById('formModificarReview');
    if (form) {
        form.reset();
    }
    if (popup) {
        popup.style.display = 'none';
    }
}

function confirmacionEliminarReview(id) {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar este review?");
    if (confirmar) {
        eliminarReview(id);
    }
}

function eliminarReview(id) {
    const reviewElement = document.querySelector(`.masonry-item[data-id='${id}']`);
    if (reviewElement) {
        reviewElement.remove();
    }
}

cargarCard();