const cardContainer = document.getElementById('grid-tarjetas');


async function cargarCard() {

    try{
    cardContainer.innerHTML = '<p>Cargando datos del servidor simulado...</p>';

    const response = await fetch('../js/data/data.json');

    if(!response.ok){
        throw new Error('No se pudo conectar con el servidor');
    }
    const datos = await response.json();
    await new Promise(resolve => setTimeout(resolve, 500));

    renderizarCards(datos);

    } catch (error){
        console.error("Error critico: ", error);
        cardContainer.innerHTML = `<p style = "color:red"> Error al cargar los datos: ${error.message}</p>`;

    }
}


cardContainer.addEventListener('click', (e) => {

    const btnAura = e.target.closest('.btn-aura');
    if (btnAura) {
        const id = btnAura.dataset.id;
        manejarAura(id, btnAura);
    }
});

async function manejarAura(id, boton) {
    
    boton.classList.add('is-loading');
    boton.disabled = true;

    try {
        
        await new Promise(r => setTimeout(r, 800)); 
        
        
        const tagAura = document.getElementById(`aura-tag-${id}`);
        
        let valorActual = parseInt(tagAura.innerText.split('+')[1]);
        let nuevoValor = valorActual + 10;


        tagAura.innerText = `Aura +${nuevoValor}`;
        tagAura.classList.remove('is-light'); 
        tagAura.classList.add('is-warning');

    } catch (error) {
        console.error("Error al dar aura", error);
    } finally {
        
        boton.classList.remove('is-loading');
        boton.disabled = false;
    }
}




function renderizarCards(publicaciones){
    cardContainer.innerHTML = ' ';

    let htmlAcomulado ='';

    publicaciones.forEach(pub => {

            htmlAcomulado += `
                <div class="masonry-item">
                    <div class="card">
                        <div class="card-image">
                            <figure class="image is-4by3">
                                <img src="${pub.img}" alt="Imagen clase" style="object-fit: cover;">
                            </figure>
                        </div>
                        
                        <div class="card-content">
                            <p class="is-size-7 has-text-weight-bold has-text-info is-uppercase mb-1">${pub.materia}</p>
                            <p class="title is-5 has-text-weight-bold mb-2">${pub.titulo}</p>
                            <p class="content is-size-6 has-text-grey mb-4">
                                ${pub.desc}
                            </p>
                            
                        <div class="buttons are-small mt-3">
                            <button class="button is-link is-outlined btn-contactar " data-id="${pub.id}">
                                Contactar
                            </button>
                            
                        </div>

                            <div class="media is-vcentered border-top pt-3 footer-card">
                                <div class="media-left">
                                    <figure class="image is-32x32">
                                        <img class="author-avatar" src="${pub.avatar}" alt="Avatar">
                                    </figure>
                                </div>
                                <div class="media-content">
                                    <p class="is-size-7 has-text-weight-semibold has-text-dark">${pub.mentor}</p>
                                </div>
                                <div class="media-right">
                                    <span 
                                        class="tag is-light is-rounded is-small aura-interactiva btn-aura" 
                                        data-id="${pub.id}"
                                        id="aura-tag-${pub.id}">
                                        Aura +${pub.aura || 10}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
                cardContainer.innerHTML = htmlAcomulado;
        });
}

cargarCard();