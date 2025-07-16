# 🔮 KAGAMI IR管理センター - コーディングガイドライン v2.0

## 📋 目次
1. [プロジェクト概要](#プロジェクト概要)
2. [CSS規約](#css規約)
3. [JavaScript規約](#javascript規約)
4. [共通パーツ](#共通パーツ)
5. [コンポーネント規約](#コンポーネント規約)
6. [ファイル構成規約](#ファイル構成規約)
7. [命名規則](#命名規則)
8. [コメント規約](#コメント規約)
9. [🚀 高度な設計パターン](#高度な設計パターン)
10. [⚡ パフォーマンス最適化](#パフォーマンス最適化)
11. [🔒 セキュリティ要件](#セキュリティ要件)
12. [🧪 テスト戦略](#テスト戦略)
13. [📊 ログ・監視戦略](#ログ監視戦略)
14. [🛠️ 開発ツール連携](#開発ツール連携)
15. [🔄 リファクタリング指針](#リファクタリング指針)
16. [📈 保守性メトリクス](#保守性メトリクス)

---

## 🎯 プロジェクト概要

KAGAMI IR管理センターは、AI技術を活用したIR業務支援システムです。
統一感のある高品質なユーザーインターフェースを提供するため、以下のガイドラインに従って開発を行います。

**ブランドカラー：** KAGAMI Blue (#1a365d)  
**デザインシステム：** CSS変数ベースのスケーラブルシステム  
**対応ブラウザ：** モダンブラウザ（Chrome, Firefox, Safari, Edge）

---

## 🎨 CSS規約

### 基本原則
- **CSS変数を活用** したデザインシステムの統一
- **BEMライクな命名規則** でコンポーネントの独立性を保つ
- **レスポンシブファースト** でモバイル対応を重視
- **アクセシビリティ** を考慮した実装

### CSS変数システム

```css
:root {
    /* カラーパレット */
    --kagami-blue: #1a365d;
    --kagami-blue-light: #2d3748;
    --kagami-blue-dark: #0f1b2c;
    --trust-green: #48bb78;
    --alert-red: #f56565;
    --warning-orange: #ed8936;
    --info-blue: #4299e1;
    
    /* スペーシングシステム */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --space-2xl: 3rem;
    --space-3xl: 4rem;
    
    /* アニメーション */
    --transition-fast: 0.15s ease-in-out;
    --transition-normal: 0.3s ease-in-out;
    --transition-slow: 0.5s ease-in-out;
}
```

### クラス命名規則

```css
/* ✅ 推奨 - BEMライクな命名 */
.header-navigation {}
.section-btn {}
.data-input-nav {}
.upload-area--active {}
.progress-bar__fill {}

/* ❌ 非推奨 */
.redButton {}
.leftSidebar {}
.content1 {}
```

### ファイル構造

```css
/* セクションコメントで整理 */
/* ===== リセット・基本設定 ===== */
/* ===== ヘッダー ===== */
/* ===== ナビゲーション ===== */
/* ===== コンテンツエリア ===== */
/* ===== フッター ===== */
/* ===== レスポンシブ対応 ===== */
```

---

## ⚡ JavaScript規約

### 基本原則
- **ES6+** の記法を活用
- **関数型プログラミング** のアプローチを重視
- **グローバル汚染を避ける** ための適切なスコープ管理
- **一貫性のある命名規則** でコードの可読性を向上

### 命名規則

```javascript
// ✅ 推奨 - camelCase
const userName = '田中太郎';
const getCurrentUser = () => {};
const isUserLoggedIn = false;

// ✅ 推奨 - 定数は UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.kagami.jp';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ✅ 推奨 - クラスは PascalCase
class DataProcessor {}
class FileUploadManager {}
```

### グローバル状態管理

```javascript
// 統一されたグローバル状態オブジェクト
const kagamiState = {
    currentSection: 'dashboard',
    user: {
        name: '田中 IR担当者',
        role: 'ir_manager',
        permissions: ['read', 'write', 'approve']
    },
    notifications: [],
    systemHealth: {}
};
```

### 関数の書き方

```javascript
// ✅ 推奨 - 関数宣言
function initializeApp() {
    console.log('🔮 KAGAMI IR管理センター - 起動中...');
    // 処理内容
}

// ✅ 推奨 - アロー関数（短い処理）
const saveState = () => {
    localStorage.setItem('kagami_state', JSON.stringify(kagamiState));
};

// ✅ 推奨 - async/await
async function fetchDashboardData() {
    try {
        const response = await fetch('/api/dashboard');
        return await response.json();
    } catch (error) {
        console.error('データ取得エラー:', error);
        throw error;
    }
}
```

### エラーハンドリング

```javascript
// ✅ 推奨 - try-catch文
try {
    const result = await processData(data);
    showSuccessMessage('処理が完了しました');
} catch (error) {
    console.error('処理エラー:', error);
    showErrorMessage('処理に失敗しました: ' + error.message);
}
```

---

## 🧩 共通パーツ

### ボタンコンポーネント

```css
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-sm) var(--space-lg);
    border: none;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition-normal);
    text-decoration: none;
}

.btn--primary {
    background: var(--kagami-blue);
    color: var(--white);
}

.btn--secondary {
    background: var(--gray-200);
    color: var(--gray-700);
}

.btn--success {
    background: var(--trust-green);
    color: var(--white);
}

.btn--danger {
    background: var(--alert-red);
    color: var(--white);
}
```

### カードコンポーネント

```css
.card {
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    padding: var(--space-lg);
    transition: var(--transition-normal);
}

.card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
}

.card__header {
    margin-bottom: var(--space-md);
    padding-bottom: var(--space-md);
    border-bottom: 1px solid var(--gray-200);
}

.card__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--kagami-blue);
    margin: 0;
}
```

### モーダルコンポーネント

```css
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: var(--transition-normal);
}

.modal-overlay.active {
    opacity: 1;
    visibility: visible;
}

.modal {
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
    transform: scale(0.9);
    transition: var(--transition-normal);
}

.modal-overlay.active .modal {
    transform: scale(1);
}
```

---

## 🔧 コンポーネント規約

### コンポーネントの構造

各コンポーネントは以下の構造で実装する：

```
component-name/
├── component-name.html    # HTML構造
├── component-name.css     # スタイル定義
├── component-name.js      # JavaScript機能
└── README.md             # 使用方法とサンプル
```

### HTML構造規約

```html
<!-- ✅ 推奨 - セマンティックなHTML -->
<section class="data-input-section" role="region" aria-labelledby="section-title">
    <header class="section-header">
        <h2 id="section-title" class="section-title">データ取込</h2>
        <p class="section-description">ファイルをアップロードして処理を開始します</p>
    </header>
    
    <div class="section-content">
        <!-- コンテンツ -->
    </div>
</section>
```

### CSS組織化

```css
/* component-name.css */

/* ===== コンポーネント基本スタイル ===== */
.component-name {
    /* 基本スタイル */
}

/* ===== バリエーション ===== */
.component-name--large {}
.component-name--compact {}

/* ===== 状態 ===== */
.component-name.active {}
.component-name.disabled {}

/* ===== 子要素 ===== */
.component-name__header {}
.component-name__content {}
.component-name__footer {}

/* ===== レスポンシブ対応 ===== */
@media (max-width: 768px) {
    .component-name {
        /* モバイル対応 */
    }
}
```

### JavaScript組織化

```javascript
// component-name.js

// ===== コンポーネント初期化 =====
function initializeComponentName() {
    console.log('📦 ComponentName - 初期化中...');
    
    setupEventListeners();
    loadInitialData();
    
    console.log('✅ ComponentName - 初期化完了');
}

// ===== イベントリスナー設定 =====
function setupEventListeners() {
    // イベントリスナーの設定
}

// ===== データ管理 =====
function loadInitialData() {
    // 初期データの読み込み
}

// ===== パブリックAPI =====
const ComponentName = {
    initialize: initializeComponentName,
    destroy: destroyComponent,
    updateData: updateComponentData
};
```

---

## 📁 ファイル構成規約

### プロジェクト構造

```
cms/
├── index.html              # メインダッシュボード
├── styles.css              # 共通スタイル
├── app.js                 # 共通JavaScript
├── 
├── components/            # 再利用可能コンポーネント
│   ├── button/
│   ├── modal/
│   └── card/
├── 
├── pages/                 # 各機能ページ
│   ├── data-input.*       # データ取込機能
│   ├── ai-faq.*          # AI-FAQ管理
│   ├── dialogue.*        # 対話管理
│   └── analytics.*       # 分析機能
├── 
├── assets/               # 静的ファイル
│   ├── images/
│   ├── icons/
│   └── fonts/
└── 
└── docs/                 # ドキュメント
    ├── coding-guidelines.md
    ├── component-library.md
    └── api-reference.md
```

### ファイル命名規則

```
✅ 推奨
- kebab-case: data-input.html, ai-faq.css
- 機能を表す明確な名前: user-management.js
- コンポーネント名前: modal-dialog.css

❌ 非推奨
- camelCase: dataInput.html
- 略語: ui.js, util.css
- 数字のみ: page1.html
```

---

## 🏷️ 命名規則

### CSS クラス名

| 種類 | 規則 | 例 |
|------|------|-----|
| コンポーネント | kebab-case | `.data-input-nav` |
| 修飾子 | `--modifier` | `.btn--primary` |
| 子要素 | `__element` | `.card__header` |
| 状態 | `.state` | `.active`, `.disabled` |

### JavaScript

| 種類 | 規則 | 例 |
|------|------|-----|
| 変数・関数 | camelCase | `userName`, `getData()` |
| 定数 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| クラス | PascalCase | `DataProcessor` |
| プライベート | `_prefix` | `_processData()` |

### HTML

| 種類 | 規則 | 例 |
|------|------|-----|
| ID | kebab-case | `#user-profile` |
| data属性 | kebab-case | `data-section="user"` |
| ARIA | kebab-case | `aria-labelledby` |

---

## 💬 コメント規約

### CSS コメント

```css
/* ===== セクション分割 ===== */
/* 大きなセクションの区切り */

/* ----- サブセクション ----- */
/* 中程度のグループ分け */

/* 単一プロパティの説明 */
.class {
    /* 特別な理由がある場合のみ */
    transform: translateZ(0); /* GPU加速を有効化 */
}
```

### JavaScript コメント

```javascript
// ===== セクション分割 =====
// 機能の大きなブロック

// ----- サブ機能 -----
// 関連する関数群

/**
 * 関数の詳細説明（複雑な処理の場合）
 * @param {string} data - 処理対象のデータ
 * @param {Object} options - オプション設定
 * @returns {Promise} 処理結果
 */
async function processData(data, options) {
    // 実装
}

// 絵文字を使った状況報告（KAGAMI形式）
console.log('🔮 KAGAMI IR管理センター - 起動中...');
console.log('✅ 処理完了');
console.log('⚠️ 警告メッセージ');
console.log('❌ エラー発生');
```

### HTML コメント

```html
<!-- ===== ヘッダーセクション ===== -->
<!-- 大きなセクションの開始 -->

<!-- TODO: 将来的な機能追加 -->
<!-- FIXME: 既知の問題 -->
<!-- NOTE: 重要な注意事項 -->
```

---

## 🔍 品質チェック項目

### CSS チェックリスト
- [ ] CSS変数を適切に使用している
- [ ] レスポンシブデザインに対応している
- [ ] アクセシビリティ要件を満たしている
- [ ] ブラウザ間の互換性を考慮している
- [ ] 適切な命名規則を使用している

### JavaScript チェックリスト
- [ ] ES6+の記法を活用している
- [ ] エラーハンドリングが適切に実装されている
- [ ] メモリリークの原因となるコードがない
- [ ] パフォーマンスを考慮した実装になっている
- [ ] コードの可読性が確保されている

### 全般チェックリスト
- [ ] 適切なコメントが記載されている
- [ ] ファイル構成が規約に従っている
- [ ] セキュリティ要件を満たしている
- [ ] テスタビリティが確保されている

---

## 🚀 高度な設計パターン

### アーキテクチャ原則

#### モジュラー設計

```javascript
// ✅ 推奨 - モジュール境界が明確
const FileUploadModule = {
    // プライベート状態
    _state: {
        uploadQueue: new Map(),
        activeUploads: new Set(),
        maxConcurrent: 3
    },
    
    // パブリックAPI
    public: {
        upload: function(files, options) {
            return FileUploadModule._processUpload(files, options);
        },
        
        cancel: function(uploadId) {
            return FileUploadModule._cancelUpload(uploadId);
        },
        
        getStatus: function(uploadId) {
            return FileUploadModule._state.uploadQueue.get(uploadId);
        }
    },
    
    // プライベートメソッド
    _processUpload: function(files, options) {
        // 実装
    },
    
    _cancelUpload: function(uploadId) {
        // 実装
    }
};

// モジュール公開
window.KAGAMI.modules.FileUpload = FileUploadModule.public;
```

#### 依存性注入パターン

```javascript
// ✅ 推奨 - 依存性を外部から注入
class DataProcessor {
    constructor(dependencies = {}) {
        this.api = dependencies.api || KAGAMI.api;
        this.logger = dependencies.logger || KAGAMI.logger;
        this.validator = dependencies.validator || KAGAMI.validator;
        this.eventBus = dependencies.eventBus || KAGAMI.events;
    }
    
    async processFile(file) {
        try {
            this.logger.info('ファイル処理開始', { filename: file.name });
            
            // バリデーション
            const validationResult = await this.validator.validateFile(file);
            if (!validationResult.isValid) {
                throw new Error(`バリデーションエラー: ${validationResult.errors.join(', ')}`);
            }
            
            // API呼び出し
            const result = await this.api.post('/process', { file });
            
            // イベント発火
            this.eventBus.emit('file:processed', { file, result });
            
            this.logger.info('ファイル処理完了', { filename: file.name, resultId: result.id });
            return result;
            
        } catch (error) {
            this.logger.error('ファイル処理エラー', { filename: file.name, error: error.message });
            this.eventBus.emit('file:error', { file, error });
            throw error;
        }
    }
}
```

#### ストラテジーパターン

```javascript
// ✅ 推奨 - 処理方法を動的に変更可能
const ProcessingStrategies = {
    'pdf': {
        validate: (file) => file.type === 'application/pdf',
        process: async (file) => {
            // PDF専用処理
            return await KAGAMI.api.post('/process/pdf', { file });
        },
        preview: (file) => {
            // PDFプレビュー生成
            return KAGAMI.ui.generatePdfPreview(file);
        }
    },
    
    'excel': {
        validate: (file) => file.type.includes('spreadsheet'),
        process: async (file) => {
            // Excel専用処理
            return await KAGAMI.api.post('/process/excel', { file });
        },
        preview: (file) => {
            // Excelプレビュー生成
            return KAGAMI.ui.generateExcelPreview(file);
        }
    },
    
    'default': {
        validate: () => true,
        process: async (file) => {
            // 汎用処理
            return await KAGAMI.api.post('/process/generic', { file });
        },
        preview: (file) => {
            // 汎用プレビュー
            return KAGAMI.ui.generateGenericPreview(file);
        }
    }
};

class FileProcessor {
    process(file) {
        const strategy = this.getStrategy(file);
        return strategy.process(file);
    }
    
    getStrategy(file) {
        for (const [type, strategy] of Object.entries(ProcessingStrategies)) {
            if (strategy.validate(file)) {
                return strategy;
            }
        }
        return ProcessingStrategies.default;
    }
}
```

#### 観察者パターンの高度化

```javascript
// ✅ 推奨 - 型安全なイベントシステム
class TypedEventBus {
    constructor() {
        this.listeners = new Map();
        this.middleware = [];
    }
    
    // ミドルウェア追加
    use(middleware) {
        this.middleware.push(middleware);
    }
    
    // イベント購読
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
        
        // 削除用関数を返す
        return () => this.off(eventType, wrappedListener);
    }
    
    // イベント発火
    async emit(eventType, data) {
        // ミドルウェア実行
        for (const middleware of this.middleware) {
            await middleware(eventType, data);
        }
        
        const listeners = this.listeners.get(eventType);
        if (!listeners) return;
        
        // 優先度順でソート
        const sortedListeners = Array.from(listeners)
            .sort((a, b) => b.priority - a.priority);
        
        for (const listener of sortedListeners) {
            try {
                await listener.fn(data);
                
                // once リスナーは削除
                if (listener.once) {
                    listeners.delete(listener);
                }
            } catch (error) {
                console.error(`イベントリスナーエラー [${eventType}]:`, error);
            }
        }
    }
    
    // 名前空間単位での削除
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

// 使用例
const eventBus = new TypedEventBus();

// ログミドルウェア
eventBus.use(async (eventType, data) => {
    console.log(`Event: ${eventType}`, data);
});

// 高優先度リスナー
eventBus.on('file:uploaded', handleCriticalFileUpload, { priority: 100 });

// 一回限りのリスナー
eventBus.on('user:login', handleFirstLogin, { once: true });

// 名前空間付きリスナー
eventBus.on('data:updated', handleDataUpdate, { namespace: 'dashboard' });
```

### 状態管理パターン

#### 中央集権型状態管理

```javascript
// ✅ 推奨 - Redux風の状態管理
class StateManager {
    constructor() {
        this.state = this.getInitialState();
        this.listeners = new Set();
        this.middleware = [];
        this.devMode = KAGAMI.config.debug;
    }
    
    getInitialState() {
        return {
            user: {
                isAuthenticated: false,
                profile: null,
                permissions: []
            },
            files: {
                uploadQueue: [],
                processing: [],
                completed: [],
                errors: []
            },
            ui: {
                activeModal: null,
                loading: false,
                notifications: []
            },
            system: {
                health: 'unknown',
                lastSync: null,
                version: '1.0.0'
            }
        };
    }
    
    // アクション実行
    dispatch(action) {
        if (this.devMode) {
            console.group(`🔄 Action: ${action.type}`);
            console.log('Previous State:', this.state);
            console.log('Action:', action);
        }
        
        // ミドルウェア実行
        let nextAction = action;
        for (const middleware of this.middleware) {
            nextAction = middleware(nextAction, this.state);
        }
        
        // リデューサー実行
        const newState = this.reduce(this.state, nextAction);
        
        if (this.devMode) {
            console.log('New State:', newState);
            console.groupEnd();
        }
        
        // 状態変更検知
        if (newState !== this.state) {
            const oldState = this.state;
            this.state = newState;
            this.notifyListeners(oldState, newState, action);
        }
    }
    
    // リデューサー
    reduce(state, action) {
        switch (action.type) {
            case 'USER_LOGIN':
                return {
                    ...state,
                    user: {
                        ...state.user,
                        isAuthenticated: true,
                        profile: action.payload.user
                    }
                };
                
            case 'FILE_UPLOAD_START':
                return {
                    ...state,
                    files: {
                        ...state.files,
                        uploadQueue: [...state.files.uploadQueue, action.payload.file]
                    }
                };
                
            case 'FILE_UPLOAD_COMPLETE':
                return {
                    ...state,
                    files: {
                        ...state.files,
                        uploadQueue: state.files.uploadQueue.filter(f => f.id !== action.payload.fileId),
                        completed: [...state.files.completed, action.payload.result]
                    }
                };
                
            default:
                return state;
        }
    }
    
    // 状態監視
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    
    // セレクター
    select(selector) {
        return selector(this.state);
    }
    
    // 非同期アクション対応
    async dispatchAsync(asyncAction) {
        if (typeof asyncAction === 'function') {
            return await asyncAction(this.dispatch.bind(this), this.select.bind(this));
        }
        return this.dispatch(asyncAction);
    }
}

// セレクター定義
const Selectors = {
    getUser: (state) => state.user,
    getUploadQueue: (state) => state.files.uploadQueue,
    getActiveModal: (state) => state.ui.activeModal,
    getSystemHealth: (state) => state.system.health
};

// アクションクリエイター
const Actions = {
    userLogin: (user) => ({
        type: 'USER_LOGIN',
        payload: { user }
    }),
    
    fileUploadStart: (file) => ({
        type: 'FILE_UPLOAD_START',
        payload: { file }
    }),
    
    // 非同期アクション
    uploadFileAsync: (file) => async (dispatch, select) => {
        dispatch(Actions.fileUploadStart(file));
        
        try {
            const result = await KAGAMI.api.upload(file);
            dispatch({
                type: 'FILE_UPLOAD_COMPLETE',
                payload: { fileId: file.id, result }
            });
        } catch (error) {
            dispatch({
                type: 'FILE_UPLOAD_ERROR',
                payload: { fileId: file.id, error }
            });
        }
    }
};
```

---

## ⚡ パフォーマンス最適化

### レンダリング最適化

#### 仮想化テクニック

```javascript
// ✅ 推奨 - 大量データの効率的な表示
class VirtualizedList {
    constructor(container, options = {}) {
        this.container = container;
        this.itemHeight = options.itemHeight || 50;
        this.buffer = options.buffer || 5;
        this.items = [];
        this.visibleItems = new Map();
        this.scrollTop = 0;
        
        this.setupScrollListener();
    }
    
    setItems(items) {
        this.items = items;
        this.updateVirtualization();
    }
    
    setupScrollListener() {
        let ticking = false;
        
        this.container.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    handleScroll() {
        this.scrollTop = this.container.scrollTop;
        this.updateVirtualization();
    }
    
    updateVirtualization() {
        const containerHeight = this.container.clientHeight;
        const startIndex = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - this.buffer);
        const endIndex = Math.min(
            this.items.length - 1,
            Math.ceil((this.scrollTop + containerHeight) / this.itemHeight) + this.buffer
        );
        
        // 不要な要素を削除
        for (const [index, element] of this.visibleItems) {
            if (index < startIndex || index > endIndex) {
                element.remove();
                this.visibleItems.delete(index);
            }
        }
        
        // 必要な要素を追加
        for (let i = startIndex; i <= endIndex; i++) {
            if (!this.visibleItems.has(i) && this.items[i]) {
                const element = this.createItemElement(this.items[i], i);
                this.visibleItems.set(i, element);
                this.container.appendChild(element);
            }
        }
        
        // 総高さ設定
        this.container.style.height = `${this.items.length * this.itemHeight}px`;
    }
    
    createItemElement(item, index) {
        const element = document.createElement('div');
        element.className = 'virtual-list-item';
        element.style.position = 'absolute';
        element.style.top = `${index * this.itemHeight}px`;
        element.style.height = `${this.itemHeight}px`;
        element.innerHTML = this.renderItem(item);
        return element;
    }
    
    renderItem(item) {
        // サブクラスでオーバーライド
        return `<div>${item.name}</div>`;
    }
}
```

#### メモ化とキャッシュ

```javascript
// ✅ 推奨 - 計算結果のメモ化
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
                // LRU更新
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
        // サイズ制限チェック
        if (this.cache.size >= this.maxSize) {
            const oldest = this.accessOrder.values().next().value;
            this.cache.delete(oldest);
            this.accessOrder.delete(oldest);
        }
        
        this.cache.set(key, value);
        this.accessOrder.add(key);
    }
    
    clear() {
        this.cache.clear();
        this.accessOrder.clear();
    }
}

// 使用例
const memoCache = new MemoizationCache(50);

const expensiveCalculation = memoCache.memoize((data) => {
    // 重い計算処理
    return data.reduce((sum, item) => sum + item.value, 0);
});

// DOM操作のメモ化
const memoizedFormatDate = memoCache.memoize(
    (date, format) => KAGAMI.utils.formatDate(date, format),
    (date, format) => `${date.getTime()}_${format}`
);
```

#### バッチ処理とデバウンス

```javascript
// ✅ 推奨 - 効率的な更新バッチ処理
class BatchProcessor {
    constructor(options = {}) {
        this.batchSize = options.batchSize || 50;
        this.delay = options.delay || 16; // 1フレーム
        this.queue = [];
        this.processing = false;
        this.scheduler = options.scheduler || requestAnimationFrame;
    }
    
    add(operation) {
        this.queue.push(operation);
        this.scheduleProcessing();
    }
    
    scheduleProcessing() {
        if (!this.processing) {
            this.processing = true;
            this.scheduler(() => this.processBatch());
        }
    }
    
    processBatch() {
        const batch = this.queue.splice(0, this.batchSize);
        
        for (const operation of batch) {
            try {
                operation();
            } catch (error) {
                console.error('バッチ処理エラー:', error);
            }
        }
        
        if (this.queue.length > 0) {
            this.scheduler(() => this.processBatch());
        } else {
            this.processing = false;
        }
    }
}

// デバウンス・スロットル
class EventThrottler {
    static debounce(fn, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    }
    
    static throttle(fn, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                fn.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    static rafThrottle(fn) {
        let scheduled = false;
        return function(...args) {
            if (!scheduled) {
                scheduled = true;
                requestAnimationFrame(() => {
                    fn.apply(this, args);
                    scheduled = false;
                });
            }
        };
    }
}

// 使用例
const batchProcessor = new BatchProcessor();
const debouncedSearch = EventThrottler.debounce(performSearch, 300);
const throttledScroll = EventThrottler.rafThrottle(handleScroll);
```

### メモリ管理

#### リークを防ぐパターン

```javascript
// ✅ 推奨 - 適切なクリーンアップ
class ComponentLifecycle {
    constructor() {
        this.subscriptions = new Set();
        this.timeouts = new Set();
        this.intervals = new Set();
        this.abortControllers = new Set();
        this.observers = new Set();
    }
    
    // イベントリスナー管理
    addEventListener(element, event, handler, options) {
        element.addEventListener(event, handler, options);
        
        const cleanup = () => element.removeEventListener(event, handler, options);
        this.subscriptions.add(cleanup);
        return cleanup;
    }
    
    // タイマー管理
    setTimeout(callback, delay) {
        const id = setTimeout(callback, delay);
        this.timeouts.add(id);
        return id;
    }
    
    setInterval(callback, delay) {
        const id = setInterval(callback, delay);
        this.intervals.add(id);
        return id;
    }
    
    // AbortController管理
    createAbortController() {
        const controller = new AbortController();
        this.abortControllers.add(controller);
        return controller;
    }
    
    // Observer管理
    observe(target, observer) {
        observer.observe(target);
        this.observers.add({ observer, target });
    }
    
    // 一括クリーンアップ
    destroy() {
        // イベントリスナー削除
        for (const cleanup of this.subscriptions) {
            cleanup();
        }
        this.subscriptions.clear();
        
        // タイマー削除
        for (const id of this.timeouts) {
            clearTimeout(id);
        }
        this.timeouts.clear();
        
        for (const id of this.intervals) {
            clearInterval(id);
        }
        this.intervals.clear();
        
        // リクエスト中断
        for (const controller of this.abortControllers) {
            controller.abort();
        }
        this.abortControllers.clear();
        
        // Observer停止
        for (const { observer, target } of this.observers) {
            observer.unobserve(target);
        }
        this.observers.clear();
    }
}

// WeakMap/WeakSetの活用
class WeakReferenceManager {
    constructor() {
        this.elementData = new WeakMap();
        this.eventHandlers = new WeakMap();
    }
    
    setElementData(element, data) {
        this.elementData.set(element, data);
    }
    
    getElementData(element) {
        return this.elementData.get(element);
    }
    
    bindEventHandler(element, handler) {
        this.eventHandlers.set(element, handler);
        element.addEventListener('click', handler);
    }
    
    // 要素が削除されると自動的にWeakMapからも削除される
}
```

---

## 🔒 セキュリティ要件

### 入力値検証とサニタイゼーション

```javascript
// ✅ 推奨 - 堅牢な入力値検証
class SecurityValidator {
    static patterns = {
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        phone: /^[0-9-+().\s]+$/,
        alphanumeric: /^[a-zA-Z0-9]+$/,
        filename: /^[a-zA-Z0-9._-]+$/,
        url: /^https?:\/\/[^\s$.?#].[^\s]*$/i
    };
    
    static validateInput(value, type, options = {}) {
        if (typeof value !== 'string') {
            throw new Error('入力値は文字列である必要があります');
        }
        
        // 長さチェック
        if (options.minLength && value.length < options.minLength) {
            throw new Error(`入力値は${options.minLength}文字以上である必要があります`);
        }
        
        if (options.maxLength && value.length > options.maxLength) {
            throw new Error(`入力値は${options.maxLength}文字以下である必要があります`);
        }
        
        // パターンチェック
        if (this.patterns[type] && !this.patterns[type].test(value)) {
            throw new Error(`入力値が${type}の形式に合いません`);
        }
        
        // カスタムバリデーション
        if (options.customValidator) {
            const result = options.customValidator(value);
            if (!result.isValid) {
                throw new Error(result.message);
            }
        }
        
        return true;
    }
    
    static sanitizeHtml(html) {
        const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'];
        const allowedAttributes = {
            'a': ['href', 'title'],
            'img': ['src', 'alt', 'width', 'height']
        };
        
        // 簡易HTMLサニタイザー（本番では専用ライブラリ使用推奨）
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        const sanitize = (element) => {
            for (let i = element.children.length - 1; i >= 0; i--) {
                const child = element.children[i];
                
                if (!allowedTags.includes(child.tagName.toLowerCase())) {
                    child.remove();
                    continue;
                }
                
                // 属性チェック
                const allowedAttrs = allowedAttributes[child.tagName.toLowerCase()] || [];
                for (let j = child.attributes.length - 1; j >= 0; j--) {
                    const attr = child.attributes[j];
                    if (!allowedAttrs.includes(attr.name)) {
                        child.removeAttribute(attr.name);
                    }
                }
                
                sanitize(child);
            }
        };
        
        sanitize(tempDiv);
        return tempDiv.innerHTML;
    }
    
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    static validateFileUpload(file, options = {}) {
        const allowedTypes = options.allowedTypes || ['.pdf', '.docx', '.xlsx'];
        const maxSize = options.maxSize || 50 * 1024 * 1024; // 50MB
        
        // ファイルタイプチェック
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(fileExtension)) {
            throw new Error(`許可されていないファイル形式です: ${fileExtension}`);
        }
        
        // ファイルサイズチェック
        if (file.size > maxSize) {
            throw new Error(`ファイルサイズが上限を超えています: ${file.size} > ${maxSize}`);
        }
        
        // MIMEタイプチェック
        const allowedMimeTypes = {
            '.pdf': 'application/pdf',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
        
        const expectedMimeType = allowedMimeTypes[fileExtension];
        if (expectedMimeType && file.type !== expectedMimeType) {
            throw new Error(`ファイルの内容と拡張子が一致しません`);
        }
        
        return true;
    }
}
```

### CSP (Content Security Policy) 対応

```javascript
// ✅ 推奨 - CSP準拠のコード
class SecureScriptLoader {
    static loadScript(src, options = {}) {
        return new Promise((resolve, reject) => {
            // nonce属性の取得
            const metaTag = document.querySelector('meta[name="csp-nonce"]');
            const nonce = metaTag ? metaTag.content : null;
            
            const script = document.createElement('script');
            script.src = src;
            script.async = options.async !== false;
            script.defer = options.defer || false;
            
            if (nonce) {
                script.setAttribute('nonce', nonce);
            }
            
            script.onload = resolve;
            script.onerror = reject;
            
            document.head.appendChild(script);
        });
    }
    
    static executeSecureCode(code, context = {}) {
        // eval使用を避けてFunction constructorを使用
        try {
            const func = new Function(...Object.keys(context), code);
            return func(...Object.values(context));
        } catch (error) {
            console.error('セキュアコード実行エラー:', error);
            throw error;
        }
    }
}

// ✅ 推奨 - XSS対策
class XSSProtection {
    static createSecureElement(tagName, properties = {}) {
        const element = document.createElement(tagName);
        
        for (const [key, value] of Object.entries(properties)) {
            if (key === 'innerHTML' || key === 'outerHTML') {
                // HTMLは常にサニタイズ
                element.innerHTML = SecurityValidator.sanitizeHtml(value);
            } else if (key === 'textContent') {
                // テキストは安全
                element.textContent = value;
            } else if (key.startsWith('on')) {
                // イベントハンドラーは関数のみ許可
                if (typeof value === 'function') {
                    element[key] = value;
                }
            } else {
                // その他の属性は文字列として設定
                element.setAttribute(key, String(value));
            }
        }
        
        return element;
    }
    
    static setSecureAttribute(element, name, value) {
        // 危険な属性のチェック
        const dangerousAttributes = ['src', 'href', 'action', 'formaction'];
        
        if (dangerousAttributes.includes(name)) {
            // URLの検証
            if (name === 'href' || name === 'src') {
                if (!this.isSecureUrl(value)) {
                    console.warn(`危険なURL: ${value}`);
                    return false;
                }
            }
        }
        
        element.setAttribute(name, value);
        return true;
    }
    
    static isSecureUrl(url) {
        try {
            const parsed = new URL(url, window.location.origin);
            // HTTPSまたは相対URLのみ許可
            return parsed.protocol === 'https:' || 
                   parsed.protocol === 'http:' && window.location.protocol === 'http:' ||
                   !parsed.protocol; // 相対URL
        } catch {
            return false;
        }
    }
}
```

---

## 🧪 テスト戦略

### ユニットテスト

```javascript
// ✅ 推奨 - テスタブルなコード設計
class TestableFileProcessor {
    constructor(dependencies = {}) {
        this.api = dependencies.api || KAGAMI.api;
        this.validator = dependencies.validator || SecurityValidator;
        this.logger = dependencies.logger || console;
    }
    
    async processFile(file) {
        // バリデーション
        this.validator.validateFileUpload(file);
        
        // 処理
        const result = await this.api.post('/process', { file });
        
        // ログ
        this.logger.info('ファイル処理完了', { filename: file.name });
        
        return result;
    }
}

// テストコード例
function testFileProcessor() {
    // モックオブジェクト
    const mockApi = {
        post: jest.fn().mockResolvedValue({ id: 123, status: 'completed' })
    };
    
    const mockValidator = {
        validateFileUpload: jest.fn()
    };
    
    const mockLogger = {
        info: jest.fn()
    };
    
    const processor = new TestableFileProcessor({
        api: mockApi,
        validator: mockValidator,
        logger: mockLogger
    });
    
    const testFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    // テスト実行
    return processor.processFile(testFile).then(result => {
        // アサーション
        expect(mockValidator.validateFileUpload).toHaveBeenCalledWith(testFile);
        expect(mockApi.post).toHaveBeenCalledWith('/process', { file: testFile });
        expect(mockLogger.info).toHaveBeenCalled();
        expect(result.id).toBe(123);
    });
}
```

### E2Eテスト自動化対応

```javascript
// ✅ 推奨 - テスト自動化を考慮したマークアップ
class TestAutomationHelper {
    static addTestIds(container) {
        // 本番環境では何もしない
        if (!KAGAMI.config.debug) return;
        
        // 重要な要素にtest-id属性を自動付与
        const importantElements = container.querySelectorAll(`
            button,
            input[type="file"],
            .upload-area,
            .modal,
            .alert,
            [role="tab"],
            [role="button"]
        `);
        
        importantElements.forEach((element, index) => {
            if (!element.getAttribute('data-test-id')) {
                const testId = this.generateTestId(element, index);
                element.setAttribute('data-test-id', testId);
            }
        });
    }
    
    static generateTestId(element, index) {
        const className = element.className.split(' ')[0] || element.tagName.toLowerCase();
        const context = this.getContext(element);
        return `${context}-${className}-${index}`;
    }
    
    static getContext(element) {
        const section = element.closest('[data-section]');
        return section ? section.getAttribute('data-section') : 'global';
    }
    
    // ページ状態のエクスポート
    static exportPageState() {
        return {
            url: window.location.href,
            title: document.title,
            forms: this.getFormStates(),
            modals: this.getModalStates(),
            notifications: this.getNotificationStates()
        };
    }
    
    static getFormStates() {
        const forms = document.querySelectorAll('form');
        return Array.from(forms).map(form => ({
            id: form.id,
            action: form.action,
            method: form.method,
            fields: this.getFieldStates(form)
        }));
    }
    
    static getFieldStates(form) {
        const fields = form.querySelectorAll('input, select, textarea');
        return Array.from(fields).map(field => ({
            name: field.name,
            type: field.type,
            value: field.value,
            checked: field.checked,
            disabled: field.disabled
        }));
    }
}

// テスト用ヘルパー関数
window.KAGAMI_TEST = {
    // 要素の可視性チェック
    isVisible: (selector) => {
        const element = document.querySelector(selector);
        return element && element.offsetParent !== null;
    },
    
    // ファイルアップロードのシミュレーション
    simulateFileUpload: (selector, fileData) => {
        const input = document.querySelector(selector);
        const file = new File([fileData.content], fileData.name, { type: fileData.type });
        
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        
        input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    
    // 非同期処理の完了待機
    waitForAsyncOperation: (timeout = 5000) => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const check = () => {
                if (KAGAMI.state.ui.loading === false) {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('タイムアウト'));
                } else {
                    setTimeout(check, 100);
                }
            };
            
            check();
        });
    }
};
```

---

## 📊 ログ・監視戦略

### 構造化ログ

```javascript
// ✅ 推奨 - 構造化ログシステム
class StructuredLogger {
    constructor(options = {}) {
        this.level = options.level || 'info';
        this.context = options.context || {};
        this.outputs = options.outputs || [console];
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
            userId: this.getUserId(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            stack: level === 'error' ? new Error().stack : undefined
        };
        
        this.buffer.push(logEntry);
        this.maintainBuffer();
        
        // 出力
        for (const output of this.outputs) {
            this.outputLog(output, logEntry);
        }
        
        // 重要ログの即座送信
        if (level === 'error' || level === 'warn') {
            this.flushToServer([logEntry]);
        }
    }
    
    error(message, data) { this.log('error', message, data); }
    warn(message, data) { this.log('warn', message, data); }
    info(message, data) { this.log('info', message, data); }
    debug(message, data) { this.log('debug', message, data); }
    trace(message, data) { this.log('trace', message, data); }
    
    // パフォーマンス測定
    time(label) {
        const startTime = performance.now();
        return {
            end: () => {
                const duration = performance.now() - startTime;
                this.info(`Performance: ${label}`, { 
                    duration: Math.round(duration * 100) / 100,
                    label: label
                });
                return duration;
            }
        };
    }
    
    // ユーザーアクション追跡
    trackUserAction(action, target, data = {}) {
        this.info('User Action', {
            action: action,
            target: target,
            targetId: target.id,
            targetClass: target.className,
            ...data
        });
    }
    
    // エラー境界
    wrapFunction(fn, name) {
        return (...args) => {
            try {
                const result = fn.apply(this, args);
                
                // Promise エラーもキャッチ
                if (result && typeof result.catch === 'function') {
                    return result.catch(error => {
                        this.error(`非同期エラー in ${name}`, { 
                            error: error.message, 
                            args: args 
                        });
                        throw error;
                    });
                }
                
                return result;
            } catch (error) {
                this.error(`エラー in ${name}`, { 
                    error: error.message, 
                    args: args 
                });
                throw error;
            }
        };
    }
    
    // バッファ管理
    maintainBuffer() {
        if (this.buffer.length > this.maxBufferSize) {
            const excess = this.buffer.length - this.maxBufferSize;
            this.buffer.splice(0, excess);
        }
    }
    
    // サーバーへの送信
    async flushToServer(logs = null) {
        const logsToSend = logs || [...this.buffer];
        if (logsToSend.length === 0) return;
        
        try {
            await fetch('/api/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ logs: logsToSend })
            });
            
            // 送信成功したらバッファからクリア
            if (!logs) {
                this.buffer.length = 0;
            }
        } catch (error) {
            console.error('ログ送信エラー:', error);
        }
    }
    
    getSessionId() {
        return sessionStorage.getItem('kagami_session_id') || 'unknown';
    }
    
    getUserId() {
        return KAGAMI.state?.user?.id || 'anonymous';
    }
    
    outputLog(output, logEntry) {
        const method = output[logEntry.level] || output.log;
        method.call(output, `[${logEntry.level.toUpperCase()}]`, logEntry.message, logEntry.data);
    }
}

// グローバルロガー設定
KAGAMI.logger = new StructuredLogger({
    level: KAGAMI.config.debug ? 'debug' : 'info',
    context: {
        component: 'kagami-ir',
        version: '1.0.0'
    }
});

// 未処理エラーキャッチ
window.addEventListener('error', (event) => {
    KAGAMI.logger.error('未処理エラー', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
    });
});

window.addEventListener('unhandledrejection', (event) => {
    KAGAMI.logger.error('未処理Promise拒否', {
        reason: event.reason,
        stack: event.reason?.stack
    });
});
```

### リアルタイム監視

```javascript
// ✅ 推奨 - パフォーマンス監視
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = new Map();
        this.setupObservers();
    }
    
    setupObservers() {
        // パフォーマンス観測
        if ('PerformanceObserver' in window) {
            this.setupPerformanceObserver();
        }
        
        // メモリ使用量監視
        this.startMemoryMonitoring();
        
        // ネットワーク監視
        this.startNetworkMonitoring();
    }
    
    setupPerformanceObserver() {
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
        this.observers.set('performance', observer);
    }
    
    startMemoryMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.recordMetric('memory', {
                    used: memory.usedJSHeapSize,
                    total: memory.totalJSHeapSize,
                    limit: memory.jsHeapSizeLimit,
                    usage: memory.usedJSHeapSize / memory.jsHeapSizeLimit
                });
            }, 30000); // 30秒間隔
        }
    }
    
    startNetworkMonitoring() {
        const originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            const startTime = performance.now();
            const url = args[0];
            
            try {
                const response = await originalFetch(...args);
                const endTime = performance.now();
                
                this.recordMetric('network', {
                    url: url,
                    method: args[1]?.method || 'GET',
                    status: response.status,
                    duration: endTime - startTime,
                    size: response.headers.get('content-length')
                });
                
                return response;
            } catch (error) {
                const endTime = performance.now();
                
                this.recordMetric('network_error', {
                    url: url,
                    method: args[1]?.method || 'GET',
                    duration: endTime - startTime,
                    error: error.message
                });
                
                throw error;
            }
        };
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
        
        // バッファサイズ制限
        if (metrics.length > 100) {
            metrics.shift();
        }
        
        // アラート閾値チェック
        this.checkAlerts(type, data);
    }
    
    checkAlerts(type, data) {
        const alerts = {
            memory: (data) => data.usage > 0.9,
            network: (data) => data.duration > 5000, // 5秒以上
            performance: (data) => data.duration > 1000 // 1秒以上
        };
        
        if (alerts[type] && alerts[type](data)) {
            KAGAMI.logger.warn(`パフォーマンスアラート: ${type}`, data);
            
            // 通知システムと連携
            KAGAMI.notify.toast(`パフォーマンス警告: ${type}`, 'warning');
        }
    }
    
    getReport() {
        const report = {};
        
        for (const [type, metrics] of this.metrics) {
            const recent = metrics.slice(-10); // 最新10件
            report[type] = {
                count: metrics.length,
                recent: recent,
                average: this.calculateAverage(recent, 'duration'),
                max: this.calculateMax(recent, 'duration'),
                min: this.calculateMin(recent, 'duration')
            };
        }
        
        return report;
    }
    
    calculateAverage(metrics, key) {
        const values = metrics.map(m => m[key]).filter(v => typeof v === 'number');
        return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    }
    
    calculateMax(metrics, key) {
        const values = metrics.map(m => m[key]).filter(v => typeof v === 'number');
        return values.length ? Math.max(...values) : 0;
    }
    
    calculateMin(metrics, key) {
        const values = metrics.map(m => m[key]).filter(v => typeof v === 'number');
        return values.length ? Math.min(...values) : 0;
    }
}
```

---

## 🛠️ 開発ツール連携

### 自動フォーマット設定

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 4,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

```json
// .eslintrc.json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "indent": ["error", 4],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-template": "error",
    "prefer-arrow-callback": "error"
  },
  "globals": {
    "KAGAMI": "readonly"
  }
}
```

### 自動化ツール設定

```javascript
// build-tools/code-quality-checker.js
class CodeQualityChecker {
    static async checkFile(filePath) {
        const issues = [];
        const content = await this.readFile(filePath);
        
        // 複雑度チェック
        issues.push(...this.checkComplexity(content));
        
        // 命名規則チェック
        issues.push(...this.checkNamingConventions(content));
        
        // セキュリティチェック
        issues.push(...this.checkSecurity(content));
        
        // パフォーマンスチェック
        issues.push(...this.checkPerformance(content));
        
        return issues;
    }
    
    static checkComplexity(content) {
        const issues = [];
        const lines = content.split('\n');
        
        // 関数の長さチェック
        let functionStart = -1;
        let braceCount = 0;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.includes('function') || line.includes('=>')) {
                functionStart = i;
                braceCount = 0;
            }
            
            braceCount += (line.match(/\{/g) || []).length;
            braceCount -= (line.match(/\}/g) || []).length;
            
            if (functionStart >= 0 && braceCount === 0) {
                const functionLength = i - functionStart;
                if (functionLength > 50) {
                    issues.push({
                        type: 'complexity',
                        message: '関数が長すぎます（50行超過）',
                        line: functionStart + 1,
                        severity: 'warning'
                    });
                }
                functionStart = -1;
            }
        }
        
        return issues;
    }
    
    static checkNamingConventions(content) {
        const issues = [];
        
        // camelCase変数チェック
        const variableRegex = /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
        let match;
        
        while ((match = variableRegex.exec(content)) !== null) {
            const variableName = match[1];
            
            if (!/^[a-z][a-zA-Z0-9]*$/.test(variableName) && !/^[A-Z_][A-Z0-9_]*$/.test(variableName)) {
                issues.push({
                    type: 'naming',
                    message: `変数名がcamelCaseまたはUPPER_SNAKE_CASEに従っていません: ${variableName}`,
                    severity: 'error'
                });
            }
        }
        
        return issues;
    }
    
    static checkSecurity(content) {
        const issues = [];
        const securityPatterns = [
            { pattern: /eval\(/, message: 'eval()の使用は避けてください' },
            { pattern: /innerHTML\s*=/, message: 'innerHTML使用時はサニタイゼーションを確認してください' },
            { pattern: /document\.write/, message: 'document.write()の使用は避けてください' },
            { pattern: /window\.location\.href\s*=/, message: 'URLリダイレクト時は検証を行ってください' }
        ];
        
        for (const { pattern, message } of securityPatterns) {
            if (pattern.test(content)) {
                issues.push({
                    type: 'security',
                    message: message,
                    severity: 'warning'
                });
            }
        }
        
        return issues;
    }
    
    static checkPerformance(content) {
        const issues = [];
        const performancePatterns = [
            { pattern: /document\.querySelectorAll.*forEach/, message: 'NodeListの反復処理は配列に変換してから行ってください' },
            { pattern: /setInterval\(.*,\s*[1-9]\d{0,2}\)/, message: '短い間隔のsetIntervalはパフォーマンスに影響します' },
            { pattern: /\.innerHTML\s*\+=/, message: 'innerHTML+=は効率が悪いです。DocumentFragmentを使用してください' }
        ];
        
        for (const { pattern, message } of performancePatterns) {
            if (pattern.test(content)) {
                issues.push({
                    type: 'performance',
                    message: message,
                    severity: 'warning'
                });
            }
        }
        
        return issues;
    }
}
```

---

## 🔄 リファクタリング指針

### 段階的リファクタリング

```javascript
// ✅ 推奨 - 段階的な改善アプローチ
class RefactoringStrategy {
    static createLegacyWrapper(oldFunction, newFunction, options = {}) {
        const deprecationWarning = options.deprecationWarning || true;
        const removeInVersion = options.removeInVersion;
        
        return function(...args) {
            if (deprecationWarning && KAGAMI.config.debug) {
                console.warn(`⚠️ 非推奨関数の使用: ${oldFunction.name}`, {
                    replacement: newFunction.name,
                    removeInVersion: removeInVersion,
                    stack: new Error().stack
                });
            }
            
            // 使用量を追跡
            KAGAMI.logger?.info('Legacy Function Usage', {
                function: oldFunction.name,
                replacement: newFunction.name
            });
            
            return newFunction.apply(this, args);
        };
    }
    
    static migrateApiUsage(oldApi, newApi, migrationMap) {
        const wrapper = {};
        
        for (const [oldMethod, newMethod] of Object.entries(migrationMap)) {
            wrapper[oldMethod] = function(...args) {
                console.warn(`⚠️ API移行: ${oldMethod} → ${newMethod}`);
                return newApi[newMethod].apply(newApi, args);
            };
        }
        
        return wrapper;
    }
    
    static createFeatureFlag(featureName, defaultValue = false) {
        return {
            isEnabled: () => {
                const storage = localStorage.getItem(`kagami_feature_${featureName}`);
                if (storage !== null) {
                    return JSON.parse(storage);
                }
                return KAGAMI.config.features?.[featureName] ?? defaultValue;
            },
            
            enable: () => {
                localStorage.setItem(`kagami_feature_${featureName}`, 'true');
            },
            
            disable: () => {
                localStorage.setItem(`kagami_feature_${featureName}`, 'false');
            }
        };
    }
}

// 使用例
const newFileUpload = new FileUploadModule();
const oldFileUpload = RefactoringStrategy.createLegacyWrapper(
    function uploadFile() { /* 旧実装 */ },
    newFileUpload.upload.bind(newFileUpload),
    { removeInVersion: '2.0.0' }
);

// フィーチャーフラグの使用
const useNewDashboard = RefactoringStrategy.createFeatureFlag('new_dashboard', false);

if (useNewDashboard.isEnabled()) {
    // 新しいダッシュボード
    loadNewDashboard();
} else {
    // 従来のダッシュボード
    loadLegacyDashboard();
}
```

### 依存関係管理

```javascript
// ✅ 推奨 - 依存関係の可視化と管理
class DependencyManager {
    constructor() {
        this.dependencies = new Map();
        this.circular = new Set();
    }
    
    register(moduleName, dependencies = []) {
        this.dependencies.set(moduleName, dependencies);
        this.detectCircularDependencies();
    }
    
    detectCircularDependencies() {
        const visited = new Set();
        const recursionStack = new Set();
        
        const dfs = (module) => {
            if (recursionStack.has(module)) {
                this.circular.add(module);
                return true;
            }
            
            if (visited.has(module)) {
                return false;
            }
            
            visited.add(module);
            recursionStack.add(module);
            
            const deps = this.dependencies.get(module) || [];
            for (const dep of deps) {
                if (dfs(dep)) {
                    return true;
                }
            }
            
            recursionStack.delete(module);
            return false;
        };
        
        for (const module of this.dependencies.keys()) {
            if (!visited.has(module)) {
                dfs(module);
            }
        }
        
        if (this.circular.size > 0) {
            console.error('循環依存を検出:', Array.from(this.circular));
        }
    }
    
    getLoadOrder() {
        const sorted = [];
        const visited = new Set();
        
        const visit = (module) => {
            if (visited.has(module)) return;
            
            visited.add(module);
            const deps = this.dependencies.get(module) || [];
            
            for (const dep of deps) {
                visit(dep);
            }
            
            sorted.push(module);
        };
        
        for (const module of this.dependencies.keys()) {
            visit(module);
        }
        
        return sorted;
    }
}
```

---

## 📈 保守性メトリクス

### コード品質測定

```javascript
// ✅ 推奨 - 保守性の定量的測定
class MaintenabilityMetrics {
    static analyzeFile(content, filePath) {
        const metrics = {
            file: filePath,
            lines: this.countLines(content),
            functions: this.countFunctions(content),
            complexity: this.calculateComplexity(content),
            duplications: this.detectDuplications(content),
            dependencies: this.analyzeDependencies(content),
            testCoverage: this.estimateTestCoverage(content),
            documentation: this.analyzeDocumentation(content)
        };
        
        metrics.maintainabilityIndex = this.calculateMaintainabilityIndex(metrics);
        return metrics;
    }
    
    static countLines(content) {
        const lines = content.split('\n');
        return {
            total: lines.length,
            code: lines.filter(line => line.trim() && !line.trim().startsWith('//')).length,
            comments: lines.filter(line => line.trim().startsWith('//')).length,
            blank: lines.filter(line => !line.trim()).length
        };
    }
    
    static calculateComplexity(content) {
        // サイクロマティック複雑度の計算
        const complexityKeywords = [
            'if', 'else', 'for', 'while', 'do', 'switch', 'case',
            'catch', 'finally', '&&', '||', '?'
        ];
        
        let complexity = 1; // 基本複雑度
        
        for (const keyword of complexityKeywords) {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            const matches = content.match(regex);
            if (matches) {
                complexity += matches.length;
            }
        }
        
        return complexity;
    }
    
    static detectDuplications(content) {
        const lines = content.split('\n');
        const duplications = [];
        const lineMap = new Map();
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.length < 5) continue; // 短い行は除外
            
            if (lineMap.has(line)) {
                lineMap.get(line).push(i + 1);
            } else {
                lineMap.set(line, [i + 1]);
            }
        }
        
        for (const [line, lineNumbers] of lineMap) {
            if (lineNumbers.length > 1) {
                duplications.push({
                    content: line,
                    lines: lineNumbers,
                    count: lineNumbers.length
                });
            }
        }
        
        return duplications;
    }
    
    static analyzeDependencies(content) {
        const imports = [];
        const exports = [];
        
        // import文の解析
        const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            imports.push(match[1]);
        }
        
        // require文の解析
        const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
        while ((match = requireRegex.exec(content)) !== null) {
            imports.push(match[1]);
        }
        
        // export文の解析
        const exportRegex = /export\s+(?:default\s+)?(\w+)/g;
        while ((match = exportRegex.exec(content)) !== null) {
            exports.push(match[1]);
        }
        
        return {
            imports: imports,
            exports: exports,
            fanIn: imports.length,
            fanOut: exports.length
        };
    }
    
    static estimateTestCoverage(content) {
        // テストファイルかどうかの判定
        const isTestFile = /\.(test|spec)\.js$/.test(content) || 
                          content.includes('describe(') || 
                          content.includes('it(') ||
                          content.includes('test(');
        
        if (isTestFile) {
            return 100; // テストファイル自体
        }
        
        // 関数の数とテストの推定
        const functionCount = this.countFunctions(content).total;
        const testableComplexity = this.calculateComplexity(content);
        
        // 簡易的な推定（実際にはテストファイルを解析する必要がある）
        return Math.max(0, 100 - (testableComplexity - functionCount) * 10);
    }
    
    static countFunctions(content) {
        const functionRegex = /function\s+\w+|=>\s*{|class\s+\w+/g;
        const matches = content.match(functionRegex) || [];
        
        return {
            total: matches.length,
            average_length: this.calculateAverageFunctionLength(content)
        };
    }
    
    static calculateAverageFunctionLength(content) {
        const lines = content.split('\n');
        const functionStarts = [];
        const functionLengths = [];
        
        for (let i = 0; i < lines.length; i++) {
            if (/function\s+\w+|=>\s*{|class\s+\w+/.test(lines[i])) {
                functionStarts.push(i);
            }
        }
        
        for (let i = 0; i < functionStarts.length; i++) {
            const start = functionStarts[i];
            const end = functionStarts[i + 1] || lines.length;
            functionLengths.push(end - start);
        }
        
        return functionLengths.length > 0 ? 
               functionLengths.reduce((a, b) => a + b, 0) / functionLengths.length : 0;
    }
    
    static analyzeDocumentation(content) {
        const lines = content.split('\n');
        const docLines = lines.filter(line => 
            line.trim().startsWith('/**') || 
            line.trim().startsWith('*') || 
            line.trim().startsWith('///')
        ).length;
        
        const codeLines = lines.filter(line => 
            line.trim() && !line.trim().startsWith('//')
        ).length;
        
        return {
            documentation_ratio: codeLines > 0 ? docLines / codeLines : 0,
            has_jsdoc: content.includes('/**'),
            has_comments: content.includes('//')
        };
    }
    
    static calculateMaintainabilityIndex(metrics) {
        // Microsoft式 Maintainability Index の簡易版
        const complexity = metrics.complexity;
        const linesOfCode = metrics.lines.code;
        const halsteadVolume = Math.log2(linesOfCode) * 10; // 簡易計算
        
        let index = 171 - 5.2 * Math.log(halsteadVolume) - 0.23 * complexity - 16.2 * Math.log(linesOfCode);
        
        // 補正要素
        if (metrics.testCoverage > 80) index += 10;
        if (metrics.documentation.documentation_ratio > 0.2) index += 5;
        if (metrics.duplications.length === 0) index += 5;
        
        return Math.max(0, Math.min(100, index));
    }
    
    static generateReport(metrics) {
        const report = {
            summary: {
                total_files: metrics.length,
                average_maintainability: metrics.reduce((sum, m) => sum + m.maintainabilityIndex, 0) / metrics.length,
                high_complexity_files: metrics.filter(m => m.complexity > 10).length,
                low_test_coverage_files: metrics.filter(m => m.testCoverage < 70).length
            },
            recommendations: []
        };
        
        // 推奨事項の生成
        for (const metric of metrics) {
            if (metric.complexity > 15) {
                report.recommendations.push({
                    file: metric.file,
                    type: 'complexity',
                    message: '関数の複雑度が高すぎます。リファクタリングを検討してください。',
                    priority: 'high'
                });
            }
            
            if (metric.functions.average_length > 30) {
                report.recommendations.push({
                    file: metric.file,
                    type: 'function_length',
                    message: '関数の長さが長すぎます。分割を検討してください。',
                    priority: 'medium'
                });
            }
            
            if (metric.duplications.length > 5) {
                report.recommendations.push({
                    file: metric.file,
                    type: 'duplication',
                    message: 'コードの重複が多く検出されました。共通化を検討してください。',
                    priority: 'medium'
                });
            }
        }
        
        return report;
    }
}

// 使用例
const projectMetrics = [];
const files = ['app.js', 'data-input.js', 'ai-faq.js']; // 実際にはファイル一覧を取得

for (const file of files) {
    const content = await fetch(file).then(r => r.text());
    const metrics = MaintenabilityMetrics.analyzeFile(content, file);
    projectMetrics.push(metrics);
}

const report = MaintenabilityMetrics.generateReport(projectMetrics);
console.log('🔍 保守性レポート:', report);
```

---

**📚 関連ドキュメント**
- [コンポーネントライブラリ](component-library.md)
- [API リファレンス](api-reference.md)
- [デザインシステム](design-system.md)

**📞 お問い合わせ**  
KAGAMI開発チーム: dev@kagami.jp

---

**🚀 v2.0 新機能**
- 高度な設計パターン（モジュラー設計、依存性注入、観察者パターン）
- パフォーマンス最適化（仮想化、メモ化、バッチ処理）
- セキュリティ強化（入力値検証、XSS対策、CSP対応）
- テスト戦略（ユニットテスト、E2E自動化対応）
- 構造化ログとリアルタイム監視
- 開発ツール連携（ESLint、Prettier、品質チェッカー）
- リファクタリング指針（段階的改善、依存関係管理）
- 保守性メトリクス（定量的品質測定、改善提案）

*最終更新: 2024年12月19日 v2.0* 