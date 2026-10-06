# 📚 Russian Classics Library

[![Made with ❤️ for my grandfather](https://img.shields.io/badge/-Made%20with%20%E2%9D%A4%EF%B8%8F%20for%20my%20grandfather-ff6b6b?style=flat)](https://github.com/trusdd/books)
[![No ads](https://img.shields.io/badge/No%20ads-blue?style=flat&logo=noads)]()
[![Mobile friendly](https://img.shields.io/badge/Mobile%20friendly-green?style=flat)]()
[![100% vanilla JS](https://img.shields.io/badge/100%25%20vanilla%20JS-yellow?style=flat)]()

A beautifully simple digital library of **Russian classical literature** designed specifically for elderly readers. No clutter, no ads, no complexity—just books and reading.

**🌐 [Visit the live website →](https://trusdd.github.io/books/)**

---

## 💡 What Is This?

This isn't a commercial project or a startup pitch. It's a personal solution I built for my grandfather, who loves to read. Traditional e-readers and reading apps frustrated him: tiny fonts, overwhelming buttons, invasive ads, popup notifications. 

So I created something radically simple instead. A website where you can find any Russian classic novel, adjust the text size, and read without distractions.

---

## ✨ Features

- **269 works of Russian literature** — complete texts from Pushkin, Tolstoy, Dostoyevsky, Chekhov, Gogol, Turgenev, Lermontov, Kuprin, Bunin, Leskov, Ostrovsky, and many others
- **Search** by book title and author name
- **Author filtering** for easy browsing
- **Adjustable font size** during reading (A+ / A−)
- **Automatic reading progress** — the site remembers where you stopped and shows a "Continue Reading" block next time
- **Light & Dark themes** with one-click toggle
- **Zero clutter** — no ads, no registration, no popups, no tracking
- **Fully responsive** — works perfectly on phones, tablets, and computers

---

## 🎯 Designed for Aging Eyes

Every design decision was made with elderly users in mind:

- **Large touch targets** — all buttons are at least 56×56 pixels
- **Big typography** — 18px default, even larger in reading mode
- **High contrast** text for comfortable reading in any lighting
- **Labeled buttons** — every action has text, no cryptic icons
- **Mobile optimization** — tested on iPhone XR with safe-area awareness, notch support, and Safari UI accommodations
- **Browser compatibility** — works smoothly in Safari and Yandex.Browser

---

## 🛠️ Technology Stack

**The philosophy is simplicity itself:**

- **Pure HTML, CSS, JavaScript** — no frameworks, no build tools, no npm dependencies
- **GitHub Pages** for free hosting
- **localStorage** to save reading progress, font preferences, and theme choice
- **Python** for catalog generation and text processing
- **Source data** — texts from the [RusLit collection](https://github.com/d0rj/RusLit) on GitHub

Everything is static and self-contained. The website works offline once loaded.

---

## 📁 Project Structure

```
books/
├── index.html          # Main page
├── style.css           # All styling
├── script.js           # All functionality
├── books.json          # Catalog of all books
├── build_catalog.py    # Script to generate books.json
└── books/              # Text files organized by author
    ├── Pushkin/
    ├── Tolstoy/
    ├── Dostoyevsky/
    └── ... (other authors)
```

---

## 🚀 Run Locally

Clone and start reading in seconds:

```bash
# Clone the repository
git clone https://github.com/trusdd/books.git
cd books

# Start a local server
python3 -m http.server 8000

# Open in your browser
# http://localhost:8000
```

That's it. No dependencies, no installation, no configuration.

---

## 📖 How to Add a New Book

1. Add the `.txt` file to the appropriate author folder in `books/`
   ```
   books/AuthorName/book_title.txt
   ```

2. Run the catalog builder:
   ```bash
   python3 build_catalog.py
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Add new book"
   git push
   ```

The changes will be live on GitHub Pages within seconds.

---

## 📜 License

**The literary texts** are in the public domain — they were written long ago and belong to everyone.

**The code** is free for anyone to use, modify, and share. Do what you want with it.

---

## ❤️ Support

If you found this useful, or if you just think it's a nice idea, consider giving it a star. It means a lot.

---

**Built with patience and love for classic literature.**
