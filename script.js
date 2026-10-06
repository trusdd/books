let booksData = [];
let currentBook = null;
let currentChapterIndex = 0;

let currentFontSize = parseInt(localStorage.getItem('lib_font') || '22');
let isDark = localStorage.getItem('lib_theme') === 'dark';
let activeFilter = 'all';

const libraryView = document.getElementById('library-view');
const chapterSelectView = document.getElementById('chapter-select-view');
const readerView = document.getElementById('reader-view');

const booksContainer = document.getElementById('books-container');
const chaptersContainer = document.getElementById('chapters-container');
const searchBox = document.getElementById('search-box');
const filterButtons = document.querySelectorAll('.filter-chip');

const navTitle = document.getElementById('nav-title');
const selectTitle = document.getElementById('select-title');
const selectAuthor = document.getElementById('select-author');

const readerBookTitle = document.getElementById('reader-book-title');
const readerChapterTitle = document.getElementById('reader-chapter-title');
const readerContent = document.getElementById('reader-content');

const btnPrevChapter = document.getElementById('btn-prev-chapter');
const btnNextChapter = document.getElementById('btn-next-chapter');

function applyFontSize(val) {
  currentFontSize = Math.min(Math.max(val, 16), 36);
  document.documentElement.style.setProperty('--font-size', `${currentFontSize}px`);
  localStorage.setItem('lib_font', currentFontSize);
}

function applyTheme(dark) {
  isDark = dark;
  if (dark) {
    document.body.classList.add('dark');
    localStorage.setItem('lib_theme', 'dark');
  } else {
    document.body.classList.remove('dark');
    localStorage.setItem('lib_theme', 'light');
  }
}

applyFontSize(currentFontSize);
applyTheme(isDark);

async function initLibrary() {
  try {
    const res = await fetch('books.json');
    if (!res.ok) throw new Error('Ошибка загрузки books.json');
    booksData = await res.json();
    renderBooksList();

    const savedBookId = localStorage.getItem('lib_last_book_id');
    const savedChapterIdx = parseInt(localStorage.getItem('lib_last_chapter_idx') || '0');
    if (savedBookId) {
      const b = booksData.find(item => item.id === savedBookId);
      if (b) {
        currentBook = b;
        openChapter(savedChapterIdx);
      }
    }
  } catch (e) {
    booksContainer.innerHTML = '<div class="status-msg">Не удалось загрузить книги. Обновите страницу.</div>';
  }
}

function renderBooksList() {
  const q = searchBox.value.trim().toLowerCase();
  booksContainer.innerHTML = '';

  const filtered = booksData.filter(item => {
    const matchesFilter = (activeFilter === 'all') || item.author.includes(activeFilter);
    const matchesQuery = !q || item.title.toLowerCase().includes(q) || item.author.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  if (filtered.length === 0) {
    booksContainer.innerHTML = '<div class="status-msg">Ничего не найдено</div>';
    return;
  }

  filtered.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';
    const chaptersCount = book.chapters.length;
    const chaptersLabel = chaptersCount === 1 ? '1 глава' : `${chaptersCount} глав(ы)`;
    card.innerHTML = `<h3>${book.title}</h3><p>${book.author} • ${chaptersLabel}</p>`;
    card.onclick = () => showBookChapters(book);
    booksContainer.appendChild(card);
  });
}

function showBookChapters(book) {
  currentBook = book;
  
  if (book.chapters.length === 1) {
    openChapter(0);
    return;
  }

  libraryView.style.display = 'none';
  readerView.style.display = 'none';
  chapterSelectView.style.display = 'block';

  navTitle.innerText = book.title;
  selectTitle.innerText = book.title;
  selectAuthor.innerText = book.author;
  chaptersContainer.innerHTML = '';

  book.chapters.forEach((ch, idx) => {
    const btn = document.createElement('button');
    btn.className = 'chapter-card-btn';
    btn.innerHTML = `<span>${ch.title}</span><span class="chapter-arrow">→</span>`;
    btn.onclick = () => openChapter(idx);
    chaptersContainer.appendChild(btn);
  });

  window.scrollTo(0, 0);
}

function openChapter(index) {
  if (!currentBook || !currentBook.chapters[index]) return;
  currentChapterIndex = index;

  localStorage.setItem('lib_last_book_id', currentBook.id);
  localStorage.setItem('lib_last_chapter_idx', currentChapterIndex);

  libraryView.style.display = 'none';
  chapterSelectView.style.display = 'none';
  readerView.style.display = 'block';

  navTitle.innerText = currentBook.title;
  readerBookTitle.innerText = currentBook.title;
  readerChapterTitle.innerText = `${currentBook.author} — ${currentBook.chapters[index].title}`;

  const paragraphs = currentBook.chapters[index].text.split('\n\n');
  readerContent.innerHTML = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');

  btnPrevChapter.disabled = (currentChapterIndex === 0);
  btnNextChapter.disabled = (currentChapterIndex === currentBook.chapters.length - 1);

  window.scrollTo(0, 0);
}

function showLibrary() {
  currentBook = null;
  localStorage.removeItem('lib_last_book_id');
  localStorage.removeItem('lib_last_chapter_idx');

  readerView.style.display = 'none';
  chapterSelectView.style.display = 'none';
  libraryView.style.display = 'block';
  navTitle.innerText = 'Библиотека';
  window.scrollTo(0, 0);
}

function backToChapters() {
  if (!currentBook) {
    showLibrary();
    return;
  }
  if (currentBook.chapters.length === 1) {
    showLibrary();
    return;
  }
  showBookChapters(currentBook);
}

btnPrevChapter.onclick = () => {
  if (currentChapterIndex > 0) openChapter(currentChapterIndex - 1);
};

btnNextChapter.onclick = () => {
  if (currentBook && currentChapterIndex < currentBook.chapters.length - 1) {
    openChapter(currentChapterIndex + 1);
  }
};

document.getElementById('btn-back-to-library').onclick = showLibrary;
document.getElementById('btn-back-to-books').onclick = showLibrary;
document.getElementById('btn-back-to-chapters').onclick = backToChapters;
document.getElementById('btn-bottom-to-chapters').onclick = backToChapters;

document.getElementById('btn-font-inc').onclick = () => applyFontSize(currentFontSize + 2);
document.getElementById('btn-font-dec').onclick = () => applyFontSize(currentFontSize - 2);
document.getElementById('btn-theme').onclick = () => applyTheme(!isDark);

searchBox.oninput = renderBooksList;

filterButtons.forEach(btn => {
  btn.onclick = () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.author;
    renderBooksList();
  };
});

initLibrary();
