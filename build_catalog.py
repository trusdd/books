import os
import json
import re

BOOKS_DIR = "books"

AUTHORS = {
    "Blok": "Александр Блок",
    "Bryusov": "Валерий Брюсов",
    "Chekhov": "Антон Чехов",
    "Dostoevsky": "Фёдор Достоевский",
    "Gogol": "Николай Гоголь",
    "Gorky": "Максим Горький",
    "Herzen": "Александр Герцен",
    "Lermontov": "Михаил Лермонтов",
    "Pushkin": "Александр Пушкин",
    "Tolstoy": "Лев Толстой",
    "Turgenev": "Иван Тургенев",
}

GENRES = {
    "роман": "Роман",
    "повесть": "Повесть",
    "рассказ": "Рассказ",
    "пьеса": "Пьеса",
    "поэма": "Поэма",
    "сказка": "Сказка",
    "стих": "Стихотворения",
    "записки": "Записки",
    "дневник": "Дневник",
}

def slugify(text):
    text = text.lower()
    text = text.replace("ё", "e").replace("й", "i").replace("ъ", "").replace("ь", "")
    text = re.sub(r"[^a-zа-я0-9\s-]", "", text)
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")

def translit(text):
    table = {
        "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ж": "zh",
        "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n",
        "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f",
        "х": "h", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "sch", "ъ": "",
        "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya", "ё": "e",
    }
    result = []
    for ch in text.lower():
        if ch in table:
            result.append(table[ch])
        elif ch.isalnum():
            result.append(ch)
        elif ch in " -_":
            result.append("-")
    slug = "".join(result)
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug

def guess_genre(title, text):
    t = title.lower()
    if "роман" in t:
        return "Роман"
    if "повесть" in t:
        return "Повесть"
    if "рассказ" in t:
        return "Рассказ"
    if "пьеса" in t or "комедия" in t or "драма" in t:
        return "Пьеса"
    if "поэма" in t:
        return "Поэма"
    if "сказк" in t:
        return "Сказка"
    return "Проза"

def extract_description(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            text = f.read(2000)
        text = re.sub(r"\s+", " ", text).strip()
        return text[:180] + "..." if len(text) > 180 else text
    except Exception:
        return ""

books = []

for author_folder in sorted(os.listdir(BOOKS_DIR)):
    author_path = os.path.join(BOOKS_DIR, author_folder)
    if not os.path.isdir(author_path):
        continue

    author_name = AUTHORS.get(author_folder, author_folder)

    for filename in sorted(os.listdir(author_path)):
        if not filename.endswith(".txt"):
            continue

        title = filename[:-4]
        filepath = os.path.join(author_path, filename)
        rel_path = f"books/{author_folder}/{filename}"

        book_id = translit(author_folder.lower()) + "-" + translit(title)
        book_id = re.sub(r"-+", "-", book_id).strip("-")[:80]

        description = extract_description(filepath)
        genre = guess_genre(title, description)

        books.append({
            "id": book_id,
            "title": title,
            "author": author_name,
            "genre": genre,
            "year": 0,
            "description": description,
            "textUrl": rel_path,
        })

with open("books.json", "w", encoding="utf-8") as f:
    json.dump(books, f, ensure_ascii=False, indent=2)

print(f"Готово! Записано книг: {len(books)}")