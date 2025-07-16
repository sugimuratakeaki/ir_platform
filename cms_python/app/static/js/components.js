// 🔮 KAGAMI IR管理センター - コンポーネント JavaScript v1.0

// ===== 基本コンポーネント管理 =====
const KagamiComponents = (function() {
    'use strict';
    
    // ===== モーダルコンポーネント =====
    class Modal {
        constructor(modalId) {
            this.modal = document.getElementById(modalId);
            if (!this.modal) {
                console.warn(`Modal with id "${modalId}" not found`);
                return;
            }
            this.overlay = this.modal;
            this.setupEventListeners();
        }
        
        setupEventListeners() {
            // 閉じるボタン
            const closeBtn = this.modal.querySelector('.modal__close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close());
            }
            
            // オーバーレイクリック
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) this.close();
            });
            
            // ESCキー
            this.escapeHandler = (e) => {
                if (e.key === 'Escape' && this.isOpen()) this.close();
            };
            
            // データ属性でのクローズボタン
            this.modal.addEventListener('click', (e) => {
                if (e.target.hasAttribute('data-modal-close')) {
                    this.close();
                }
            });
        }
        
        open() {
            this.overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', this.escapeHandler);
            
            // フォーカス管理
            const firstFocusable = this.modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
        
        close() {
            this.overlay.classList.remove('active');
            document.body.style.overflow = '';
            document.removeEventListener('keydown', this.escapeHandler);
        }
        
        isOpen() {
            return this.overlay.classList.contains('active');
        }
    }
    
    // ===== アラートコンポーネント =====
    class Alert {
        constructor(element) {
            this.element = element;
            this.setupEventListeners();
        }
        
        setupEventListeners() {
            const closeBtn = this.element.querySelector('.alert__close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close());
            }
        }
        
        close() {
            this.element.style.opacity = '0';
            this.element.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                this.element.remove();
            }, 300);
        }
        
        static create(message, variant = 'info', title = null, dismissible = true) {
            const alertElement = document.createElement('div');
            alertElement.className = `alert alert--${variant}`;
            alertElement.setAttribute('role', 'alert');
            
            const iconMap = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️'
            };
            
            alertElement.innerHTML = `
                <span class="alert__icon">${iconMap[variant] || iconMap.info}</span>
                <div class="alert__content">
                    ${title ? `<strong class="alert__title">${title}</strong>` : ''}
                    <p class="alert__message">${message}</p>
                </div>
                ${dismissible ? '<button class="alert__close" aria-label="閉じる">×</button>' : ''}
            `;
            
            const alert = new Alert(alertElement);
            return alertElement;
        }
    }
    
    // ===== ファイルアップロードコンポーネント =====
    class FileUpload {
        constructor(element) {
            this.element = element;
            this.input = element.querySelector('.upload-area__input');
            this.button = element.querySelector('.upload-area__button');
            this.progress = element.querySelector('.upload-area__progress');
            this.progressBar = element.querySelector('.progress-bar__fill');
            this.status = element.querySelector('.upload-area__status');
            this.fileList = document.getElementById('file-list');
            this.files = [];
            
            this.setupEventListeners();
        }
        
        setupEventListeners() {
            // クリックでファイル選択
            this.button.addEventListener('click', () => {
                this.input.click();
            });
            
            // ドラッグ&ドロップ
            this.element.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.element.classList.add('dragover');
            });
            
            this.element.addEventListener('dragleave', (e) => {
                e.preventDefault();
                this.element.classList.remove('dragover');
            });
            
            this.element.addEventListener('drop', (e) => {
                e.preventDefault();
                this.element.classList.remove('dragover');
                this.handleFiles(e.dataTransfer.files);
            });
            
            // ファイル選択
            this.input.addEventListener('change', (e) => {
                this.handleFiles(e.target.files);
            });
        }
        
        handleFiles(files) {
            Array.from(files).forEach(file => {
                this.addFile(file);
            });
        }
        
        addFile(file) {
            const fileData = {
                id: Date.now() + Math.random(),
                file: file,
                name: file.name,
                size: this.formatFileSize(file.size),
                status: 'pending'
            };
            
            this.files.push(fileData);
            this.renderFileItem(fileData);
            this.uploadFile(fileData);
        }
        
        renderFileItem(fileData) {
            if (!this.fileList) return;
            
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.setAttribute('data-file-id', fileData.id);
            
            fileItem.innerHTML = `
                <div class="file-item__icon">📄</div>
                <div class="file-item__info">
                    <div class="file-item__name">${fileData.name}</div>
                    <div class="file-item__size">${fileData.size}</div>
                </div>
                <div class="file-item__status">
                    <span class="status-badge status-badge--warning">アップロード中</span>
                </div>
                <button class="file-item__remove" aria-label="削除">🗑️</button>
            `;
            
            // 削除ボタン
            const removeBtn = fileItem.querySelector('.file-item__remove');
            removeBtn.addEventListener('click', () => {
                this.removeFile(fileData.id);
            });
            
            this.fileList.appendChild(fileItem);
        }
        
        async uploadFile(fileData) {
            try {
                // プログレス表示
                this.showProgress();
                
                // FormData作成
                const formData = new FormData();
                formData.append('file', fileData.file);
                
                // アップロード処理
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    const result = await response.json();
                    this.updateFileStatus(fileData.id, 'success');
                    this.hideProgress();
                    
                    // 成功通知
                    const alert = Alert.create('ファイルのアップロードが完了しました', 'success');
                    document.body.appendChild(alert);
                    
                    // 5秒後に自動削除
                    setTimeout(() => {
                        alert.remove();
                    }, 5000);
                } else {
                    throw new Error('アップロードに失敗しました');
                }
            } catch (error) {
                this.updateFileStatus(fileData.id, 'error');
                this.hideProgress();
                
                // エラー通知
                const alert = Alert.create(`アップロードエラー: ${error.message}`, 'error');
                document.body.appendChild(alert);
                
                setTimeout(() => {
                    alert.remove();
                }, 5000);
            }
        }
        
        updateFileStatus(fileId, status) {
            const fileItem = this.fileList.querySelector(`[data-file-id="${fileId}"]`);
            if (!fileItem) return;
            
            const statusElement = fileItem.querySelector('.status-badge');
            
            const statusConfig = {
                success: { class: 'status-badge--success', text: '完了' },
                error: { class: 'status-badge--error', text: 'エラー' },
                pending: { class: 'status-badge--warning', text: 'アップロード中' }
            };
            
            const config = statusConfig[status] || statusConfig.pending;
            statusElement.className = `status-badge ${config.class}`;
            statusElement.textContent = config.text;
        }
        
        removeFile(fileId) {
            this.files = this.files.filter(f => f.id !== fileId);
            const fileItem = this.fileList.querySelector(`[data-file-id="${fileId}"]`);
            if (fileItem) {
                fileItem.remove();
            }
        }
        
        showProgress() {
            if (this.progress) {
                this.progress.style.display = 'block';
                this.progressBar.style.width = '0%';
                
                // プログレスバーアニメーション
                let width = 0;
                const interval = setInterval(() => {
                    width += Math.random() * 10;
                    if (width >= 90) {
                        clearInterval(interval);
                        width = 90;
                    }
                    this.progressBar.style.width = width + '%';
                }, 100);
            }
        }
        
        hideProgress() {
            if (this.progress) {
                this.progressBar.style.width = '100%';
                setTimeout(() => {
                    this.progress.style.display = 'none';
                }, 500);
            }
        }
        
        formatFileSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    }
    
    // ===== セクションナビゲーション =====
    class SectionNav {
        constructor(navElement) {
            this.nav = navElement;
            this.buttons = navElement.querySelectorAll('.section-btn');
            this.sections = document.querySelectorAll('[data-section]');
            
            this.setupEventListeners();
        }
        
        setupEventListeners() {
            this.buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const sectionId = button.dataset.section;
                    this.activateSection(sectionId);
                });
            });
        }
        
        activateSection(sectionId) {
            // ボタンの状態更新
            this.buttons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.section === sectionId) {
                    btn.classList.add('active');
                }
            });
            
            // セクションの表示/非表示
            this.sections.forEach(section => {
                const targetSection = section.querySelector(`[data-section="${sectionId}"]`);
                if (targetSection) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        }
    }
    
    // ===== 自動初期化 =====
    function init() {
        // モーダルの自動初期化
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            new Modal(modal.id);
        });
        
        // アラートの自動初期化
        document.querySelectorAll('.alert').forEach(alert => {
            new Alert(alert);
        });
        
        // ファイルアップロードの自動初期化
        document.querySelectorAll('.upload-area').forEach(upload => {
            new FileUpload(upload);
        });
        
        // セクションナビゲーションの自動初期化
        document.querySelectorAll('.section-nav').forEach(nav => {
            new SectionNav(nav);
        });
        
        console.log('✅ KAGAMIコンポーネント初期化完了');
    }
    
    // ===== パブリックAPI =====
    return {
        Modal: Modal,
        Alert: Alert,
        FileUpload: FileUpload,
        SectionNav: SectionNav,
        init: init
    };
})();

// DOM読み込み完了時に自動初期化
document.addEventListener('DOMContentLoaded', () => {
    KagamiComponents.init();
});

// グローバルに公開
window.KagamiComponents = KagamiComponents; 