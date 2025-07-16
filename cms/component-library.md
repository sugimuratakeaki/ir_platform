# 🧩 KAGAMI IR管理センター - コンポーネントライブラリ

## 📋 目次
1. [概要](#概要)
2. [基本コンポーネント](#基本コンポーネント)
3. [フォームコンポーネント](#フォームコンポーネント)
4. [ナビゲーションコンポーネント](#ナビゲーションコンポーネント)
5. [データ表示コンポーネント](#データ表示コンポーネント)
6. [フィードバックコンポーネント](#フィードバックコンポーネント)
7. [レイアウトコンポーネント](#レイアウトコンポーネント)
8. [使用方法](#使用方法)

---

## 🎯 概要

KAGAMI IR管理センターで使用する統一的なUIコンポーネントライブラリです。
一貫性のあるデザインと使いやすさを実現するため、各コンポーネントは共通のデザインシステムに基づいて設計されています。

**デザイン原則：**
- 🎨 **統一性** - KAGAMI Blueを基調とした一貫したデザイン
- ♿ **アクセシビリティ** - WCAG 2.1 AA準拠
- 📱 **レスポンシブ** - モバイルファーストのアプローチ
- ⚡ **パフォーマンス** - 軽量で高速な動作

---

## 🔧 基本コンポーネント

### Button（ボタン）

用途に応じて複数のスタイルを提供するボタンコンポーネント。

#### バリエーション

```html
<!-- プライマリボタン -->
<button class="btn btn--primary">
    <span class="btn__icon">📊</span>
    <span class="btn__text">データ分析</span>
</button>

<!-- セカンダリボタン -->
<button class="btn btn--secondary">キャンセル</button>

<!-- 成功ボタン -->
<button class="btn btn--success">保存</button>

<!-- 危険ボタン -->
<button class="btn btn--danger">削除</button>

<!-- サイズバリエーション -->
<button class="btn btn--primary btn--sm">小さいボタン</button>
<button class="btn btn--primary btn--lg">大きいボタン</button>

<!-- 状態 -->
<button class="btn btn--primary" disabled>無効ボタン</button>
<button class="btn btn--primary btn--loading">
    <span class="btn__spinner"></span>処理中...
</button>
```

#### CSS

```css
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-lg);
    border: none;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.5;
    cursor: pointer;
    transition: var(--transition-normal);
    text-decoration: none;
    white-space: nowrap;
}

.btn--primary {
    background: var(--kagami-blue);
    color: var(--white);
}

.btn--primary:hover {
    background: var(--kagami-blue-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.btn--sm {
    padding: var(--space-xs) var(--space-md);
    font-size: 0.75rem;
}

.btn--lg {
    padding: var(--space-md) var(--space-xl);
    font-size: 1rem;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.btn__spinner {
    width: 1em;
    height: 1em;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
```

### Card（カード）

コンテンツをグループ化して表示するカードコンポーネント。

#### 基本構造

```html
<div class="card">
    <header class="card__header">
        <h3 class="card__title">
            <span class="card__icon">📊</span>
            KPI分析
        </h3>
        <div class="card__actions">
            <button class="btn btn--sm btn--secondary">設定</button>
        </div>
    </header>
    
    <div class="card__content">
        <p class="card__description">
            最新のKPIデータと分析結果を表示します。
        </p>
        
        <div class="card__stats">
            <div class="stat">
                <span class="stat__value">1,234</span>
                <span class="stat__label">総閲覧数</span>
            </div>
        </div>
    </div>
    
    <footer class="card__footer">
        <span class="card__timestamp">最終更新: 2024-12-19 14:30</span>
    </footer>
</div>
```

#### バリエーション

```html
<!-- ホバーエフェクト付き -->
<div class="card card--hoverable">
    <!-- カード内容 -->
</div>

<!-- 強調カード -->
<div class="card card--featured">
    <!-- カード内容 -->
</div>

<!-- コンパクトカード -->
<div class="card card--compact">
    <!-- カード内容 -->
</div>
```

### Modal（モーダル）

重要な操作や詳細情報を表示するモーダルダイアログ。

#### 基本構造

```html
<div class="modal-overlay" id="sample-modal">
    <div class="modal">
        <header class="modal__header">
            <h2 class="modal__title">確認</h2>
            <button class="modal__close" aria-label="閉じる">×</button>
        </header>
        
        <div class="modal__content">
            <p>この操作を実行してもよろしいですか？</p>
        </div>
        
        <footer class="modal__footer">
            <button class="btn btn--secondary" data-modal-close>キャンセル</button>
            <button class="btn btn--danger">削除実行</button>
        </footer>
    </div>
</div>
```

#### JavaScript

```javascript
// モーダル制御クラス
class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.overlay = this.modal;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // 閉じるボタン
        const closeBtn = this.modal.querySelector('.modal__close');
        closeBtn?.addEventListener('click', () => this.close());
        
        // オーバーレイクリック
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });
        
        // ESCキー
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) this.close();
        });
    }
    
    open() {
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // フォーカス管理
        const firstFocusable = this.modal.querySelector('button, input, select, textarea');
        firstFocusable?.focus();
    }
    
    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    isOpen() {
        return this.overlay.classList.contains('active');
    }
}
```

---

## 📝 フォームコンポーネント

### Input Field（入力フィールド）

各種データ入力用のフィールドコンポーネント。

```html
<div class="form-field">
    <label class="form-field__label" for="user-name">
        ユーザー名 <span class="form-field__required">*</span>
    </label>
    <input 
        type="text" 
        id="user-name" 
        class="form-field__input" 
        placeholder="名前を入力してください"
        required
    >
    <span class="form-field__help">半角英数字で入力してください</span>
    <span class="form-field__error">この項目は必須です</span>
</div>

<!-- 状態バリエーション -->
<div class="form-field form-field--error">
    <!-- エラー状態 -->
</div>

<div class="form-field form-field--success">
    <!-- 成功状態 -->
</div>

<div class="form-field form-field--disabled">
    <!-- 無効状態 -->
</div>
```

### File Upload（ファイルアップロード）

ドラッグ&ドロップ対応のファイルアップロードコンポーネント。

```html
<div class="upload-area" data-upload-zone>
    <div class="upload-area__content">
        <div class="upload-area__icon">📁</div>
        <h3 class="upload-area__title">ファイルをアップロード</h3>
        <p class="upload-area__description">
            ファイルをドラッグ&ドロップまたはクリックして選択
        </p>
        <input type="file" class="upload-area__input" multiple accept=".pdf,.docx,.xlsx">
        <button class="btn btn--primary upload-area__button">
            ファイル選択
        </button>
    </div>
    
    <div class="upload-area__progress" style="display: none;">
        <div class="progress-bar">
            <div class="progress-bar__fill" style="width: 0%"></div>
        </div>
        <span class="upload-area__status">アップロード中...</span>
    </div>
</div>

<!-- アップロードされたファイルリスト -->
<div class="file-list">
    <div class="file-item">
        <div class="file-item__icon">📄</div>
        <div class="file-item__info">
            <span class="file-item__name">決算資料.pdf</span>
            <span class="file-item__size">2.5 MB</span>
        </div>
        <div class="file-item__status">
            <span class="status-badge status-badge--success">完了</span>
        </div>
        <button class="file-item__remove" aria-label="削除">🗑️</button>
    </div>
</div>
```

---

## 🧭 ナビゲーションコンポーネント

### Tab Navigation（タブナビゲーション）

複数のセクション間を切り替えるタブコンポーネント。

```html
<div class="tab-container">
    <nav class="tab-nav" role="tablist">
        <button class="tab-nav__item active" role="tab" data-tab="upload">
            📤 アップロード
        </button>
        <button class="tab-nav__item" role="tab" data-tab="processed">
            ✅ 処理済み
        </button>
        <button class="tab-nav__item" role="tab" data-tab="error">
            ❌ エラー
        </button>
    </nav>
    
    <div class="tab-content">
        <div class="tab-panel active" data-panel="upload">
            <!-- アップロードパネル -->
        </div>
        <div class="tab-panel" data-panel="processed">
            <!-- 処理済みパネル -->
        </div>
        <div class="tab-panel" data-panel="error">
            <!-- エラーパネル -->
        </div>
    </div>
</div>
```

### Breadcrumb（パンくずリスト）

現在位置を表示するナビゲーションコンポーネント。

```html
<nav class="breadcrumb" aria-label="パンくずリスト">
    <ol class="breadcrumb__list">
        <li class="breadcrumb__item">
            <a href="#" class="breadcrumb__link">ホーム</a>
        </li>
        <li class="breadcrumb__item">
            <a href="#" class="breadcrumb__link">データ管理</a>
        </li>
        <li class="breadcrumb__item breadcrumb__item--current">
            アップロード
        </li>
    </ol>
</nav>
```

---

## 📊 データ表示コンポーネント

### Data Table（データテーブル）

大量のデータを効率的に表示するテーブルコンポーネント。

```html
<div class="data-table-container">
    <div class="data-table__toolbar">
        <div class="data-table__search">
            <input type="search" placeholder="検索..." class="form-field__input">
        </div>
        <div class="data-table__actions">
            <button class="btn btn--secondary btn--sm">エクスポート</button>
            <button class="btn btn--primary btn--sm">新規追加</button>
        </div>
    </div>
    
    <div class="data-table__wrapper">
        <table class="data-table">
            <thead class="data-table__head">
                <tr>
                    <th class="data-table__header" data-sortable>
                        日時 <span class="sort-indicator">↕️</span>
                    </th>
                    <th class="data-table__header">ファイル名</th>
                    <th class="data-table__header">ステータス</th>
                    <th class="data-table__header">操作</th>
                </tr>
            </thead>
            <tbody class="data-table__body">
                <tr class="data-table__row">
                    <td class="data-table__cell">2024-12-19 14:30</td>
                    <td class="data-table__cell">決算資料.pdf</td>
                    <td class="data-table__cell">
                        <span class="status-badge status-badge--success">処理完了</span>
                    </td>
                    <td class="data-table__cell">
                        <button class="btn btn--sm btn--secondary">詳細</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="data-table__pagination">
        <span class="pagination__info">1-10 / 100件</span>
        <div class="pagination__controls">
            <button class="btn btn--sm btn--secondary" disabled>前へ</button>
            <button class="btn btn--sm btn--secondary">次へ</button>
        </div>
    </div>
</div>
```

### KPI Card（KPIカード）

重要指標を視覚的に表示するコンポーネント。

```html
<div class="kpi-card">
    <div class="kpi-card__header">
        <span class="kpi-card__icon">📈</span>
        <h3 class="kpi-card__title">月間アクセス数</h3>
    </div>
    
    <div class="kpi-card__value">
        <span class="kpi-card__number">12,345</span>
        <span class="kpi-card__unit">PV</span>
    </div>
    
    <div class="kpi-card__trend">
        <span class="trend trend--up">
            <span class="trend__icon">↗️</span>
            <span class="trend__value">+15.3%</span>
        </span>
        <span class="trend__period">前月比</span>
    </div>
    
    <div class="kpi-card__chart">
        <!-- 小さなチャートやスパークライン -->
        <canvas class="mini-chart" width="100" height="30"></canvas>
    </div>
</div>
```

---

## 💬 フィードバックコンポーネント

### Alert（アラート）

重要な情報やメッセージを表示するコンポーネント。

```html
<!-- 成功アラート -->
<div class="alert alert--success" role="alert">
    <span class="alert__icon">✅</span>
    <div class="alert__content">
        <strong class="alert__title">保存完了</strong>
        <p class="alert__message">データが正常に保存されました。</p>
    </div>
    <button class="alert__close" aria-label="閉じる">×</button>
</div>

<!-- エラーアラート -->
<div class="alert alert--error" role="alert">
    <span class="alert__icon">❌</span>
    <div class="alert__content">
        <strong class="alert__title">エラー発生</strong>
        <p class="alert__message">ファイルのアップロードに失敗しました。</p>
    </div>
    <button class="alert__close" aria-label="閉じる">×</button>
</div>

<!-- 警告アラート -->
<div class="alert alert--warning" role="alert">
    <span class="alert__icon">⚠️</span>
    <div class="alert__content">
        <strong class="alert__title">注意</strong>
        <p class="alert__message">ファイルサイズが大きいため、処理に時間がかかる場合があります。</p>
    </div>
</div>

<!-- 情報アラート -->
<div class="alert alert--info" role="alert">
    <span class="alert__icon">ℹ️</span>
    <div class="alert__content">
        <strong class="alert__title">お知らせ</strong>
        <p class="alert__message">システムメンテナンスを12/25 2:00-4:00に実施します。</p>
    </div>
</div>
```

### Status Badge（ステータスバッジ）

項目の状態を視覚的に表示するバッジコンポーネント。

```html
<span class="status-badge status-badge--success">処理完了</span>
<span class="status-badge status-badge--warning">処理中</span>
<span class="status-badge status-badge--error">エラー</span>
<span class="status-badge status-badge--info">待機中</span>
<span class="status-badge status-badge--neutral">未処理</span>
```

### Toast Notification（トースト通知）

一時的な通知メッセージを表示するコンポーネント。

```html
<div class="toast-container">
    <div class="toast toast--success">
        <span class="toast__icon">✅</span>
        <span class="toast__message">保存が完了しました</span>
        <button class="toast__close">×</button>
    </div>
</div>
```

---

## 📐 レイアウトコンポーネント

### Grid System（グリッドシステム）

レスポンシブなレイアウトを構築するグリッドシステム。

```html
<div class="grid">
    <div class="grid__col grid__col--12 grid__col--md-6 grid__col--lg-4">
        <!-- 列1 -->
    </div>
    <div class="grid__col grid__col--12 grid__col--md-6 grid__col--lg-4">
        <!-- 列2 -->
    </div>
    <div class="grid__col grid__col--12 grid__col--md-12 grid__col--lg-4">
        <!-- 列3 -->
    </div>
</div>

<!-- ギャップ指定 -->
<div class="grid grid--gap-lg">
    <!-- グリッド項目 -->
</div>
```

### Sidebar Layout（サイドバーレイアウト）

サイドバー付きの基本レイアウト。

```html
<div class="layout-sidebar">
    <aside class="layout-sidebar__nav">
        <!-- サイドバーナビゲーション -->
    </aside>
    
    <main class="layout-sidebar__content">
        <header class="layout-sidebar__header">
            <!-- ページヘッダー -->
        </header>
        
        <div class="layout-sidebar__main">
            <!-- メインコンテンツ -->
        </div>
    </main>
</div>
```

---

## 🛠️ 使用方法

### 1. 基本セットアップ

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KAGAMI IR管理センター</title>
    
    <!-- 共通スタイル -->
    <link rel="stylesheet" href="styles.css">
    
    <!-- Noto Sans JP フォント -->
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- アプリケーション -->
    
    <!-- 共通JavaScript -->
    <script src="app.js"></script>
</body>
</html>
```

### 2. コンポーネントの初期化

```javascript
// DOM読み込み完了後にコンポーネントを初期化
document.addEventListener('DOMContentLoaded', function() {
    // モーダル初期化
    const modal = new Modal('sample-modal');
    
    // ファイルアップロード初期化
    initializeFileUpload();
    
    // データテーブル初期化
    initializeDataTable();
    
    // トースト通知初期化
    initializeToastNotifications();
});
```

### 3. テーマカスタマイズ

```css
/* カスタムテーマ変数 */
:root {
    --kagami-blue-custom: #2b4c7e;
    --success-color-custom: #22c55e;
}

/* カスタムコンポーネント */
.btn--custom {
    background: var(--kagami-blue-custom);
    color: var(--white);
}
```

### 4. アクセシビリティ

各コンポーネントは以下のアクセシビリティ機能を含んでいます：

- **キーボードナビゲーション** - Tab, Enter, Escapeキーサポート
- **スクリーンリーダー対応** - 適切なARIA属性とロール
- **カラーコントラスト** - WCAG AA基準準拠
- **フォーカス管理** - 明確なフォーカス表示

---

## 🔧 開発者向けガイド

### カスタムコンポーネント作成

```javascript
// 新しいコンポーネントのテンプレート
class CustomComponent {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            // デフォルトオプション
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupAccessibility();
    }
    
    setupElements() {
        // DOM要素の取得と設定
    }
    
    setupEventListeners() {
        // イベントリスナーの設定
    }
    
    setupAccessibility() {
        // アクセシビリティ属性の設定
    }
    
    destroy() {
        // クリーンアップ処理
    }
}
```

### パフォーマンス最適化

```css
/* GPU加速の活用 */
.card {
    transform: translateZ(0);
    will-change: transform;
}

/* 効率的なアニメーション */
.btn {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* クリティカルCSSの最適化 */
.above-fold {
    /* 初期表示に必要なスタイル */
}
```

---

**📚 関連ドキュメント**
- [コーディングガイドライン](coding-guidelines.md)
- [デザインシステム](design-system.md)
- [API リファレンス](api-reference.md)

**🚀 更新履歴**
- v1.0.0 (2024-12-19): 初回リリース

---

*© 2024 KAGAMI Development Team* 