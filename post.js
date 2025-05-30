console.log('post.js loaded successfully');

// מאמרים מוכנים מראש לטעינה מיידית
const preloadedArticles = [
    {
        title: "הברכיים שלא כרעו לבעל, והחיילים שלא נכנעים לחמאס",
        excerpt: "בין שלושת שלבי הקרב של גדעון – אמונה, יוזמה וניצחון – טמון מסר חד לימי הלחימה בעזה: לא עוצרים באמצע.",
        author: "אלעזר ריגר",
        date: "2025-05-24",
        category: "דעה",
        readTime: "5 דקות קריאה",
        image: "https://via.placeholder.com/400x250/667eea/ffffff?text=מאמר+דעה",
        filename: "2025-05-24-gideon-warriors.md"
    },
    {
        title: "הברכיים שלא כרעו לבעל והחיילים שלא נכנעים לחמאס",
        excerpt: "מאמר מעמיק על עמידה וחוסן בזמנים קשים",
        author: "גדעון לוי",
        date: "2025-05-24",
        category: "דעה",
        readTime: "5 דקות קריאה",
        image: "https://via.placeholder.com/400x250/28a745/ffffff?text=עמידה+וחוסן",
        filename: "2025-05-24-הברכיים-שלא-כרעו-לבעל-והחיילים-שלא-נכנעים-לחמאס.md"
    },
    {
        title: "אני רוצה לבדוק אם זה עובד",
        excerpt: "בדיקת פונקציונליות המערכת החדשה",
        author: "מפתח",
        date: "2025-05-24",
        category: "טכנולוגיה",
        readTime: "2 דקות קריאה",
        image: "https://via.placeholder.com/400x250/007bff/ffffff?text=בדיקת+מערכת",
        filename: "2025-05-24-אני-רוצה-לבדוק-אם-זה-עובד.md"
    },
    {
        title: "בדיקה ראשונה",
        excerpt: "מאמר בדיקה ראשון למערכת החדשה",
        author: "צוות הפיתוח",
        date: "2025-05-24",
        category: "טכנולוגיה",
        readTime: "2 דקות קריאה",
        image: "https://via.placeholder.com/400x250/6c757d/ffffff?text=בדיקה+ראשונה",
        filename: "2025-05-24-בדיקה-ראשונה.md"
    },
    {
        title: "כתבה שנייה",
        excerpt: "המשך לסדרת הכתבות החשובות שלנו",
        author: "כתב שטח",
        date: "2025-05-24",
        category: "חדשות",
        readTime: "3 דקות קריאה",
        image: "https://via.placeholder.com/400x250/dc3545/ffffff?text=חדשות+חמות",
        filename: "2025-05-24-כתבה-שנייה.md"
    },
    {
        title: "מאמר דעה חשוב",
        excerpt: "דעות וחשיבות על נושאים עכשוויים",
        author: "עורך ראשי",
        date: "2025-05-24",
        category: "דעה",
        readTime: "4 דקות קריאה",
        image: "https://via.placeholder.com/400x250/ffc107/000000?text=דעה+חשובה",
        filename: "2025-05-24-מאמר-דעה.md"
    },
    {
        title: "עדכון חשוב",
        excerpt: "עדכונים חדשים ושיפורים במערכת",
        author: "מנהל המערכת",
        date: "2025-05-24",
        category: "עדכונים",
        readTime: "3 דקות קריאה",
        image: "https://via.placeholder.com/400x250/17a2b8/ffffff?text=עדכון+חשוב",
        filename: "2025-05-24-עדכון.md"
    },
    {
        title: "בדיקה",
        excerpt: "מאמר של מעין אהבה - בדיקת המערכת",
        author: "מעין אהבה",
        date: "2025-05-24",
        category: "בדיקות",
        readTime: "2 דקות קריאה",
        image: "https://via.placeholder.com/400x250/e83e8c/ffffff?text=בדיקת+מערכת",
        filename: "2025-05-24-בדיקה.md"
    }
];

// פונקציה לטעינת מאמר בודד
async function loadPost() {
    console.log('loadPost started');
    console.log('Current URL:', window.location.href);
    console.log('Search params:', window.location.search);
    
    const urlParams = new URLSearchParams(window.location.search);
    const postFile = urlParams.get('post');
    console.log('postFile:', postFile);
    console.log('All URL params:', Array.from(urlParams.entries()));
    
    if (!postFile) {
        console.log('No post file specified');
        showError('לא נמצא מאמר לטעינה');
        return;
    }
    
    try {
        console.log('Fetching:', `posts/${encodeURIComponent(postFile)}`);
        // טעינת המאמר מהקובץ
        const response = await fetch(`posts/${encodeURIComponent(postFile)}`);
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
            throw new Error(`המאמר לא נמצא - Status: ${response.status}`);
        }
        
        const content = await response.text();
        console.log('Content length:', content.length);
        console.log('Content preview:', content.substring(0, 200));
        
        const article = parseMarkdown(content);
        console.log('Parsed article:', article);
        console.log('Article frontmatter:', article.frontmatter);
        console.log('Article title:', article.frontmatter.title);
        
        // עדכון כותרת הדף
        document.title = `${article.frontmatter.title || 'מאמר'} - נלחמים על החיים`;
        
        // עדכון כותרת בדף
        const postTitleElement = document.getElementById('post-title');
        if (postTitleElement) {
            postTitleElement.textContent = article.frontmatter.title || 'מאמר';
            console.log('Updated post-title element');
        } else {
            console.log('post-title element not found');
        }
        
        // עדכון כותרת המאמר
        const articleTitleElement = document.getElementById('article-title');
        if (articleTitleElement) {
            articleTitleElement.textContent = article.frontmatter.title || 'ללא כותרת';
            console.log('Updated article-title element');
        } else {
            console.log('article-title element not found');
        }
        
        // עדכון כותרת משנה
        if (article.frontmatter.subtitle) {
            const subtitleElement = document.getElementById('article-subtitle');
            if (subtitleElement) {
                subtitleElement.textContent = article.frontmatter.subtitle;
                subtitleElement.style.display = 'block';
                console.log('Updated subtitle element');
            }
        }
        
        // עדכון קטגוריה בתג המקצועי
        if (article.frontmatter.category) {
            const categoryContainer = document.getElementById('post-category-container');
            if (categoryContainer) {
                categoryContainer.innerHTML = `<span class="post-category-badge">${article.frontmatter.category}</span>`;
                console.log('Updated category container');
            }
        }
        
        // עדכון תמונה ראשית מקצועית
        if (article.frontmatter.featured_image) {
            const imageElement = document.getElementById('post-featured-image');
            if (imageElement) {
                imageElement.src = article.frontmatter.featured_image;
                imageElement.alt = article.frontmatter.title || 'תמונת המאמר';
                imageElement.style.display = 'block';
                console.log('Updated featured image');
            }
        }
        
        // עדכון פרטי הכותב
        if (article.frontmatter.author) {
            const authorElement = document.getElementById('article-author');
            if (authorElement) {
                authorElement.textContent = article.frontmatter.author;
                console.log('Updated author element');
            }
            
            if (article.frontmatter.author_image) {
                const avatarElement = document.getElementById('author-avatar');
                if (avatarElement) {
                    avatarElement.src = article.frontmatter.author_image;
                    avatarElement.alt = article.frontmatter.author;
                    avatarElement.style.display = 'block';
                    console.log('Updated author avatar');
                }
            }
        }
        
        // עדכון תאריך
        const dateElement = document.getElementById('article-date');
        if (dateElement && article.frontmatter.date) {
            dateElement.textContent = formatDate(article.frontmatter.date);
            console.log('Updated date element');
        }
        
        // עדכון תוכן המאמר
        const contentElement = document.getElementById('article-content');
        if (contentElement) {
            contentElement.innerHTML = markdownToHtml(article.content);
            console.log('Updated article content');
        } else {
            console.log('article-content element not found');
        }
        
        // הצגת גלריית תמונות כקרוסלה
        if (article.frontmatter.gallery && article.frontmatter.gallery.length > 0) {
            displayCarouselGallery(article.frontmatter.gallery);
        }
        
        // הצגת תגיות
        if (article.frontmatter.tags && article.frontmatter.tags.length > 0) {
            displayTags(article.frontmatter.tags);
        }
        
        // טעינת תגובות
        loadComments(postFile);
        
        // הוספת פונקציונליות לכפתורי הפעולה
        setupActionButtons(article);
        
        console.log('loadPost completed successfully');
        
    } catch (error) {
        console.error('שגיאה בטעינת המאמר:', error);
        showError(`שגיאה בטעינת המאמר: ${error.message}`);
    }
}

// פונקציה להצגת תגיות
function displayTags(tags) {
    const tagsSection = document.getElementById('post-tags');
    const tagsContainer = document.getElementById('tags-container');
    
    if (!tagsContainer) return;
    
    tagsContainer.innerHTML = '';
    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
    
    tagsSection.style.display = 'block';
}

// פונקציה להגדרת כפתורי הפעולה
function setupActionButtons(article) {
    const shareBtn = document.querySelector('.share-btn');
    const saveBtn = document.querySelector('.save-btn');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', () => shareArticle(article));
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', () => saveArticle(article));
    }
}

// פונקציה לשיתוף מאמר
function shareArticle(article) {
    if (navigator.share) {
        navigator.share({
            title: article.frontmatter.title,
            text: article.frontmatter.excerpt || article.frontmatter.subtitle,
            url: window.location.href
        });
    } else {
        // העתקה ללוח
        navigator.clipboard.writeText(window.location.href).then(() => {
            showSuccessMessage('הקישור הועתק ללוח!');
        });
    }
}

// פונקציה לשמירת מאמר
function saveArticle(article) {
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    const articleData = {
        title: article.frontmatter.title,
        url: window.location.href,
        date: new Date().toISOString()
    };
    
    if (!savedArticles.find(saved => saved.url === articleData.url)) {
        savedArticles.push(articleData);
        localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
        showSuccessMessage('המאמר נשמר בהצלחה!');
    } else {
        showSuccessMessage('המאמר כבר שמור!');
    }
}

// פונקציה להצגת גלריית תמונות מקצועית
function displayGallery(gallery) {
    const gallerySection = document.getElementById('post-gallery');
    const galleryGrid = document.getElementById('gallery-grid');
    
    galleryGrid.innerHTML = '';
    gallery.forEach((imageUrl, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `תמונה ${index + 1}`;
        img.addEventListener('click', () => openImageModal(imageUrl));
        
        galleryItem.appendChild(img);
        galleryGrid.appendChild(galleryItem);
    });
    
    gallerySection.style.display = 'block';
}

// פונקציה לפתיחת תמונה במודל מקצועי
function openImageModal(imageUrl) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        cursor: pointer;
        backdrop-filter: blur(5px);
    `;
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 10px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        font-size: 24px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        backdrop-filter: blur(10px);
    `;
    
    modal.appendChild(img);
    modal.appendChild(closeBtn);
    
    const closeModal = () => document.body.removeChild(modal);
    modal.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    
    document.body.appendChild(modal);
}

// פונקציה לטעינת תגובות
function loadComments(postFile) {
    const commentsList = document.getElementById('comments-list');
    const commentsCount = document.getElementById('comments-count');
    
    // טעינת תגובות מאושרות מ-localStorage
    const approvedComments = JSON.parse(localStorage.getItem('approvedComments') || '[]');
    
    // סינון תגובות לפי המאמר הנוכחי
    const postComments = approvedComments.filter(comment => comment.post === postFile);
    
    // עדכון מספר התגובות
    if (commentsCount) {
        commentsCount.textContent = `${postComments.length} תגובות`;
    }
    
    displayComments(postComments);
}

// פונקציה להצגת תגובות
function displayComments(comments) {
    const commentsList = document.getElementById('comments-list');
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<p style="text-align: center; color: #6c757d;">אין תגובות עדיין. היה הראשון להגיב!</p>';
        return;
    }
    
    commentsList.innerHTML = '';
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${comment.name}</span>
                <span class="comment-date">${formatDate(comment.date)}</span>
            </div>
            <div class="comment-content">${comment.content}</div>
        `;
        commentsList.appendChild(commentDiv);
    });
}

// פונקציה לטיפול בשליחת תגובה
async function handleCommentSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const urlParams = new URLSearchParams(window.location.search);
    const postFile = urlParams.get('post');
    
    const comment = {
        id: Date.now().toString(), // ID ייחודי
        name: formData.get('name'),
        email: formData.get('email'),
        content: formData.get('content'),
        post: postFile,
        postTitle: document.getElementById('article-title').textContent,
        date: new Date().toISOString(),
        status: 'pending' // סטטוס ממתין לאישור
    };
    
    try {
        // שמירת התגובה (בפרויקט אמיתי זה יישלח לשרת)
        console.log('תגובה חדשה נשלחה:', comment);
        
        // סימולציה של שמירה - בפרויקט אמיתי נשלח לשרת
        // await fetch('/api/comments', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(comment)
        // });
        
        // הצגת הודעת הצלחה
        showSuccessMessage('תגובתך נשלחה בהצלחה! היא תופיע לאחר אישור המנהל.');
        
        // איפוס הטופס
        form.reset();
        
        // הוספת התגובה לאחסון מקומי זמני (לצורך הדגמה)
        const pendingComments = JSON.parse(localStorage.getItem('pendingComments') || '[]');
        pendingComments.push(comment);
        localStorage.setItem('pendingComments', JSON.stringify(pendingComments));
        
    } catch (error) {
        console.error('שגיאה בשליחת התגובה:', error);
        showErrorMessage('שגיאה בשליחת התגובה. אנא נסה שוב.');
    }
}

// פונקציה להצגת הודעת הצלחה
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        background: #d4edda;
        color: #155724;
        padding: 1rem;
        border-radius: 5px;
        margin: 1rem 0;
        border: 1px solid #c3e6cb;
    `;
    successDiv.textContent = message;
    
    const form = document.getElementById('comment-form');
    form.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 5000);
}

// פונקציה להצגת הודעת שגיאה
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 1rem;
        border-radius: 5px;
        margin: 1rem 0;
        border: 1px solid #f5c6cb;
    `;
    errorDiv.textContent = message;
    
    const form = document.getElementById('comment-form');
    form.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
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
            
            // וידוא שהמשתנה value הוא string
            if (typeof value !== 'string') {
                value = String(value);
            }
            
            // הסרת גרשיים
            if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            
            // המרת boolean
            if (value === 'true') value = true;
            if (value === 'false') value = false;
            
            // טיפול ברשימות (למשל gallery)
            if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    // אם לא מצליח לפרסר כ-JSON, נשאיר כמחרוזת
                }
            }
            
            frontmatter[key] = value;
        }
    });
    
    return {
        frontmatter,
        content: bodyContent
    };
}

// פונקציה להמרת Markdown ל-HTML מתקדמת יותר
function markdownToHtml(markdown) {
    let html = markdown;
    
    // כותרות
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // טקסט מודגש
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // קישורים
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // תמונות
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 10px; margin: 1rem 0;">');
    
    // רשימות
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // ציטוטים
    html = html.replace(/^> (.*$)/gim, '<blockquote style="border-right: 4px solid #007bff; padding-right: 1rem; margin: 1rem 0; font-style: italic; color: #6c757d;">$1</blockquote>');
    
    // פסקאות
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // ניקוי פסקאות ריקות ותיקונים
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
    
    return html;
}

// פונקציה לעיצוב תאריך
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('he-IL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return dateString;
    }
}

// פונקציה להצגת שגיאה
function showError(message) {
    document.getElementById('article-title').textContent = 'שגיאה';
    document.getElementById('article-content').innerHTML = `<div class="loading">${message}</div>`;
}

// אירועי DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    loadPost();
    
    // הוספת אירוע לטופס התגובות
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', handleCommentSubmit);
    }
});

// פונקציה להצגת גלריית תמונות כקרוסלה מתקדמת
function displayCarouselGallery(gallery) {
    const gallerySection = document.getElementById('post-gallery');
    const galleryGrid = document.getElementById('gallery-grid');
    
    if (!gallery || gallery.length === 0) return;
    
    // הגבלה ל-8 תמונות
    const limitedGallery = gallery.slice(0, 8);
    
    galleryGrid.innerHTML = `
        <div class="carousel-container">
            <div class="carousel-wrapper">
                <div class="carousel-track" id="carousel-track">
                    ${limitedGallery.map((imageUrl, index) => `
                        <div class="carousel-slide ${index === 0 ? 'active' : ''}">
                            <img src="${imageUrl}" alt="תמונה ${index + 1}" onclick="openImageModal('${imageUrl}')">
                        </div>
                    `).join('')}
                </div>
                
                ${limitedGallery.length > 1 ? `
                    <button class="carousel-btn carousel-prev" onclick="moveCarousel(-1)">❮</button>
                    <button class="carousel-btn carousel-next" onclick="moveCarousel(1)">❯</button>
                ` : ''}
            </div>
            
            ${limitedGallery.length > 1 ? `
                <div class="carousel-indicators">
                    ${limitedGallery.map((_, index) => `
                        <button class="indicator ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></button>
                    `).join('')}
                </div>
            ` : ''}
            
            <div class="gallery-counter">
                <span id="current-slide">1</span> / ${limitedGallery.length}
            </div>
        </div>
    `;
    
    // הוספת CSS לקרוסלה
    if (!document.getElementById('carousel-styles')) {
        const style = document.createElement('style');
        style.id = 'carousel-styles';
        style.textContent = `
            .carousel-container {
                position: relative;
                max-width: 800px;
                margin: 2rem auto;
                background: #f8f9fa;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            
            .carousel-wrapper {
                position: relative;
                overflow: hidden;
            }
            
            .carousel-track {
                display: flex;
                transition: transform 0.5s ease-in-out;
            }
            
            .carousel-slide {
                min-width: 100%;
                position: relative;
            }
            
            .carousel-slide img {
                width: 100%;
                height: 400px;
                object-fit: cover;
                cursor: pointer;
                transition: transform 0.3s ease;
            }
            
            .carousel-slide img:hover {
                transform: scale(1.02);
            }
            
            .carousel-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0,0,0,0.7);
                color: white;
                border: none;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                font-size: 18px;
                cursor: pointer;
                z-index: 10;
                transition: all 0.3s ease;
            }
            
            .carousel-btn:hover {
                background: rgba(0,0,0,0.9);
                transform: translateY(-50%) scale(1.1);
            }
            
            .carousel-prev {
                left: 15px;
            }
            
            .carousel-next {
                right: 15px;
            }
            
            .carousel-indicators {
                display: flex;
                justify-content: center;
                gap: 10px;
                padding: 20px;
                background: linear-gradient(135deg, var(--primary-gold), var(--primary-teal));
            }
            
            .indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid rgba(255,255,255,0.5);
                background: transparent;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .indicator.active,
            .indicator:hover {
                background: white;
                border-color: white;
                transform: scale(1.2);
            }
            
            .gallery-counter {
                position: absolute;
                top: 15px;
                right: 15px;
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 500;
            }
            
            @media (max-width: 768px) {
                .carousel-btn {
                    width: 40px;
                    height: 40px;
                    font-size: 14px;
                }
                
                .carousel-prev {
                    left: 10px;
                }
                
                .carousel-next {
                    right: 10px;
                }
                
                .carousel-slide img {
                    height: 250px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    gallerySection.style.display = 'block';
    
    // משתנים גלובליים לקרוסלה
    window.currentSlideIndex = 0;
    window.totalSlides = limitedGallery.length;
}

// פונקציות לניהול הקרוסלה
window.moveCarousel = function(direction) {
    const track = document.getElementById('carousel-track');
    const indicators = document.querySelectorAll('.indicator');
    const counter = document.getElementById('current-slide');
    
    window.currentSlideIndex += direction;
    
    if (window.currentSlideIndex >= window.totalSlides) {
        window.currentSlideIndex = 0;
    } else if (window.currentSlideIndex < 0) {
        window.currentSlideIndex = window.totalSlides - 1;
    }
    
    const translateX = -window.currentSlideIndex * 100;
    track.style.transform = `translateX(${translateX}%)`;
    
    // עדכון אינדיקטורים
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === window.currentSlideIndex);
    });
    
    // עדכון מונה
    counter.textContent = window.currentSlideIndex + 1;
};

window.goToSlide = function(slideIndex) {
    const track = document.getElementById('carousel-track');
    const indicators = document.querySelectorAll('.indicator');
    const counter = document.getElementById('current-slide');
    
    window.currentSlideIndex = slideIndex;
    
    const translateX = -slideIndex * 100;
    track.style.transform = `translateX(${translateX}%)`;
    
    // עדכון אינדיקטורים
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === slideIndex);
    });
    
    // עדכון מונה
    counter.textContent = slideIndex + 1;
};

// הוספת תמיכה במקלדת וטאצ'
document.addEventListener('keydown', function(e) {
    if (document.querySelector('.carousel-container')) {
        if (e.key === 'ArrowLeft') {
            window.moveCarousel(-1);
        } else if (e.key === 'ArrowRight') {
            window.moveCarousel(1);
        }
    }
});

// תמיכה בטאצ' למובייל
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    if (document.querySelector('.carousel-container')) {
        handleSwipe();
    }
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // החלקה שמאלה - תמונה הבאה
            window.moveCarousel(1);
        } else {
            // החלקה ימינה - תמונה קודמת
            window.moveCarousel(-1);
        }
    }
}