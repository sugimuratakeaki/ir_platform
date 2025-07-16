"""
🔮 KAGAMI 設定管理
環境変数ベースの設定システム
"""

from pydantic_settings import BaseSettings
from typing import Optional
import os
from pathlib import Path


class Settings(BaseSettings):
    """アプリケーション設定"""
    
    # 基本設定
    APP_NAME: str = "KAGAMI IR管理センター"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # サーバー設定
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    
    # セキュリティ設定
    SECRET_KEY: str = "kagami-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30日
    
    # データベース設定
    DATABASE_URL: str = "sqlite:///./kagami.db"
    
    # API設定
    API_PREFIX: str = "/api"
    
    # ファイルアップロード設定
    MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB
    UPLOAD_DIRECTORY: str = "uploads"
    
    # ログ設定
    LOG_LEVEL: str = "INFO"
    LOG_FILE: Optional[str] = "logs/kagami.log"
    
    # AI設定（将来の拡張用）
    AI_ENABLED: bool = True
    AI_MODEL_PATH: Optional[str] = None
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# グローバル設定インスタンス
settings = Settings()

# ディレクトリ作成
def ensure_directories():
    """必要なディレクトリを作成"""
    directories = [
        settings.UPLOAD_DIRECTORY,
        "logs",
        "static/uploads"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)

# 設定検証
def validate_settings():
    """設定値の検証"""
    if settings.DEBUG:
        print(f"🔮 {settings.APP_NAME} v{settings.VERSION}")
        print(f"📊 Debug Mode: {settings.DEBUG}")
        print(f"🌐 Server: {settings.HOST}:{settings.PORT}")
        print(f"💾 Database: {settings.DATABASE_URL}")

# 初期化時に実行
ensure_directories()
validate_settings() 