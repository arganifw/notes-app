class AppBar extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._setupDarkModeToggle();
  }

  render() {
    this._shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .app-bar {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .app-bar__brand {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .app-bar__brand::before {
          content: '📝';
          font-size: 1.5rem;
        }

        .theme-toggle {
          background-color: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 200ms ease;
        }

        .theme-toggle:hover {
          background-color: rgba(255, 255, 255, 0.25);
          transform: scale(1.05);
        }

        .theme-toggle:active {
          transform: scale(0.95);
        }

        @media screen and (max-width: 480px) {
          .app-bar {
            padding: 12px 16px;
          }

          .app-bar__brand {
            font-size: 1.1rem;
          }

          .theme-toggle {
            width: 38px;
            height: 38px;
            font-size: 1rem;
          }
        }
      </style>

      <div class="app-bar">
        <h1 class="app-bar__brand">Notes App</h1>
        <button
          class="theme-toggle"
          id="themeToggle"
          aria-label="Toggle dark mode"
          title="Ganti tema"
        >
          🌙
        </button>
      </div>
    `;
  }

  _setupDarkModeToggle() {
    const toggleButton = this._shadowRoot.querySelector('#themeToggle');
    const body = document.body;

    // Cek preferensi tersimpan
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      body.classList.add('dark-mode');
      toggleButton.textContent = '☀️';
    }

    // Handle klik toggle
    toggleButton.addEventListener('click', () => {
      body.classList.toggle('dark-mode');

      const isDark = body.classList.contains('dark-mode');
      toggleButton.textContent = isDark ? '☀️' : '🌙';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
}

customElements.define('app-bar', AppBar);

export default AppBar;