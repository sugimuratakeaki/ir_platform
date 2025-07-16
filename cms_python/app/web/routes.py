"""
🔮 KAGAMI Web ルーター
HTML テンプレートレンダリング
"""

from fastapi import APIRouter, Request, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

from ..core.logger import kagami_logger
from .component_helpers import (
    create_button_config, create_card_config, create_alert_config,
    create_status_badge_config, create_file_upload_config,
    format_health_status, format_kpi_data, format_datetime
)

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


def get_base_context(request: Request, current_section: str, title: str):
    """ベースコンテキストを生成"""
    return {
        "request": request,
        "title": title,
        "current_section": current_section,
        "user": {
            "name": "田中 IR担当者",
            "role": "ir_manager",
            "permissions": ["read", "write", "approve"]
        }
    }


@router.get("/", response_class=HTMLResponse, name="dashboard")
async def dashboard(request: Request):
    """メインダッシュボード"""
    context = get_base_context(request, "dashboard", "ダッシュボード")
    
    # ダッシュボード特有のデータ
    context.update({
        "health_status": {
            "ai_system": {"status": "online", "accuracy": "96.8%"},
            "api_connection": {"status": "online", "response_time": "1.2s"},
            "security": {"status": "online", "threats": "0件"},
            "database": {"status": "warning", "capacity": "87%"}
        },
        "task_summary": [
            {"number": 12, "label": "未処理問い合わせ", "action": "dialogue"},
            {"number": 5, "label": "FAQ承認待ち", "action": "ai-faq"},
            {"number": 3, "label": "本日の面談", "action": "meetings"},
            {"number": 8, "label": "音声処理中", "action": "data-input"}
        ],
        "kpi_data": {
            "engagement": {"value": "1,247", "change": "+12.3%", "positive": True},
            "satisfaction": {"value": "96.8%", "change": "+2.1%", "positive": True},
            "response_time": {"value": "2.3h", "change": "-0.5h", "positive": True},
            "voice_processing": {"value": "89", "change": "+15.2%", "positive": True}
        }
    })
    
    kagami_logger.info("📋 ダッシュボードページ表示", user=context["user"]["name"])
    return templates.TemplateResponse("dashboard.html", context)


@router.get("/data-input", response_class=HTMLResponse, name="data_input")
async def data_input(request: Request):
    """データ取込ページ"""
    context = get_base_context(request, "data-input", "データ取込・処理")
    
    # 処理統計
    processing_stats = [
        {"icon": "🎤", "label": "音声処理中", "value": 3},
        {"icon": "📧", "label": "メール解析中", "value": 7},
        {"icon": "📄", "label": "文書処理中", "value": 2}
    ]
    
    # セクション設定
    sections = [
        {"id": "audio-video", "label": "🎤 音声・動画", "active": True},
        {"id": "web-meeting", "label": "💻 Web会議連携", "active": False},
        {"id": "email", "label": "📧 メール管理", "active": False},
        {"id": "documents", "label": "📄 決算資料", "active": False}
    ]
    
    # ファイルアップロード設定
    audio_upload_config = create_file_upload_config(
        title="音声・動画ファイルをアップロード",
        description="ドラッグ&ドロップまたはクリックでファイルを選択<br><small>対応形式: MP3, MP4, WAV, M4A, MOV, AVI (最大500MB)</small>",
        icon="🎤",
        accept="audio/*,video/*",
        multiple=True,
        show_file_list=True
    )
    
    context.update({
        "processing_stats": processing_stats,
        "sections": sections,
        "audio_upload_config": audio_upload_config
    })
    
    kagami_logger.info("📥 データ取込ページ表示", user=context["user"]["name"])
    return templates.TemplateResponse("data_input.html", context)


@router.get("/ai-faq", response_class=HTMLResponse, name="ai_faq")
async def ai_faq(request: Request):
    """AI-FAQ管理ページ"""
    context = get_base_context(request, "ai-faq", "AI-FAQ管理")
    
    context.update({
        "ai_stats": [
            {"icon": "⚡", "label": "AI精度", "value": "96.8%"},
            {"icon": "🔄", "label": "生成中", "value": 3},
            {"icon": "✅", "label": "承認待ち", "value": 5}
        ],
        "sections": [
            {"id": "generation", "label": "📝 FAQ生成・編集", "active": True},
            {"id": "approval", "label": "✅ 承認キュー", "active": False},
            {"id": "management", "label": "📚 FAQ管理", "active": False},
            {"id": "analytics", "label": "📊 FAQ分析", "active": False},
            {"id": "learning", "label": "🧠 学習データ", "active": False}
        ]
    })
    
    kagami_logger.info("🤖 AI-FAQページ表示", user=context["user"]["name"])
    return templates.TemplateResponse("ai_faq.html", context)


@router.get("/dialogue", response_class=HTMLResponse, name="dialogue")
async def dialogue(request: Request):
    """対話管理ページ"""
    context = get_base_context(request, "dialogue", "対話管理")
    
    kagami_logger.info("💬 対話管理ページ表示", user=context["user"]["name"])
    return templates.TemplateResponse("dialogue.html", context)


@router.get("/analytics", response_class=HTMLResponse, name="analytics")
async def analytics(request: Request):
    """分析レポートページ"""
    context = get_base_context(request, "analytics", "分析レポート")
    
    kagami_logger.info("📊 分析レポートページ表示", user=context["user"]["name"])
    return templates.TemplateResponse("analytics.html", context)


@router.get("/settings", response_class=HTMLResponse, name="settings")
async def settings(request: Request):
    """システム設定ページ"""
    context = get_base_context(request, "settings", "システム設定")
    
    kagami_logger.info("⚙️ システム設定ページ表示", user=context["user"]["name"])
    return templates.TemplateResponse("settings.html", context) 