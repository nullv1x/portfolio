document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // CONFIGURACIÓN INICIAL
    // =========================================================================
    const apiKey = 'eb6227fe838a896302f5b928d5e43531'; // Tu API Key de TMDB
    const apiUrl = 'https://api.themoviedb.org/3';
    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

    // Elementos del DOM
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsGrid = document.getElementById('results-grid');
    const genreNav = document.getElementById('genre-nav');
    const loader = document.getElementById('loader');
    const modal = document.getElementById('movie-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.querySelector('.close-modal');

    let activeGenre = null;

    // =========================================================================
    // FUNCIONES DE LA API
    // =========================================================================

    /**
     * Función genérica y corregida para hacer peticiones a la API.
     * Añade '?' o '&' según sea necesario para evitar errores en la URL.
     */
    async function fetchFromAPI(endpoint) {
        const separator = endpoint.includes('?') ? '&' : '?';
        const url = `${apiUrl}/${endpoint}${separator}api_key=${apiKey}&language=es-ES`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error en la respuesta de la API: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            resultsGrid.innerHTML = '<p>Hubo un error al conectar con el servidor. Por favor, intenta de nuevo.</p>';
        }
    }

    // Cargar y mostrar géneros en la barra de navegación
    async function loadGenres() {
        const data = await fetchFromAPI('genre/movie/list');
        if (data && data.genres) {
            data.genres.forEach(genre => {
                const btn = document.createElement('button');
                btn.classList.add('genre-btn');
                btn.textContent = genre.name;
                btn.dataset.genreId = genre.id;
                genreNav.appendChild(btn);
            });
        }
    }

    // Obtener y mostrar películas (populares, por búsqueda o por género)
    async function getMovies(endpoint) {
        showLoader();
        clearResults();
        const data = await fetchFromAPI(endpoint);
        if (data && data.results) {
            displayMovies(data.results);
        }
        hideLoader();
    }

    // =========================================================================
    // RENDERIZADO EN EL DOM
    // =========================================================================

    function displayMovies(movies) {
        if (movies.length === 0) {
            resultsGrid.innerHTML = '<p>No se encontraron películas que coincidan con tu búsqueda.</p>';
            return;
        }

        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.dataset.movieId = movie.id;

            const posterPath = movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Imagen';

            movieCard.innerHTML = `
                <img src="${posterPath}" alt="Póster de ${movie.title}">
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>Lanzamiento: ${movie.release_date || 'N/A'}</p>
                </div>
            `;
            resultsGrid.appendChild(movieCard);
        });
    }

    async function displayMovieDetails(movieId) {
        showLoader();
        modalBody.innerHTML = ''; // Limpiar contenido anterior del modal

        const [details, videos, providers] = await Promise.all([
            fetchFromAPI(`movie/${movieId}`),
            fetchFromAPI(`movie/${movieId}/videos`),
            fetchFromAPI(`movie/${movieId}/watch/providers`)
        ]);

        hideLoader();

        if (!details) {
            modalBody.innerHTML = '<p>No se pudieron cargar los detalles de la película.</p>';
            modal.style.display = 'flex';
            return;
        }

        const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        const watchProviders = providers.results['ES']?.flatrate || [];

        modalBody.innerHTML = `
            <div class="modal-header">
                <img src="${details.poster_path ? imageBaseUrl + details.poster_path : 'https://via.placeholder.com/500x750?text=No+Imagen'}" alt="${details.title}" class="modal-poster">
                <div class="modal-info">
                    <h2 class="modal-title">${details.title}</h2>
                    <div class="modal-details">
                        <p><span class="rating">⭐ ${details.vote_average.toFixed(1)}/10</span></p>
                        <p>${details.release_date} | ${details.runtime} min</p>
                        <p><strong>Géneros:</strong> ${details.genres.map(g => g.name).join(', ')}</p>
                    </div>
                    <h3>Sinopsis</h3>
                    <p>${details.overview || 'Sinopsis no disponible.'}</p>
                </div>
            </div>
            ${trailer ? `
            <div class="modal-trailer">
                <h3>Tráiler Oficial</h3>
                <iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>` : ''}
            ${watchProviders.length > 0 ? `
            <div class="modal-providers">
                <h3>Disponible en Streaming:</h3>
                <div class="provider-list">
                    ${watchProviders.map(p => `<img src="${imageBaseUrl}${p.logo_path}" alt="${p.provider_name}" class="provider-logo" title="${p.provider_name}">`).join('')}
                </div>
            </div>` : '<p>Información de streaming no disponible para esta región.</p>'}
        `;
        
        modal.style.display = 'flex';
    }

    // =========================================================================
    // MANEJO DE EVENTOS
    // =========================================================================

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            getMovies(`search/movie?query=${encodeURIComponent(query)}`);
            if (activeGenre) {
                activeGenre.classList.remove('active');
                activeGenre = null;
            }
        }
    });

    searchInput.addEventListener('keyup', e => e.key === 'Enter' && searchButton.click());

    genreNav.addEventListener('click', e => {
        if (e.target.classList.contains('genre-btn')) {
            if (activeGenre) activeGenre.classList.remove('active');
            activeGenre = e.target;
            activeGenre.classList.add('active');
            const genreId = e.target.dataset.genreId;
            searchInput.value = ''; // Limpiar búsqueda al usar un filtro
            getMovies(`discover/movie?with_genres=${genreId}`);
        }
    });
    
    resultsGrid.addEventListener('click', e => {
        const card = e.target.closest('.movie-card');
        if (card) {
            displayMovieDetails(card.dataset.movieId);
        }
    });

    closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Funciones de ayuda
    const showLoader = () => loader.style.display = 'block';
    const hideLoader = () => loader.style.display = 'none';
    const clearResults = () => resultsGrid.innerHTML = '';

    // =========================================================================
    // INICIALIZACIÓN DE LA APLICACIÓN
    // =========================================================================
    function init() {
        loadGenres();
        getMovies('movie/popular');
    }

    init();
});