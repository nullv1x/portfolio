document.addEventListener('DOMContentLoaded', () => {
    class LabApp {
        constructor() {
            // Base de datos de código para los experimentos
            this.experiments = {
                pulseButton: {
                    title: 'Botón con Pulso de Energía',
                    html: `<button class="pulse-button">Haz Clic</button>`,
                    css: `.pulse-button {
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background-color: #ff6719; /* Naranja SENA */
    border: none;
    border-radius: 12px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}
.pulse-button:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px #ff6719;
}
.pulse-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.5s, height 0.5s;
}
.pulse-button:active::before {
    width: 300px;
    height: 300px;
}`
                },
                futureToggle: {
                    title: 'Toggle Futurista',
                    html: `<input type="checkbox" id="toggle1" class="toggle-checkbox">
<label for="toggle1" class="toggle-label">
    <div class="toggle-switch"></div>
</label>`,
                    css: `.toggle-label {
    width: 80px;
    height: 40px;
    background-color: #333;
    border-radius: 20px;
    position: relative;
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.2);
}
.toggle-checkbox {
    display: none;
}
.toggle-switch {
    width: 34px;
    height: 34px;
    background-color: #555;
    border-radius: 50%;
    position: absolute;
    top: 3px;
    left: 3px;
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.toggle-checkbox:checked + .toggle-label .toggle-switch {
    transform: translateX(40px);
    background-color: #ff6719; /* Naranja SENA */
}
.toggle-checkbox:checked + .toggle-label {
    background-color: #70b22d; /* Verde SENA */
}`
                }
            };

            this.modal = document.getElementById('code-modal');
            this.modalTitle = document.getElementById('modal-title');
            this.htmlCode = document.getElementById('html-code');
            this.cssCode = document.getElementById('css-code');
            this.htmlTab = document.getElementById('html-tab');
            this.cssTab = document.getElementById('css-tab');
            this.copyBtn = document.getElementById('copy-code-btn');
            this.currentCode = '';

            this.setupEventListeners();
        }

        setupEventListeners() {
            // Filtros
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.filterExperiments(e));
            });
            
            // Botones "Ver Código"
            document.querySelectorAll('.code-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.showCode(e.target.dataset.experimentId));
            });

            // Modal
            document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.closeModal();
            });
            this.htmlTab.addEventListener('click', () => this.switchTab('html'));
            this.cssTab.addEventListener('click', () => this.switchTab('css'));
            this.copyBtn.addEventListener('click', () => this.copyCode());
        }

        filterExperiments(e) {
            const filter = e.target.dataset.filter;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            document.querySelectorAll('.experiment-card').forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        showCode(experimentId) {
            const experiment = this.experiments[experimentId];
            if (!experiment) return;

            this.modalTitle.textContent = experiment.title;
            this.htmlCode.textContent = experiment.html;
            this.cssCode.textContent = experiment.css;

            this.switchTab('html'); // Iniciar en la pestaña HTML
            this.modal.style.display = 'flex';
        }

        closeModal() {
            this.modal.style.display = 'none';
        }

        switchTab(tabName) {
            if (tabName === 'html') {
                this.htmlTab.classList.add('active');
                this.cssTab.classList.remove('active');
                this.htmlCode.classList.add('active');
                this.cssCode.classList.remove('active');
                this.currentCode = this.htmlCode.textContent;
            } else {
                this.htmlTab.classList.remove('active');
                this.cssTab.classList.add('active');
                this.htmlCode.classList.remove('active');
                this.cssCode.classList.add('active');
                this.currentCode = this.cssCode.textContent;
            }
        }

        copyCode() {
            navigator.clipboard.writeText(this.currentCode).then(() => {
                this.copyBtn.textContent = '¡Copiado!';
                setTimeout(() => {
                    this.copyBtn.textContent = 'Copiar';
                }, 2000);
            });
        }
    }

    // Inicializar la aplicación del laboratorio
    const labApp = new LabApp();
});