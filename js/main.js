/* 科学伙伴 - 移动端优化集成脚本 */
/* 包含：设备检测 + 移动端导航 */

// ===== 设备检测系统 =====
class DeviceDetection {
    constructor() {
        this.deviceType = null;
        this.screenOrientation = null;
        this.touchEnabled = false;
        this.init();
    }
    
    init() {
        this.detectDeviceType();
        this.detectScreenOrientation();
        this.detectTouchSupport();
        this.setHtmlClasses();
        this.bindEvents();
    }
    
    detectDeviceType() {
        const width = window.innerWidth;
        const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());
        
        if (isMobile || width < 768) {
            this.deviceType = 'mobile';
        } else if (width >= 768 && width < 1024) {
            this.deviceType = 'tablet';
        } else {
            this.deviceType = 'desktop';
        }
    }
    
    detectScreenOrientation() {
        this.screenOrientation = window.matchMedia("(orientation: portrait)").matches ? 'portrait' : 'landscape';
    }
    
    detectTouchSupport() {
        this.touchEnabled = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    setHtmlClasses() {
        const html = document.documentElement;
        
        // 清除旧类
        html.classList.remove(
            'device-mobile', 'device-tablet', 'device-desktop',
            'orientation-portrait', 'orientation-landscape',
            'touch-enabled', 'no-touch'
        );
        
        // 添加新类
        html.classList.add(`device-${this.deviceType}`);
        html.classList.add(`orientation-${this.screenOrientation}`);
        
        if (this.touchEnabled) {
            html.classList.add('touch-enabled');
        } else {
            html.classList.add('no-touch');
        }
        
        // 设置布局类
        this.setLayoutClass();
    }
    
    setLayoutClass() {
        const html = document.documentElement;
        html.classList.remove(
            'layout-mobile-portrait',
            'layout-mobile-landscape',
            'layout-tablet-portrait',
            'layout-tablet-landscape',
            'layout-desktop'
        );
        
        let layoutClass = 'layout-desktop';
        
        if (this.deviceType === 'mobile') {
            if (this.screenOrientation === 'portrait') {
                layoutClass = 'layout-mobile-portrait';
            } else {
                layoutClass = 'layout-mobile-landscape';
            }
        } else if (this.deviceType === 'tablet') {
            if (this.screenOrientation === 'portrait') {
                layoutClass = 'layout-tablet-portrait';
            } else {
                layoutClass = 'layout-tablet-landscape';
            }
        }
        
        html.classList.add(layoutClass);
    }
    
    bindEvents() {
        // 监听窗口大小变化
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
        
        // 监听方向变化
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
    }
    
    handleResize() {
        const oldDeviceType = this.deviceType;
        const oldOrientation = this.screenOrientation;
        
        this.detectDeviceType();
        this.detectScreenOrientation();
        
        if (oldDeviceType !== this.deviceType || oldOrientation !== this.screenOrientation) {
            this.setHtmlClasses();
        }
    }
    
    handleOrientationChange() {
        const oldOrientation = this.screenOrientation;
        this.detectScreenOrientation();
        
        if (oldOrientation !== this.screenOrientation) {
            this.setHtmlClasses();
        }
    }
    
    isMobile() {
        return this.deviceType === 'mobile';
    }
    
    isTablet() {
        return this.deviceType === 'tablet';
    }
    
    isDesktop() {
        return this.deviceType === 'desktop';
    }
    
    isPortrait() {
        return this.screenOrientation === 'portrait';
    }
}

// ===== 移动端导航系统 =====
class MobileNavigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.toggleButton = document.querySelector('.navbar-toggle');
        this.menu = document.querySelector('.navbar-menu');
        this.overlay = document.querySelector('.navbar-overlay');
        this.closeButton = document.querySelector('.menu-close');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.ensureOverlayExists();
    }
    
    ensureOverlayExists() {
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'navbar-overlay';
            this.overlay.setAttribute('aria-hidden', 'true');
            document.body.appendChild(this.overlay);
        }
        
        if (this.menu && !this.menu.querySelector('.menu-close')) {
            const closeButton = document.createElement('button');
            closeButton.className = 'menu-close';
            closeButton.setAttribute('aria-label', '关闭菜单');
            closeButton.innerHTML = '×';
            this.menu.insertBefore(closeButton, this.menu.firstChild);
            this.closeButton = closeButton;
        }
        
        // 设置ARIA属性
        if (this.toggleButton) {
            this.toggleButton.setAttribute('aria-expanded', 'false');
            this.toggleButton.setAttribute('aria-controls', 'navbar-menu');
        }
        
        if (this.menu) {
            this.menu.setAttribute('aria-hidden', 'true');
        }
    }
    
    bindEvents() {
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', this.toggleMenu.bind(this));
        }
        
        if (this.closeButton) {
            this.closeButton.addEventListener('click', this.closeMenu.bind(this));
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', this.closeMenu.bind(this));
        }
        
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMenuOpen) {
                    this.closeMenu();
                }
            });
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        if (!this.isMobileDevice()) return;
        
        this.isMenuOpen = true;
        
        if (this.toggleButton) {
            this.toggleButton.setAttribute('aria-expanded', 'true');
        }
        
        if (this.menu) {
            this.menu.setAttribute('aria-hidden', 'false');
            this.menu.classList.add('active');
        }
        
        if (this.overlay) {
            this.overlay.classList.add('active');
        }
        
        document.body.style.overflow = 'hidden';
    }
    
    closeMenu() {
        if (!this.isMenuOpen) return;
        
        this.isMenuOpen = false;
        
        if (this.toggleButton) {
            this.toggleButton.setAttribute('aria-expanded', 'false');
        }
        
        if (this.menu) {
            this.menu.setAttribute('aria-hidden', 'true');
            this.menu.classList.remove('active');
        }
        
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
        
        document.body.style.overflow = '';
    }
    
    isMobileDevice() {
        return window.innerWidth < 1024;
    }
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    // 初始化设备检测
    window.deviceDetection = new DeviceDetection();
    
    // 初始化移动端导航
    window.mobileNavigation = new MobileNavigation();
    
    // 基础方向变化处理
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            const html = document.documentElement;
            const isPortrait = window.innerHeight > window.innerWidth;
            
            html.classList.remove('orientation-portrait', 'orientation-landscape');
            if (isPortrait) {
                html.classList.add('orientation-portrait');
            } else {
                html.classList.add('orientation-landscape');
            }
            
            // 更新布局类
            if (window.deviceDetection) {
                window.deviceDetection.setLayoutClass();
            }
        }, 100);
    });
    
    // 窗口大小变化处理
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.deviceDetection) {
                window.deviceDetection.handleResize();
            }
            
            // 如果从移动端切换到桌面端，确保菜单关闭
            if (window.mobileNavigation && window.innerWidth >= 1024 && window.mobileNavigation.isMenuOpen) {
                window.mobileNavigation.closeMenu();
            }
        }, 250);
    });
    
    console.log('📱 移动端优化系统已初始化');
    console.log('设备类型:', window.deviceDetection.deviceType);
    console.log('屏幕方向:', window.deviceDetection.screenOrientation);
    console.log('触摸支持:', window.deviceDetection.touchEnabled);
});

// 导出供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DeviceDetection,
        MobileNavigation
    };
}