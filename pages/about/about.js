document.addEventListener('DOMContentLoaded', () => {
    const terminalBody = document.getElementById('terminal-body');
    const commandInput = document.getElementById('command-input');
    const inputLine = document.getElementById('input-line');
    let commandHistory = [];
    let historyIndex = -1;

    const commands = {
        'help': `
            <span class="output-title">Comandos disponibles:</span><br>
            <strong>whoami</strong>     - Muestra mi biografía.<br>
            <strong>skills</strong>     - Lista mis habilidades técnicas.<br>
            <strong>projects</strong>   - Vuelve a la sección de proyectos.<br>
            <strong>contact</strong>    - Muestra cómo puedes contactarme.<br>
            <strong>socials</strong>    - Despliega mis redes sociales.<br>
            <strong>clear</strong>      - Limpia la pantalla de la terminal.<br>
            <strong>exit</strong>       - Vuelve a la página principal del portafolio.
        `,
        'whoami': `
            <span class="output-title">Juan Manuel Colorado</span><br>
            Aprendiz de Análisis y Desarrollo de Software (ADSO) en el SENA.<br>
            Me especializo en transformar ideas en soluciones de software robustas y escalables. Mi enfoque se centra en el desarrollo backend, pero disfruto creando experiencias de usuario completas. Me apasiona el aprendizaje constante y aplicar nuevas tecnologías para resolver problemas del mundo real.
        `,
        'skills': `
            <span class="output-title">Habilidades Técnicas:</span><br>
            - <strong>Lenguajes:</strong> JavaScript (Node.js), Python, SQL<br>
            - <strong>Frontend:</strong> HTML5, CSS3, React<br>
            - <strong>Backend:</strong> Express.js, APIs REST<br>
            - <strong>Bases de Datos:</strong> PostgreSQL, MongoDB<br>
            - <strong>Herramientas:</strong> Git, GitHub, Docker, Figma
        `,
        'projects': () => {
            typeText('Redirigiendo a la sección de proyectos...', () => {
                window.location.href = '../../index.html#projects';
            });
            return '';
        },
        'contact': () => {
            typeText('Abriendo canal de comunicación...', () => {
                window.location.href = '../contact.html';
            });
            return '';
        },
        'socials': `
            <span class="output-title">Redes Sociales:</span><br>
            - <a href="https://github.com/nullv1x" target="_blank" class="output-link">GitHub</a><br>
            - <a href="https://www.linkedin.com/in/juan-manuel-colorado-duque" target="_blank" class="output-link">LinkedIn</a>
        `,
        'exit': () => {
            typeText('Cerrando sesión y volviendo al portafolio principal...', () => {
                window.location.href = '../../index.html';
            });
            return '';
        },
        'clear': () => {
            terminalBody.innerHTML = '';
            return '';
        },
        // Easter Eggs
        'sudo': `<span class="output-error">ERROR:</span> Permiso denegado. Este no es el terminal que estás buscando.`,
        'matrix': () => {
            typeText('Iniciando secuencia... Adiós, Morfeo.', () => {
                window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
            });
            return '';
        },
        'cat': `<pre>  /\\_/\\\n ( o.o )\n  > ^ <</pre>`,
        'date': `<span class="output-title">Fecha del sistema:</span><br>${new Date().toUTCString()}`
    };

    const typeText = (text, callback) => {
        const line = document.createElement('div');
        line.classList.add('terminal-line');
        terminalBody.appendChild(line);

        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                line.innerHTML += text.charAt(i);
                i++;
                scrollToBottom();
            } else {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 25);
    };

    const executeCommand = (cmd) => {
        const commandLine = document.createElement('div');
        commandLine.innerHTML = `<span class="prompt">user@anonymous:~$ </span> <span class="user-input">${cmd}</span>`;
        terminalBody.appendChild(commandLine);

        const output = document.createElement('div');
        output.classList.add('terminal-line');

        if (commands[cmd]) {
            const result = commands[cmd];
            if (typeof result === 'function') {
                result();
            } else {
                output.innerHTML = result;
                terminalBody.appendChild(output);
            }
        } else {
            output.innerHTML = `<span class="output-error">Comando no encontrado: ${cmd}. Escribe 'help' para ver la lista de comandos.</span>`;
            terminalBody.appendChild(output);
        }

        commandHistory.unshift(cmd);
        historyIndex = -1;
        scrollToBottom();
    };

    const scrollToBottom = () => {
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = commandInput.value.trim().toLowerCase();
            if (command) {
                executeCommand(command);
                commandInput.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                commandInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
             if (historyIndex > 0) {
                historyIndex--;
                commandInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = -1;
                commandInput.value = '';
            }
        }
    });

    // Al hacer clic en cualquier parte de la ventana, enfocar el input
    document.querySelector('.terminal-window').addEventListener('click', () => {
        commandInput.focus();
    });

    // Mensaje de bienvenida
    typeText("Bienvenido a mi terminal. Escribe 'help' para comenzar.", () => {
        commandInput.focus();
    });
});