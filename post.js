// פונקציה לטעינת מאמר בודד
async function loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postFile = urlParams.get('post');
    
    if (!postFile) {
        showError('לא נמצא מאמר לטעינה');
        return;
    }
    
    try {
        const response = await fetch(`posts/${encodeURIComponent(postFile)}`);
        if (!response.ok) {
            throw new Error('המאמר לא נמצא');
        }
        
        const content = await response.text();
        const article = parseMarkdown(content);
        
        // עדכון כותרת הדף
        document.title = `${article.frontmatter.title || 'מאמר'} - אתר החדשות המקצועי`;
        document.getElementById('post-title').textContent = article.frontmatter.title || 'מאמר';
        
        // עדכון כותרת המאמר
        document.getElementById('article-title').textContent = article.frontmatter.title || 'ללא כותרת';
        
        // עדכון כותרת משנה
        if (article.frontmatter.subtitle) {
            const subtitleElement = document.getElementById('article-subtitle');
            subtitleElement.textContent = article.frontmatter.subtitle;
            subtitleElement.style.display = 'block';
        }
        
        // עדכון קטגוריה בתג המקצועי
        if (article.frontmatter.category) {
            const categoryContainer = document.getElementById('post-category-container');
            categoryContainer.innerHTML = `<span class="post-category-badge">${article.frontmatter.category}</span>`;
        }
        
        // עדכון תמונה ראשית מקצועית
        if (article.frontmatter.featured_image) {
            const imageElement = document.getElementById('post-featured-image');
            imageElement.src = article.frontmatter.featured_image;
            imageElement.alt = article.frontmatter.title || 'תמונת המאמר';
            imageElement.style.display = 'block';
        }
        
        // עדכון פרטי הכותב
        if (article.frontmatter.author) {
            document.getElementById('article-author').textContent = article.frontmatter.author;
            
            if (article.frontmatter.author_image) {
                const avatarElement = document.getElementById('author-avatar');
                avatarElement.src = article.frontmatter.author_image;
                avatarElement.alt = article.frontmatter.author;
                avatarElement.style.display = 'block';
            }
        }
        
        // עדכון תאריך
        const dateElement = document.getElementById('article-date');
        if (article.frontmatter.date) {
            dateElement.textContent = formatDate(article.frontmatter.date);
        }
        
        // עדכון תוכן המאמר
        const contentElement = document.getElementById('article-content');
        contentElement.innerHTML = markdownToHtml(article.content);
        
        // הצגת גלריית תמונות
        if (article.frontmatter.gallery && article.frontmatter.gallery.length > 0) {
            displayGallery(article.frontmatter.gallery);
        }
        
        // הצגת תגיות
        if (article.frontmatter.tags && article.frontmatter.tags.length > 0) {
            displayTags(article.frontmatter.tags);
        }
        
        // טעינת תגובות
        loadComments(postFile);
        
        // הוספת פונקציונליות לכפתורי הפעולה
        setupActionButtons(article);
        
    } catch (error) {
        console.error('שגיאה בטעינת המאמר:', error);
        showError('שגיאה בטעינת המאמר');
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
    
    // בפרויקט אמיתי, כאן נטען תגובות מהשרת
    // לעת עתה נציג תגובות דמה
    const demoComments = [
        {
            id: 1,
            name: 'יוסי כהן',
            date: '2024-01-03T10:30:00.000Z',
            content: 'מאמר מעניין מאוד! תודה על השיתוף.'
        },
        {
            id: 2,
            name: 'שרה לוי',
            date: '2024-01-03T14:15:00.000Z',
            content: 'נקודות מצוינות. האם יש לך מקורות נוספים בנושא?'
        },
        {
            id: 3,
            name: 'דוד אברהם',
            date: '2024-01-03T16:45:00.000Z',
            content: 'תוכן איכותי ומקצועי. ממליץ לכולם לקרוא!'
        }
    ];
    
    // עדכון מספר התגובות
    if (commentsCount) {
        commentsCount.textContent = `${demoComments.length} תגובות`;
    }
    
    displayComments(demoComments);
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
function handleCommentSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const comment = {
        name: formData.get('name'),
        email: formData.get('email'),
        content: formData.get('content'),
        date: new Date().toISOString()
    };
    
    // בפרויקט אמיתי, כאן נשלח את התגובה לשרת
    console.log('תגובה חדשה:', comment);
    
    // הצגת הודעת הצלחה
    showSuccessMessage('התגובה נשלחה בהצלחה! תופיע לאחר אישור.');
    
    // איפוס הטופס
    form.reset();
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
            
            // טיפול ברשימות (למשל gallery)
            if (value.startsWith('[') && value.endsWith(']')) {
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
    loadPost();
    
    // הוספת אירוע לטופס התגובות
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', handleCommentSubmit);
    }
}); 