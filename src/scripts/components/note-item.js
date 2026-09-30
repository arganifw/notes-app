class NoteItem extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['title', 'body', 'created-at'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this._shadowRoot) {
      this.render();
    }
  }

  render() {
    const title = this.getAttribute('title') || 'Tanpa Judul';
    const body = this.getAttribute('body') || 'Tidak ada isi.';
    const createdAt = this.getAttribute('created-at');

    const formattedDate = createdAt
      ? new Date(createdAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '-';

    this._shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: var(--bg-secondary, #ffffff);
          border-radius: 12px;
          box-shadow: var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08));
          padding: 20px;
          transition: transform 200ms ease, box-shadow 200ms ease,
            background-color 300ms ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        :host(:hover) {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg, 0 8px 24px rgba(0, 0, 0, 0.12));
        }

        .note-item__title {
          margin: 0 0 8px 0;
          color: var(--text-primary, #1a202c);
          font-size: 1.1rem;
          font-weight: 600;
          word-wrap: break-word;
          line-height: 1.3;
        }

        .note-item__body {
          margin: 0;
          color: var(--text-secondary, #4a5568);
          font-size: 0.9rem;
          line-height: 1.5;
          word-wrap: break-word;
          white-space: pre-wrap;
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .note-item__footer {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color, #e2e8f0);
          font-size: 0.75rem;
          color: var(--text-muted, #a0aec0);
        }

        .note-item__footer::before {
          content: '📅';
          font-size: 0.85rem;
        }
      </style>

      <h3 class="note-item__title">${title}</h3>
      <p class="note-item__body">${body}</p>
      <div class="note-item__footer">${formattedDate}</div>
    `;
  }
}

customElements.define('note-item', NoteItem);

export default NoteItem;