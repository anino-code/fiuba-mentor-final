const cardContainer = document.getElementById('grid-tarjetas');


async function cargarCard() {

    try{
    cardContainer.innerHTML = '<p>Cargando datos del servidor simulado...</p>';

    const response = await fetch('http://localhost:3000/api/forms');

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
                            <p class="is-size-7 has-text-weight-bold has-text-info is-uppercase mb-1">${pub.materia}</p>
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

/* Pega esto en js/main.js */

document.addEventListener('DOMContentLoaded', () => {

  // Busca todos los elementos con la clase "navbar-burger"
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Si encuentra alguno...
  if ($navbarBurgers.length > 0) {

    // A cada uno le agrega el evento "click"
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {

        // Obtiene el ID del menú objetivo (data-target="navbarMenuPrincipal")
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Alterna la clase "is-active" en el botón y en el menú
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }
});