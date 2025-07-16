"""
🔮 KAGAMI レスポンスモデル
API レスポンス用のPydanticモデル定義
"""

from pydantic import BaseModel
from typing import Dict, List, Any, Optional
from datetime import datetime


class APIResponse(BaseModel):
    """基本APIレスポンス"""
    success: bool
    message: Optional[str] = None
    timestamp: str = datetime.utcnow().isoformat()


class HealthResponse(BaseModel):
    """ヘルスチェックレスポンス"""
    status: str
    timestamp: str
    version: str
    services: Dict[str, str]
    metrics: Dict[str, str]


class DashboardDataResponse(BaseModel):
    """ダッシュボードデータレスポンス"""
    success: bool
    data: Dict[str, Any]
    timestamp: str


class KPIData(BaseModel):
    """KPIデータ"""
    value: float
    trend: float
    period: str


class ProcessingStatus(BaseModel):
    """処理状況"""
    id: str
    type: str
    status: str
    progress: float
    created_at: datetime
    updated_at: datetime


class NotificationItem(BaseModel):
    """通知項目"""
    id: int
    type: str
    title: str
    message: str
    timestamp: str
    read: bool = False 