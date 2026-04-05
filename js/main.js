/* 科学伙伴 - 主JavaScript文件 */

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有组件
    initNavbar();
    initLoading();
    loadContent();
    initScrollEffects();
    initResponsive();
});

// ===== 导航栏功能 =====
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.querySelector('.navbar-toggle');
    const menu = document.querySelector('.navbar-menu');
    
    if (!toggle || !menu) return;
    
    // 滚动时添加阴影
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // 移动端菜单切换
    toggle.addEventListener('click', function() {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('show');
    });
    
    // 点击菜单项关闭菜单（移动端）
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 768) {
                toggle.setAttribute('aria-expanded', 'false');
                menu.classList.remove('show');
            }
        });
    });
}

// ===== 加载指示器 =====
function initLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    
    if (loadingOverlay) {
        // 页面加载完成后隐藏加载指示器
        window.addEventListener('load', function() {
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 300);
            }, 500);
        });
        
        // 如果页面已经加载完成，立即隐藏
        if (document.readyState === 'complete') {
            loadingOverlay.style.display = 'none';
        }
    }
}

// ===== 内容加载 =====
function loadContent() {
    // 加载代表文章
    loadFeaturedEssays();
    
    // 加载栏目
    loadColumns();
    
    // 加载最新文章
    loadLatestEssays();
    
    // 加载专题
    loadFeatures();
}

function loadFeaturedEssays() {
    const container = document.getElementById('featured-essays-grid');
    if (!container) return;
    
    // 从数据中获取代表文章
    const featuredEssays = window.articlesData?.filter(article => article.featured) || [];
    
    if (featuredEssays.length === 0) {
        container.innerHTML = '<p class="text-center text-secondary">暂无代表文章</p>';
        return;
    }
    
    // 渲染文章卡片
    const html = featuredEssays.slice(0, 6).map(article => createEssayCard(article, true)).join('');
    container.innerHTML = html;
}

function loadColumns() {
    const container = document.getElementById('columns-grid');
    if (!container) return;
    
    const columns = window.columnsData || [];
    
    if (columns.length === 0) {
        container.innerHTML = '<p class="text-center text-secondary">栏目建设中</p>';
        return;
    }
    
    const html = columns.map(column => `
        <div class="column-card">
            <div class="column-icon">${column.icon || '📚'}</div>
            <h3 class="column-title">${column.title}</h3>
            <p class="column-description">${column.description}</p>
            <div class="column-count">${column.articleCount || 0} 篇文章</div>
            <a href="${column.url || '#'}" class="btn btn-outline btn-sm">进入栏目</a>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

function loadLatestEssays() {
    const container = document.getElementById('latest-essays-grid');
    if (!container) return;
    
    const allEssays = window.articlesData || [];
    const latestEssays = allEssays
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 9);
    
    if (latestEssays.length === 0) {
        container.innerHTML = '<p class="text-center text-secondary">暂无最新文章</p>';
        return;
    }
    
    const html = latestEssays.map(article => createEssayCard(article, false)).join('');
    container.innerHTML = html;
}

function loadFeatures() {
    const container = document.getElementById('features-grid');
    if (!container) return;
    
    const features = window.featuresData || [];
    
    if (features.length === 0) {
        container.innerHTML = '<p class="text-center text-secondary">专题策划准备中</p>';
        return;
    }
    
    const html = features.slice(0, 4).map(feature => `
        <div class="feature-card">
            <div class="feature-card-image">${feature.title.charAt(0)}</div>
            <div class="feature-card-content">
                <h3 class="feature-card-title">${feature.title}</h3>
                <p class="feature-card-description">${feature.description}</p>
                <div class="feature-card-meta">
                    <span>${feature.articleCount || 0} 篇文章</span>
                    <a href="${feature.url || '#'}" class="text-sm font-medium">探索专题 →</a>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// ===== 创建文章卡片 =====
function createEssayCard(article, isFeatured = false) {
    const categoryClass = getCategoryClass(article.category);
    const date = formatDate(article.date);
    const readingTime = article.readingTime || '5分钟';
    
    return `
        <article class="essay-card ${isFeatured ? 'essay-card-featured' : ''}">
            <div class="essay-card-header">
                <div class="essay-card-meta">
                    <span class="essay-category ${categoryClass}">${article.category}</span>
                    <span class="essay-date">${date}</span>
                </div>
                <h3 class="essay-card-title">
                    <a href="${article.url || '#'}">${article.title}</a>
                </h3>
            </div>
            <div class="essay-card-body">
                <p class="essay-card-summary">${article.summary}</p>
            </div>
            <div class="essay-card-footer">
                <span class="essay-reading-time">阅读时间约 ${readingTime}</span>
                <a href="${article.url || '#'}" class="text-sm font-medium">阅读全文 →</a>
            </div>
        </article>
    `;
}

// ===== 工具函数 =====
function getCategoryClass(category) {
    const categoryMap = {
        'AI': 'essay-category-ai',
        '医学': 'essay-category-medical',
        '科技': 'essay-category-tech',
        '社会': 'essay-category-society',
        '生物科技': 'essay-category-medical',
        '科技评论': 'essay-category-tech',
        '社会观察': 'essay-category-society'
    };
    
    return categoryMap[category] || 'essay-category-ai';
}

function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return '今天';
    } else if (diffDays === 1) {
        return '昨天';
    } else if (diffDays < 7) {
        return `${diffDays}天前`;
    } else if (diffDays < 30) {
        return `${Math.floor(diffDays / 7)}周前`;
    } else {
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// ===== 滚动效果 =====
function initScrollEffects() {
    // 淡入动画
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // 观察所有章节
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// ===== 响应式处理 =====
function initResponsive() {
    // 移动端菜单处理
    function handleResize() {
        const menu = document.querySelector('.navbar-menu');
        const toggle = document.querySelector('.navbar-toggle');
        
        if (window.innerWidth >= 768) {
            // 桌面端：显示菜单，重置状态
            if (menu) menu.classList.remove('show');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
    }
    
    // 初始检查和监听
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // 图片懒加载
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== 全局工具函数 =====
window.SciencePartner = {
    // 格式化数字
    formatNumber: function(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },
    
    // 复制到剪贴板
    copyToClipboard: function(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('已复制到剪贴板');
        }).catch(err => {
            console.error('复制失败:', err);
        });
    },
    
    // 显示提示
    showToast: function(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--color-accent);
            color: white;
            padding: 12px 24px;
            border-radius: var(--radius-md);
            z-index: var(--z-tooltip);
            animation: fadeInOut ${duration}ms ease-in-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, duration);
    },
    
    // 切换主题
    toggleTheme: function() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        return newTheme;
    }
};

// 初始化主题
(function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
})();