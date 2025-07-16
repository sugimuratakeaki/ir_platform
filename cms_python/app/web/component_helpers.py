"""
🔮 KAGAMI Web コンポーネントヘルパー
HTMLコンポーネントの共通化とデータ処理
"""

def create_button_config(text, variant='primary', size=None, icon=None, onclick=None, disabled=False, loading=False, type='button'):
    """ボタンコンポーネントの設定を作成"""
    return {
        'text': text,
        'variant': variant,
        'size': size,
        'icon': icon,
        'onclick': onclick,
        'disabled': disabled,
        'loading': loading,
        'type': type
    }

def create_card_config(title, content=None, description=None, icon=None, actions=None, stats=None, footer=None, variant=None, hoverable=False):
    """カードコンポーネントの設定を作成"""
    return {
        'title': title,
        'content': content,
        'description': description,
        'icon': icon,
        'actions': actions,
        'stats': stats,
        'footer': footer,
        'variant': variant,
        'hoverable': hoverable
    }

def create_alert_config(message, variant='info', title=None, dismissible=True):
    """アラートコンポーネントの設定を作成"""
    return {
        'message': message,
        'variant': variant,
        'title': title,
        'dismissible': dismissible
    }

def create_status_badge_config(text, variant='info'):
    """ステータスバッジコンポーネントの設定を作成"""
    return {
        'text': text,
        'variant': variant
    }

def create_file_upload_config(title='ファイルをアップロード', description='ファイルをドラッグ&ドロップまたはクリックして選択', 
                             icon='📁', accept=None, multiple=False, show_file_list=False):
    """ファイルアップロードコンポーネントの設定を作成"""
    return {
        'title': title,
        'description': description,
        'icon': icon,
        'accept': accept,
        'multiple': multiple,
        'show_file_list': show_file_list
    }

def create_modal_config(title, content, modal_id='modal', footer=None):
    """モーダルコンポーネントの設定を作成"""
    return {
        'title': title,
        'content': content,
        'modal_id': modal_id,
        'footer': footer
    }

def create_section_nav_config(sections):
    """セクションナビゲーションコンポーネントの設定を作成"""
    return {
        'sections': sections
    }

def format_health_status(status_data):
    """ヘルスステータスデータを画面表示用に変換"""
    formatted = {}
    
    status_map = {
        'online': {'class': 'online', 'text': '稼働中'},
        'warning': {'class': 'warning', 'text': '注意'},
        'error': {'class': 'error', 'text': 'エラー'},
        'offline': {'class': 'offline', 'text': '停止中'}
    }
    
    for key, item in status_data.items():
        formatted[key] = {
            **item,
            'status_class': status_map.get(item['status'], status_map['offline'])['class'],
            'status_text': status_map.get(item['status'], status_map['offline'])['text']
        }
    
    return formatted

def format_kpi_data(kpi_data):
    """KPIデータを画面表示用に変換"""
    formatted = {}
    
    for key, item in kpi_data.items():
        formatted[key] = {
            **item,
            'trend_class': 'positive' if item.get('positive', True) else 'negative',
            'trend_icon': '↗️' if item.get('positive', True) else '↘️'
        }
    
    return formatted

def format_file_size(size_bytes):
    """ファイルサイズを人間が読みやすい形式に変換"""
    if size_bytes == 0:
        return '0 B'
    
    size_units = ['B', 'KB', 'MB', 'GB', 'TB']
    i = 0
    while size_bytes >= 1024 and i < len(size_units) - 1:
        size_bytes /= 1024
        i += 1
    
    return f"{size_bytes:.1f} {size_units[i]}"

def create_notification_config(message, variant='info', title=None, duration=5000):
    """通知コンポーネントの設定を作成"""
    return {
        'message': message,
        'variant': variant,
        'title': title,
        'duration': duration
    }

def format_datetime(dt, format_type='datetime'):
    """日時を画面表示用に変換"""
    if not dt:
        return '---'
    
    formats = {
        'datetime': '%Y-%m-%d %H:%M',
        'date': '%Y-%m-%d',
        'time': '%H:%M',
        'relative': '相対時間'  # 実装は後で追加
    }
    
    if hasattr(dt, 'strftime'):
        return dt.strftime(formats.get(format_type, formats['datetime']))
    
    return str(dt)

def create_breadcrumb_config(items):
    """パンくずリストの設定を作成"""
    return {
        'items': items
    }

def create_pagination_config(current_page, total_pages, per_page=10, total_items=0):
    """ページネーションの設定を作成"""
    return {
        'current_page': current_page,
        'total_pages': total_pages,
        'per_page': per_page,
        'total_items': total_items,
        'has_prev': current_page > 1,
        'has_next': current_page < total_pages,
        'prev_page': current_page - 1 if current_page > 1 else None,
        'next_page': current_page + 1 if current_page < total_pages else None
    }

def create_table_config(headers, rows, sortable=False, searchable=False, pagination=None):
    """データテーブルの設定を作成"""
    return {
        'headers': headers,
        'rows': rows,
        'sortable': sortable,
        'searchable': searchable,
        'pagination': pagination
    } 