const CATALOG = [
    { id: "Евгений_Онегин_(Пушкин)", title: "Евгений Онегин", author: "Александр Пушкин" },
    { id: "Капитанская_дочка_(Пушкин)", title: "Капитанская дочка", author: "Александр Пушкин" },
    { id: "Пиковая_дама_(Пушкин)", title: "Пиковая дама", author: "Александр Пушкин" },
    { id: "Метель_(Пушкин)", title: "Метель", author: "Александр Пушкин" },
    { id: "Выстрел_(Пушкин)", title: "Выстрел", author: "Александр Пушкин" },
    { id: "Станционный_смотритель_(Пушкин)", title: "Станционный смотритель", author: "Александр Пушкин" },
    { id: "Палата_№_6_(Чехов)", title: "Палата № 6", author: "Антон Чехов" },
    { id: "Дама_с_собачкой_(Чехов)", title: "Дама с собачкой", author: "Антон Чехов" },
    { id: "Человек_в_футляре_(Чехов)", title: "Человек в футляре", author: "Антон Чехов" },
    { id: "Хамелеон_(Чехов)", title: "Хамелеон", author: "Антон Чехов" },
    { id: "Толстый_и_тонкий_(Чехов)", title: "Толстый и тонкий", author: "Антон Чехов" },
    { id: "Смерть_Ивана_Ильича_(Толстой)", title: "Смерть Ивана Ильича", author: "Лев Толстой" },
    { id: "Кавказский_пленник_(Толстой)", title: "Кавказский пленник", author: "Лев Толстой" },
    { id: "Филипок_(Толстой)", title: "Филипок", author: "Лев Толстой" },
    { id: "Шинель_(Гоголь)", title: "Шинель", author: "Николай Гоголь" },
    { id: "Нос_(Гоголь)", title: "Нос", author: "Николай Гоголь" },
    { id: "Тарас_Бульба_(Гоголь)", title: "Тарас Бульба", author: "Николай Гоголь" },
    { id: "Вий_(Гоголь)", title: "Вий", author: "Николай Гоголь" },
    { id: "Белые_ночи_(Достоевский)", title: "Белые ночи", author: "Фёдор Достоевский" },
    { id: "Бедные_люди_(Достоевский)", title: "Бедные люди", author: "Фёдор Достоевский" },
    { id: "Игрок_(Достоевский)", title: "Игрок", author: "Фёдор Достоевский" },
    { id: "Герой_нашего_времени_(Лермонтов)", title: "Герой нашего времени", author: "Михаил Лермонтов" },
    { id: "Мцыри_(Лермонтов)", title: "Мцыри", author: "Михаил Лермонтов" },
    { id: "Муму_(Тургенев)", title: "Муму", author: "Иван Тургенев" },
    { id: "Ася_(Тургенев)", title: "Ася", author: "Иван Тургенев" },
    { id: "Первая_любовь_(Тургенев)", title: "Первая любовь", author: "Иван Тургенев" },
    { id: "Отцы_и_дети_(Тургенев)", title: "Отцы и дети", author: "Иван Тургенев" }
  ];
  
  let currentFontSize = parseInt(localStorage.getItem('lib_font') || '22');
  let isDark = localStorage.getItem('lib_theme') === 'dark';
  let activeFilter = 'all';
  
  const libraryView = document.getElementById('library-view');
  const readerView = document.getElementById('reader-view');
  const booksContainer = document.getElementById('books-container');
  const readerTitle = document.getElementById('reader-title');
  const readerAuthor = document.getElementById('reader-author');
  const readerContent = document.getElementById('reader-content');
  const readerStatus = document.getElementById('reader-status');
  const navTitle = document.getElementById('nav-title');
  const searchBox = document.getElementById('search-box');
  const filterButtons = document.querySelectorAll('.filter-chip');
  
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
  
  function renderList() {
    const q = searchBox.value.trim().toLowerCase();
    booksContainer.innerHTML = '';
  
    const filtered = CATALOG.filter(item => {
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
      card.innerHTML = `<h3>${book.title}</h3><p>${book.author}</p>`;
      card.onclick = () => loadBook(book.id, book.title, book.author);
      booksContainer.appendChild(card);
    });
  }
  
  async function loadBook(bookId, bookTitle, bookAuthor) {
    libraryView.style.display = 'none';
    readerView.style.display = 'block';
    navTitle.innerText = bookTitle;
    readerTitle.innerText = bookTitle;
    readerAuthor.innerText = bookAuthor;
    readerContent.innerHTML = '';
    readerStatus.style.display = 'block';
    readerStatus.innerText = 'Загрузка текста...';
    window.scrollTo(0, 0);
  
    localStorage.setItem('lib_saved_id', bookId);
    localStorage.setItem('lib_saved_title', bookTitle);
    localStorage.setItem('lib_saved_author', bookAuthor);
  
    try {
      const url = `https://ru.wikisource.org/w/api.php?action=parse&page=${encodeURIComponent(bookId)}&prop=text&format=json&origin=*`;
      const res = await fetch(url);
      const data = await res.json();
  
      if (data.error || !data.parse || !data.parse.text) throw new Error('Текст не найден');
  
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.parse.text['*'], 'text/html');
  
      doc.querySelectorAll('table, .navigation-box, .ws-noexport, script, style, .mw-empty-elt, .header, .plainlinks').forEach(el => el.remove());
  
      doc.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('/wiki/')) {
          a.onclick = (e) => {
            e.preventDefault();
            const nextId = decodeURIComponent(href.replace('/wiki/', ''));
            loadBook(nextId, a.innerText.trim() || bookTitle, bookAuthor);
          };
        } else {
          a.style.color = 'inherit';
          a.style.textDecoration = 'none';
          a.onclick = (e) => e.preventDefault();
        }
      });
  
      readerContent.innerHTML = doc.body.innerHTML;
      readerStatus.style.display = 'none';
    } catch (err) {
      readerStatus.innerText = 'Не удалось загрузить текст. Проверьте интернет.';
    }
  }
  
  function showLibrary() {
    readerView.style.display = 'none';
    libraryView.style.display = 'block';
    navTitle.innerText = 'Библиотека';
    localStorage.removeItem('lib_saved_id');
    window.scrollTo(0, 0);
  }
  
  document.getElementById('btn-font-inc').onclick = () => applyFontSize(currentFontSize + 2);
  document.getElementById('btn-font-dec').onclick = () => applyFontSize(currentFontSize - 2);
  document.getElementById('btn-theme').onclick = () => applyTheme(!isDark);
  document.getElementById('btn-back').onclick = showLibrary;
  document.getElementById('btn-back-bottom').onclick = showLibrary;
  
  searchBox.oninput = renderList;
  
  filterButtons.forEach(btn => {
    btn.onclick = () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.author;
      renderList();
    };
  });
  
  renderList();
  
  const savedId = localStorage.getItem('lib_saved_id');
  if (savedId) {
    const savedTitle = localStorage.getItem('lib_saved_title') || '';
    const savedAuthor = localStorage.getItem('lib_saved_author') || '';
    loadBook(savedId, savedTitle, savedAuthor);
  }
  