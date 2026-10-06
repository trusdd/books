let allBooks = [];
let currentBook = null;
let currentFontSizePx = 22;
let scrollSaveTimer = null;

const viewCatalog = document.getElementById("view-catalog");
const viewDetails = document.getElementById("view-details");
const viewReader = document.getElementById("view-reader");

const searchInput = document.getElementById("search-input");
const authorFilter = document.getElementById("author-filter");
const btnResetFilter = document.getElementById("btn-reset-filter");
const catalogList = document.getElementById("catalog-list");
const catalogCounter = document.getElementById("catalog-counter");
const catalogError = document.getElementById("catalog-error");

const headerTitle = document.getElementById("header-title");
const readerControls = document.getElementById("reader-controls");
const btnFontDec = document.getElementById("btn-font-dec");
const btnFontInc = document.getElementById("btn-font-inc");

const btnBackToCatalog = document.getElementById("btn-back-to-catalog");
const btnStartReading = document.getElementById("btn-start-reading");
const detailTitle = document.getElementById("detail-title");
const detailAuthor = document.getElementById("detail-author");
const detailMeta = document.getElementById("detail-meta");
const detailDescription = document.getElementById("detail-description");
const detailProgress = document.getElementById("detail-progress");
const detailProgressText = document.getElementById("detail-progress-text");

const btnBackToDetails = document.getElementById("btn-back-to-details");
const btnQuickCatalog = document.getElementById("btn-quick-catalog");
const btnReaderFooterBack = document.getElementById("btn-reader-footer-back");
const readerWorkTitle = document.getElementById("reader-work-title");
const readerWorkAuthor = document.getElementById("reader-work-author");
const readerTextArea = document.getElementById("reader-text-area");
const readerStatus = document.getElementById("reader-status");

const btnScrollTop = document.getElementById("btn-scroll-top");
const btnThemeToggle = document.getElementById("btn-theme-toggle");

function initTheme() {
  const saved = localStorage.getItem("theme");
  const isDark = saved === "dark";
  if (isDark) {
    document.documentElement.classList.add("theme-dark");
  } else {
    document.documentElement.classList.remove("theme-dark");
  }
  updateThemeButtonLabel();
  updateThemeColorMeta();
}

function updateThemeButtonLabel() {
  const isDark = document.documentElement.classList.contains("theme-dark");
  btnThemeToggle.textContent = isDark ? "Светлая" : "Тёмная";
}

function updateThemeColorMeta() {
  const isDark = document.documentElement.classList.contains("theme-dark");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", isDark ? "#202020" : "#faf8f3");
  }
}

btnThemeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("theme-dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeButtonLabel();
  updateThemeColorMeta();
});

function getScrollKey(bookId) {
  return "scroll_pos_" + bookId;
}

function getProgressPercent(bookId) {
  const saved = localStorage.getItem(getScrollKey(bookId));
  if (!saved) return 0;
  const savedY = parseInt(saved, 10);
  if (!savedY || savedY < 200) return 0;
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (totalHeight <= 0) return 0;
  const percent = Math.round((savedY / totalHeight) * 100);
  return Math.min(100, Math.max(0, percent));
}

function hasProgress(bookId) {
  return getProgressPercent(bookId) > 1;
}

function initReaderSettings() {
  const savedSize = localStorage.getItem("reader_font_size");
  if (savedSize) {
    currentFontSizePx = parseInt(savedSize, 10);
  }
  applyReaderFontSize();
}

function applyReaderFontSize() {
  document.documentElement.style.setProperty("--reader-size", currentFontSizePx + "px");
  localStorage.setItem("reader_font_size", currentFontSizePx.toString());
}

btnFontInc.addEventListener("click", () => {
  if (currentFontSizePx < 36) {
    currentFontSizePx += 2;
    applyReaderFontSize();
  }
});

btnFontDec.addEventListener("click", () => {
  if (currentFontSizePx > 18) {
    currentFontSizePx -= 2;
    applyReaderFontSize();
  }
});

async function loadCatalogData() {
  try {
    const response = await fetch("books.json");
    if (!response.ok) {
      throw new Error("Не удалось получить файл каталога");
    }
    allBooks = await response.json();
    populateAuthorsDropdown(allBooks);
    renderCatalog();
  } catch (error) {
    catalogError.hidden = false;
    catalogError.textContent = "Не удалось загрузить список книг. Проверьте соединение или обновите страницу.";
    catalogCounter.textContent = "";
  }
}

function populateAuthorsDropdown(books) {
  const authorSet = new Set();
  books.forEach(b => {
    if (b.author) authorSet.add(b.author.trim());
  });
  const sortedAuthors = Array.from(authorSet).sort((a, b) => a.localeCompare(b, "ru"));

  sortedAuthors.forEach(author => {
    const opt = document.createElement("option");
    opt.value = author;
    opt.textContent = author;
    authorFilter.appendChild(opt);
  });
}

function updateResetFilterVisibility() {
  if (authorFilter.value === "all") {
    btnResetFilter.hidden = true;
  } else {
    btnResetFilter.hidden = false;
  }
}

function renderCatalog() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedAuthor = authorFilter.value;

  const filtered = allBooks.filter(book => {
    const matchesAuthor = (selectedAuthor === "all") || (book.author === selectedAuthor);
    const matchesQuery = !query ||
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query);
    return matchesAuthor && matchesQuery;
  });

  catalogList.innerHTML = "";
  catalogCounter.textContent = `Найдено книг: ${filtered.length}`;

  if (filtered.length === 0) {
    const emptyMsg = document.createElement("div");
    emptyMsg.className = "status-banner";
    emptyMsg.textContent = "Книги не найдены. Попробуйте изменить запрос.";
    catalogList.appendChild(emptyMsg);
    updateResetFilterVisibility();
    return;
  }

  filtered.forEach(book => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "book-item-card";

    const titleEl = document.createElement("div");
    titleEl.className = "item-card-title";
    titleEl.textContent = book.title;

    const authorEl = document.createElement("div");
    authorEl.className = "item-card-author";
    authorEl.textContent = book.author;

    const metaEl = document.createElement("div");
    metaEl.className = "item-card-meta";
    metaEl.textContent = book.genre;

    card.appendChild(titleEl);
    card.appendChild(authorEl);
    card.appendChild(metaEl);

    if (hasProgress(book.id)) {
      const progressEl = document.createElement("div");
      progressEl.className = "item-card-progress";
      progressEl.textContent = `Вы остановились здесь • ${getProgressPercent(book.id)}%`;
      card.appendChild(progressEl);
    }

    card.addEventListener("click", () => showDetailsView(book));

    catalogList.appendChild(card);
  });

  updateResetFilterVisibility();
}

searchInput.addEventListener("input", renderCatalog);
authorFilter.addEventListener("change", renderCatalog);

btnResetFilter.addEventListener("click", () => {
  authorFilter.value = "all";
  renderCatalog();
});

function showDetailsView(book) {
  currentBook = book;

  viewCatalog.hidden = true;
  viewReader.hidden = true;
  viewDetails.hidden = false;
  readerControls.hidden = true;

  headerTitle.textContent = "О книге";
  detailTitle.textContent = book.title;
  detailAuthor.textContent = book.author;
  detailMeta.textContent = `Жанр: ${book.genre}`;
  detailDescription.textContent = book.description;

  if (hasProgress(book.id)) {
    detailProgress.hidden = false;
    detailProgressText.textContent = `Вы уже начали читать эту книгу. Продолжить можно с ${getProgressPercent(book.id)}%.`;
    btnStartReading.textContent = "Продолжить чтение";
  } else {
    detailProgress.hidden = true;
    btnStartReading.textContent = "Читать произведение";
  }

  window.scrollTo(0, 0);
  updateScrollTopButton();
}

function showCatalogView() {
  viewDetails.hidden = true;
  viewReader.hidden = true;
  viewCatalog.hidden = false;
  readerControls.hidden = true;

  headerTitle.textContent = "Приятного чтения!";
  window.scrollTo(0, 0);
  renderCatalog();
  updateScrollTopButton();
}

btnBackToCatalog.addEventListener("click", showCatalogView);

async function showReaderView() {
  if (!currentBook) return;

  viewCatalog.hidden = true;
  viewDetails.hidden = true;
  viewReader.hidden = false;
  readerControls.hidden = false;

  headerTitle.textContent = currentBook.title;
  readerWorkTitle.textContent = currentBook.title;
  readerWorkAuthor.textContent = currentBook.author;

  readerTextArea.innerHTML = "";
  readerStatus.hidden = false;
  readerStatus.textContent = "Загрузка текста книги...";

  try {
    const encodedUrl = encodeURI(currentBook.textUrl);
    const res = await fetch(encodedUrl);
    if (!res.ok) {
      throw new Error("Текст книги недоступен");
    }
    const rawText = await res.text();
    readerStatus.hidden = true;

    const paragraphs = rawText.split(/\n\s*\n/);
    const fragment = document.createDocumentFragment();
    paragraphs.forEach(pText => {
      const trimmed = pText.trim();
      if (trimmed.length > 0) {
        const pElem = document.createElement("p");
        pElem.textContent = trimmed;
        fragment.appendChild(pElem);
      }
    });
    readerTextArea.appendChild(fragment);

    restoreReadingProgress(currentBook.id);
  } catch (err) {
    readerStatus.hidden = false;
    readerStatus.textContent = "Не удалось открыть текст книги. Убедитесь, что текстовый файл добавлен в каталог.";
  }

  updateScrollTopButton();
}

btnStartReading.addEventListener("click", showReaderView);

btnBackToDetails.addEventListener("click", () => {
  saveReadingProgress();
  showDetailsView(currentBook);
});

btnQuickCatalog.addEventListener("click", () => {
  saveReadingProgress();
  showCatalogView();
});

btnReaderFooterBack.addEventListener("click", () => {
  saveReadingProgress();
  showDetailsView(currentBook);
});

function saveReadingProgress() {
  if (currentBook && !viewReader.hidden) {
    const scrollKey = getScrollKey(currentBook.id);
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    localStorage.setItem(scrollKey, scrollY.toString());
  }
}

function restoreReadingProgress(bookId) {
  const scrollKey = getScrollKey(bookId);
  const savedY = localStorage.getItem(scrollKey);

  const applyScroll = () => {
    if (savedY) {
      const target = parseInt(savedY, 10);
      if (target > 0) {
        window.scrollTo(0, target);
      }
    } else {
      window.scrollTo(0, 0);
    }
  };

  requestAnimationFrame(() => {
    applyScroll();
    requestAnimationFrame(applyScroll);
    setTimeout(applyScroll, 150);
  });
}

window.addEventListener("scroll", () => {
  if (!viewReader.hidden && currentBook) {
    if (scrollSaveTimer) clearTimeout(scrollSaveTimer);
    scrollSaveTimer = setTimeout(saveReadingProgress, 400);
  }
  updateScrollTopButton();
}, { passive: true });

function updateScrollTopButton() {
  if (window.scrollY > 600) {
    btnScrollTop.hidden = false;
  } else {
    btnScrollTop.hidden = true;
  }
}

btnScrollTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("beforeunload", () => {
  saveReadingProgress();
});

initTheme();
initReaderSettings();
loadCatalogData();