// משתנים גלובליים
let allArticles = [];
let currentFilter = 'all';

// מאמרים לדוגמה
const posts = [
    {
        filename: '2025-05-24-gideon-warriors.md',
        title: 'הברכיים שלא כרעו לבעל, והחיילים שלא נכנעים לחמאס',
        excerpt: 'בין שלושת שלבי הקרב של גדעון – אמונה, יוזמה וניצחון – טמון מסר חד לימי הלחימה בעזה: לא עוצרים באמצע. כמו גדעון, גם אנחנו חייבים להאמין, להוביל, ולהמשיך עד להשמדה מוחלטת של האויב.',
        author: 'אלעזר ריגר',
        date: '2025-05-24',
        category: 'דעה',
        image: '/assets/images/whatsapp-image-2025-05-24-at-20.55.11.jpeg',
        urgent: false,
        featured: false
    }
];

// פונקציה לטעינת מאמרים אוטומטית
async function loadArticles() {
    const articlesGrid = document.getElementById('articles-grid');
    
    try {
        articlesGrid.innerHTML = '<div class="loading">טוען מאמרים...</div>';
        allArticles = [];
        
        // ננסה לטעון מאמרים עם תבניות שמות שונות
        const possibleFiles = await generatePossibleFilenames();
        
        for (const filename of possibleFiles) {
            try {
                const response = await fetch(`posts/${encodeURIComponent(filename)}`);
                if (response.ok) {
                    const content = await response.text();
                    const article = parseMarkdown(content);
                    article.filename = filename;
                    
                    if (article.frontmatter.published !== false) {
                        allArticles.push(article);
                    }
                }
            } catch (error) {
                // שקט - זה נורמלי שחלק מהקבצים לא קיימים
            }
        }
        
        if (allArticles.length === 0) {
            articlesGrid.innerHTML = '<div class="loading">אין מאמרים זמינים כרגע</div>';
            return;
        }
        
        // מיון מאמרים לפי תאריך (החדשים ראשונים)
        allArticles.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
        
        // הצגת כל המאמרים ברשת כרטיסים
        displayAllArticles();
        
        // הצגת מאמרים לפי קטגוריות
        displayCategorizedArticles();
        
    } catch (error) {
        console.error('שגיאה בטעינת מאמרים:', error);
        articlesGrid.innerHTML = '<div class="loading">שגיאה בטעינת המאמרים</div>';
    }
}

// פונקציה ליצירת רשימת שמות קבצים אפשריים
async function generatePossibleFilenames() {
    const filenames = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    // ננסה תאריכים מהחודש הנוכחי ו-6 חודשים אחורה
    for (let monthOffset = 0; monthOffset <= 6; monthOffset++) {
        const date = new Date(currentYear, currentMonth - 1 - monthOffset, 1);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        
        // ננסה כל יום בחודש
        for (let day = 1; day <= 31; day++) {
            const dayStr = String(day).padStart(2, '0');
            const datePrefix = `${year}-${month}-${dayStr}`;
            
            // תבניות שמות נפוצות - כולל תבניות בעברית ובאנגלית
            const commonPatterns = [
                // תבניות קיימות
                'gideon-warriors',
                'הברכיים-שלא-כרעו-לבעל-והחיילים-שלא-נכנעים-לחמאס',
                'אני-רוצה-לבדוק-אם-זה-עובד',
                
                // תבניות כלליות בעברית
                'מאמר-חדש',
                'עדכון-חשוב',
                'כתבה-מיוחדת',
                'דעה-אישית',
                'קמפיין-חדש',
                'מאמר-שבועי',
                'חדשות-דחופות',
                'הודעה-חשובה',
                'מסר-לעם',
                'קריאה-לפעולה',
                
                // תבניות באנגלית
                'welcome-post',
                'tech-news',
                'breaking-news',
                'article',
                'post',
                'news',
                'update',
                'opinion',
                'campaign',
                'weekly-article',
                'urgent-news',
                'important-message',
                'call-to-action',
                
                // תבניות מספריות
                'post-1', 'post-2', 'post-3', 'post-4', 'post-5',
                'article-1', 'article-2', 'article-3', 'article-4', 'article-5',
                'news-1', 'news-2', 'news-3', 'news-4', 'news-5',
                
                // תבניות עם מילים נפוצות
                'test', 'בדיקה', 'ניסיון', 'demo', 'example', 'דוגמה'
            ];
            
            commonPatterns.forEach(pattern => {
                filenames.push(`${datePrefix}-${pattern}.md`);
            });
            
            // גם ננסה בלי תבנית - רק תאריך
            filenames.push(`${datePrefix}.md`);
        }
    }
    
    return filenames;
}

// פונקציה להצגת כל המאמרים ברשת כרטיסים
function displayAllArticles() {
    const articlesGrid = document.getElementById('articles-grid');
    articlesGrid.innerHTML = '';
    
    if (allArticles.length === 0) {
        articlesGrid.innerHTML = '<div class="loading">אין מאמרים זמינים</div>';
        return;
    }
    
    allArticles.forEach(article => {
        const articleCard = createArticleCard(article, article.filename);
        articlesGrid.appendChild(articleCard);
    });
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
            article.frontmatter.category === category.name
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
function createArticleCard(article, filename, isSmall = false) {
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
    let categoryClass = `category-${category.replace(/\s+/g, '-')}`;
    if (article.frontmatter.urgent) categoryClass += ' urgent-badge';
    if (article.frontmatter.featured) categoryClass += ' featured-badge';
    
    // גודל כרטיס קטן יותר לקטגוריות
    const cardStyle = isSmall ? 'style="max-height: 350px;"' : '';
    const excerptText = isSmall ? excerpt.substring(0, 80) + '...' : excerpt;
    
    card.innerHTML = `
        ${imageUrl ? `<img src="${imageUrl}" alt="${title}" class="article-image">` : '<div class="article-image" style="background: linear-gradient(135deg, var(--primary-gold), var(--primary-teal)); height: 200px;"></div>'}
        <div class="article-content">
            <span class="article-category ${categoryClass}">${category}</span>
            <h3 class="article-title" style="${isSmall ? 'font-size: 1.1rem; line-height: 1.3;' : ''}">${title}</h3>
            ${subtitle && !isSmall ? `<p class="article-subtitle" style="font-size: 0.9rem; color: var(--text-light); margin-bottom: 0.5rem;">${subtitle}</p>` : ''}
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
        window.location.href = `post.html?post=${encodeURIComponent(filename)}`;
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