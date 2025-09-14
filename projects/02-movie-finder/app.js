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

    // Elementos de recomendaciones
    const recommendationGenre = document.getElementById('recommendation-genre');
    const recommendButton = document.getElementById('recommend-button');
    const recommendedMovieDiv = document.getElementById('recommended-movie');
    const viewRecommendedDetails = document.getElementById('view-recommended-details');

    // Nuevos elementos para favoritos e historial
    const favoritesButton = document.getElementById('favorites-button');
    const historyButton = document.getElementById('history-button');
    const sectionTitle = document.getElementById('section-title');

    // Variables de estado
    let currentPage = 1;
    let totalPages = 1;
    let currentEndpoint = '';
    let isLoading = false;
    let activeGenre = null;
    let allGenres = [];
    let currentRecommendedMovie = null;
    let currentSection = 'popular'; // 'popular', 'favorites', 'history'

    // =========================================================================
    // SISTEMA DE FAVORITOS E HISTORIAL
    // =========================================================================
    
    // Funciones para manejar localStorage
    function getFavorites() {
        try {
            return JSON.parse(localStorage.getItem('movieFavorites')) || [];
        } catch (error) {
            console.error('Error al obtener favoritos:', error);
            return [];
        }
    }

    function getWatchedMovies() {
        try {
            return JSON.parse(localStorage.getItem('watchedMovies')) || [];
        } catch (error) {
            console.error('Error al obtener historial:', error);
            return [];
        }
    }

    function addToFavorites(movie) {
        const favorites = getFavorites();
        const isAlreadyFavorite = favorites.some(fav => fav.id === movie.id);
        
        if (!isAlreadyFavorite) {
            favorites.push({
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
                overview: movie.overview,
                dateAdded: new Date().toISOString()
            });
            localStorage.setItem('movieFavorites', JSON.stringify(favorites));
            return true;
        }
        return false;
    }

    function removeFromFavorites(movieId) {
        const favorites = getFavorites();
        const filteredFavorites = favorites.filter(fav => fav.id !== movieId);
        localStorage.setItem('movieFavorites', JSON.stringify(filteredFavorites));
    }

    function addToWatched(movie) {
        const watchedMovies = getWatchedMovies();
        const isAlreadyWatched = watchedMovies.some(watched => watched.id === movie.id);
        
        if (!isAlreadyWatched) {
            watchedMovies.unshift({
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
                overview: movie.overview,
                dateWatched: new Date().toISOString()
            });
            localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
            return true;
        }
        return false;
    }

    function removeFromWatched(movieId) {
        const watchedMovies = getWatchedMovies();
        const filteredWatched = watchedMovies.filter(watched => watched.id !== movieId);
        localStorage.setItem('watchedMovies', JSON.stringify(filteredWatched));
    }

    function isFavorite(movieId) {
        return getFavorites().some(fav => fav.id === movieId);
    }

    function isWatched(movieId) {
        return getWatchedMovies().some(watched => watched.id === movieId);
    }

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
            if (resultsGrid) {
                resultsGrid.innerHTML = '<p>Hubo un error al conectar con el servidor.</p>';
            }
            return null;
        } finally {
            isLoading = false;
            hideLoader();
        }
    }

    async function loadGenres() {
        const data = await fetchFromAPI('genre/movie/list');
        if (data && data.genres) {
            allGenres = data.genres;
            
            // Cargar géneros en la navegación
            data.genres.forEach(genre => {
                const btn = document.createElement('button');
                btn.className = 'genre-btn';
                btn.textContent = genre.name;
                btn.dataset.genreId = genre.id;
                genreNav.appendChild(btn);
            });

            // Cargar géneros en el selector de recomendaciones
            data.genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.name;
                recommendationGenre.appendChild(option);
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

            if (currentPage < totalPages) {
                loadMoreButton.style.display = 'block';
            } else {
                loadMoreButton.style.display = 'none';
            }
        }
    }

    // =========================================================================
    // FUNCIONES DE RECOMENDACIONES
    // =========================================================================
    async function getRandomMovie() {
        const selectedGenre = recommendationGenre.value;
        const randomPage = Math.floor(Math.random() * 20) + 1;
        
        let endpoint = `discover/movie?sort_by=popularity.desc&page=${randomPage}`;
        if (selectedGenre) {
            endpoint += `&with_genres=${selectedGenre}`;
        }

        const data = await fetchFromAPI(endpoint);
        if (data && data.results && data.results.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.results.length);
            const randomMovie = data.results[randomIndex];
            currentRecommendedMovie = randomMovie;
            displayRecommendedMovie(randomMovie);
        }
    }

    function displayRecommendedMovie(movie) {
        document.getElementById('recommended-title').textContent = movie.title;
        document.getElementById('recommended-overview').textContent = movie.overview || 'Descripción no disponible';
        document.getElementById('recommended-rating').textContent = `⭐ ${movie.vote_average.toFixed(1)}/10`;
        document.getElementById('recommended-year').textContent = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
        
        const posterPath = movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=Sin+Imagen';
        document.getElementById('recommended-poster').src = posterPath;
        document.getElementById('recommended-poster').alt = movie.title;

        recommendedMovieDiv.classList.add('show');
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
            
            // Indicadores de estado
            const favoriteIcon = isFavorite(movie.id) ? '❤️' : '';
            const watchedIcon = isWatched(movie.id) ? '✓' : '';
            
            let statusIcons = '';
            if (favoriteIcon || watchedIcon) {
                statusIcons = `<div class="movie-status">${favoriteIcon} ${watchedIcon}</div>`;
            }

            movieCard.innerHTML = `
                <img src="${posterPath}" alt="Póster de ${movie.title}">
                ${statusIcons}
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>Lanzamiento: ${movie.release_date || 'N/A'}</p>
                </div>
            `;
            resultsGrid.appendChild(movieCard);
        });
    }

    function displayFavorites() {
        currentSection = 'favorites';
        sectionTitle.textContent = '❤️ Mis Películas Favoritas';
        clearResults();
        loadMoreButton.style.display = 'none';
        
        const favorites = getFavorites();
        if (favorites.length === 0) {
            resultsGrid.innerHTML = '<p>No tienes películas favoritas aún. ¡Agrega algunas!</p>';
            return;
        }
        
        displayMovies(favorites);
    }

    function displayHistory() {
        currentSection = 'history';
        sectionTitle.textContent = '📺 Películas Vistas';
        clearResults();
        loadMoreButton.style.display = 'none';
        
        const watchedMovies = getWatchedMovies();
        if (watchedMovies.length === 0) {
            resultsGrid.innerHTML = '<p>No has marcado ninguna película como vista. ¡Empieza a llevar tu registro!</p>';
            return;
        }
        
        displayMovies(watchedMovies);
    }

    async function displayMovieDetails(movieId) {
        showLoader();
        modalBody.innerHTML = '';
        
        // Obtener toda la información de la película
        const [details, credits, videos, providers, keywords, similar, reviews] = await Promise.all([
            fetchFromAPI(`movie/${movieId}`),
            fetchFromAPI(`movie/${movieId}/credits`),
            fetchFromAPI(`movie/${movieId}/videos`),
            fetchFromAPI(`movie/${movieId}/watch/providers`),
            fetchFromAPI(`movie/${movieId}/keywords`),
            fetchFromAPI(`movie/${movieId}/similar`),
            fetchFromAPI(`movie/${movieId}/reviews`)
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
        const director = credits?.crew?.find(person => person.job === 'Director');
        const movieKeywords = keywords?.keywords?.slice(0, 8) || [];
        const similarMovies = similar?.results?.slice(0, 6) || [];
        const movieReviews = reviews?.results?.slice(0, 3) || [];

        // Estados de favorito y visto
        const isFav = isFavorite(movieId);
        const isWat = isWatched(movieId);

        modalBody.innerHTML = `
            <div class="modal-header">
                <img src="${details.poster_path ? imageBaseUrl + details.poster_path : 'https://via.placeholder.com/500x750?text=No+Imagen'}" alt="${details.title}" class="modal-poster">
                <div class="modal-info">
                    <h2 class="modal-title">${details.title}</h2>
                    
                    <!-- BOTONES DE ACCIÓN -->
                    <div class="movie-actions">
                        <button id="favorite-btn" class="action-btn ${isFav ? 'active' : ''}" data-movie-id="${movieId}">
                            ${isFav ? '❤️ En Favoritos' : '🤍 Agregar a Favoritos'}
                        </button>
                        <button id="watched-btn" class="action-btn ${isWat ? 'active' : ''}" data-movie-id="${movieId}">
                            ${isWat ? '✅ Ya Vista' : '➕ Marcar como Vista'}
                        </button>
                    </div>
                    
                    <div class="modal-details">
                        <p><span class="rating">⭐ ${details.vote_average.toFixed(1)}/10</span> (${details.vote_count} votos)</p>
                        <p>${details.release_date} | ${details.runtime || 'N/A'} min</p>
                        <p><strong>Géneros:</strong> ${details.genres.map(g => g.name).join(', ')}</p>
                        ${director ? `<p><strong>Director:</strong> ${director.name}</p>` : ''}
                        ${details.budget > 0 ? `<p><strong>Presupuesto:</strong> $${details.budget.toLocaleString()}</p>` : ''}
                    </div>
                    
                    <div class="modal-stats">
                        <div class="stat-item">
                            <span class="stat-value">${details.vote_average.toFixed(1)}</span>
                            <span class="stat-label">Puntuación</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${details.popularity.toFixed(0)}</span>
                            <span class="stat-label">Popularidad</span>
                        </div>
                        ${details.revenue > 0 ? `
                        <div class="stat-item">
                            <span class="stat-value">$${(details.revenue/1000000).toFixed(1)}M</span>
                            <span class="stat-label">Recaudación</span>
                        </div>` : ''}
                        <div class="stat-item">
                            <span class="stat-value">${details.runtime || 'N/A'}</span>
                            <span class="stat-label">Minutos</span>
                        </div>
                    </div>
                    
                    <h3>Sinopsis</h3>
                    <p>${details.overview || 'Sinopsis no disponible.'}</p>
                </div>
            </div>

            ${trailer ? `
            <div class="modal-section modal-trailer">
                <h3>🎬 Tráiler Oficial</h3>
                <iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>
            </div>` : ''}

            ${watchProviders.length > 0 ? `
            <div class="modal-section modal-providers">
                <h3>📺 Disponible en Streaming (España):</h3>
                <div class="provider-list">
                    ${watchProviders.map(p => `<img src="${imageBaseUrl}${p.logo_path}" alt="${p.provider_name}" class="provider-logo" title="${p.provider_name}">`).join('')}
                </div>
            </div>` : ''}

            ${cast.length > 0 ? `
            <div class="modal-section">
                <h3>🎭 Reparto Principal</h3>
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

            ${details.production_companies && details.production_companies.length > 0 ? `
            <div class="modal-section">
                <h3>🏢 Compañías Productoras</h3>
                <div class="production-companies">
                    ${details.production_companies.filter(company => company.logo_path).map(company => `
                        <img src="${imageBaseUrl}${company.logo_path}" alt="${company.name}" class="company-logo" title="${company.name}">
                    `).join('')}
                </div>
            </div>` : ''}

            ${movieKeywords.length > 0 ? `
            <div class="modal-section">
                <h3>🏷️ Palabras Clave</h3>
                <div class="keywords-list">
                    ${movieKeywords.map(keyword => `<span class="keyword-tag">${keyword.name}</span>`).join('')}
                </div>
            </div>` : ''}

            ${movieReviews.length > 0 ? `
            <div class="modal-section">
                <h3>💬 Reseñas de Usuarios</h3>
                ${movieReviews.map(review => `
                    <div class="review-card">
                        <p>${review.content.length > 300 ? review.content.substring(0, 300) + '...' : review.content}</p>
                        <span class="author">- ${review.author}</span>
                    </div>
                `).join('')}
            </div>` : ''}

            ${similarMovies.length > 0 ? `
            <div class="modal-section">
                <h3>🎯 Películas Similares</h3>
                <div class="similar-movies">
                    ${similarMovies.map(movie => `
                        <div class="similar-movie" data-movie-id="${movie.id}">
                            <img src="${movie.poster_path ? imageBaseUrl + movie.poster_path : 'https://via.placeholder.com/200x300?text=Sin+Imagen'}" alt="${movie.title}">
                            <p>${movie.title}</p>
                        </div>
                    `).join('')}
                </div>
            </div>` : ''}
        `;
        
        modal.classList.add('active');

        // Event listeners para películas similares
        const similarMovieElements = modalBody.querySelectorAll('.similar-movie');
        similarMovieElements.forEach(element => {
            element.addEventListener('click', () => {
                displayMovieDetails(element.dataset.movieId);
            });
        });

        // Event listeners para botones de favorito y visto
        const favoriteBtn = modalBody.querySelector('#favorite-btn');
        const watchedBtn = modalBody.querySelector('#watched-btn');

        favoriteBtn.addEventListener('click', () => {
            const movieId = parseInt(favoriteBtn.dataset.movieId);
            const isFav = isFavorite(movieId);
            
            if (isFav) {
                removeFromFavorites(movieId);
                favoriteBtn.innerHTML = '🤍 Agregar a Favoritos';
                favoriteBtn.classList.remove('active');
            } else {
                const success = addToFavorites(details);
                if (success) {
                    favoriteBtn.innerHTML = '❤️ En Favoritos';
                    favoriteBtn.classList.add('active');
                }
            }
            
            // Actualizar vista si estamos en favoritos
            if (currentSection === 'favorites') {
                setTimeout(() => displayFavorites(), 500);
            }
        });

        watchedBtn.addEventListener('click', () => {
            const movieId = parseInt(watchedBtn.dataset.movieId);
            const isWat = isWatched(movieId);
            
            if (isWat) {
                removeFromWatched(movieId);
                watchedBtn.innerHTML = '➕ Marcar como Vista';
                watchedBtn.classList.remove('active');
            } else {
                const success = addToWatched(details);
                if (success) {
                    watchedBtn.innerHTML = '✅ Ya Vista';
                    watchedBtn.classList.add('active');
                }
            }
            
            // Actualizar vista si estamos en historial
            if (currentSection === 'history') {
                setTimeout(() => displayHistory(), 500);
            }
        });
    }
    
    // =========================================================================
    // MANEJO DE EVENTOS
    // =========================================================================
    homeButton.addEventListener('click', () => {
        currentSection = 'popular';
        sectionTitle.textContent = '🎬 Películas Populares';
        if (activeGenre) activeGenre.classList.remove('active');
        activeGenre = null;
        searchInput.value = '';
        getMovies('movie/popular', 1);
    });

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            currentSection = 'search';
            sectionTitle.textContent = `🔍 Resultados para: "${query}"`;
            getMovies(`search/movie?query=${encodeURIComponent(query)}`, 1);
            if (activeGenre) activeGenre.classList.remove('active');
            activeGenre = null;
        }
    });

    searchInput.addEventListener('keyup', e => e.key === 'Enter' && searchButton.click());

    genreNav.addEventListener('click', e => {
        if (e.target.classList.contains('genre-btn')) {
            currentSection = 'genre';
            if (activeGenre) activeGenre.classList.remove('active');
            activeGenre = e.target;
            activeGenre.classList.add('active');
            const genreId = e.target.dataset.genreId;
            const genreName = e.target.textContent;
            sectionTitle.textContent = `🎭 Películas de ${genreName}`;
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
    
    loadMoreButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            getMovies(currentEndpoint, currentPage + 1);
        }
    });

    // Event listeners para favoritos e historial
    favoritesButton.addEventListener('click', displayFavorites);
    historyButton.addEventListener('click', displayHistory);

    // Event listeners para recomendaciones
    recommendButton.addEventListener('click', getRandomMovie);
    
    viewRecommendedDetails.addEventListener('click', () => {
        if (currentRecommendedMovie) {
            displayMovieDetails(currentRecommendedMovie.id);
        }
    });

    // Funciones utilitarias
    const showLoader = () => loader.style.display = 'block';
    const hideLoader = () => loader.style.display = 'none';
    const clearResults = () => resultsGrid.innerHTML = '';

    function init() {
        sectionTitle.textContent = '🎬 Películas Populares';
        loadGenres();
        getMovies('movie/popular', 1);
    }

    init();
});