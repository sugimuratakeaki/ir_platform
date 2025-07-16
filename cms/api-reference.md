# 📚 KAGAMI IR管理センター - API リファレンス

## 📋 目次
1. [概要](#概要)
2. [コア API](#コア-api)
3. [ユーティリティ関数](#ユーティリティ関数)
4. [イベントシステム](#イベントシステム)
5. [データ管理](#データ管理)
6. [UI制御](#ui制御)
7. [ファイル処理](#ファイル処理)
8. [通知システム](#通知システム)

---

## 🎯 概要

KAGAMI IR管理センターのJavaScript APIリファレンスです。
共通関数、ユーティリティ、イベントシステムの使用方法を詳細に説明します。

**名前空間：** `KAGAMI`  
**バージョン：** 1.0.0  
**互換性：** ES6+ (Modern Browsers)

---

## ⚡ コア API

### KAGAMI オブジェクト

システム全体の状態と設定を管理するメインオブジェクト。

```javascript
// グローバル状態アクセス
const currentUser = KAGAMI.state.user;
const systemHealth = KAGAMI.state.systemHealth;

// 設定取得
const apiBaseUrl = KAGAMI.config.API_BASE_URL;
const maxFileSize = KAGAMI.config.MAX_FILE_SIZE;
```

### 初期化 API

#### `KAGAMI.init(options)`

アプリケーション全体の初期化を実行します。

```javascript
KAGAMI.init({
    debug: true,
    apiBaseUrl: 'https://api.kagami.jp',
    enableRealTimeUpdates: true,
    updateInterval: 30000
});
```

**パラメータ:**
- `options` (Object) - 初期化オプション
  - `debug` (Boolean) - デバッグモード有効/無効
  - `apiBaseUrl` (String) - API ベースURL
  - `enableRealTimeUpdates` (Boolean) - リアルタイム更新の有効/無効
  - `updateInterval` (Number) - 更新間隔（ミリ秒）

**戻り値:** `Promise<void>`

#### `KAGAMI.destroy()`

アプリケーションのクリーンアップを実行します。

```javascript
// ページ離脱時のクリーンアップ
window.addEventListener('beforeunload', () => {
    KAGAMI.destroy();
});
```

---

## 🛠️ ユーティリティ関数

### 文字列操作

#### `KAGAMI.utils.formatDate(date, format)`

日付を指定されたフォーマットで文字列に変換します。

```javascript
const now = new Date();

KAGAMI.utils.formatDate(now, 'YYYY-MM-DD');
// => "2024-12-19"

KAGAMI.utils.formatDate(now, 'YYYY年MM月DD日 HH:mm');
// => "2024年12月19日 14:30"

KAGAMI.utils.formatDate(now, 'relative');
// => "2分前"
```

**パラメータ:**
- `date` (Date) - 変換する日付オブジェクト
- `format` (String) - フォーマット文字列またはプリセット名

**戻り値:** `String` - フォーマットされた日付文字列

#### `KAGAMI.utils.formatFileSize(bytes)`

バイト数を人間が読みやすい形式に変換します。

```javascript
KAGAMI.utils.formatFileSize(1024);
// => "1 KB"

KAGAMI.utils.formatFileSize(1048576);
// => "1 MB"

KAGAMI.utils.formatFileSize(1073741824);
// => "1 GB"
```

#### `KAGAMI.utils.sanitizeHtml(html)`

HTMLをサニタイズして安全にします。

```javascript
const userInput = '<script>alert("XSS")</script><p>正常なテキスト</p>';
const safeHtml = KAGAMI.utils.sanitizeHtml(userInput);
// => "<p>正常なテキスト</p>"
```

### バリデーション

#### `KAGAMI.utils.validate.email(email)`

メールアドレスの妥当性を検証します。

```javascript
KAGAMI.utils.validate.email('user@example.com');
// => true

KAGAMI.utils.validate.email('invalid-email');
// => false
```

#### `KAGAMI.utils.validate.fileType(file, allowedTypes)`

ファイルタイプを検証します。

```javascript
const file = document.querySelector('input[type="file"]').files[0];

KAGAMI.utils.validate.fileType(file, ['.pdf', '.docx', '.xlsx']);
// => true or false

KAGAMI.utils.validate.fileType(file, ['image/*']);
// => true or false
```

#### `KAGAMI.utils.validate.fileSize(file, maxSize)`

ファイルサイズを検証します。

```javascript
const file = document.querySelector('input[type="file"]').files[0];
const maxSize = 10 * 1024 * 1024; // 10MB

KAGAMI.utils.validate.fileSize(file, maxSize);
// => true or false
```

---

## 📡 イベントシステム

### イベント購読

#### `KAGAMI.events.on(eventName, callback)`

イベントリスナーを登録します。

```javascript
// ファイルアップロード完了イベント
KAGAMI.events.on('file:uploaded', (data) => {
    console.log('ファイルアップロード完了:', data.filename);
});

// システム状態変更イベント
KAGAMI.events.on('system:status_changed', (status) => {
    updateSystemStatusUI(status);
});

// 通知イベント
KAGAMI.events.on('notification:new', (notification) => {
    showToast(notification.message, notification.type);
});
```

#### `KAGAMI.events.off(eventName, callback)`

イベントリスナーを削除します。

```javascript
const handler = (data) => {
    console.log('処理:', data);
};

KAGAMI.events.on('data:processed', handler);
// 後で削除
KAGAMI.events.off('data:processed', handler);
```

#### `KAGAMI.events.emit(eventName, data)`

イベントを発火します。

```javascript
// カスタムイベントの発火
KAGAMI.events.emit('user:action', {
    action: 'file_download',
    filename: 'report.pdf',
    timestamp: new Date()
});
```

### 標準イベント一覧

| イベント名 | 説明 | データ |
|-----------|------|--------|
| `system:initialized` | システム初期化完了 | `{}` |
| `user:login` | ユーザーログイン | `{user}` |
| `user:logout` | ユーザーログアウト | `{}` |
| `file:uploaded` | ファイルアップロード完了 | `{file, result}` |
| `file:processed` | ファイル処理完了 | `{file, result}` |
| `data:updated` | データ更新 | `{type, data}` |
| `notification:new` | 新しい通知 | `{message, type, timestamp}` |
| `error:occurred` | エラー発生 | `{error, context}` |

---

## 📊 データ管理

### API通信

#### `KAGAMI.api.get(endpoint, options)`

GET リクエストを実行します。

```javascript
// ダッシュボードデータ取得
const dashboardData = await KAGAMI.api.get('/dashboard');

// パラメータ付きリクエスト
const userData = await KAGAMI.api.get('/users', {
    params: {
        page: 1,
        limit: 20,
        status: 'active'
    }
});
```

#### `KAGAMI.api.post(endpoint, data, options)`

POST リクエストを実行します。

```javascript
// ファイルアップロード
const uploadResult = await KAGAMI.api.post('/upload', {
    file: fileData,
    metadata: {
        category: 'ir_document',
        priority: 'high'
    }
});

// JSON データ送信
const createResult = await KAGAMI.api.post('/faq', {
    question: '決算日はいつですか？',
    answer: '毎年3月31日です。',
    category: 'financial'
});
```

#### `KAGAMI.api.put(endpoint, data, options)`

PUT リクエストを実行します。

```javascript
// データ更新
const updateResult = await KAGAMI.api.put('/faq/123', {
    answer: '更新された回答内容'
});
```

#### `KAGAMI.api.delete(endpoint, options)`

DELETE リクエストを実行します。

```javascript
// データ削除
const deleteResult = await KAGAMI.api.delete('/faq/123');
```

### ローカルストレージ

#### `KAGAMI.storage.set(key, value, options)`

データをローカルストレージに保存します。

```javascript
// 単純な値の保存
KAGAMI.storage.set('user_preference', 'dark_theme');

// オブジェクトの保存
KAGAMI.storage.set('dashboard_config', {
    layout: 'grid',
    widgets: ['kpi', 'chart', 'notifications']
});

// 有効期限付き保存
KAGAMI.storage.set('temp_data', data, {
    expires: 60 * 60 * 1000 // 1時間
});
```

#### `KAGAMI.storage.get(key, defaultValue)`

ローカルストレージからデータを取得します。

```javascript
const userPreference = KAGAMI.storage.get('user_preference', 'light_theme');
const dashboardConfig = KAGAMI.storage.get('dashboard_config', {});
```

#### `KAGAMI.storage.remove(key)`

ローカルストレージからデータを削除します。

```javascript
KAGAMI.storage.remove('temp_data');
```

#### `KAGAMI.storage.clear()`

すべてのローカルストレージデータを削除します。

```javascript
KAGAMI.storage.clear();
```

---

## 🎨 UI制御

### ローディング表示

#### `KAGAMI.ui.showLoading(target, message)`

ローディング表示を開始します。

```javascript
// 全画面ローディング
KAGAMI.ui.showLoading();

// 特定要素のローディング
const button = document.querySelector('#submit-btn');
KAGAMI.ui.showLoading(button, '処理中...');

// カスタムメッセージ
KAGAMI.ui.showLoading(null, 'データを分析しています...');
```

#### `KAGAMI.ui.hideLoading(target)`

ローディング表示を終了します。

```javascript
// 全画面ローディング終了
KAGAMI.ui.hideLoading();

// 特定要素のローディング終了
KAGAMI.ui.hideLoading(button);
```

### モーダル制御

#### `KAGAMI.ui.modal.show(modalId, options)`

モーダルを表示します。

```javascript
// 基本的な表示
KAGAMI.ui.modal.show('confirm-modal');

// オプション付き表示
KAGAMI.ui.modal.show('edit-modal', {
    data: { id: 123, name: 'Sample' },
    onConfirm: (data) => {
        console.log('確認:', data);
    },
    onCancel: () => {
        console.log('キャンセル');
    }
});
```

#### `KAGAMI.ui.modal.hide(modalId)`

モーダルを非表示にします。

```javascript
KAGAMI.ui.modal.hide('confirm-modal');
```

### ツールチップ

#### `KAGAMI.ui.tooltip.init(selector, options)`

ツールチップを初期化します。

```javascript
// 基本的なツールチップ
KAGAMI.ui.tooltip.init('[data-tooltip]');

// カスタムオプション
KAGAMI.ui.tooltip.init('.help-icon', {
    position: 'top',
    delay: 300,
    arrow: true
});
```

---

## 📁 ファイル処理

### ファイルアップロード

#### `KAGAMI.file.upload(files, options)`

ファイルをアップロードします。

```javascript
const fileInput = document.querySelector('#file-input');
const files = fileInput.files;

const result = await KAGAMI.file.upload(files, {
    endpoint: '/upload',
    onProgress: (progress) => {
        console.log(`アップロード進捗: ${progress}%`);
    },
    onComplete: (result) => {
        console.log('アップロード完了:', result);
    },
    onError: (error) => {
        console.error('アップロードエラー:', error);
    }
});
```

#### `KAGAMI.file.uploadWithPreview(files, previewContainer)`

プレビュー付きでファイルをアップロードします。

```javascript
const files = fileInput.files;
const previewContainer = document.querySelector('#preview-area');

KAGAMI.file.uploadWithPreview(files, previewContainer);
```

### ファイル処理

#### `KAGAMI.file.process(fileId, processingType)`

アップロードされたファイルを処理します。

```javascript
// AI分析処理
const analysisResult = await KAGAMI.file.process(fileId, 'ai_analysis');

// OCR処理
const ocrResult = await KAGAMI.file.process(fileId, 'ocr');

// 文書変換処理
const convertResult = await KAGAMI.file.process(fileId, 'convert_pdf');
```

#### `KAGAMI.file.download(fileId, filename)`

ファイルをダウンロードします。

```javascript
// ファイルダウンロード
KAGAMI.file.download('file123', 'report.pdf');

// 処理結果ダウンロード
KAGAMI.file.download('result456', 'analysis_result.xlsx');
```

---

## 📢 通知システム

### トースト通知

#### `KAGAMI.notify.toast(message, type, options)`

トースト通知を表示します。

```javascript
// 成功通知
KAGAMI.notify.toast('保存が完了しました', 'success');

// エラー通知
KAGAMI.notify.toast('エラーが発生しました', 'error');

// 警告通知
KAGAMI.notify.toast('ファイルサイズが大きすぎます', 'warning');

// 情報通知
KAGAMI.notify.toast('新しいメッセージがあります', 'info');

// カスタムオプション
KAGAMI.notify.toast('カスタム通知', 'success', {
    duration: 5000,
    position: 'top-right',
    closable: true
});
```

### アラート

#### `KAGAMI.notify.alert(message, type, options)`

アラートを表示します。

```javascript
// 基本アラート
KAGAMI.notify.alert('重要なお知らせがあります', 'info');

// 確認付きアラート
KAGAMI.notify.alert('この操作を実行しますか？', 'warning', {
    confirmButton: true,
    onConfirm: () => {
        console.log('確認されました');
    }
});
```

### プッシュ通知

#### `KAGAMI.notify.push(message, options)`

ブラウザのプッシュ通知を表示します。

```javascript
// 基本プッシュ通知
KAGAMI.notify.push('新しいメッセージが届きました');

// 詳細プッシュ通知
KAGAMI.notify.push('IR資料の処理が完了しました', {
    icon: '/icons/kagami-logo.png',
    badge: '/icons/notification-badge.png',
    data: { type: 'file_processed', id: 123 },
    onClick: (event) => {
        // 通知クリック時の処理
        window.focus();
        event.notification.close();
    }
});
```

---

## 🔧 拡張とカスタマイズ

### プラグインシステム

#### `KAGAMI.plugin.register(name, plugin)`

カスタムプラグインを登録します。

```javascript
// カスタムプラグインの定義
const customAnalytics = {
    init: function(options) {
        console.log('カスタム分析プラグイン初期化');
    },
    
    track: function(event, data) {
        // 分析データの追跡
        console.log('イベント追跡:', event, data);
    },
    
    destroy: function() {
        console.log('カスタム分析プラグイン終了');
    }
};

// プラグイン登録
KAGAMI.plugin.register('custom_analytics', customAnalytics);

// プラグイン使用
KAGAMI.plugin.use('custom_analytics', {
    apiKey: 'your-api-key'
});
```

### テーマカスタマイズ

#### `KAGAMI.theme.apply(themeName, customVars)`

テーマを適用します。

```javascript
// プリセットテーマ適用
KAGAMI.theme.apply('dark');

// カスタムテーマ適用
KAGAMI.theme.apply('custom', {
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    backgroundColor: '#f8fafc'
});
```

---

## 🧪 デバッグとトラブルシューティング

### デバッグモード

```javascript
// デバッグモード有効化
KAGAMI.config.debug = true;

// デバッグ情報の出力
KAGAMI.debug.log('カスタムログ');
KAGAMI.debug.warn('警告メッセージ');
KAGAMI.debug.error('エラーメッセージ');

// パフォーマンス測定
KAGAMI.debug.time('process_start');
// 処理実行
KAGAMI.debug.timeEnd('process_start');
```

### エラーハンドリング

```javascript
// グローバルエラーハンドラー
KAGAMI.error.onGlobal((error, context) => {
    console.error('グローバルエラー:', error);
    // エラーレポート送信
    KAGAMI.api.post('/error-report', {
        error: error.message,
        stack: error.stack,
        context: context,
        timestamp: new Date().toISOString()
    });
});

// API エラーハンドラー
KAGAMI.api.onError((response, request) => {
    if (response.status === 401) {
        // 認証エラー処理
        KAGAMI.user.redirectToLogin();
    } else if (response.status >= 500) {
        // サーバーエラー処理
        KAGAMI.notify.toast('サーバーエラーが発生しました', 'error');
    }
});
```

---

## 📖 使用例

### 完全な実装例

```javascript
// アプリケーション初期化
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // KAGAMI システム初期化
        await KAGAMI.init({
            debug: process.env.NODE_ENV === 'development',
            apiBaseUrl: 'https://api.kagami.jp',
            enableRealTimeUpdates: true
        });
        
        // ユーザー認証確認
        const user = await KAGAMI.user.getCurrentUser();
        if (!user) {
            KAGAMI.user.redirectToLogin();
            return;
        }
        
        // UI コンポーネント初期化
        initializeComponents();
        
        // イベントリスナー設定
        setupEventListeners();
        
        // 初期データ読み込み
        await loadInitialData();
        
        console.log('✅ KAGAMI IR管理センター - 起動完了');
        
    } catch (error) {
        console.error('❌ 初期化エラー:', error);
        KAGAMI.notify.alert('システムの初期化に失敗しました', 'error');
    }
});

// コンポーネント初期化
function initializeComponents() {
    // ファイルアップロード
    KAGAMI.file.initUploadZone('#upload-zone', {
        maxFiles: 10,
        maxFileSize: 50 * 1024 * 1024, // 50MB
        allowedTypes: ['.pdf', '.docx', '.xlsx'],
        onUpload: handleFileUpload
    });
    
    // データテーブル
    KAGAMI.ui.dataTable.init('#data-table', {
        ajax: '/api/files',
        columns: [
            { data: 'filename' },
            { data: 'uploadDate', render: KAGAMI.utils.formatDate },
            { data: 'status', render: renderStatusBadge },
            { data: 'actions', render: renderActionButtons }
        ]
    });
    
    // ツールチップ
    KAGAMI.ui.tooltip.init('[data-tooltip]');
}

// イベントリスナー設定
function setupEventListeners() {
    // ファイル処理完了イベント
    KAGAMI.events.on('file:processed', (data) => {
        KAGAMI.notify.toast(`${data.filename} の処理が完了しました`, 'success');
        // データテーブル更新
        KAGAMI.ui.dataTable.reload('#data-table');
    });
    
    // エラーイベント
    KAGAMI.events.on('error:occurred', (error) => {
        KAGAMI.notify.toast('エラーが発生しました: ' + error.message, 'error');
    });
}

// ファイルアップロード処理
async function handleFileUpload(files) {
    try {
        KAGAMI.ui.showLoading(null, 'ファイルをアップロード中...');
        
        const results = await KAGAMI.file.upload(files, {
            onProgress: (progress) => {
                KAGAMI.ui.updateProgress(progress);
            }
        });
        
        KAGAMI.notify.toast('ファイルのアップロードが完了しました', 'success');
        
        // 自動処理開始
        for (const result of results) {
            await KAGAMI.file.process(result.id, 'ai_analysis');
        }
        
    } catch (error) {
        KAGAMI.notify.toast('アップロードに失敗しました: ' + error.message, 'error');
    } finally {
        KAGAMI.ui.hideLoading();
    }
}

// 初期データ読み込み
async function loadInitialData() {
    const [dashboardData, systemHealth] = await Promise.all([
        KAGAMI.api.get('/dashboard'),
        KAGAMI.api.get('/system/health')
    ]);
    
    // ダッシュボード更新
    updateDashboard(dashboardData);
    
    // システム状態表示
    updateSystemStatus(systemHealth);
}
```

---

**🔧 技術仕様**
- **最小ブラウザ要件:** Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **依存関係:** なし（Pure JavaScript）
- **ファイルサイズ:** ~45KB (gzipped)

**📚 関連ドキュメント**
- [コーディングガイドライン](coding-guidelines.md)
- [コンポーネントライブラリ](component-library.md)
- [デザインシステム](design-system.md)

**🚀 バージョン履歴**
- v1.0.0 (2024-12-19): 初回リリース

---

*© 2024 KAGAMI Development Team* 