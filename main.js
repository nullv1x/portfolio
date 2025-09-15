// main.js
class Portfolio {
    constructor() {
        this.projects = [];
        this.init();
    }

    async init() {
        await this.loadProjects();
        this.renderProjects();
        this.updateStats();
        this.setupEventListeners();
    }

    async loadProjects() {
        try {
            const response = await fetch('./data/projects-config.json');
            const data = await response.json();
            this.projects = data.projects;
            this.categories = data.categories;
            this.stats = data.stats;
        } catch (error) {
            console.error('Error loading projects:', error);
            this.projects = [];
        }
    }

    renderProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = this.projects.map(project => this.createProjectCard(project)).join('');
    }

    createProjectCard(project) {
        const statusClass = project.status;
        const statusText = {
            'completed': 'Completado',
            'in-progress': 'En Progreso',
            'planned': 'Planeado'
        };

        return `
            <article class="project-card" data-category="${project.category}">
                <div class="project-header">
                    <div class="project-status ${statusClass}">
                        ${statusText[project.status] || project.status}
                    </div>
                    <div class="project-meta">
                        <span class="category">${project.category}</span>
                        <span class="trimester">T${project.trimester}</span>
                    </div>
                </div>
                
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p class="subtitle">${project.subtitle}</p>
                    <p class="description">${project.description}</p>
                    
                    <div class="technologies">
                        ${project.technologies.map(tech =>
                            `<span class="tech-tag">${tech}</span>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="project-actions">
                    <a href="${project.demo_url}" class="btn btn-primary">Ver Proyecto</a>
                    <button class="btn btn-secondary" onclick="Portfolio.showProjectDetails('${project.id}')">
                        Detalles
                    </button>
                </div>
            </article>
        `;
    }

    updateStats() {
        // Actualizar estadísticas en el hero
        document.getElementById('total-projects').textContent = this.projects.length;
        
        const uniqueTechs = [...new Set(this.projects.flatMap(p => p.technologies))];
        document.getElementById('technologies-count').textContent = uniqueTechs.length;
        
        document.getElementById('current-trimester').textContent = this.stats?.current_trimester || 1;
    }

    setupEventListeners() {
        // Búsqueda de proyectos
        const searchInput = document.getElementById('search-projects');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProjects(e.target.value);
            });
        }

        // Filtros por categoría
        const categoryFilter = document.getElementById('filter-category');
        if (categoryFilter) {
            // Llenar opciones de categorías
            this.categories?.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.name;
                option.textContent = cat.name;
                categoryFilter.appendChild(option);
            });

            categoryFilter.addEventListener('change', (e) => {
                this.filterByCategory(e.target.value);
            });
        }
    }

    filterProjects(searchTerm) {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('.description').textContent.toLowerCase();
            const technologies = Array.from(card.querySelectorAll('.tech-tag'))
                .map(tag => tag.textContent.toLowerCase()).join(' ');
            
            const matches = title.includes(searchTerm.toLowerCase()) ||
                          description.includes(searchTerm.toLowerCase()) ||
                          technologies.includes(searchTerm.toLowerCase());
            
            card.style.display = matches ? 'block' : 'none';
        });
    }

    filterByCategory(category) {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            const cardCategory = card.dataset.category;
            const matches = !category || cardCategory === category;
            card.style.display = matches ? 'block' : 'none';
        });
    }

    showProjectDetails(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const modal = document.getElementById('project-modal');
        const modalBody = document.getElementById('modal-body');
        
        modalBody.innerHTML = `
            <h2>${project.title}</h2>
            <p class="project-subtitle">${project.subtitle}</p>
            <div class="project-details">
                <p><strong>Descripción:</strong> ${project.description}</p>
                <p><strong>Duración:</strong> ${project.duration}</p>
                <p><strong>Dificultad:</strong> ${project.difficulty}</p>
                <p><strong>Trimestre:</strong> ${project.trimester}</p>
                
                <h4>Objetivos de Aprendizaje:</h4>
                <ul>
                    ${project.learning_objectives?.map(obj => `<li>${obj}</li>`).join('') || ''}
                </ul>
                
                <h4>Características:</h4>
                <ul>
                    ${project.features?.map(feature => `<li>${feature}</li>`).join('') || ''}
                </ul>
                
                <div class="project-links">
                    <a href="${project.demo_url}" class="btn btn-primary" target="_blank">Ver Proyecto</a>
                    <a href="${project.repo_url}" class="btn btn-secondary" target="_blank">Código en GitHub</a>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // ✨ CAMBIO CLAVE: Asignamos la instancia a window.Portfolio
    window.Portfolio = new Portfolio();
});

// Cerrar modal
document.addEventListener('click', (e) => {
    const modal = document.getElementById('project-modal');
    if (e.target === modal || e.target.classList.contains('close')) {
        modal.style.display = 'none';
    }
});