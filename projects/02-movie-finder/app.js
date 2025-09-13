document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // CONFIGURACIÓN INICIAL
    // =========================================================================
    const apiKey = 'eb6227fe838a896302f5b928d5e43531';
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
    const homeButton = document.getElementById('home-button');
    const loadMoreButton = document.getElementById('load-more');

    // Variables de estado para paginación
    let currentPage = 1;
    let totalPages = 1;
    let currentEndpoint = '';
    let isLoading = false;
    let activeGenre = null;

    // =========================================================================
    // FUNCIONES DE LA API
    // =========================================================================
    async function fetchFromAPI(endpoint) {
        if (isLoading) return;
        isLoading = true;
        showLoader();

        const separator = endpoint.includes('?') ? '&' : '?';
        const url = `${apiUrl}/${endpoint}${separator}api_key=${apiKey}&language=es-ES`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error en la respuesta de la API: ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            resultsGrid.innerHTML = '<p>Hubo un error al conectar con el servidor.</p>';
        } finally {
            isLoading = false;
            hideLoader();
        }
    }

    async function loadGenres() {
        const data = await fetchFromAPI('genre/movie/list');
        if (data && data.genres) {
            data.genres.forEach(genre => {
                const btn = document.createElement('button');
                btn.className = 'genre-btn';
                btn.textContent = genre.name;
                btn.dataset.genreId = genre.id;
                genreNav.appendChild(btn);
            });
        }
    }

    async function getMovies(endpoint, page = 1) {
        currentEndpoint = endpoint;
        currentPage = page;
        
        if (page === 1) {
            clearResults();
        }

        const endpointWithPage = `${endpoint}${endpoint.includes('?') ? '&' : '?'}page=${page}`;
        const data = await fetchFromAPI(endpointWithPage);
        
        if (data && data.results) {
            displayMovies(data.results);
            totalPages = data.total_pages;

            // Mostrar u ocultar el botón "Cargar Más"
            if (currentPage < totalPages) {
                loadMoreButton.style.display = 'block';
            } else {
                loadMoreButton.style.display = 'none';
            }
        }
    }

    // =========================================================================
    // RENDERIZADO EN EL DOM
    // =========================================================================
    function displayMovies(movies) {
        if (movies.length === 0 && currentPage === 1) {
            resultsGrid.innerHTML = '<p>No se encontraron películas.</p>';
            return;
        }

        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
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
        modalBody.innerHTML = '';
        
        // CORRECCIÓN: Se añaden verificaciones para evitar errores si alguna petición falla
        const [details, credits, videos, providers] = await Promise.all([
            fetchFromAPI(`movie/${movieId}`),
            fetchFromAPI(`movie/${movieId}/credits`),
            fetchFromAPI(`movie/${movieId}/videos`),
            fetchFromAPI(`movie/${movieId}/watch/providers`)
        ]);

        hideLoader();
        if (!details) {
            modalBody.innerHTML = '<p>No se pudieron cargar los detalles de la película.</p>';
            modal.classList.add('active');
            return;
        }

        const trailer = videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        const watchProviders = providers?.results?.['ES']?.flatrate || [];
        const cast = credits?.cast?.slice(0, 10) || [];

        modalBody.innerHTML = `
            <div class="modal-header">
                <img src="${details.poster_path ? imageBaseUrl + details.poster_path : 'https://via.placeholder.com/500x750?text=No+Imagen'}" alt="${details.title}" class="modal-poster">
                <div class="modal-info">
                    <h2 class="modal-title">${details.title}</h2>
                    <div class="modal-details">
                        <p><span class="rating">⭐ ${details.vote_average.toFixed(1)}/10</span></p>
                        <p>${details.release_date} | ${details.runtime || 'N/A'} min</p>
                        <p><strong>Géneros:</strong> ${details.genres.map(g => g.name).join(', ')}</p>
                    </div>
                    <h3>Sinopsis</h3>
                    <p>${details.overview || 'Sinopsis no disponible.'}</p>
                </div>
            </div>

            ${trailer ? `
            <div class="modal-section modal-trailer">
                <h3>Tráiler Oficial</h3>
                <iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>
            </div>` : ''}

            ${watchProviders.length > 0 ? `
            <div class="modal-section modal-providers">
                <h3>Disponible en Streaming (España):</h3>
                <div class="provider-list">
                    ${watchProviders.map(p => `<img src="${imageBaseUrl}${p.logo_path}" alt="${p.provider_name}" class="provider-logo" title="${p.provider_name}">`).join('')}
                </div>
            </div>` : ''}

            ${cast.length > 0 ? `
            <div class="modal-section">
                <h3>Reparto Principal</h3>
                <div class="cast-grid">
                    ${cast.map(actor => `
                        <div class="cast-card">
                            <img src="${actor.profile_path ? imageBaseUrl + actor.profile_path : 'https://via.placeholder.com/150x225?text=Sin+Foto'}" alt="${actor.name}">
                            <p class="actor">${actor.name}</p>
                            <p class="character">${actor.character}</p>
                        </div>
                    `).join('')}
                </div>
            </div>` : ''}
        `;
        
        modal.classList.add('active');
    }
    
    // =========================================================================
    // MANEJO DE EVENTOS
    // =========================================================================
    homeButton.addEventListener('click', () => {
        if (activeGenre) activeGenre.classList.remove('active');
        activeGenre = null;
        searchInput.value = '';
        getMovies('movie/popular', 1);
    });

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            getMovies(`search/movie?query=${encodeURIComponent(query)}`, 1);
            if (activeGenre) activeGenre.classList.remove('active');
            activeGenre = null;
        }
    });
    searchInput.addEventListener('keyup', e => e.key === 'Enter' && searchButton.click());

    genreNav.addEventListener('click', e => {
        if (e.target.classList.contains('genre-btn')) {
            if (activeGenre) activeGenre.classList.remove('active');
            activeGenre = e.target;
            activeGenre.classList.add('active');
            const genreId = e.target.dataset.genreId;
            searchInput.value = '';
            getMovies(`discover/movie?with_genres=${genreId}`, 1);
        }
    });
    
    resultsGrid.addEventListener('click', e => {
        const card = e.target.closest('.movie-card');
        if (card) {
            displayMovieDetails(card.dataset.movieId);
        }
    });

    closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.classList.remove('active');
    });
    
    // CORRECCIÓN: Evento para el botón de paginación
    loadMoreButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            getMovies(currentEndpoint, currentPage + 1);
        }
    });

    const showLoader = () => loader.style.display = 'block';
    const hideLoader = () => loader.style.display = 'none';
    const clearResults = () => resultsGrid.innerHTML = '';

    function init() {
        loadGenres();
        getMovies('movie/popular', 1);
    }

    init();
});