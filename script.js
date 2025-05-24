// משתנים גלובליים
let allArticles = [];
let currentFilter = 'all';

// פונקציה לטעינת מאמרים
async function loadArticles() {
    const articlesGrid = document.getElementById('articles-grid');
    
    try {
        // רק המאמר שלך
        const articles = [
            '2025-05-24-הברכיים-שלא-כרעו-לבעל-והחיילים-שלא-נכנעים-לחמאס.md'
        ];
        
        articlesGrid.innerHTML = '<div class="loading">טוען מאמרים...</div>';
        allArticles = [];
        
        for (const articleFile of articles) {
            try {
                const response = await fetch(`posts/${encodeURIComponent(articleFile)}`);
                if (!response.ok) {
                    console.error(`לא ניתן לטעון את המאמר: ${articleFile}`);
                    continue;
                }
                
                const content = await response.text();
                const article = parseMarkdown(content);
                article.filename = articleFile;
                
                if (article.frontmatter.published !== false) {
                    allArticles.push(article);
                }
            } catch (error) {
                console.error(`שגיאה בטעינת מאמר ${articleFile}:`, error);
            }
        }
        
        if (allArticles.length === 0) {
            articlesGrid.innerHTML = '<div class="loading">אין מאמרים זמינים כרגע</div>';
            return;
        }
        
        // מיון מאמרים לפי תאריך (החדשים ראשונים)
        allArticles.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
        
        // הצגת מאמרים מיוחדים
        displaySpecialArticles();
        
        // הצגת כל המאמרים
        displayArticles();
        
    } catch (error) {
        console.error('שגיאה בטעינת מאמרים:', error);
        articlesGrid.innerHTML = '<div class="loading">שגיאה בטעינת המאמרים</div>';
    }
}

// פונקציה להצגת מאמרים מיוחדים
function displaySpecialArticles() {
    // מאמרים דחופים
    const urgentArticles = allArticles.filter(article => article.frontmatter.urgent);
    if (urgentArticles.length > 0) {
        displayUrgentArticles(urgentArticles);
    }
    
    // מאמר ראשי (המאמר הראשון שמומלץ או החדש ביותר)
    const heroArticle = allArticles.find(article => article.frontmatter.featured) || allArticles[0];
    if (heroArticle) {
        displayHeroArticle(heroArticle);
    }
    
    // מאמרים מומלצים
    const featuredArticles = allArticles.filter(article => article.frontmatter.featured && article !== heroArticle);
    if (featuredArticles.length > 0) {
        displayFeaturedArticles(featuredArticles);
    }
}

// פונקציה להצגת מאמרים דחופים
function displayUrgentArticles(urgentArticles) {
    const urgentSection = document.getElementById('urgent-section');
    const urgentContainer = document.getElementById('urgent-articles');
    
    urgentContainer.innerHTML = '';
    urgentArticles.forEach(article => {
        const urgentDiv = document.createElement('div');
        urgentDiv.className = 'urgent-article';
        urgentDiv.innerHTML = `
            <strong>${article.frontmatter.title}</strong>
            <p style="margin-top: 0.5rem; opacity: 0.9;">${article.frontmatter.excerpt || ''}</p>
        `;
        urgentDiv.addEventListener('click', () => {
            window.location.href = `post.html?post=${encodeURIComponent(article.filename)}`;
        });
        urgentContainer.appendChild(urgentDiv);
    });
    
    urgentSection.style.display = 'block';
}

// פונקציה להצגת מאמר ראשי
function displayHeroArticle(article) {
    const heroSection = document.getElementById('hero-section');
    const heroContainer = document.getElementById('hero-article');
    
    const imageUrl = article.frontmatter.featured_image || '/assets/images/default-hero.jpg';
    const category = article.frontmatter.category || 'כללי';
    const author = article.frontmatter.author || 'כותב אלמוני';
    const date = formatDate(article.frontmatter.date);
    
    heroContainer.innerHTML = `
        <div class="hero-image" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center;"></div>
        <div class="hero-overlay">
            <span class="hero-category">${category}</span>
            <h2 class="hero-title">${article.frontmatter.title}</h2>
            ${article.frontmatter.subtitle ? `<p class="hero-subtitle">${article.frontmatter.subtitle}</p>` : ''}
            <div class="hero-meta">
                <div class="author-info">
                    <span>${author}</span>
                </div>
                <span>${date}</span>
            </div>
        </div>
    `;
    
    heroContainer.addEventListener('click', () => {
        window.location.href = `post.html?post=${encodeURIComponent(article.filename)}`;
    });
    
    heroSection.style.display = 'block';
}

// פונקציה להצגת מאמרים מומלצים
function displayFeaturedArticles(featuredArticles) {
    const featuredSection = document.getElementById('featured-section');
    const featuredContainer = document.getElementById('featured-articles');
    
    featuredContainer.innerHTML = '';
    featuredArticles.slice(0, 3).forEach(article => {
        const card = createArticleCard(article, article.filename, true);
        featuredContainer.appendChild(card);
    });
    
    featuredSection.style.display = 'block';
}

// פונקציה להצגת כל המאמרים
function displayArticles() {
    const articlesGrid = document.getElementById('articles-grid');
    const filteredArticles = currentFilter === 'all' 
        ? allArticles 
        : allArticles.filter(article => article.frontmatter.category === currentFilter);
    
    articlesGrid.innerHTML = '';
    
    if (filteredArticles.length === 0) {
        articlesGrid.innerHTML = '<div class="loading">אין מאמרים להצגה בקטגוריה זו</div>';
        return;
    }
    
    filteredArticles.forEach(article => {
        const articleCard = createArticleCard(article, article.filename);
        articlesGrid.appendChild(articleCard);
    });
}

// פונקציה לפרסור Markdown פשוט
function parseMarkdown(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return {
            frontmatter: {},
            content: content
        };
    }
    
    const frontmatterText = match[1];
    const bodyContent = match[2];
    
    // פרסור פשוט של frontmatter
    const frontmatter = {};
    frontmatterText.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // הסרת גרשיים
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            
            // המרת boolean
            if (value === 'true') value = true;
            if (value === 'false') value = false;
            
            frontmatter[key] = value;
        }
    });
    
    return {
        frontmatter,
        content: bodyContent
    };
}

// פונקציה ליצירת כרטיס מאמר
function createArticleCard(article, filename, isFeatured = false) {
    const card = document.createElement('div');
    card.className = 'article-card';
    
    const title = article.frontmatter.title || 'ללא כותרת';
    const subtitle = article.frontmatter.subtitle || '';
    const excerpt = article.frontmatter.excerpt || 'ללא תקציר';
    const date = article.frontmatter.date ? formatDate(article.frontmatter.date) : '';
    const category = article.frontmatter.category || 'כללי';
    const author = article.frontmatter.author || 'כותב אלמוני';
    const imageUrl = article.frontmatter.featured_image || '';
    
    // קביעת סוג הקטגוריה
    let categoryClass = '';
    if (article.frontmatter.urgent) categoryClass = 'urgent';
    else if (article.frontmatter.featured || isFeatured) categoryClass = 'featured';
    
    card.innerHTML = `
        ${imageUrl ? `<img src="${imageUrl}" alt="${title}" class="article-image">` : '<div class="article-image"></div>'}
        <div class="article-content">
            <span class="article-category ${categoryClass}">${category}</span>
            <h3 class="article-title">${title}</h3>
            ${subtitle ? `<p class="article-subtitle">${subtitle}</p>` : ''}
            <p class="article-excerpt">${excerpt}</p>
            <div class="article-meta">
                <div class="article-author">
                    <span>${author}</span>
                </div>
                <div>
                    <span class="article-date">${date}</span>
                    <a href="post.html?post=${encodeURIComponent(filename)}" class="read-more">קרא עוד</a>
                </div>
            </div>
        </div>
    `;
    
    // הוספת אירוע קליק לכל הכרטיס
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('read-more')) {
            window.location.href = `post.html?post=${encodeURIComponent(filename)}`;
        }
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
    
    displayArticles();
}

// אירועי DOM
document.addEventListener('DOMContentLoaded', () => {
    loadArticles();
    
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