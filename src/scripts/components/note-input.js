class NoteInput extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }

        h2 {
          margin-top: 0;
          margin-bottom: 16px;
          color: #2c3e50;
          font-size: 1.25rem;
        }

        .form-group {
          margin-bottom: 16px;
        }

        label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          color: #34495e;
          font-size: 0.9rem;
        }

        input,
        textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #bdc3c7;
          border-radius: 4px;
          font-size: 1rem;
          font-family: inherit;
          box-sizing: border-box;
          transition: border-color 150ms ease-in-out;
        }

        input:focus,
        textarea:focus {
          outline: none;
          border-color: #3498db;
        }

        textarea {
          min-height: 100px;
          resize: vertical;
        }

        .error-message {
          display: block;
          margin-top: 4px;
          color: #e74c3c;
          font-size: 0.85rem;
          min-height: 1.2em;
        }

        input.invalid,
        textarea.invalid {
          border-color: #e74c3c;
        }

        button {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 150ms ease-in-out;
        }

        button:hover {
          background-color: #2980b9;
        }

        button:active {
          background-color: #1f618d;
        }
      </style>

      <h2>Tambah Catatan</h2>

      <form id="noteForm">
        <div class="form-group">
          <label for="titleInput">Judul</label>
          <input
            type="text"
            id="titleInput"
            name="title"
            placeholder="Masukkan judul catatan..."
            required
            minlength="3"
          />
          <span class="error-message" id="titleError"></span>
        </div>

        <div class="form-group">
          <label for="bodyInput">Isi Catatan</label>
          <textarea
            id="bodyInput"
            name="body"
            placeholder="Tulis isi catatan di sini..."
            required
            minlength="5"
          ></textarea>
          <span class="error-message" id="bodyError"></span>
        </div>

        <button type="submit">Tambah</button>
      </form>
    `;

    this._setupValidation();
    this._setupSubmitHandler();
  }

  _setupValidation() {
    const titleInput = this._shadowRoot.querySelector('#titleInput');
    const bodyInput = this._shadowRoot.querySelector('#bodyInput');
    const titleError = this._shadowRoot.querySelector('#titleError');
    const bodyError = this._shadowRoot.querySelector('#bodyError');

    const validateInput = (input, errorEl, minLength, fieldName) => {
      const value = input.value.trim();

      if (value.length === 0) {
        input.classList.add('invalid');
        errorEl.textContent = `${fieldName} tidak boleh kosong.`;
        return false;
      }

      if (value.length < minLength) {
        input.classList.add('invalid');
        errorEl.textContent = `${fieldName} minimal ${minLength} karakter.`;
        return false;
      }

      input.classList.remove('invalid');
      errorEl.textContent = '';
      return true;
    };

    // Realtime validation: cek setiap kali user mengetik
    titleInput.addEventListener('input', () => {
      validateInput(titleInput, titleError, 3, 'Judul');
    });

    bodyInput.addEventListener('input', () => {
      validateInput(bodyInput, bodyError, 5, 'Isi catatan');
    });
  }

  _setupSubmitHandler() {
    const form = this._shadowRoot.querySelector('#noteForm');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const titleInput = this._shadowRoot.querySelector('#titleInput');
      const bodyInput = this._shadowRoot.querySelector('#bodyInput');
      const titleError = this._shadowRoot.querySelector('#titleError');
      const bodyError = this._shadowRoot.querySelector('#bodyError');

      const isTitleValid = titleInput.value.trim().length >= 3;
      const isBodyValid = bodyInput.value.trim().length >= 5;

      if (!isTitleValid) {
        titleInput.classList.add('invalid');
        titleError.textContent = 'Judul minimal 3 karakter.';
      }

      if (!isBodyValid) {
        bodyInput.classList.add('invalid');
        bodyError.textContent = 'Isi catatan minimal 5 karakter.';
      }

      if (!isTitleValid || !isBodyValid) return;

      // Kirim event custom ke parent
      const newNote = {
        id: `notes-${Date.now()}`,
        title: titleInput.value.trim(),
        body: bodyInput.value.trim(),
        createdAt: new Date().toISOString(),
        archived: false,
      };

      this.dispatchEvent(
        new CustomEvent('note-added', {
          detail: newNote,
          bubbles: true,
          composed: true,
        })
      );

      // Reset form
      form.reset();
      titleError.textContent = '';
      bodyError.textContent = '';
    });
  }
}

customElements.define('note-input', NoteInput);

export default NoteInput;