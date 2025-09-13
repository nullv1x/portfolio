document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // CONFIGURACIÓN INICIAL
    // =========================================================================
    const apiKey = 'eb6227fe838a896302f5b928d5e43531'; // <-- ¡IMPORTANTE! Reemplaza con tu API Key de TMDB
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

    // Función genérica para hacer peticiones a la API
    async function fetchFromAPI(endpoint) {
        const url = `${apiUrl}/${endpoint}?api_key=${apiKey}&language=es-ES`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error en la respuesta de la API');
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
        }
    }

    // Cargar y mostrar géneros
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

    // Obtener películas (populares, por búsqueda o por género)
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
            resultsGrid.innerHTML = '<p>No se encontraron películas.</p>';
            return;
        }

        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.dataset.movieId = movie.id; // Guardamos el ID para el modal

            const posterPath = movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Imagen';

            movieCard.innerHTML = `
                <img src="${posterPath}" alt="${movie.title}">
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
        // Hacemos múltiples peticiones en paralelo para ser más eficientes
        const [details, videos, providers] = await Promise.all([
            fetchFromAPI(`movie/${movieId}`),
            fetchFromAPI(`movie/${movieId}/videos`),
            fetchFromAPI(`movie/${movieId}/watch/providers`)
        ]);

        if (!details) {
            hideLoader();
            return;
        }

        const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        const watchProviders = providers.results['ES']?.flatrate || []; // Buscamos proveedores en España

        modalBody.innerHTML = `
            <div class="modal-header">
                <img src="${details.poster_path ? imageBaseUrl + details.poster_path : 'https://via.placeholder.com/500x750?text=No+Imagen'}" alt="${details.title}" class="modal-poster">
                <div class="modal-info">
                    <h2 class="modal-title">${details.title}</h2>
                    <div class="modal-details">
                        <p><span class="rating">⭐ ${details.vote_average.toFixed(1)}/10</span></p>
                        <p>${details.release_date} | ${details.runtime} min</p>
                        <p>${details.genres.map(g => g.name).join(', ')}</p>
                    </div>
                    <h3>Sinopsis</h3>
                    <p>${details.overview || 'No disponible.'}</p>
                </div>
            </div>
            ${trailer ? `
            <div class="modal-trailer">
                <h3>Tráiler</h3>
                <iframe src="https://www.youtube.com/embed/${trailer.key}" allowfullscreen></iframe>
            </div>` : ''}
            ${watchProviders.length > 0 ? `
            <div class="modal-providers">
                <h3>Disponible en:</h3>
                <div class="provider-list">
                    ${watchProviders.map(p => `<img src="${imageBaseUrl}${p.logo_path}" alt="${p.provider_name}" class="provider-logo" title="${p.provider_name}">`).join('')}
                </div>
            </div>` : ''}
        `;
        
        hideLoader();
        modal.style.display = 'flex';
    }

    // =========================================================================
    // MANEJO DE EVENTOS
    // =========================================================================

    // Búsqueda
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            getMovies(`search/movie?query=${encodeURIComponent(query)}`);
            if (activeGenre) activeGenre.classList.remove('active');
        }
    });
    searchInput.addEventListener('keyup', e => e.key === 'Enter' && searchButton.click());

    // Filtros por Género
    genreNav.addEventListener('click', e => {
        if (e.target.classList.contains('genre-btn')) {
            if (activeGenre) activeGenre.classList.remove('active');
            activeGenre = e.target;
            activeGenre.classList.add('active');
            const genreId = e.target.dataset.genreId;
            getMovies(`discover/movie?with_genres=${genreId}`);
        }
    });
    
    // Abrir Modal
    resultsGrid.addEventListener('click', e => {
        const card = e.target.closest('.movie-card');
        if (card) {
            displayMovieDetails(card.dataset.movieId);
        }
    });

    // Cerrar Modal
    closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Funciones de ayuda
    const showLoader = () => loader.style.display = 'block';
    const hideLoader = () => loader.style.display = 'none';
    const clearResults = () => resultsGrid.innerHTML = '';

    // =========================================================================
    // INICIALIZACIÓN
    // =========================================================================
    function init() {
        loadGenres();
        getMovies('movie/popular'); // Cargar populares al inicio
    }

    init();
});