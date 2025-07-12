# KAGAMI IR Platform - CSS設計ガイド

## 📋 **概要**

KAGAMI IR PlatformのCSS設計は、Tailwind CSSを基盤としたモジュラー設計を採用しています。保守性、拡張性、一貫性を重視した設計により、開発効率とユーザー体験の向上を実現しています。

## 🏗️ **CSS構造**

```
backend/css/
├── tailwind.css          # メインCSSファイル（Tailwind + カスタムコンポーネント）
└── README.md            # このファイル
```

## 🎨 **設計原則**

### 1. **Tailwind CSSファースト**
- Tailwind CSSのユーティリティクラスを優先使用
- カスタムCSSは必要最小限に抑制
- 一貫性のあるデザインシステムの構築

### 2. **コンポーネントベース設計**
- 再利用可能なUIコンポーネントの定義
- 統一されたデザインパターンの適用
- 保守性の高いモジュラー構造

### 3. **レスポンシブデザイン**
- モバイルファーストのアプローチ
- ブレークポイントに基づく適応的レイアウト
- 一貫したユーザー体験の提供

## 🧩 **カスタムコンポーネント**

### **カードコンポーネント**
```css
.card              # 基本カード
.card-header       # カードヘッダー
.card-body         # カード本文
.card-footer       # カードフッター
```

### **メトリクスカード**
```css
.metric-card       # メトリクス表示用カード
.metric-label      # メトリクスラベル
.metric-value      # メトリクス値
.metric-change     # メトリクス変化
```

### **ボタンコンポーネント**
```css
.btn               # 基本ボタン
.btn-primary       # プライマリボタン
.btn-secondary     # セカンダリボタン
.btn-success       # 成功ボタン
.btn-danger        # 危険ボタン
.btn-sm            # 小サイズ
.btn-lg            # 大サイズ
```

### **バッジコンポーネント**
```css
.badge             # 基本バッジ
.badge-primary     # プライマリバッジ
.badge-success     # 成功バッジ
.badge-warning     # 警告バッジ
.badge-danger      # 危険バッジ
.status-badge      # ステータスバッジ
.alert-badge       # アラートバッジ
```

### **フォームコンポーネント**
```css
.form-group        # フォームグループ
.form-label        # フォームラベル
.form-control      # フォームコントロール
.form-select       # セレクトボックス
.search-box        # 検索ボックス
```

### **その他のコンポーネント**
```css
.avatar            # アバター
.progress          # プログレスバー
.tooltip           # ツールチップ
.modal             # モーダル
.dropdown          # ドロップダウン
```

## 🎯 **使用方法**

### **HTMLでの読み込み**
```html
<!-- Tailwind CSS CDN -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- カスタムCSS -->
<link rel="stylesheet" href="../css/tailwind.css">
```

### **コンポーネントの使用例**
```html
<!-- カードコンポーネント -->
<div class="card">
    <div class="card-header">
        <h2>タイトル</h2>
    </div>
    <div class="card-body">
        コンテンツ
    </div>
</div>

<!-- メトリクスカード -->
<div class="metric-card">
    <div class="metric-label">ラベル</div>
    <div class="metric-value">値</div>
    <div class="metric-change">変化</div>
</div>

<!-- ボタン -->
<button class="btn btn-primary">プライマリボタン</button>
<button class="btn btn-secondary">セカンダリボタン</button>
```

## 🔧 **修正履歴と改善点**

### **v2.0 (最新) - Tailwind CSS完全対応**
- **問題**: @applyディレクティブの動作不良
- **解決**: 標準CSSプロパティへの完全移行
- **改善**: 
  - より確実なスタイル適用
  - ブラウザ互換性の向上
  - デバッグの容易化

### **v1.0 - 初期設計**
- Tailwind CSSベースの設計
- カスタムコンポーネントの定義
- レスポンシブデザインの実装

## 📱 **レスポンシブデザイン**

### **ブレークポイント**
```css
/* モバイル: 480px以下 */
@media (max-width: 480px) {
    .grid-cols-1 { grid-template-columns: 1fr; }
}

/* タブレット: 768px以下 */
@media (max-width: 768px) {
    .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
}

/* デスクトップ: 768px以上 */
@media (min-width: 768px) {
    .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
}
```

### **レスポンシブクラス**
```html
<!-- レスポンシブグリッド -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
    <!-- コンテンツ -->
</div>

<!-- レスポンシブレイアウト -->
<div class="flex flex-col lg:flex-row">
    <!-- コンテンツ -->
</div>
```

## 🎨 **カラーパレット**

### **プライマリカラー**
- `#4299e1` - プライマリブルー
- `#3182ce` - プライマリブルー（ホバー）

### **セマンティックカラー**
- `#48bb78` - 成功（グリーン）
- `#f56565` - 危険（レッド）
- `#ed8936` - 警告（オレンジ）
- `#718096` - ニュートラル（グレー）

### **背景色**
- `#f7fafc` - ライトグレー
- `#e2e8f0` - ミディアムグレー
- `#2d3748` - ダークグレー

## 🔍 **トラブルシューティング**

### **よくある問題**

1. **スタイルが適用されない**
   - CSSファイルの読み込み順序を確認
   - ブラウザのキャッシュをクリア
   - 開発者ツールでCSSの競合を確認

2. **レスポンシブデザインが動作しない**
   - viewportメタタグの確認
   - メディアクエリの構文チェック
   - Tailwind CSSの読み込み確認

3. **コンポーネントが表示されない**
   - クラス名のスペルチェック
   - CSSファイルのパス確認
   - ブラウザの互換性確認

### **デバッグ方法**
```html
<!-- 開発者ツールでの確認 -->
<div class="card" style="border: 2px solid red;">
    <!-- デバッグ用のボーダー -->
</div>
```

## 📈 **パフォーマンス最適化**

### **CSS最適化**
- 未使用CSSの削除
- 重複スタイルの統合
- 効率的なセレクタの使用

### **読み込み最適化**
- CSSファイルの最小化
- クリティカルCSSの特定
- 遅延読み込みの検討

## 🚀 **今後の改善計画**

### **短期目標**
- [ ] アニメーションライブラリの統合
- [ ] ダークモードの実装
- [ ] アクセシビリティの向上

### **長期目標**
- [ ] CSS-in-JSへの移行検討
- [ ] デザインシステムの拡張
- [ ] パフォーマンス監視の導入

## 📚 **参考資料**

- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [CSS設計ガイドライン](https://css-tricks.com/)
- [レスポンシブデザインパターン](https://www.smashingmagazine.com/)

---

**最終更新**: 2025年7月12日  
**バージョン**: 2.0  
**担当**: KAGAMI開発チーム 