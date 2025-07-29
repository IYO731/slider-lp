// スライド制御
class SlideController {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 5;
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        this.sliderContainer = document.querySelector('.slider-container');
        this.navDots = document.querySelectorAll('.nav-dot');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateSlide();
    }
    
    bindEvents() {
        // マウスホイールイベント
        document.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.handleWheel(e);
        }, { passive: false });
        
        // タッチイベント（スマホ対応）
        let startY = 0;
        let endY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            endY = e.changedTouches[0].clientY;
            this.handleTouch(startY, endY);
        }, { passive: true });
        
        // キーボードイベント
        document.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });
        
        // ナビゲーションドット
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
        
        // スクロールインジケーター
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                this.nextSlide();
            });
        }
    }
    
    handleWheel(e) {
        if (this.isScrolling) return;
        
        if (e.deltaY > 0) {
            this.nextSlide();
        } else {
            this.prevSlide();
        }
    }
    
    handleTouch(startY, endY) {
        if (this.isScrolling) return;
        
        const threshold = 50;
        const diff = startY - endY;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    handleKeydown(e) {
        if (this.isScrolling) return;
        
        switch (e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides - 1);
                break;
        }
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.updateSlide();
        }
    }
    
    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlide();
        }
    }
    
    goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < this.totalSlides) {
            this.currentSlide = slideIndex;
            this.updateSlide();
        }
    }
    
    updateSlide() {
        this.isScrolling = true;
        
        // スライダーの位置を更新
        const translateX = -this.currentSlide * 100;
        this.sliderContainer.style.transform = `translateX(${translateX}vw)`;
        
        // ナビゲーションドットを更新
        this.navDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
        
        // スクロールインジケーターの表示/非表示
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.display = this.currentSlide === 0 ? 'block' : 'none';
        }
        
        // スクロール完了後にフラグをリセット
        setTimeout(() => {
            this.isScrolling = false;
        }, 800);
    }
}

// アニメーション効果
class AnimationController {
    constructor() {
        this.init();
    }
    
    init() {
        this.observeElements();
        this.addHoverEffects();
    }
    
    observeElements() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // アニメーション対象の要素を監視
        const animatedElements = document.querySelectorAll('.problem-item, .solution-item, .detail-card');
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
    
    addHoverEffects() {
        // ボタンのホバーエフェクト
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
        
        // カードのホバーエフェクト
        const cards = document.querySelectorAll('.problem-item, .detail-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
}

// ページ読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', function() {
    // スライド制御を初期化
    const slideController = new SlideController();
    
    // アニメーション制御を初期化
    const animationController = new AnimationController();
    
    // LINEリンクの動作確認
    const ctaButtons = document.querySelectorAll('.btn-primary');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            console.log('LINEリンクがクリックされました:', this.href);
        });
    });
    
    // 初期表示時のアニメーション
    setTimeout(() => {
        const firstSlide = document.querySelector('.slide-1');
        if (firstSlide) {
            firstSlide.style.opacity = '1';
        }
    }, 100);
});

// ページの可視性変更時の処理
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // ページが非表示になった時の処理
        console.log('ページが非表示になりました');
    } else {
        // ページが表示された時の処理
        console.log('ページが表示されました');
    }
});

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.error('エラーが発生しました:', e.error);
});

// パフォーマンス最適化
window.addEventListener('load', function() {
    // 画像の遅延読み込み
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}); 