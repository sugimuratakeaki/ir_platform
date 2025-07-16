# 🔮 KAGAMI IR管理センター - Python プロトタイプ v1.0

**AI技術を活用したIR業務支援システム（Python FastAPI版）**

このプロジェクトは、元のJavaScript CMSをベースにPython/FastAPIで作成されたプロトタイプです。  
元のデザインシステムを継承しつつ、段階的にPythonバックエンドへの移行を行います。

---

## 🚀 クイックスタート

### 1. 必要な環境

- **Python**: 3.8+ （推奨: 3.11+）
- **pip**: パッケージマネージャー

### 2. セットアップ

```bash
# 1. プロジェクトディレクトリに移動
cd cms_python

# 2. 仮想環境の作成（推奨）
python3 -m venv venv

# 3. 仮想環境の有効化
# macOS/Linux:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# 4. 依存関係のインストール
pip install -r requirements.txt
```

## 起動方法

1.  **仮想環境の有効化**:
    ```bash
    source venv/bin/activate
    ```

2.  **アプリケーションの起動**:
    `cms_python` ディレクトリに移動してから、以下のコマンドを実行してください。

    ```bash
    cd cms_python
    uvicorn main:app --reload
    ```

    サーバーが `http://127.0.0.1:8000` で起動します。

    **【重要】ポートが使用中の場合**
    もし `Address already in use` というエラーが表示された場合は、別のポート番号を指定して起動してください。例えば、ポート`8001`を使用するには以下のコマンドを実行します。

    ```bash
    # cms_python ディレクトリ内で実行します
    uvicorn main:app --reload --port 8001
    ```
    この場合、サーバーは `http://127.0.0.1:8001` で起動します。

### 4. アクセス

ブラウザで以下のURLにアクセスしてください：

- **メインアプリケーション**: http://127.0.0.1:8000
- **API ドキュメント**: http://127.0.0.1:8000/api/docs
- **ヘルスチェック**: http://127.0.0.1:8000/healthz

---

## 📁 プロジェクト構造

```
cms_python/
├── 📄 main.py                      # アプリケーションエントリポイント
├── 📄 requirements.txt             # Python依存関係
├── 📄 README.md                    # このファイル
│
├── 📁 app/                         # アプリケーションコア
│   ├── 📁 core/                    # コア機能
│   │   ├── config.py              # 設定管理
│   │   ├── logger.py              # ログシステム
│   │   └── middleware.py          # ミドルウェア
│   │
│   ├── 📁 api/                     # REST API
│   │   └── routes.py              # APIエンドポイント
│   │
│   ├── 📁 web/                     # Web UI
│   │   └── routes.py              # HTMLページルーティング
│   │
│   ├── 📁 services/                # ビジネスロジック
│   │   ├── dashboard.py           # ダッシュボード関連
│   │   ├── data_input.py          # データ取込関連
│   │   └── ai_faq.py              # AI-FAQ関連
│   │
│   ├── 📁 models/                  # データモデル
│   │   └── response.py            # APIレスポンスモデル
│   │
│   ├── 📁 templates/               # HTMLテンプレート
│   │   ├── base.html              # ベーステンプレート
│   │   ├── dashboard.html         # ダッシュボード
│   │   ├── data_input.html        # データ取込
│   │   ├── ai_faq.html            # AI-FAQ管理
│   │   └── components/            # 共通コンポーネント
│   │       ├── header.html        # ヘッダー
│   │       └── footer.html        # フッター
│   │
│   └── 📁 static/                  # 静的ファイル
│       ├── css/                   # スタイルシート
│       │   └── styles.css         # メインCSS（元CMSから継承）
│       └── js/                    # JavaScript
│           └── app.js             # メインJS（元CMSから継承）
│
├── 📁 logs/                        # ログファイル（自動生成）
├── 📁 uploads/                     # アップロードファイル（自動生成）
└── 📄 kagami.db                    # SQLiteデータベース（自動生成）
```

---

## 🎯 実装済み機能

### ✅ 完了済み

- **ダッシュボード**: システムヘルス、KPI、AI インサイト表示
- **データ取込**: ファイルアップロードUI（モック処理）
- **AI-FAQ管理**: FAQ生成UI（モック処理）
- **API システム**: RESTful APIエンドポイント
- **ログシステム**: 構造化ログと監視
- **セキュリティ**: セキュリティヘッダー、CORS設定

### 🚧 開発中

- **対話管理**: 投資家とのコミュニケーション履歴
- **分析レポート**: 詳細なKPI分析とレポート生成
- **システム設定**: 管理者向け設定画面

---

## 🔧 開発者向け情報

### コマンド

```bash
# 開発サーバー起動（自動リロード）
uvicorn main:app --reload

# プロダクション起動
uvicorn main:app --host 0.0.0.0 --port 8000

# ログ確認
tail -f logs/kagami.log

# 依存関係更新
pip freeze > requirements.txt
```

### 設定変更

環境変数またはapp/core/config.pyで設定を変更できます：

```bash
# デバッグモード無効化
DEBUG=false

# ポート変更
PORT=8080

# ログレベル変更
LOG_LEVEL=WARNING
```

### API エンドポイント

主要なAPIエンドポイント：

- `GET /health` - ヘルスチェック
- `GET /api/dashboard/data` - ダッシュボードデータ
- `POST /api/data-input/upload` - ファイルアップロード
- `POST /api/ai-faq/generate` - FAQ生成
- `GET /api/notifications` - 通知一覧

詳細は http://127.0.0.1:8000/api/docs で確認

---

## 🔄 移行戦略

このプロトタイプは段階的移行を前提として設計されています：

### Phase 1: プロトタイプ（現在）
- 基本UI機能
- モックAPI
- 元デザインシステム継承

### Phase 2: バックエンド実装
- 実際のデータベース連携
- AI エンジン統合
- 認証・認可システム

### Phase 3: 本格運用
- パフォーマンス最適化
- 本番環境対応
- 元システムからの完全移行

---

## 🐛 トラブルシューティング

### よくある問題

**Q: `ModuleNotFoundError` が発生する**
```bash
# 仮想環境が有効か確認
which python
# 依存関係を再インストール
pip install -r requirements.txt
```

**Q: ポート8000が既に使用されている**
```bash
# 他のポートを指定
uvicorn main:app --port 8001
```

**Q: 静的ファイルが読み込まれない**
```bash
# ファイルパスを確認
ls -la app/static/css/
ls -la app/static/js/
```

**Q: ログが出力されない**
```bash
# ログディレクトリを確認
mkdir -p logs
# 権限を確認
ls -la logs/
```

---

## 🤝 開発への貢献

### 開発の流れ

1. **機能追加**:
   - `app/services/` にビジネスロジック追加
   - `app/api/routes.py` にAPIエンドポイント追加
   - `app/templates/` にUIテンプレート追加

2. **スタイル修正**:
   - `app/static/css/styles.css` を編集
   - 元CMSとの一貫性を保持

3. **テスト**:
   - 手動テスト: ブラウザでUI確認
   - APIテスト: `/api/docs` のSwagger UI使用

### コード規約

- **Python**: PEP 8準拠
- **コミット**: 絵文字プレフィックス（例: 🔧 設定変更）
- **ログ**: 絵文字付き構造化ログ

---

## 📞 サポート

- **開発チーム**: dev@kagami.jp
- **システム管理**: admin@kagami.jp

---

## 📄 ライセンス

© 2024 KAGAMI Development Team. All rights reserved.

---

**🎯 次のステップ**

1. アプリケーションを起動してダッシュボードを確認
2. `/api/docs` でAPI仕様を確認  
3. 各機能をテストして動作確認
4. 必要に応じて設定をカスタマイズ

**Happy Coding! 🔮** 