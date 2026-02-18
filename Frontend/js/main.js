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

    console.log("Hiciste clic en:", e.target);



        
    
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

const btnEditar = e.target.closest('.btn-editar');
    if (btnEditar) {
        const idPublicacion = btnEditar.dataset.id;
        
        abrirModalEditar(idPublicacion);
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


const modalEditar = document.getElementById('modal-editar');
const btnGuardarEditar = document.getElementById('btn-guardar-editar');

async function abrirModalEditar(idForm) {
    console.log("Abriendo editor para ID:", idForm);
    
    if (!modalEditar) {
        console.error("Error: No encuentro el modal con id='modal-editar' en el HTML.");
        alert("Falta el HTML del modal de edición.");
        return;
    }

    try {
        modalEditar.classList.add('is-active');
        
        const inputMateria = document.getElementById('edit-materia');
        if(inputMateria) inputMateria.value = "Cargando...";


        const selectUsuario = document.getElementById('edit-usuario-select'); 
        
        
        selectUsuario.innerHTML = '<option disabled selected>Cargando lista...</option>';

        
        const responseUsers = await fetch('http://localhost:3000/api/users');
        const usuarios = await responseUsers.json();

        
        selectUsuario.innerHTML = ''; 
        usuarios.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id_user; 
            option.textContent = `${user.nombre} ${user.apellido}`;
            selectUsuario.appendChild(option);
        });

        const response = await fetch(`http://localhost:3000/api/forms/${idForm}`);
        
        if (!response.ok) throw new Error("Error al traer datos");
        
        const data = await response.json();

        document.getElementById('edit-materia').value = data.materia;
        document.getElementById('edit-tema').value = data.tema;
        document.getElementById('edit-descripcion').value = data.descripcion;
        
        document.getElementById('edit-id-form').value = data.id_form;
        document.getElementById('edit-id-user').value = data.usuario.id_user;
        document.getElementById('edit-tipo').value = data.tipo;
        document.getElementById('edit-foto-form').value = data.foto_form || "";

        selectUsuario.value = data.usuario.id_user;

    } catch (error) {
        console.error(error);
        alert("Error al cargar datos del post.");
        cerrarModalEditar();
    }
}

function cerrarModalEditar() {
    if(modalEditar) modalEditar.classList.remove('is-active');
    const form = document.getElementById('form-editar');
    if(form) form.reset();
}


document.getElementById('btn-cerrar-x-editar')?.addEventListener('click', cerrarModalEditar);
document.getElementById('btn-cancelar-editar')?.addEventListener('click', cerrarModalEditar);


if (btnGuardarEditar) {
    btnGuardarEditar.addEventListener('click', async () => {
        const idForm = document.getElementById('edit-id-form').value;

        const selectUsuario = document.getElementById('edit-usuario-select');

        
        const datosActualizados = {
            id_user: parseInt(selectUsuario.value),
            materia: document.getElementById('edit-materia').value,
            tema: document.getElementById('edit-tema').value,
            descripcion: document.getElementById('edit-descripcion').value,
            tipo: document.getElementById('edit-tipo').value,
            foto_form: document.getElementById('edit-foto-form').value
        };

        try {
            btnGuardarEditar.classList.add('is-loading');

            const response = await fetch(`http://localhost:3000/api/forms/${idForm}`, {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosActualizados)
            });

            if (response.ok) {
                console.log("Editado correctamente");
                cerrarModalEditar();
                cargarCard(); 
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            btnGuardarEditar.classList.remove('is-loading');
        }
    });
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

    const miId = parseInt(localStorage.getItem('idUsuarioActual')) || 0;

    publicaciones.forEach(pub => {

        if (!pub.usuario || !pub.usuario.id_user) {
            return; 
        }

        const usuario = pub.usuario;
        
        
        const esMiPost = (usuario.id_user === miId);

        
        const fechaObj = new Date(pub.fecha_creado);
        const fechaFormateada = fechaObj.toLocaleDateString('es-AR', {
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit', 
            minute: '2-digit'
        });

        
        let colorTag = 'is-link'; 
        let iconoTag = 'fa-chalkboard-teacher'; 

        if (pub.tipo === 'solicitante') {
            colorTag = 'is-warning is-light'; 
            iconoTag = 'fa-hand-paper';
        } else if (pub.tipo === 'mentor') {
            colorTag = 'is-primary is-light'; 
            iconoTag = 'fa-graduation-cap';
        }

    
    
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
                            <div class="is-flex is-justify-content-space-between is-align-items-center mb-2">

                            <div style="max-width: 75%;">
                                
                                    <span class="tag ${colorTag} is-rounded is-small mb-2">
                                        <span class="icon is-small mr-1"><i class="fas ${iconoTag}"></i></span>
                                        ${pub.tipo}
                                    </span>
        
                                    <p class="is-size-7 has-text-weight-bold has-text-info is-uppercase">
                                        ${pub.materia}
                                    </p>
                            </div>

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

                            <p class="is-size-7 has-text-grey-light mb-4 is-italic">
                                <i class="far fa-clock mr-1"></i> ${fechaFormateada}
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