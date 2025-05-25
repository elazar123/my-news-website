// מערכת ניתוח צפיות מתקדמת
class AnalyticsSystem {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.pageViews = this.getStoredData('pageViews') || {};
        this.sessions = this.getStoredData('sessions') || [];
        this.articleViews = this.getStoredData('articleViews') || {};
        this.userBehavior = this.getStoredData('userBehavior') || {};
        
        this.initTracking();
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getStoredData(key) {
        try {
            return JSON.parse(localStorage.getItem(`analytics_${key}`)) || {};
        } catch (e) {
            return {};
        }
    }
    
    saveData(key, data) {
        localStorage.setItem(`analytics_${key}`, JSON.stringify(data));
    }
    
    initTracking() {
        // מעקב אחר טעינת דף
        this.trackPageView();
        
        // מעקב אחר זמן שהייה
        this.trackTimeOnPage();
        
        // מעקב אחר גלילה
        this.trackScrollBehavior();
        
        // מעקב אחר קליקים
        this.trackClicks();
        
        // שמירה כל 30 שניות
        setInterval(() => this.saveAllData(), 30000);
        
        // שמירה בעת עזיבת הדף
        window.addEventListener('beforeunload', () => this.saveAllData());
    }
    
    trackPageView() {
        const currentPage = window.location.pathname + window.location.search;
        const today = new Date().toISOString().split('T')[0];
        const hour = new Date().getHours();
        
        // עדכון צפיות יומיות
        if (!this.pageViews[today]) {
            this.pageViews[today] = {};
        }
        if (!this.pageViews[today][currentPage]) {
            this.pageViews[today][currentPage] = 0;
        }
        this.pageViews[today][currentPage]++;
        
        // עדכון צפיות לפי שעות
        const hourKey = `${today}_${hour}`;
        if (!this.pageViews[hourKey]) {
            this.pageViews[hourKey] = {};
        }
        if (!this.pageViews[hourKey][currentPage]) {
            this.pageViews[hourKey][currentPage] = 0;
        }
        this.pageViews[hourKey][currentPage]++;
        
        // אם זה דף מאמר, עדכן סטטיסטיקות מאמר
        const urlParams = new URLSearchParams(window.location.search);
        const postFile = urlParams.get('post');
        if (postFile) {
            this.trackArticleView(postFile);
        }
        
        console.log('📊 Page view tracked:', currentPage);
    }
    
    trackArticleView(postFile) {
        const today = new Date().toISOString().split('T')[0];
        
        if (!this.articleViews[postFile]) {
            this.articleViews[postFile] = {
                totalViews: 0,
                dailyViews: {},
                firstView: new Date().toISOString(),
                lastView: new Date().toISOString()
            };
        }
        
        this.articleViews[postFile].totalViews++;
        this.articleViews[postFile].lastView = new Date().toISOString();
        
        if (!this.articleViews[postFile].dailyViews[today]) {
            this.articleViews[postFile].dailyViews[today] = 0;
        }
        this.articleViews[postFile].dailyViews[today]++;
        
        console.log('📰 Article view tracked:', postFile);
    }
    
    trackTimeOnPage() {
        this.timeTracker = setInterval(() => {
            const currentPage = window.location.pathname + window.location.search;
            const timeSpent = Date.now() - this.startTime;
            
            if (!this.userBehavior[currentPage]) {
                this.userBehavior[currentPage] = {
                    totalTime: 0,
                    sessions: 0,
                    bounceRate: 0
                };
            }
            
            this.userBehavior[currentPage].totalTime = timeSpent;
        }, 5000); // עדכון כל 5 שניות
    }
    
    trackScrollBehavior() {
        let maxScroll = 0;
        let scrollEvents = 0;
        
        window.addEventListener('scroll', () => {
            scrollEvents++;
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            maxScroll = Math.max(maxScroll, scrollPercent);
            
            const currentPage = window.location.pathname + window.location.search;
            if (!this.userBehavior[currentPage]) {
                this.userBehavior[currentPage] = {};
            }
            
            this.userBehavior[currentPage].maxScroll = maxScroll;
            this.userBehavior[currentPage].scrollEvents = scrollEvents;
        });
    }
    
    trackClicks() {
        document.addEventListener('click', (event) => {
            const element = event.target;
            const clickData = {
                timestamp: new Date().toISOString(),
                element: element.tagName,
                className: element.className,
                id: element.id,
                text: element.textContent?.substring(0, 50) || '',
                page: window.location.pathname + window.location.search
            };
            
            const today = new Date().toISOString().split('T')[0];
            if (!this.userBehavior[`clicks_${today}`]) {
                this.userBehavior[`clicks_${today}`] = [];
            }
            
            this.userBehavior[`clicks_${today}`].push(clickData);
            console.log('🖱️ Click tracked:', clickData);
        });
    }
    
    saveAllData() {
        this.saveData('pageViews', this.pageViews);
        this.saveData('articleViews', this.articleViews);
        this.saveData('userBehavior', this.userBehavior);
        
        // שמירת מידע על הסשן הנוכחי
        const sessionData = {
            sessionId: this.sessionId,
            startTime: this.startTime,
            endTime: Date.now(),
            pages: Object.keys(this.userBehavior),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };
        
        this.sessions.push(sessionData);
        this.saveData('sessions', this.sessions);
    }
    
    // פונקציות לקבלת נתונים
    getTodayViews() {
        const today = new Date().toISOString().split('T')[0];
        return this.pageViews[today] || {};
    }
    
    getWeeklyViews() {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        let totalViews = 0;
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            if (this.pageViews[dateStr]) {
                Object.values(this.pageViews[dateStr]).forEach(views => {
                    totalViews += views;
                });
            }
        }
        
        return totalViews;
    }
    
    getMonthlyViews() {
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        
        let totalViews = 0;
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            if (this.pageViews[dateStr]) {
                Object.values(this.pageViews[dateStr]).forEach(views => {
                    totalViews += views;
                });
            }
        }
        
        return totalViews;
    }
    
    getTopArticles(period = 'week') {
        const articles = [];
        
        Object.keys(this.articleViews).forEach(article => {
            const data = this.articleViews[article];
            let views = 0;
            
            if (period === 'today') {
                const today = new Date().toISOString().split('T')[0];
                views = data.dailyViews[today] || 0;
            } else if (period === 'week') {
                for (let i = 0; i < 7; i++) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];
                    views += data.dailyViews[dateStr] || 0;
                }
            } else {
                views = data.totalViews;
            }
            
            articles.push({
                article,
                views,
                totalViews: data.totalViews
            });
        });
        
        return articles.sort((a, b) => b.views - a.views);
    }
    
    getHourlyStats() {
        const today = new Date().toISOString().split('T')[0];
        const hourlyData = {};
        
        for (let hour = 0; hour < 24; hour++) {
            const hourKey = `${today}_${hour}`;
            let totalViews = 0;
            
            if (this.pageViews[hourKey]) {
                Object.values(this.pageViews[hourKey]).forEach(views => {
                    totalViews += views;
                });
            }
            
            hourlyData[hour] = totalViews;
        }
        
        return hourlyData;
    }
}

// יצירת מופע גלובלי
window.analytics = new AnalyticsSystem();

// פונקציות עזר גלובליות
window.getAnalyticsData = function() {
    return {
        todayViews: analytics.getTodayViews(),
        weeklyViews: analytics.getWeeklyViews(),
        monthlyViews: analytics.getMonthlyViews(),
        topArticles: analytics.getTopArticles(),
        hourlyStats: analytics.getHourlyStats(),
        totalSessions: analytics.sessions.length
    };
};

console.log('📊 Analytics system initialized'); 