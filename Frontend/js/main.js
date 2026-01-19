const grid = document.getElementById('grid-tarjetas');

        publicaciones.forEach(pub => {
            const cardHTML = `
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
                                    <span class="tag is-light is-rounded is-small">Aura +10</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            grid.innerHTML += cardHTML;
        });