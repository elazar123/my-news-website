// משתנים גלובליים
let allArticles = [];
let currentFilter = 'all';

// מאמרים מוכנים מראש לטעינה מיידית
const preloadedArticles = [
    {
        title: "הברכיים שלא כרעו לבעל, והחיילים שלא נכנעים לחמאס",
        excerpt: "בין שלושת שלבי הקרב של גדעון – אמונה, יוזמה וניצחון – טמון מסר חד לימי הלחימה בעזה: לא עוצרים באמצע.",
        author: "אלעזר ריגר",
        date: "2025-05-24",
        category: "דעה",
        readTime: "5 דקות קריאה",
        image: "assets/images/resistance.jpg",
        filename: "2025-05-24-gideon-warriors.md"
    },
    {
        title: "הברכיים שלא כרעו לבעל והחיילים שלא נכנעים לחמאס",
        excerpt: "מאמר מעמיק על עמידה וחוסן בזמנים קשים",
        author: "גדעון לוי",
        date: "2025-05-24",
        category: "דעה",
        readTime: "5 דקות קריאה",
        image: "assets/images/resistance.jpg",
        filename: "2025-05-24-הברכיים-שלא-כרעו-לבעל-והחיילים-שלא-נכנעים-לחמאס.md"
    },
    {
        title: "אני רוצה לבדוק אם זה עובד",
        excerpt: "בדיקת פונקציונליות המערכת החדשה",
        author: "מפתח",
        date: "2025-05-24",
        category: "טכנולוגיה",
        readTime: "2 דקות קריאה",
        image: "assets/images/test2.jpg",
        filename: "2025-05-24-אני-רוצה-לבדוק-אם-זה-עובד.md"
    },
    {
        title: "בדיקה ראשונה",
        excerpt: "מאמר בדיקה ראשון למערכת החדשה",
        author: "צוות הפיתוח",
        date: "2025-05-24",
        category: "טכנולוגיה",
        readTime: "2 דקות קריאה",
        image: "assets/images/test1.jpg",
        filename: "2025-05-24-בדיקה-ראשונה.md"
    },
    {
        title: "כתבה שנייה",
        excerpt: "המשך לסדרת הכתבות החשובות שלנו",
        author: "כתב שטח",
        date: "2025-05-24",
        category: "חדשות",
        readTime: "3 דקות קריאה",
        image: "assets/images/news2.jpg",
        filename: "2025-05-24-כתבה-שנייה.md"
    },
    {
        title: "מאמר דעה חשוב",
        excerpt: "דעות וחשיבות על נושאים עכשוויים",
        author: "עורך ראשי",
        date: "2025-05-24",
        category: "דעה",
        readTime: "4 דקות קריאה",
        image: "assets/images/opinion.jpg",
        filename: "2025-05-24-מאמר-דעה.md"
    },
    {
        title: "עדכון חשוב",
        excerpt: "עדכונים חדשים ושיפורים במערכת",
        author: "מנהל המערכת",
        date: "2025-05-24",
        category: "עדכונים",
        readTime: "3 דקות קריאה",
        image: "assets/images/update.jpg",
        filename: "2025-05-24-עדכון.md"
    },
    {
        title: "בדיקה",
        excerpt: "מאמר של מעין אהבה - בדיקת המערכת",
        author: "מעין אהבה",
        date: "2025-05-24",
        category: "בדיקות",
        readTime: "2 דקות קריאה",
        image: "assets/images/test3.jpg",
        filename: "2025-05-24-בדיקה.md"
    }
];

// פונקציה לטעינת מאמרים - מיידית!
async function loadArticles() {
    try {
        // הצגה מיידית של מאמרים מוכנים
        allArticles = [...preloadedArticles];
        
        // מיון מאמרים לפי תאריך (החדשים ראשונים)
        allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // הצגת כל המאמרים ברשת כרטיסים
        displayAllArticles();
        
        // הצגת מאמרים לפי קטגוריות
        displayCategorizedArticles();
        
    } catch (error) {
        console.error('שגיאה בטעינת מאמרים:', error);
        const articlesGrid = document.getElementById('articles-grid');
        articlesGrid.innerHTML = '<div class="loading">שגיאה בטעינת המאמרים</div>';
    }
}

// פונקציה להצגת כל המאמרים ברשת כרטיסים
function displayAllArticles() {
    const articlesGrid = document.getElementById('articles-grid');
    articlesGrid.innerHTML = '';
    
    if (allArticles.length === 0) {
        articlesGrid.innerHTML = '<div class="swiper-slide loading">אין מאמרים זמינים</div>';
        return;
    }
    
    allArticles.forEach(article => {
        const articleCard = createArticleCard(article, article.filename);
        articleCard.classList.add('swiper-slide');
        articlesGrid.appendChild(articleCard);
    });
    
    // אתחול Swiper
    setTimeout(() => {
        new Swiper('.articles-swiper', {
            slidesPerView: 'auto',
            spaceBetween: 20,
            centeredSlides: false,
            loop: false,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 10
                },
                640: {
                    slidesPerView: 2,
                    spaceBetween: 15
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 20
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 20
                }
            }
        });
    }, 100);
}

// פונקציה להצגת מאמרים לפי קטגוריות
function displayCategorizedArticles() {
    const categories = [
        { name: 'עדכונים', gridId: 'updates-grid' },
        { name: 'כתבות', gridId: 'articles-category-grid' },
        { name: 'קמפיין', gridId: 'campaign-grid' },
        { name: 'מאמר שבועי', gridId: 'weekly-grid' },
        { name: 'דעה', gridId: 'opinions-grid' }
    ];
    
    categories.forEach(category => {
        const grid = document.getElementById(category.gridId);
        if (!grid) return;
        
        const categoryArticles = allArticles.filter(article => 
            article.category === category.name
        );
        
        grid.innerHTML = '';
        
        if (categoryArticles.length === 0) {
            grid.innerHTML = `
                <div class="empty-category">
                    אין ${category.name} זמינים כרגע
                </div>
            `;
        } else {
            categoryArticles.slice(0, 4).forEach(article => {
                const card = createArticleCard(article, article.filename, true);
                grid.appendChild(card);
            });
        }
    });
}

// פונקציה ליצירת כרטיס מאמר
function createArticleCard(article, filename, isSmall = false) {
    const card = document.createElement('div');
    card.className = 'article-card';
    
    const title = article.title || 'ללא כותרת';
    const excerpt = article.excerpt || 'ללא תקציר';
    const date = article.date ? formatDate(article.date) : '';
    const category = article.category || 'כללי';
    const author = article.author || 'כותב אלמוני';
    const imageUrl = article.image || '';
    
    // קביעת סוג הקטגוריה
    let categoryClass = `category-${category.replace(/\s+/g, '-')}`;
    
    // גודל כרטיס קטן יותר לקטגוריות
    const excerptText = isSmall ? excerpt.substring(0, 80) + '...' : excerpt;
    
    card.innerHTML = `
        ${imageUrl ? `<img src="${imageUrl}" alt="${title}" class="article-image">` : '<div class="article-image" style="background: linear-gradient(135deg, var(--primary-gold), var(--primary-teal)); height: 200px;"></div>'}
        <div class="article-content">
            <span class="article-category ${categoryClass}">${category}</span>
            <h3 class="article-title" style="${isSmall ? 'font-size: 1.1rem; line-height: 1.3;' : ''}">${title}</h3>
            <p class="article-excerpt" style="${isSmall ? 'font-size: 0.85rem; line-height: 1.4;' : ''}">${excerptText}</p>
            <div class="article-meta">
                <div class="article-author">
                    <span style="${isSmall ? 'font-size: 0.8rem;' : ''}">${author}</span>
                </div>
                <div>
                    <span class="article-date" style="${isSmall ? 'font-size: 0.8rem;' : ''}">${date}</span>
                </div>
            </div>
        </div>
    `;
    
    // הוספת אירוע קליק לכל הכרטיס
    card.addEventListener('click', (e) => {
        openArticle(filename);
    });
    
    return card;
}

// פונקציה לעיצוב תאריך
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('he-IL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

// פונקציה לסינון מאמרים
function filterArticles(category) {
    currentFilter = category;
    
    // עדכון כפתורי הסינון
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    // עדכון הניווט
    document.querySelectorAll('.nav-link[data-category]').forEach(link => {
        if (link.dataset.category === category) {
            link.style.background = 'rgba(255,255,255,0.2)';
        } else {
            link.style.background = '';
        }
    });
    
    displayAllArticles();
}

// מערכת חיפוש מתקדמת
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const resultsContainer = document.getElementById('searchResults');
    
    if (searchTerm.length < 2) {
        resultsContainer.style.display = 'none';
        return;
    }
    
    const results = searchArticles(searchTerm);
    displaySearchResults(results, searchTerm);
}

function searchArticles(searchTerm) {
    const term = searchTerm.toLowerCase();
    return preloadedArticles.filter(article => 
        article.title.toLowerCase().includes(term) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(term)) ||
        article.author.toLowerCase().includes(term) ||
        article.category.toLowerCase().includes(term)
    );
}

function displaySearchResults(results, searchTerm) {
    const resultsContainer = document.getElementById('searchResults');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="search-result-item">לא נמצאו תוצאות</div>';
        showSearchMessage(0);
    } else {
        resultsContainer.innerHTML = results.map(article => {
            const excerpt = getExcerpt(article.excerpt || '', searchTerm);
            return `
                <div class="search-result-item" onclick="openArticle('${article.filename}')">
                    <div class="search-result-title">${highlightText(article.title, searchTerm)}</div>
                    <div class="search-result-excerpt">${highlightText(excerpt, searchTerm)}</div>
                </div>
            `;
        }).join('');
        showSearchMessage(results.length);
    }
    
    resultsContainer.style.display = 'block';
}

function getExcerpt(content, searchTerm) {
    const index = content.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (index === -1) return content.substring(0, 150) + '...';
    
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + searchTerm.length + 100);
    return '...' + content.substring(start, end) + '...';
}

function highlightText(text, searchTerm) {
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

function openArticle(filename) {
    window.location.href = `post.html?post=${encodeURIComponent(filename)}`;
}

// תפריט נייד
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('mobile-open');
}

// חיפוש בזמן אמת
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            if (this.value.length >= 2) {
                performSearch();
            } else {
                document.getElementById('searchResults').style.display = 'none';
            }
        });
        
        // סגירת תוצאות חיפוש בלחיצה מחוץ לאזור
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-container')) {
                document.getElementById('searchResults').style.display = 'none';
            }
        });
    }
});

// אירועי DOM
document.addEventListener('DOMContentLoaded', () => {
    loadArticles();
    
    // הצגת הודעת ברוכים הבאים
    setTimeout(() => {
        showWelcomeMessage();
    }, 1000);
    
    // הוספת אירועים לכפתורי סינון
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterArticles(btn.dataset.category);
        });
    });
    
    // הוספת אירועים לניווט
    document.querySelectorAll('.nav-link[data-category]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            filterArticles(link.dataset.category);
        });
    });
});

// מערכת הודעות טוסט
function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="removeToast(this.parentElement.parentElement)">×</button>
        </div>
        <div class="toast-progress"></div>
    `;
    
    container.appendChild(toast);
    
    // הצגת הטוסט
    setTimeout(() => toast.classList.add('show'), 100);
    
    // הסרה אוטומטית
    setTimeout(() => removeToast(toast), duration);
    
    return toast;
}

function removeToast(toast) {
    if (toast && toast.parentElement) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 400);
    }
}

// הודעות מערכת
function showWelcomeMessage() {
    showToast('ברוכים הבאים לאתר "נלחמים על החיים"! 🎉', 'success', 5000);
}

function showSearchMessage(resultsCount) {
    if (resultsCount === 0) {
        showToast('לא נמצאו תוצאות חיפוש', 'warning');
    } else {
        showToast(`נמצאו ${resultsCount} תוצאות`, 'success');
    }
}