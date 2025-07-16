# 🔮 KAGAMI IR管理センター

**AI技術を活用したIR業務支援システム**

---

## 📋 プロジェクト概要

KAGAMI IR管理センターは、投資家向け広報（IR）業務を効率化するAI搭載のWebアプリケーションです。
ファイル処理、FAQ管理、対話システム、分析機能を統合した包括的なIR管理プラットフォームを提供します。

### 🎯 主要機能

- **📥 データ取込・処理** - 音声/動画、Web会議、メール、文書の自動処理
- **🤖 AI-FAQ管理** - AI自動生成によるFAQ作成と承認ワークフロー
- **💬 対話管理** - ステークホルダーとのコミュニケーション履歴管理
- **📊 分析・レポート** - KPI分析と投資家行動インサイト
- **⚙️ システム設定** - ユーザー管理と組織設定

### 🎨 デザインシステム

- **ブランドカラー:** KAGAMI Blue (#1a365d)
- **デザイン原則:** 統一性、アクセシビリティ、レスポンシブ設計
- **UI/UX:** モダンで直感的なインターフェース

---

## 🚀 クイックスタート

### 1. 環境セットアップ

```bash
# プロジェクトディレクトリに移動
cd cms/

# 開発サーバー起動（例：Python）
python -m http.server 8000

# または Node.js の場合
npx serve .
```

### 2. ブラウザでアクセス

```
http://localhost:8000
```

### 3. 最初に確認すべきファイル

1. **index.html** - メインダッシュボード
2. **styles.css** - 共通スタイルシート
3. **app.js** - 共通JavaScript

---

## 📚 ドキュメント

### 📖 開発者向けドキュメント

| ドキュメント | 説明 | 対象者 |
|--------------|------|--------|
| **[📋 コーディングガイドライン](coding-guidelines.md)** | CSS・JavaScript規約、命名規則、品質基準 | 全開発者 |
| **[🧩 コンポーネントライブラリ](component-library.md)** | UIコンポーネントの使用方法とサンプル | フロントエンド開発者 |
| **[📚 API リファレンス](api-reference.md)** | JavaScript関数、ユーティリティ、イベントシステム | JavaScript開発者 |

### 🎯 どのドキュメントから読むべきか

#### 🆕 新規開発者の場合
1. **コーディングガイドライン** - プロジェクトの基本ルールを理解
2. **コンポーネントライブラリ** - UIコンポーネントの使い方を学習
3. **API リファレンス** - JavaScript関数の詳細を確認

#### 🔨 既存機能の修正
1. **コンポーネントライブラリ** - 使用中のコンポーネントを確認
2. **API リファレンス** - 関連する関数やイベントを調査

#### 🆕 新機能の追加
1. **コーディングガイドライン** - 規約に沿った実装を確認
2. **コンポーネントライブラリ** - 再利用可能なコンポーネントを活用
3. **API リファレンス** - 必要なユーティリティ関数を確認

---

## 🏗️ ファイル構成

```
cms/
├── 📄 index.html                    # メインダッシュボード
├── 🎨 styles.css                   # 共通スタイルシート
├── ⚡ app.js                       # 共通JavaScript
│
├── 📥 データ取込機能
│   ├── data-input.html
│   ├── data-input.css
│   └── data-input.js
│
├── 🤖 AI-FAQ管理機能
│   ├── ai-faq.html
│   ├── ai-faq.css
│   └── ai-faq.js
│
└── 📚 ドキュメント
    ├── README.md                   # このファイル
    ├── coding-guidelines.md        # コーディング規約
    ├── component-library.md        # コンポーネントライブラリ
    └── api-reference.md           # API リファレンス
```

---

## 🛠️ 技術スタック

### フロントエンド
- **HTML5** - セマンティックマークアップ
- **CSS3** - CSS変数、Flexbox、Grid
- **JavaScript ES6+** - モダンJavaScript記法
- **Web APIs** - File API, Drag&Drop API, Local Storage

### 設計パターン
- **CSS変数システム** - スケーラブルなデザインシステム
- **BEMライク命名** - コンポーネント指向のCSS
- **イベント駆動アーキテクチャ** - 疎結合なJavaScript設計
- **プログレッシブエンハンスメント** - 段階的機能向上

### 開発ツール
- **モダンブラウザ** - Chrome, Firefox, Safari, Edge
- **開発サーバー** - Python http.server, Node.js serve
- **デバッグ** - ブラウザ開発者ツール

---

## 🎨 デザインシステム

### カラーパレット

```css
:root {
    /* プライマリカラー */
    --kagami-blue: #1a365d;
    --kagami-blue-light: #2d3748;
    --kagami-blue-dark: #0f1b2c;
    
    /* フィードバックカラー */
    --trust-green: #48bb78;
    --alert-red: #f56565;
    --warning-orange: #ed8936;
    --info-blue: #4299e1;
    
    /* グレースケール */
    --gray-50: #f7fafc;
    --gray-100: #edf2f7;
    --gray-500: #718096;
    --gray-800: #1a202c;
}
```

### スペーシングシステム

```css
:root {
    --space-xs: 0.25rem;   /* 4px */
    --space-sm: 0.5rem;    /* 8px */
    --space-md: 1rem;      /* 16px */
    --space-lg: 1.5rem;    /* 24px */
    --space-xl: 2rem;      /* 32px */
    --space-2xl: 3rem;     /* 48px */
    --space-3xl: 4rem;     /* 64px */
}
```

### タイポグラフィ

- **フォント:** Noto Sans JP
- **ウェイト:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **行間:** 1.6 (本文), 1.2 (見出し)

---

## 🧩 主要コンポーネント

### ボタン
```html
<button class="btn btn--primary">プライマリボタン</button>
<button class="btn btn--secondary">セカンダリボタン</button>
```

### カード
```html
<div class="card">
    <header class="card__header">
        <h3 class="card__title">カードタイトル</h3>
    </header>
    <div class="card__content">
        <!-- カード内容 -->
    </div>
</div>
```

### モーダル
```html
<div class="modal-overlay" id="sample-modal">
    <div class="modal">
        <!-- モーダル内容 -->
    </div>
</div>
```

---

## ⚡ JavaScript API

### 基本的な使用方法

```javascript
// システム初期化
await KAGAMI.init();

// ファイルアップロード
const result = await KAGAMI.file.upload(files);

// 通知表示
KAGAMI.notify.toast('成功しました', 'success');

// モーダル表示
KAGAMI.ui.modal.show('confirm-modal');
```

### イベントシステム

```javascript
// イベント購読
KAGAMI.events.on('file:uploaded', (data) => {
    console.log('ファイルアップロード完了:', data);
});

// イベント発火
KAGAMI.events.emit('custom:event', { data: 'value' });
```

---

## 📊 実装済み機能

### Phase 1 - 基盤システム ✅
- **メインダッシュボード** (289行, 14KB)
- **共通スタイルシート** (752行, 16KB)
- **共通JavaScript** (651行, 20KB)

### Phase 2 - コア機能 ✅

#### データ取込・処理システム
- **HTML** (737行, 39KB) - マルチセクション入力インターフェース
- **CSS** (1,222行, 22KB) - 専用スタイリング
- **JavaScript** (1,039行, 34KB) - ファイル処理・Web会議連携

#### AI-FAQ管理システム
- **HTML** (864行, 49KB) - AI生成・編集・承認機能
- **CSS** (1,281行, 25KB) - 複雑なワークフロー対応スタイル
- **JavaScript** (1,101行, 36KB) - AI連携・リアルタイム編集

### 📈 開発進捗
- **総ファイル数:** 9ファイル
- **総コード量:** 8,976行 (約275KB)
- **カバー率:** 54機能中22機能実装 (約40%)

---

## 🔧 開発環境セットアップ

### 必要な環境
- **ブラウザ:** Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **開発サーバー:** Python 3.x または Node.js 14+
- **エディタ:** VS Code（推奨）、Sublime Text、Atom等

### VS Code 推奨拡張機能
- **HTML CSS Support** - HTML/CSS自動補完
- **JavaScript (ES6) code snippets** - ES6スニペット
- **Live Server** - ライブリロード開発サーバー
- **Prettier** - コードフォーマッター
- **ES6 String HTML** - HTMLテンプレートハイライト

### 開発サーバー起動方法

```bash
# Python (推奨)
python -m http.server 8000

# Node.js
npx serve . -p 8000

# VS Code Live Server拡張を使用
# index.htmlを右クリック → "Open with Live Server"
```

---

## 🧪 テストとデバッグ

### デバッグモード有効化

```javascript
// デバッグモードで初期化
KAGAMI.init({
    debug: true
});

// デバッグ情報出力
KAGAMI.debug.log('カスタムログ');
```

### ブラウザ開発者ツール活用

1. **Console** - ログとエラーの確認
2. **Elements** - DOM構造とスタイルの検証
3. **Network** - API通信の監視
4. **Application** - ローカルストレージの確認

### パフォーマンス最適化

```javascript
// パフォーマンス測定
KAGAMI.debug.time('process_start');
// 処理実行
KAGAMI.debug.timeEnd('process_start');
```

---

## 🚀 デプロイ

### 本番環境準備

1. **ファイル最適化**
   ```bash
   # CSS/JS minify (必要に応じて)
   ```

2. **設定確認**
   ```javascript
   // 本番環境設定
   KAGAMI.init({
       debug: false,
       apiBaseUrl: 'https://api.kagami.jp'
   });
   ```

3. **静的ファイル配信**
   - Apache, Nginx, CloudFront等での配信

---

## 🤝 コントリビューション

### 開発フロー

1. **[コーディングガイドライン](coding-guidelines.md)** の確認
2. **機能の設計・実装**
3. **[コンポーネントライブラリ](component-library.md)** の更新
4. **[API リファレンス](api-reference.md)** の更新（必要に応じて）

### コードレビューポイント

- [ ] コーディング規約の遵守
- [ ] アクセシビリティ要件の確認
- [ ] レスポンシブデザインの確認
- [ ] パフォーマンスの最適化
- [ ] セキュリティ要件の確認

---

## 📞 サポート

### 問い合わせ先
- **開発チーム:** dev@kagami.jp
- **システム管理:** admin@kagami.jp

### ドキュメント更新履歴
- **v1.0.0** (2024-12-19): 初回ドキュメント作成

---

## 📄 ライセンス

© 2024 KAGAMI Development Team. All rights reserved.

---

**🎯 次のステップ**

1. **[コーディングガイドライン](coding-guidelines.md)** でプロジェクトの基本ルールを確認
2. **[コンポーネントライブラリ](component-library.md)** で利用可能なUIコンポーネントを学習
3. **[API リファレンス](api-reference.md)** でJavaScript関数の詳細を把握
4. 実際の開発作業を開始

**Happy Coding! 🔮** 