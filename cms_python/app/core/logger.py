"""
🔮 KAGAMI 構造化ログシステム
"""

import logging
import logging.handlers
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional

from .config import settings


class StructuredFormatter(logging.Formatter):
    """構造化ログフォーマッター"""
    
    def format(self, record: logging.LogRecord) -> str:
        """ログレコードを構造化JSONに変換"""
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        # 追加データがある場合
        if hasattr(record, 'extra_data'):
            log_data.update(record.extra_data)
            
        # エラーの場合はスタックトレースを追加
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(log_data, ensure_ascii=False)


class KagamiLogger:
    """KAGAMI専用ログ管理クラス"""
    
    def __init__(self, name: str = "kagami"):
        self.logger = logging.getLogger(name)
        self._setup_logger()
    
    def _setup_logger(self):
        """ログ設定をセットアップ"""
        self.logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper()))
        
        # ハンドラーをクリア
        for handler in self.logger.handlers[:]:
            self.logger.removeHandler(handler)
        
        # コンソールハンドラー
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(self._get_console_formatter())
        self.logger.addHandler(console_handler)
        
        # ファイルハンドラー（設定されている場合）
        if settings.LOG_FILE:
            self._add_file_handler()
    
    def _get_console_formatter(self) -> logging.Formatter:
        """コンソール用フォーマッター"""
        if settings.DEBUG:
            return logging.Formatter(
                "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
                datefmt="%Y-%m-%d %H:%M:%S"
            )
        else:
            return StructuredFormatter()
    
    def _add_file_handler(self):
        """ファイルハンドラーを追加"""
        log_file = Path(settings.LOG_FILE)
        log_file.parent.mkdir(parents=True, exist_ok=True)
        
        file_handler = logging.handlers.RotatingFileHandler(
            log_file,
            maxBytes=10 * 1024 * 1024,  # 10MB
            backupCount=5,
            encoding='utf-8'
        )
        file_handler.setFormatter(StructuredFormatter())
        self.logger.addHandler(file_handler)
    
    def log(self, level: str, message: str, extra_data: Optional[Dict[str, Any]] = None):
        """構造化ログ出力"""
        log_method = getattr(self.logger, level.lower())
        
        if extra_data:
            # extraパラメータでカスタムデータを渡す
            extra = {"extra_data": extra_data}
            log_method(message, extra=extra)
        else:
            log_method(message)
    
    def info(self, message: str, **kwargs):
        """情報ログ"""
        self.log("info", message, kwargs if kwargs else None)
    
    def debug(self, message: str, **kwargs):
        """デバッグログ"""
        self.log("debug", message, kwargs if kwargs else None)
    
    def warning(self, message: str, **kwargs):
        """警告ログ"""
        self.log("warning", message, kwargs if kwargs else None)
    
    def error(self, message: str, **kwargs):
        """エラーログ"""
        self.log("error", message, kwargs if kwargs else None)
    
    def critical(self, message: str, **kwargs):
        """クリティカルログ"""
        self.log("critical", message, kwargs if kwargs else None)


# グローバルロガーインスタンス
kagami_logger = KagamiLogger()


def setup_logging():
    """ログシステムの初期化"""
    kagami_logger.info("📊 ログシステム初期化完了", 
                      log_level=settings.LOG_LEVEL,
                      log_file=settings.LOG_FILE)


def get_logger(name: str = "kagami") -> KagamiLogger:
    """ロガーインスタンスを取得"""
    return KagamiLogger(name) 