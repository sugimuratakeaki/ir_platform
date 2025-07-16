"""
🔮 KAGAMI ミドルウェア
セキュリティ、ログ、パフォーマンス監視
"""

import time
import uuid
from typing import Callable
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from .config import settings
from .logger import kagami_logger


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """リクエストログミドルウェア"""
    
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())[:8]
        start_time = time.time()
        
        kagami_logger.info(
            "🌐 HTTP Request",
            request_id=request_id,
            method=request.method,
            url=str(request.url),
            user_agent=request.headers.get("user-agent", ""),
            client_ip=request.client.host if request.client else None
        )
        
        response = await call_next(request)
        
        process_time = time.time() - start_time
        status_code = response.status_code
        
        log_level = "warning" if status_code >= 400 else "info"
        kagami_logger.log(
            log_level,
            "📤 HTTP Response",
            extra_data={
                "request_id": request_id,
                "status_code": status_code,
                "process_time": f"{process_time:.3f}s"
            }
        )
        
        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """セキュリティヘッダーミドルウェア"""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # 静的ファイルの場合はキャッシュヘッダーを追加
        if request.url.path.startswith("/static/"):
            if request.url.path.endswith((".css", ".js")):
                response.headers.update({
                    "Cache-Control": "public, max-age=31536000, immutable",
                    "ETag": f'"{hash(request.url.path)}"'
                })
            elif request.url.path.endswith((".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico")):
                response.headers.update({
                    "Cache-Control": "public, max-age=31536000, immutable"
                })
        
        security_headers = {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Content-Security-Policy": (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
                "font-src 'self' https://fonts.gstatic.com; "
                "img-src 'self' data: https:; "
                "connect-src 'self'"
            )
        }
        
        response.headers.update(security_headers)
        return response


def add_middleware(app: FastAPI):
    """ミドルウェアを追加"""
    
    # セッションミドルウェア
    app.add_middleware(
        SessionMiddleware,
        secret_key=settings.SECRET_KEY,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    
    # CORS設定
    if settings.DEBUG:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    
    # 信頼できるホスト設定
    if not settings.DEBUG:
        app.add_middleware(
            TrustedHostMiddleware,
            allowed_hosts=["localhost", "127.0.0.1", "*.kagami.jp"]
        )
    
    # カスタムミドルウェア (順番が重要。外側から内側に処理される)
    app.add_middleware(RequestLoggingMiddleware)
    app.add_middleware(SecurityHeadersMiddleware)
    
    kagami_logger.info("🛡️ ミドルウェア設定完了") 