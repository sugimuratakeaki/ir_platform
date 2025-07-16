// 🔮 KAGAMI IR管理センター - JavaScript アプリケーション v2.0

// ===== モジュラーアーキテクチャ =====
const KAGAMI = (function() {
    'use strict';
    
    // ===== プライベート状態 =====
    const _state = {
        initialized: false,
        user: {
            isAuthenticated: false,
            profile: {
                name: '田中 IR担当者',
                role: 'ir_manager',
                permissions: ['read', 'write', 'approve']
            }
        },
        ui: {
            currentSection: 'dashboard',
            activeModal: null,
            loading: false,
            notifications: []
        },
        system: {
            health: 'unknown',
            lastSync: null,
            version: '2.0.0'
        },
        data: {
            kpis: new Map(),
            alerts: [],
            cache: new Map()
        }
    };
    
    const _config = {
        debug: true,
        apiBaseUrl: '/api',
        updateInterval: 30000,
        maxCacheSize: 100,
        features: {
            realTimeUpdates: true,
            performanceMonitoring: true,
            structuredLogging: true
        }
    };
    
    // ===== 構造化ログシステム =====
    class StructuredLogger {
        constructor(options = {}) {
            this.level = options.level || 'info';
            this.context = options.context || {};
            this.buffer = [];
            this.maxBufferSize = options.maxBufferSize || 1000;
        }
        
        static levels = {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3,
            trace: 4
        };
        
        log(level, message, data = {}) {
            const levelNum = StructuredLogger.levels[level];
            const currentLevelNum = StructuredLogger.levels[this.level];
            
            if (levelNum > currentLevelNum) return;
            
            const logEntry = {
                timestamp: new Date().toISOString(),
                level: level,
                message: message,
                data: { ...this.context, ...data },
                sessionId: this.getSessionId(),
                userAgent: navigator.userAgent,
                url: window.location.href
            };
            
            this.buffer.push(logEntry);
            this.maintainBuffer();
            
            // コンソール出力
            const method = console[level] || console.log;
            method.call(console, `[${level.toUpperCase()}]`, message, data);
        }
        
        error(message, data) { this.log('error', message, data); }
        warn(message, data) { this.log('warn', message, data); }
        info(message, data) { this.log('info', message, data); }
        debug(message, data) { this.log('debug', message, data); }
        
        maintainBuffer() {
            if (this.buffer.length > this.maxBufferSize) {
                this.buffer.splice(0, this.buffer.length - this.maxBufferSize);
            }
        }
        
        getSessionId() {
            return sessionStorage.getItem('kagami_session_id') || 'unknown';
        }
    }
    
    // ===== 高度なイベントシステム =====
    class TypedEventBus {
        constructor() {
            this.listeners = new Map();
            this.middleware = [];
        }
        
        use(middleware) {
            this.middleware.push(middleware);
        }
        
        on(eventType, listener, options = {}) {
            if (!this.listeners.has(eventType)) {
                this.listeners.set(eventType, new Set());
            }
            
            const wrappedListener = {
                fn: listener,
                once: options.once || false,
                priority: options.priority || 0,
                namespace: options.namespace || 'global'
            };
            
            this.listeners.get(eventType).add(wrappedListener);
            
            return () => this.off(eventType, wrappedListener);
        }
        
        async emit(eventType, data) {
            // ミドルウェア実行
            for (const middleware of this.middleware) {
                await middleware(eventType, data);
            }
            
            const listeners = this.listeners.get(eventType);
            if (!listeners) return;
            
            const sortedListeners = Array.from(listeners)
                .sort((a, b) => b.priority - a.priority);
            
            for (const listener of sortedListeners) {
                try {
                    await listener.fn(data);
                    
                    if (listener.once) {
                        listeners.delete(listener);
                    }
                } catch (error) {
                    logger.error(`イベントリスナーエラー [${eventType}]`, { error: error.message });
                }
            }
        }
        
        off(eventType, listener) {
            const listeners = this.listeners.get(eventType);
            if (listeners) {
                listeners.delete(listener);
            }
        }
        
        offNamespace(namespace) {
            for (const [eventType, listeners] of this.listeners) {
                for (const listener of listeners) {
                    if (listener.namespace === namespace) {
                        listeners.delete(listener);
                    }
                }
            }
        }
    }
    
    // ===== パフォーマンス監視 =====
    class PerformanceMonitor {
        constructor() {
            this.metrics = new Map();
            this.setupObservers();
        }
        
        setupObservers() {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.recordMetric(entry.entryType, {
                            name: entry.name,
                            duration: entry.duration,
                            startTime: entry.startTime
                        });
                    }
                });
                
                observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
            }
        }
        
        recordMetric(type, data) {
            if (!this.metrics.has(type)) {
                this.metrics.set(type, []);
            }
            
            const metrics = this.metrics.get(type);
            metrics.push({
                timestamp: Date.now(),
                ...data
            });
            
            if (metrics.length > 100) {
                metrics.shift();
            }
        }
        
        getReport() {
            const report = {};
            for (const [type, metrics] of this.metrics) {
                report[type] = {
                    count: metrics.length,
                    recent: metrics.slice(-10)
                };
            }
            return report;
        }
    }
    
    // ===== メモ化キャッシュ =====
    class MemoizationCache {
        constructor(maxSize = 100) {
            this.cache = new Map();
            this.maxSize = maxSize;
            this.accessOrder = new Set();
        }
        
        memoize(fn, keyGenerator = (...args) => JSON.stringify(args)) {
            return (...args) => {
                const key = keyGenerator(...args);
                
                if (this.cache.has(key)) {
                    this.accessOrder.delete(key);
                    this.accessOrder.add(key);
                    return this.cache.get(key);
                }
                
                const result = fn(...args);
                this.set(key, result);
                return result;
            };
        }
        
        set(key, value) {
            if (this.cache.size >= this.maxSize) {
                const oldest = this.accessOrder.values().next().value;
                this.cache.delete(oldest);
                this.accessOrder.delete(oldest);
            }
            
            this.cache.set(key, value);
            this.accessOrder.add(key);
        }
    }
    
    // ===== セキュリティバリデーター =====
    class SecurityValidator {
        static patterns = {
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            filename: /^[a-zA-Z0-9._-]+$/,
            url: /^https?:\/\/[^\s$.?#].[^\s]*$/i
        };
        
        static validateInput(value, type, options = {}) {
            if (typeof value !== 'string') {
                throw new Error('入力値は文字列である必要があります');
            }
            
            if (options.maxLength && value.length > options.maxLength) {
                throw new Error(`入力値は${options.maxLength}文字以下である必要があります`);
            }
            
            if (this.patterns[type] && !this.patterns[type].test(value)) {
                throw new Error(`入力値が${type}の形式に合いません`);
            }
            
            return true;
        }
        
        static sanitizeHtml(html) {
            const div = document.createElement('div');
            div.textContent = html;
            return div.innerHTML;
        }
    }
    
    // ===== サービス実装 =====
    
    // APIサービス
    const ApiService = {
        async get(endpoint, options = {}) {
            logger.debug('API GET', { endpoint, options });
            
            try {
                const response = await fetch(`${_config.apiBaseUrl}${endpoint}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    },
                    ...options
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                logger.debug('API GET Success', { endpoint, data });
                return data;
            } catch (error) {
                logger.error('API GET Error', { endpoint, error: error.message });
                throw error;
            }
        },
        
        async post(endpoint, data, options = {}) {
            logger.debug('API POST', { endpoint, data });
            
            try {
                const response = await fetch(`${_config.apiBaseUrl}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    },
                    body: JSON.stringify(data),
                    ...options
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const result = await response.json();
                logger.debug('API POST Success', { endpoint, result });
                return result;
            } catch (error) {
                logger.error('API POST Error', { endpoint, error: error.message });
                throw error;
            }
        }
    };
    
    // ナビゲーションサービス
    const NavigationService = {
        init() {
            this.setupNavigation();
            this.restoreState();
        },
        
        setupNavigation() {
            const navContainer = document.querySelector('.header-nav');
            if (!navContainer) {
                logger.warn('ナビゲーションコンテナが見つかりません');
                return;
            }

            // navContainer.addEventListener('click', (event) => {
            //     const navBtn = event.target.closest('.nav-btn');
            //     if (navBtn && !navBtn.classList.contains('active')) {
            //         // event.preventDefault(); // 標準のリンク動作を妨げないようにコメントアウト
            //         const section = navBtn.getAttribute('href'); // href属性から直接URLを取得
            //         // this.navigateToSection(section); // ページ遷移はaタグのhrefに任せる
            //     }
            // });
        },
        
        navigateToSection(section) {
            logger.info('Navigation', { from: _state.ui.currentSection, to: section });
            
            // アクティブボタンの更新
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const targetButton = document.querySelector(`[data-section="${section}"]`);
            if (targetButton) {
                targetButton.classList.add('active');
            }
            
            // 状態更新
            _state.ui.currentSection = section;
            
            // イベント発火
            eventBus.emit('navigation:changed', { section });
            
            // セクション別処理
            this.handleSectionNavigation(section);
            
            // 状態保存
            this.saveState();
        },
        
        handleSectionNavigation(section) {
            const routes = {
                dashboard: () => this.showDashboard(),
                'data-input': () => window.location.href = 'data-input.html',
                'ai-faq': () => window.location.href = 'ai-faq.html',
                dialogue: () => window.location.href = 'dialogue.html',
                analytics: () => window.location.href = 'analytics.html',
                settings: () => window.location.href = 'settings.html'
            };
            
            const handler = routes[section];
            if (handler) {
                handler();
            } else {
                logger.warn('未知のセクション', { section });
            }
        },
        
        showDashboard() {
            // ダッシュボード表示処理
            logger.debug('ダッシュボード表示');
        },
        
        saveState() {
            const state = {
                currentSection: _state.ui.currentSection,
                timestamp: Date.now()
            };
            localStorage.setItem('kagami_navigation_state', JSON.stringify(state));
        },
        
        restoreState() {
            try {
                const saved = localStorage.getItem('kagami_navigation_state');
                if (saved) {
                    const state = JSON.parse(saved);
                    _state.ui.currentSection = state.currentSection || 'dashboard';
                }
            } catch (error) {
                logger.warn('状態復元エラー', { error: error.message });
            }
        }
    };
    
    // 通知サービス
    const NotificationService = {
        init() {
            this.container = this.createContainer();
            this.setupStyles();
        },
        
        createContainer() {
            let container = document.getElementById('notification-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'notification-container';
                container.className = 'notification-container';
                document.body.appendChild(container);
            }
            return container;
        },
        
        toast(message, type = 'info', options = {}) {
            logger.debug('Toast notification', { message, type, options });
            
            const notification = this.createNotification(message, type, options);
            this.container.appendChild(notification);
            
            // アニメーション
            requestAnimationFrame(() => {
                notification.classList.add('show');
            });
            
            // 自動削除
            const duration = options.duration || 5000;
            setTimeout(() => {
                this.removeNotification(notification);
            }, duration);
            
            return notification;
        },
        
        createNotification(message, type, options) {
            const notification = document.createElement('div');
            notification.className = `notification notification--${type}`;
            
            const icons = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️'
            };
            
            notification.innerHTML = `
                <span class="notification__icon">${icons[type] || icons.info}</span>
                <span class="notification__message">${SecurityValidator.sanitizeHtml(message)}</span>
                <button class="notification__close" aria-label="閉じる">×</button>
            `;
            
            // 閉じるボタン
            const closeBtn = notification.querySelector('.notification__close');
            closeBtn.addEventListener('click', () => {
                this.removeNotification(notification);
            });
            
            return notification;
        },
        
        removeNotification(notification) {
            notification.classList.add('removing');
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        },
        
        setupStyles() {
            if (document.getElementById('notification-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    pointer-events: none;
                }
                
                .notification {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem;
                    margin-bottom: 0.5rem;
                    background: var(--white);
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-lg);
                    max-width: 400px;
                    pointer-events: auto;
                    transform: translateX(100%);
                    opacity: 0;
                    transition: all 0.3s ease;
                }
                
                .notification.show {
                    transform: translateX(0);
                    opacity: 1;
                }
                
                .notification.removing {
                    transform: translateX(100%);
                    opacity: 0;
                }
                
                .notification--success {
                    border-left: 4px solid var(--trust-green);
                }
                
                .notification--error {
                    border-left: 4px solid var(--alert-red);
                }
                
                .notification--warning {
                    border-left: 4px solid var(--warning-orange);
                }
                
                .notification--info {
                    border-left: 4px solid var(--info-blue);
                }
                
                .notification__message {
                    flex: 1;
                    font-size: 0.875rem;
                    line-height: 1.4;
                }
                
                .notification__close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    opacity: 0.6;
                    transition: opacity 0.2s;
                }
                
                .notification__close:hover {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }
    };
    
    // データサービス
    const DataService = {
        async loadDashboardData() {
            try {
                logger.info('ダッシュボードデータ読み込み開始');
                
                const [kpiData, systemHealth, alerts] = await Promise.all([
                    this.loadKpiData(),
                    this.loadSystemHealth(),
                    this.loadAlerts()
                ]);
                
                _state.data.kpis = new Map(Object.entries(kpiData));
                _state.system.health = systemHealth.status;
                _state.data.alerts = alerts;
                _state.system.lastSync = new Date().toISOString();
                
                eventBus.emit('data:loaded', {
                    kpis: kpiData,
                    systemHealth,
                    alerts
                });
                
                logger.info('ダッシュボードデータ読み込み完了');
                
            } catch (error) {
                logger.error('ダッシュボードデータ読み込みエラー', { error: error.message });
                throw error;
            }
        },
        
        async loadKpiData() {
            // 実際のAPIコールの代わりにモックデータ
            return {
                monthlyViews: { value: 12345, trend: 15.3 },
                documentCount: { value: 1234, trend: 8.7 },
                processingQueue: { value: 23, trend: -12.5 },
                systemLoad: { value: 67, trend: 2.1 }
            };
        },
        
        async loadSystemHealth() {
            return {
                status: 'healthy',
                uptime: '99.9%',
                responseTime: '250ms'
            };
        },
        
        async loadAlerts() {
            return [
                {
                    id: 1,
                    type: 'info',
                    message: 'システムメンテナンスを12/25 2:00-4:00に実施します',
                    timestamp: new Date().toISOString()
                }
            ];
        },
        
        // 分析レポート用データサービス
        async loadAnalyticsData() {
            try {
                logger.info('分析レポートデータ読み込み開始');
                
                const [overviewData, engagementData, sentimentData, trendsData] = await Promise.all([
                    this.loadOverviewData(),
                    this.loadEngagementData(),
                    this.loadSentimentData(),
                    this.loadTrendsData()
                ]);
                
                _state.data.analytics = {
                    overview: overviewData,
                    engagement: engagementData,
                    sentiment: sentimentData,
                    trends: trendsData
                };
                
                eventBus.emit('analytics:loaded', {
                    overview: overviewData,
                    engagement: engagementData,
                    sentiment: sentimentData,
                    trends: trendsData
                });
                
                logger.info('分析レポートデータ読み込み完了');
                
            } catch (error) {
                logger.error('分析レポートデータ読み込みエラー', { error: error.message });
                throw error;
            }
        },
        
        async loadOverviewData() {
            return {
                engagement: { value: 1247, change: 12.3, positive: true },
                satisfaction: { value: 96.8, change: 2.1, positive: true },
                responseTime: { value: 2.3, change: -0.5, positive: true },
                resolutionRate: { value: 98.5, change: 1.2, positive: true }
            };
        },
        
        async loadEngagementData() {
            return {
                activeUsers: { value: 1247, breakdown: { institutional: 847, individual: 400 } },
                avgSessionTime: { value: 4.2, breakdown: { faq: 2.1, download: 1.8 } },
                repeatRate: { value: 78.5, breakdown: { monthly: 65.2, weekly: 23.3 } }
            };
        },
        
        async loadSentimentData() {
            return {
                positive: { value: 76.8, change: 5.2, positive: true },
                neutral: { value: 18.5, change: -2.1, positive: false },
                negative: { value: 4.7, change: -3.1, positive: true }
            };
        },
        
        async loadTrendsData() {
            return {
                categories: [
                    { name: '財務・IR', trend: 25 },
                    { name: 'ESG', trend: 45 },
                    { name: '技術・開発', trend: 15 },
                    { name: '事業戦略', trend: 8 }
                ]
            };
        },
        
        async generateReport(type) {
            try {
                logger.info(`レポート生成開始: ${type}`);
                
                const response = await ApiService.post('/api/analytics/generate-report', {
                    type: type,
                    timestamp: new Date().toISOString()
                });
                
                if (response.success) {
                    eventBus.emit('report:generated', {
                        type: type,
                        reportId: response.reportId
                    });
                    
                    logger.info(`レポート生成完了: ${type}`);
                    return response;
                } else {
                    throw new Error(response.message || 'レポート生成に失敗しました');
                }
                
            } catch (error) {
                logger.error('レポート生成エラー', { type, error: error.message });
                throw error;
            }
        },
        
        async downloadReport(reportId) {
            try {
                logger.info(`レポートダウンロード開始: ${reportId}`);
                
                const response = await ApiService.get(`/api/analytics/download/${reportId}`, {
                    responseType: 'blob'
                });
                
                // ファイルダウンロード処理
                const url = window.URL.createObjectURL(response);
                const a = document.createElement('a');
                a.href = url;
                a.download = `kagami_report_${reportId}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                logger.info(`レポートダウンロード完了: ${reportId}`);
                
            } catch (error) {
                logger.error('レポートダウンロードエラー', { reportId, error: error.message });
                throw error;
            }
        },
        
        async shareReport(reportId) {
            try {
                logger.info(`レポート共有開始: ${reportId}`);
                
                const response = await ApiService.post(`/api/analytics/share/${reportId}`);
                
                if (response.success) {
                    eventBus.emit('report:shared', {
                        reportId: reportId,
                        shareUrl: response.shareUrl
                    });
                    
                    logger.info(`レポート共有完了: ${reportId}`);
                    return response;
                } else {
                    throw new Error(response.message || 'レポート共有に失敗しました');
                }
                
            } catch (error) {
                logger.error('レポート共有エラー', { reportId, error: error.message });
                throw error;
            }
        }
    };
    
    // ===== サービス初期化 =====
    const logger = new StructuredLogger({
        level: _config.debug ? 'debug' : 'info',
        context: {
            component: 'kagami-ir',
            version: _state.system.version
        }
    });
    
    const eventBus = new TypedEventBus();
    const performanceMonitor = _config.features.performanceMonitoring ? new PerformanceMonitor() : null;
    const memoCache = new MemoizationCache(_config.maxCacheSize);
    
    // ログミドルウェア
    eventBus.use(async (eventType, data) => {
        logger.debug(`Event: ${eventType}`, data);
    });
    
    // ===== 初期化処理 =====
    async function init() {
        try {
            logger.info('🔮 KAGAMI IR管理センター v2.0 - 起動中...');
            
            // サービス初期化
            NavigationService.init();
            NotificationService.init();
            
            // 初期データ読み込み
            await DataService.loadDashboardData();
            
            // リアルタイム更新開始
            if (_config.features.realTimeUpdates) {
                setInterval(() => {
                    DataService.loadDashboardData().catch(error => {
                        logger.error('定期更新エラー', { error: error.message });
                    });
                }, _config.updateInterval);
            }
            
            _state.initialized = true;
            
            eventBus.emit('app:initialized', { version: _state.system.version });
            
            logger.info('✅ KAGAMI IR管理センター v2.0 - 起動完了');
            
            // 成功通知
            NotificationService.toast('システムの初期化が完了しました', 'success');
            
        } catch (error) {
            logger.error('❌ 初期化エラー', { error: error.message });
            NotificationService.toast('システムの初期化に失敗しました', 'error');
        }
    }
    
    // ===== パブリック API =====
    return {
        // 設定
        config: _config,
        
        // 状態アクセス（読み取り専用）
        get state() {
            return { ..._state };
        },
        
        // サービス
        api: ApiService,
        events: eventBus,
        logger: logger,
        cache: memoCache,
        validator: SecurityValidator,
        notify: NotificationService,
        
        // メソッド
        init: init,
        
        // パフォーマンス監視
        getPerformanceReport: () => performanceMonitor?.getReport() || null,
        
        // デバッグ用
        _debug: {
            state: _state,
            config: _config,
            performanceMonitor: performanceMonitor
        }
    };
})();

// ===== アプリケーション起動 =====
document.addEventListener('DOMContentLoaded', function() {
    KAGAMI.init();
});

// ===== グローバルエラーハンドリング =====
window.addEventListener('error', (event) => {
    if (window.KAGAMI && KAGAMI.logger) {
        KAGAMI.logger.error('未処理エラー', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack
        });
    }
});

window.addEventListener('unhandledrejection', (event) => {
    if (window.KAGAMI && KAGAMI.logger) {
        KAGAMI.logger.error('未処理Promise拒否', {
            reason: event.reason,
            stack: event.reason?.stack
        });
    }
});

// ===== グローバル公開 =====
window.KAGAMI = KAGAMI;

console.log('🎉 KAGAMI JavaScript アプリケーション v2.0 - 読み込み完了'); 