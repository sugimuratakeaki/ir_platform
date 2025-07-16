#!/usr/bin/env python3
"""
🔮 KAGAMI IR管理センター - Python プロトタイプ v1.0
FastAPI ベースのIR業務支援システム
"""

from fastapi import FastAPI, Request, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from contextlib import asynccontextmanager
import logging
from pathlib import Path

from app.core.config import settings
from app.core.logger import setup_logging
from app.api.routes import router as api_router
from app.web.routes import router as web_router
from app.core.middleware import add_middleware

# アプリケーションのベースディレクトリを定義 (cms_python)
BASE_DIR = Path(__file__).resolve().parent


@asynccontextmanager
async def lifespan(app: FastAPI):
    """アプリケーションライフサイクル管理"""
    # 起動時処理
    logging.info("🔮 KAGAMI IR管理センター - 起動中...")
    yield
    # 終了時処理
    logging.info("✅ KAGAMI IR管理センター - 停止完了")


# FastAPIアプリケーション初期化
app = FastAPI(
    title="KAGAMI IR管理センター",
    description="AI技術を活用したIR業務支援システム",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
)

# ログ設定
setup_logging()

# ミドルウェア追加
add_middleware(app)

# 静的ファイル設定
app.mount("/static", StaticFiles(directory=BASE_DIR / "app/static"), name="static")

# ルーター登録
app.include_router(api_router, prefix="/api", tags=["API"])
app.include_router(web_router, tags=["Web"])

# テンプレート設定
templates = Jinja2Templates(directory=BASE_DIR / "app/templates")


@app.get("/", response_class=HTMLResponse)
async def dashboard(request: Request):
    """メインダッシュボード"""
    context = {
        "request": request,
        "title": "ダッシュボード",
        "current_section": "dashboard",
        "user": {
            "name": "田中 IR担当者",
            "role": "ir_manager"
        }
    }
    return templates.TemplateResponse("dashboard.html", context)


@app.get("/healthz", tags=["System"])
async def health_check():
    """ヘルスチェックエンドポイント"""
    return {"status": "healthy", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    ) 