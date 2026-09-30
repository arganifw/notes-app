import './components/app-bar.js';
import './components/note-input.js';
import './components/note-item.js';
import notesData from './data/notes.js';

document.addEventListener('DOMContentLoaded', () => {
  // ==== Element references ====
  const notesListElement = document.querySelector('#notesList');
  const notesCountElement = document.querySelector('#notesCount');
  const searchInputElement = document.querySelector('#searchInput');
  const sortSelectElement = document.querySelector('#sortSelect');
  const emptyStateElement = document.querySelector('#emptyState');

  // ==== State ====
  let allNotes = [...notesData]; // salinan dari sample data
  let currentSearch = '';
  let currentSort = 'newest';

  // ==== Fungsi: render satu catatan jadi <note-item> ====
  const createNoteElement = (note) => {
    const noteItem = document.createElement('note-item');
    noteItem.setAttribute('title', note.title);
    noteItem.setAttribute('body', note.body);
    noteItem.setAttribute('created-at', note.createdAt);
    return noteItem;
  };

  // ==== Fungsi: filter berdasarkan search ====
  const filterNotes = (notes, query) => {
    if (!query) return notes;
    const lowerQuery = query.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.body.toLowerCase().includes(lowerQuery)
    );
  };

  // ==== Fungsi: sort berdasarkan pilihan ====
  const sortNotes = (notes, sortBy) => {
    const sorted = [...notes];
    switch (sortBy) {
      case 'newest':
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case 'oldest':
        return sorted.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  // ==== Fungsi: render semua catatan (dengan filter + sort) ====
  const renderNotes = () => {
    const filtered = filterNotes(allNotes, currentSearch);
    const sorted = sortNotes(filtered, currentSort);

    notesListElement.innerHTML = '';

    if (sorted.length === 0) {
      emptyStateElement.hidden = false;
      notesListElement.hidden = true;
    } else {
      emptyStateElement.hidden = true;
      notesListElement.hidden = false;
      sorted.forEach((note) => {
        notesListElement.appendChild(createNoteElement(note));
      });
    }

    // Update counter
    notesCountElement.textContent = allNotes.length;
  };

  // ==== Event: search input ====
  searchInputElement.addEventListener('input', (event) => {
    currentSearch = event.target.value.trim();
    renderNotes();
  });

  // ==== Event: sort select ====
  sortSelectElement.addEventListener('change', (event) => {
    currentSort = event.target.value;
    renderNotes();
  });

  // ==== Event: catatan baru ditambahkan ====
  document.addEventListener('note-added', (event) => {
    const newNote = event.detail;
    allNotes.unshift(newNote); // tambah ke depan
    renderNotes();
  });

  // ==== Render awal ====
  renderNotes();
});