const cardContainer = document.getElementById('grid-tarjetas');
let idParaEliminar = null; 
let elementoParaEliminar = null; 
const modalEliminar = document.getElementById('modal-eliminar');


async function cargarCard() {

    try{


    const response = await fetch('http://localhost:3000/api/forms?t=' + Date.now());

    if(!response.ok){
        throw new Error('No se pudo conectar con el servidor');
    }
    const datos = await response.json();
    await new Promise(resolve => setTimeout(resolve, 100));

    renderizarCards(datos);

    } catch (error){
        console.error("Error critico: ", error);
        cardContainer.innerHTML = `<p style = "color:red"> Error al cargar los datos: ${error.message}</p>`;

    }
}


cardContainer.addEventListener('click', (e) => {

const btnAura = e.target.closest('.btn-aura');
    if (btnAura) {
        
        const idUsuario = btnAura.dataset.userid; 
        
        
        manejarAura(idUsuario, btnAura);
    }

        
    
const btnContactar = e.target.closest('.btn-contactar');
if (btnContactar) {
    const idUsuario = btnContactar.dataset.userid; 
    if (idUsuario) {
        manejarContacto(idUsuario);
    }
}

const btnEliminar = e.target.closest('.btn-eliminar');
    if (btnEliminar) {
        const idPublicacion = btnEliminar.dataset.id;

        pedirConfirmacion(idPublicacion, btnEliminar);
    }


    
});


const modal = document.getElementById('modal-contacto');
const modalNombre = document.getElementById('modal-nombre');
const modalCarrera = document.getElementById('modal-carrera');
const modalEmail = document.getElementById('modal-email');


async function manejarContacto(idUsuario) {
    console.log(` Conectando con Backend para buscar ID: ${idUsuario}...`);

    try {
        
        if(modal) modal.classList.add('is-active');
        if(modalNombre) modalNombre.textContent = "Buscando mentor...";
        if(modalEmail) modalEmail.textContent = "...";

        const response = await fetch(`http://localhost:3000/api/users/${idUsuario}`);

        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al obtener datos");
        }

        
        const usuario = await response.json();

        
        if(modalNombre) modalNombre.textContent = `${usuario.nombre} ${usuario.apellido}`;
        if(modalCarrera) modalCarrera.textContent = usuario.carrera || "Carrera no especificada";
        
        if(modalEmail) {
            modalEmail.textContent = usuario.email;
            modalEmail.href = `mailto:${usuario.email}`;
        }

    } catch (error) {
        console.error("Error de conexión:", error);
        if(modalNombre) modalNombre.textContent = "Error";
        if(modalCarrera) modalCarrera.textContent = "No se pudo cargar la información.";
        alert("Hubo un problema: " + error.message);
        cerrarModal();
    }
}


function cerrarModal() {
    if(modal) modal.classList.remove('is-active');
}

document.getElementById('btn-cerrar-modal')?.addEventListener('click', cerrarModal);
document.getElementById('btn-cancelar-modal')?.addEventListener('click', cerrarModal);
document.querySelector('.modal-background')?.addEventListener('click', cerrarModal);

async function manejarAura(idUsuario, boton) {
    
    if (!idUsuario) return console.error("Error: No hay ID de usuario");


    boton.classList.add('is-loading');
    
    
    const textoOriginal = boton.innerText;

    try {
        console.log(` Sumando aura al usuario ${idUsuario}...`);

        const response = await fetch('http://localhost:3000/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_puntuado: Number(idUsuario), 
                id_puntuador: 1,                
                aura: 10,
                descripcion: "¡Aura desde la web!"
            })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Error en servidor");
        }

        
        
        let valorNumerico = parseInt(textoOriginal.replace(/\D/g, '')) || 0;
        let nuevoValor = valorNumerico + 10;

        boton.innerText = `Aura +${nuevoValor}`;
        boton.classList.remove('is-light');
        boton.classList.add('is-warning'); 

    } catch (error) {
        console.error("Fallo el aura:", error);
        alert(error.message); 
        boton.innerText = textoOriginal; 
    } finally {
        boton.classList.remove('is-loading');
    }
}

async function eliminarPublicacion(id, botonDOM) {
    

    try {
        
        botonDOM.classList.add('is-loading');

        
        const response = await fetch(`http://localhost:3000/api/forms/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log(`Publicación ${id} eliminada con éxito.`);

            const cartaCompleta = botonDOM.closest('.masonry-item');
            
            if (cartaCompleta) {
                
                cartaCompleta.style.transition = "opacity 0.5s ease, transform 0.5s ease";
                cartaCompleta.style.opacity = "0";
                cartaCompleta.style.transform = "scale(0.9)";

                setTimeout(() => {
                    cartaCompleta.remove();
                }, 500);
            }
        } else {
            const errorData = await response.json();
            alert(`Error al eliminar: ${errorData.error || response.statusText}`);
            botonDOM.classList.remove('is-loading');
        }

    } catch (error) {
        console.error("Error de red:", error);
        alert("No se pudo conectar con el servidor.");
        botonDOM.classList.remove('is-loading');
    }
}


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

        await eliminarPublicacion(idParaEliminar, elementoParaEliminar);
    }
});

const CATEGORIAS_IMAGENES = [
    {
        
        palabrasClave: ['Fundamentos de programación','introcamejo', 'punteros', 'memoria', 'malloc', 'segfault', 'linux', 'bash', 'terminal'],
        url: 'https://fi.ort.edu.uy/innovaportal/file/127831/1/lenguajes-de-programacion.jpg'
    },
    {
        
        palabrasClave: ['el backend', 'bd', 'sql', 'base de datos', 'postgres', 'node', 'express', 'api', 'servidor'],
        url: 'https://images.unsplash.com/photo-1667372393119-c85c020799dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        
        palabrasClave: ['front', 'css', 'html', 'diseño', 'flexbox', 'grid', 'javascript'],
        url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=60'
    },
    {
        
        palabrasClave: ['Gradientes', 'algo', 'algoritmos', 'matematica', 'calculo', 'algebra', 'grafos', 'logica','Analisis Matematico 2'],
        url: 'https://cms.fi.uba.ar/uploads/large_Galeria_PC_05_08c39ef5dd.jpg'
    }
];

const IMAGEN_DEFAULT = 'https://www.uba.ar/storage/VHmQvvhSdMb9fxh3k5e4At0XS2BAnOdx7n1PcYkJ.jpg';

function obtenerImagenPorTexto(textoUsuario) {
    
    if (!textoUsuario) return null; 

    
    const textoLimpio = textoUsuario.toLowerCase(); 

    for (const categoria of CATEGORIAS_IMAGENES) {
        const coincide = categoria.palabrasClave.some(palabra => textoLimpio.includes(palabra));
        
        if (coincide) {
            return categoria.url; 
        }
    }

    return null; 
}


function renderizarCards(publicaciones){
    cardContainer.innerHTML = ' ';

    let htmlAcomulado ='';

    publicaciones.forEach(pub => {

        if (!pub.usuario || !pub.usuario.id_user) {
            return; 
        }

    const usuario = pub.usuario || { nombre: 'Anonimo', id_user: 0, aura: 0 };
    
    const imagenPortada = pub.foto_form || 
                        obtenerImagenPorTexto(pub.materia) || 
                        obtenerImagenPorTexto(pub.tema) || 
                        obtenerImagenPorTexto(pub.descripcion) || 
                        IMAGEN_DEFAULT;
    
        htmlAcomulado += `
                <div class="masonry-item">
                    <div class="card">
                        <div class="card-image">
                            <figure class="image is-4by3">
                                <img src="${imagenPortada}" alt="${pub.tema}" style="object-fit: cover;">
                            </figure>
                        </div>
                        
                        <div class="card-content">
                            <div class="is-flex is-justify-content-space-between is-align-items-center mb-1">
        
                            <p class="is-size-7 has-text-weight-bold has-text-info is-uppercase">
                                ${pub.materia}
                            </p>

                        <div class="buttons are-small is-marginless">
            
                            <button class="button is-small is-white has-text-info p-1 btn-editar" 
                                title="Editar Publicación"
                                data-id="${pub.id_form}">
                                <span class="icon">
                                    <i class="fas fa-pen-nib fa-lg"></i>
                                </span>
                            </button>

                            <button class="button is-small is-white has-text-danger p-1 btn-eliminar" 
                                title="Eliminar Publicación"
                                data-id="${pub.id_form}">
                                <span class="icon is-small">
                                    <i class="fas fa-trash"></i>
                                </span>
                            </button>
                        </div>

                        </div>
                            <p class="title is-5 has-text-weight-bold mb-2">${pub.tema}</p>
                            <p class="content is-size-6 has-text-grey mb-4">
                                ${pub.descripcion}
                            </p>
                            
                        <div class="buttons are-small mt-3">
                            <button 
                                class="button is-link btn-contactar" 
                                data-id="${pub.id_form}"
                                data-userid="${usuario.id_user}">
                                Contactar
                            </button>
                            
                        </div>

                        <div class="media is-vcentered border-top pt-3 footer-card">
                                <div class="media-left">
                                    <figure class="image is-32x32">
                                        <img class="author-avatar" src="${pub.usuario.foto_user}" alt="Avatar">
                                    </figure>
                                </div>
                                <div class="media-content">
                                    <p class="is-size-7 has-text-weight-semibold has-text-dark">${pub.usuario.nombre} ${pub.usuario.apellido}</p>
                                </div>
                                <div class="media-right">
                                    <span 
                                        class="tag is-light is-rounded is-small aura-interactiva btn-aura" 
                                        data-userid="${usuario.id_user}"  id="aura-tag-${pub.id_form}">    Aura +${usuario.aura || 10}
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