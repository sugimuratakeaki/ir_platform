// 📥 データ取込・処理 専用JavaScript v2.0

// ===== モジュラーアーキテクチャ =====
const DataInputModule = (function() {
    'use strict';
    
    // ===== プライベート状態 =====
    const _state = {
        currentSection: 'audio-video',
        uploadedFiles: new Map(),
        processingQueue: [],
        webMeetingConnections: new Map([
            ['zoom', { connected: true, lastSync: '2024-12-19 14:30', config: {} }],
            ['teams', { connected: false, lastSync: null, config: {} }],
            ['googleMeet', { connected: false, lastSync: null, config: {} }]
        ]),
        processingStats: {
            totalProcessed: 0,
            successCount: 0,
            errorCount: 0,
            averageProcessingTime: 0
        }
    };
    
    const _config = {
        maxFileSize: 50 * 1024 * 1024, // 50MB
        allowedFileTypes: ['.pdf', '.docx', '.xlsx', '.pptx', '.mp4', '.mp3', '.wav'],
        maxConcurrentUploads: 3,
        chunkSize: 1024 * 1024, // 1MB chunks
        retryAttempts: 3,
        processingTimeout: 300000 // 5分
    };
    
    // ===== 依存性注入 =====
    let logger, eventBus, securityValidator, performanceMonitor;
    
    // ===== ストラテジーパターン - ファイル処理 =====
    const ProcessingStrategies = {
        'audio': {
            validate: (file) => ['.mp3', '.wav', '.m4a'].some(ext => file.name.toLowerCase().endsWith(ext)),
            process: async (file) => {
                logger.info('音声ファイル処理開始', { filename: file.name });
                const result = await simulateAudioProcessing(file);
                eventBus.emit('file:audio:processed', { file, result });
                return result;
            },
            preview: (file) => generateAudioPreview(file)
        },
        
        'video': {
            validate: (file) => ['.mp4', '.avi', '.mov'].some(ext => file.name.toLowerCase().endsWith(ext)),
            process: async (file) => {
                logger.info('動画ファイル処理開始', { filename: file.name });
                const result = await simulateVideoProcessing(file);
                eventBus.emit('file:video:processed', { file, result });
                return result;
            },
            preview: (file) => generateVideoPreview(file)
        },
        
        'document': {
            validate: (file) => ['.pdf', '.docx', '.xlsx', '.pptx'].some(ext => file.name.toLowerCase().endsWith(ext)),
            process: async (file) => {
                logger.info('文書ファイル処理開始', { filename: file.name });
                const result = await simulateDocumentProcessing(file);
                eventBus.emit('file:document:processed', { file, result });
                return result;
            },
            preview: (file) => generateDocumentPreview(file)
        },
        
        'default': {
            validate: () => true,
            process: async (file) => {
                logger.warn('未知のファイル形式', { filename: file.name, type: file.type });
                return { status: 'unsupported', message: 'サポートされていないファイル形式です' };
            },
            preview: (file) => generateGenericPreview(file)
        }
    };
    
    // ===== バッチ処理システム =====
    class BatchProcessor {
        constructor(options = {}) {
            this.batchSize = options.batchSize || 10;
            this.queue = [];
            this.processing = false;
            this.concurrentLimit = options.concurrentLimit || 3;
            this.activeProcesses = new Set();
        }
        
        add(operation) {
            this.queue.push(operation);
            this.scheduleProcessing();
        }
        
        async scheduleProcessing() {
            if (this.processing || this.activeProcesses.size >= this.concurrentLimit) {
                return;
            }
            
            this.processing = true;
            
            while (this.queue.length > 0 && this.activeProcesses.size < this.concurrentLimit) {
                const batch = this.queue.splice(0, this.batchSize);
                this.processBatch(batch);
            }
            
            this.processing = false;
        }
        
        async processBatch(batch) {
            const processId = Date.now() + Math.random();
            this.activeProcesses.add(processId);
            
            try {
                await Promise.all(
                    batch.map(operation => this.executeOperation(operation))
                );
            } catch (error) {
                logger.error('バッチ処理エラー', { error: error.message });
            } finally {
                this.activeProcesses.delete(processId);
                
                if (this.queue.length > 0) {
                    this.scheduleProcessing();
                }
            }
        }
        
        async executeOperation(operation) {
            try {
                await operation();
            } catch (error) {
                logger.error('処理エラー', { error: error.message });
            }
        }
    }
    
    // ===== セキュリティ強化ファイルバリデーター =====
    class EnhancedFileValidator {
        static validateFile(file) {
            // 基本バリデーション
            securityValidator.validateInput(file.name, 'filename');
            
            // サイズチェック
            if (file.size > _config.maxFileSize) {
                throw new Error(`ファイルサイズが上限を超えています: ${formatFileSize(file.size)}`);
            }
            
            // 拡張子チェック
            const extension = '.' + file.name.split('.').pop().toLowerCase();
            if (!_config.allowedFileTypes.includes(extension)) {
                throw new Error(`許可されていないファイル形式です: ${extension}`);
            }
            
            // MIMEタイプチェック
            this.validateMimeType(file);
            
            // ファイル名のサニタイズ
            return this.sanitizeFileName(file.name);
        }
        
        static validateMimeType(file) {
            const allowedMimeTypes = {
                '.pdf': 'application/pdf',
                '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                '.mp4': 'video/mp4',
                '.mp3': 'audio/mpeg'
            };
            
            const extension = '.' + file.name.split('.').pop().toLowerCase();
            const expectedMimeType = allowedMimeTypes[extension];
            
            if (expectedMimeType && file.type !== expectedMimeType) {
                logger.warn('MIMEタイプ不一致', {
                    filename: file.name,
                    expected: expectedMimeType,
                    actual: file.type
                });
            }
        }
        
        static sanitizeFileName(filename) {
            return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
        }
    }
    
    // ===== チャンク化アップロードシステム =====
    class ChunkedUploader {
        constructor(file, options = {}) {
            this.file = file;
            this.chunkSize = options.chunkSize || _config.chunkSize;
            this.totalChunks = Math.ceil(file.size / this.chunkSize);
            this.uploadedChunks = new Set();
            this.abortController = new AbortController();
        }
        
        async upload(onProgress) {
            const timer = performanceMonitor?.time(`upload:${this.file.name}`);
            
            try {
                logger.info('チャンク化アップロード開始', {
                    filename: this.file.name,
                    totalChunks: this.totalChunks,
                    chunkSize: this.chunkSize
                });
                
                for (let chunkIndex = 0; chunkIndex < this.totalChunks; chunkIndex++) {
                    if (this.abortController.signal.aborted) {
                        throw new Error('アップロードがキャンセルされました');
                    }
                    
                    await this.uploadChunk(chunkIndex);
                    
                    const progress = ((chunkIndex + 1) / this.totalChunks) * 100;
                    onProgress?.(progress);
                }
                
                const result = await this.finalizeUpload();
                timer?.end();
                
                logger.info('チャンク化アップロード完了', {
                    filename: this.file.name,
                    uploadId: result.uploadId
                });
                
                return result;
                
            } catch (error) {
                timer?.end();
                logger.error('チャンク化アップロードエラー', {
                    filename: this.file.name,
                    error: error.message
                });
                throw error;
            }
        }
        
        async uploadChunk(chunkIndex) {
            const start = chunkIndex * this.chunkSize;
            const end = Math.min(start + this.chunkSize, this.file.size);
            const chunk = this.file.slice(start, end);
            
            const formData = new FormData();
            formData.append('chunk', chunk);
            formData.append('chunkIndex', chunkIndex);
            formData.append('totalChunks', this.totalChunks);
            formData.append('filename', this.file.name);
            
            const response = await fetch('/api/upload/chunk', {
                method: 'POST',
                body: formData,
                signal: this.abortController.signal
            });
            
            if (!response.ok) {
                throw new Error(`チャンク${chunkIndex}のアップロードに失敗しました`);
            }
            
            this.uploadedChunks.add(chunkIndex);
        }
        
        async finalizeUpload() {
            const response = await fetch('/api/upload/finalize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filename: this.file.name,
                    totalChunks: this.totalChunks,
                    uploadedChunks: Array.from(this.uploadedChunks)
                }),
                signal: this.abortController.signal
            });
            
            if (!response.ok) {
                throw new Error('アップロードの完了処理に失敗しました');
            }
            
            return await response.json();
        }
        
        abort() {
            this.abortController.abort();
            logger.info('アップロードをキャンセル', { filename: this.file.name });
        }
    }

// ===== データ取込初期化 =====
function initializeDataInput() {
    // 現在の処理状況を更新
    updateProcessingStats();
    
    // 定期的な状況更新（30秒ごと）
    setInterval(updateProcessingStats, 30000);
    
    // リアルタイム処理状況更新（5秒ごと）
    setInterval(updateProgressBars, 5000);
}

// ===== セクションナビゲーション =====
function initializeSectionNavigation() {
    const sectionButtons = document.querySelectorAll('.section-btn');
    
    sectionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });
}

function switchSection(section) {
    // ボタンの状態更新
    document.querySelectorAll('.section-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // セクションの表示切り替え
    document.querySelectorAll('.input-section').forEach(sec => {
        sec.style.display = 'none';
    });
    document.getElementById(`${section}-section`).style.display = 'block';
    
    currentSection = section;
    
    // セクション別の初期化処理
    switch(section) {
        case 'audio-video':
            loadAudioVideoFiles();
            break;
        case 'web-meeting':
            loadMeetingHistory();
            break;
        case 'email':
            loadEmailAnalytics();
            break;
        case 'documents':
            loadDocumentList();
            break;
    }
    
    showNotification(`${getSectionName(section)}に切り替えました`, 'info');
}

function getSectionName(section) {
    const names = {
        'audio-video': '音声・動画アップロード',
        'web-meeting': 'Web会議連携',
        'email': 'メール管理',
        'documents': '決算資料管理'
    };
    return names[section] || section;
}

// ===== ファイルアップロード機能 =====
function initializeFileUpload() {
    // 音声・動画ファイルアップロード
    const audioVideoInput = document.getElementById('audioVideoInput');
    const documentInput = document.getElementById('documentInput');
    
    if (audioVideoInput) {
        audioVideoInput.addEventListener('change', function(e) {
            handleFileSelection(e.target.files, 'audio-video');
        });
    }
    
    if (documentInput) {
        documentInput.addEventListener('change', function(e) {
            handleFileSelection(e.target.files, 'document');
        });
    }
}

function handleFileSelection(files, type) {
    Array.from(files).forEach(file => {
        if (validateFile(file, type)) {
            uploadFile(file, type);
        } else {
            showNotification(`❌ ファイル "${file.name}" は対応していない形式です`, 'error');
        }
    });
}

function validateFile(file, type) {
    const audioVideoTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'video/mp4', 'video/mov', 'video/avi'];
    const documentTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
                          'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    
    const maxSizes = {
        'audio-video': 500 * 1024 * 1024, // 500MB
        'document': 100 * 1024 * 1024      // 100MB
    };
    
    const allowedTypes = type === 'audio-video' ? audioVideoTypes : documentTypes;
    
    if (!allowedTypes.includes(file.type)) {
        return false;
    }
    
    if (file.size > maxSizes[type]) {
        showNotification(`❌ ファイルサイズが上限（${Math.round(maxSizes[type] / 1024 / 1024)}MB）を超えています`, 'error');
        return false;
    }
    
    return true;
}

function uploadFile(file, type) {
    const fileId = generateFileId();
    const fileInfo = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: type,
        status: 'uploading',
        progress: 0,
        startTime: new Date(),
        file: file
    };
    
    uploadedFiles.set(fileId, fileInfo);
    addFileToUI(fileInfo);
    
    // アップロード処理をシミュレーション
    simulateFileUpload(fileId);
}

function simulateFileUpload(fileId) {
    const fileInfo = uploadedFiles.get(fileId);
    if (!fileInfo) return;
    
    const uploadInterval = setInterval(() => {
        fileInfo.progress += Math.random() * 15 + 5; // 5-20%の進捗
        
        if (fileInfo.progress >= 100) {
            fileInfo.progress = 100;
            fileInfo.status = 'processing';
            clearInterval(uploadInterval);
            
            updateFileInUI(fileInfo);
            showNotification(`✅ "${fileInfo.name}" のアップロードが完了しました`, 'success');
            
            // 処理開始
            setTimeout(() => startFileProcessing(fileId), 1000);
        } else {
            updateFileInUI(fileInfo);
        }
    }, 1000);
}

function startFileProcessing(fileId) {
    const fileInfo = uploadedFiles.get(fileId);
    if (!fileInfo) return;
    
    fileInfo.status = 'processing';
    fileInfo.progress = 0;
    processingQueue.push(fileId);
    
    showNotification(`🔄 "${fileInfo.name}" の処理を開始しました`, 'info');
    
    // 処理をシミュレーション
    simulateFileProcessing(fileId);
}

function simulateFileProcessing(fileId) {
    const fileInfo = uploadedFiles.get(fileId);
    if (!fileInfo) return;
    
    const processingSteps = [
        '音声認識中...',
        '話者識別中...',
        'トピック抽出中...',
        'FAQ候補生成中...',
        '品質チェック中...'
    ];
    
    let stepIndex = 0;
    
    const processingInterval = setInterval(() => {
        fileInfo.progress += Math.random() * 10 + 5; // 5-15%の進捗
        
        if (stepIndex < processingSteps.length && fileInfo.progress > (stepIndex + 1) * 20) {
            fileInfo.currentStep = processingSteps[stepIndex];
            stepIndex++;
        }
        
        if (fileInfo.progress >= 100) {
            fileInfo.progress = 100;
            fileInfo.status = 'completed';
            fileInfo.currentStep = '処理完了';
            fileInfo.results = generateProcessingResults(fileInfo);
            
            clearInterval(processingInterval);
            processingQueue = processingQueue.filter(id => id !== fileId);
            
            updateFileInUI(fileInfo);
            showNotification(`🎉 "${fileInfo.name}" の処理が完了しました`, 'success');
        } else {
            updateFileInUI(fileInfo);
        }
    }, 2000);
}

function generateProcessingResults(fileInfo) {
    if (fileInfo.type === 'audio-video') {
        return {
            transcription: '文字起こし完了',
            topics: Math.floor(Math.random() * 20) + 10,
            questions: Math.floor(Math.random() * 30) + 15,
            speakers: Math.floor(Math.random() * 5) + 2
        };
    } else if (fileInfo.type === 'document') {
        return {
            dataPoints: Math.floor(Math.random() * 50) + 30,
            faqCandidates: Math.floor(Math.random() * 15) + 8,
            charts: Math.floor(Math.random() * 10) + 3
        };
    }
    return {};
}

// ===== ドラッグ&ドロップ機能 =====
function initializeDragAndDrop() {
    const uploadAreas = document.querySelectorAll('.upload-area');
    
    uploadAreas.forEach(area => {
        area.addEventListener('dragover', handleDragOver);
        area.addEventListener('dragleave', handleDragLeave);
        area.addEventListener('drop', handleDrop);
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    const uploadType = e.currentTarget.id === 'audioVideoUploadArea' ? 'audio-video' : 'document';
    
    handleFileSelection(files, uploadType);
}

// ===== UI更新機能 =====
function addFileToUI(fileInfo) {
    const filesList = fileInfo.type === 'audio-video' ? 
        document.getElementById('audioVideoFilesList') : 
        document.querySelector('.documents-table');
    
    if (!filesList) return;
    
    const fileElement = createFileElement(fileInfo);
    filesList.appendChild(fileElement);
}

function createFileElement(fileInfo) {
    const fileDiv = document.createElement('div');
    fileDiv.className = `file-item ${fileInfo.status}`;
    fileDiv.id = `file-${fileInfo.id}`;
    
    const icon = getFileIcon(fileInfo.name);
    const size = formatFileSize(fileInfo.size);
    
    fileDiv.innerHTML = `
        <div class="file-icon">${icon}</div>
        <div class="file-info">
            <div class="file-name">${fileInfo.name}</div>
            <div class="file-details">
                <span class="file-size">${size}</span>
                <span class="file-status ${fileInfo.status}">${getStatusText(fileInfo)}</span>
            </div>
            <div class="processing-progress" style="display: ${fileInfo.status === 'processing' ? 'block' : 'none'}">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${fileInfo.progress}%"></div>
                </div>
            </div>
            <div class="processing-results" style="display: ${fileInfo.status === 'completed' ? 'block' : 'none'}">
                ${generateResultsHTML(fileInfo)}
            </div>
        </div>
        <div class="file-actions">
            ${generateActionsHTML(fileInfo)}
        </div>
    `;
    
    return fileDiv;
}

function updateFileInUI(fileInfo) {
    const fileElement = document.getElementById(`file-${fileInfo.id}`);
    if (!fileElement) return;
    
    fileElement.className = `file-item ${fileInfo.status}`;
    
    const statusElement = fileElement.querySelector('.file-status');
    if (statusElement) {
        statusElement.textContent = getStatusText(fileInfo);
        statusElement.className = `file-status ${fileInfo.status}`;
    }
    
    const progressFill = fileElement.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = `${fileInfo.progress}%`;
    }
    
    const progressContainer = fileElement.querySelector('.processing-progress');
    if (progressContainer) {
        progressContainer.style.display = fileInfo.status === 'processing' ? 'block' : 'none';
    }
    
    const resultsContainer = fileElement.querySelector('.processing-results');
    if (resultsContainer) {
        resultsContainer.style.display = fileInfo.status === 'completed' ? 'block' : 'none';
        if (fileInfo.status === 'completed') {
            resultsContainer.innerHTML = generateResultsHTML(fileInfo);
        }
    }
    
    const actionsContainer = fileElement.querySelector('.file-actions');
    if (actionsContainer) {
        actionsContainer.innerHTML = generateActionsHTML(fileInfo);
    }
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const iconMap = {
        mp3: '🎵', wav: '🎵', m4a: '🎵',
        mp4: '🎥', mov: '🎥', avi: '🎥',
        pdf: '📄', xlsx: '📊', pptx: '📊', docx: '📝'
    };
    return iconMap[ext] || '📁';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getStatusText(fileInfo) {
    switch(fileInfo.status) {
        case 'uploading':
            return `アップロード中... ${Math.round(fileInfo.progress)}%`;
        case 'processing':
            return fileInfo.currentStep || `処理中... ${Math.round(fileInfo.progress)}%`;
        case 'completed':
            return '処理完了';
        case 'error':
            return 'エラー';
        default:
            return '待機中';
    }
}

function generateResultsHTML(fileInfo) {
    if (!fileInfo.results) return '';
    
    if (fileInfo.type === 'audio-video') {
        return `
            <span class="result-item">📝 ${fileInfo.results.transcription}</span>
            <span class="result-item">🏷️ ${fileInfo.results.topics}個のトピック抽出</span>
            <span class="result-item">❓ ${fileInfo.results.questions}個の質問検出</span>
        `;
    } else if (fileInfo.type === 'document') {
        return `
            <span class="result-item">📈 数値抽出: ${fileInfo.results.dataPoints}項目</span>
            <span class="result-item">📝 FAQ候補: ${fileInfo.results.faqCandidates}件</span>
        `;
    }
    return '';
}

function generateActionsHTML(fileInfo) {
    switch(fileInfo.status) {
        case 'processing':
            return `
                <button class="btn-secondary" onclick="pauseProcessing('${fileInfo.id}')">
                    ⏸️ 一時停止
                </button>
            `;
        case 'completed':
            return `
                <button class="btn-primary" onclick="viewResults('${fileInfo.id}')">
                    📊 結果を表示
                </button>
                <button class="btn-secondary" onclick="downloadTranscript('${fileInfo.id}')">
                    📄 ダウンロード
                </button>
            `;
        case 'error':
            return `
                <button class="btn-warning" onclick="retryProcessing('${fileInfo.id}')">
                    🔄 再試行
                </button>
            `;
        default:
            return `
                <button class="btn-secondary" onclick="removeFile('${fileInfo.id}')">
                    🗑️ 削除
                </button>
            `;
    }
}

// ===== ファイル操作機能 =====
function pauseProcessing(fileId) {
    const fileInfo = uploadedFiles.get(fileId);
    if (fileInfo) {
        fileInfo.status = 'paused';
        updateFileInUI(fileInfo);
        showNotification(`⏸️ "${fileInfo.name}" の処理を一時停止しました`, 'info');
    }
}

function retryProcessing(fileId) {
    const fileInfo = uploadedFiles.get(fileId);
    if (fileInfo) {
        fileInfo.status = 'processing';
        fileInfo.progress = 0;
        updateFileInUI(fileInfo);
        startFileProcessing(fileId);
    }
}

function removeFile(fileId) {
    const fileInfo = uploadedFiles.get(fileId);
    if (fileInfo) {
        uploadedFiles.delete(fileId);
        const fileElement = document.getElementById(`file-${fileId}`);
        if (fileElement) {
            fileElement.remove();
        }
        showNotification(`🗑️ "${fileInfo.name}" を削除しました`, 'info');
    }
}

function viewResults(fileId) {
    const fileInfo = uploadedFiles.get(fileId);
    if (fileInfo && fileInfo.results) {
        showModal(
            `${fileInfo.name} - 処理結果`,
            generateDetailedResults(fileInfo),
            [
                {
                    label: 'FAQ生成',
                    action: () => generateFAQFromFile(fileId),
                    type: 'primary'
                },
                {
                    label: '閉じる',
                    action: () => {},
                    type: 'secondary'
                }
            ]
        );
    }
}

function downloadTranscript(fileId) {
    const fileInfo = uploadedFiles.get(fileId);
    if (fileInfo) {
        // ダウンロード処理のシミュレーション
        showNotification(`📥 "${fileInfo.name}" の文字起こしをダウンロードしています...`, 'info');
        setTimeout(() => {
            showNotification(`✅ ダウンロードが完了しました`, 'success');
        }, 2000);
    }
}

function generateDetailedResults(fileInfo) {
    if (fileInfo.type === 'audio-video') {
        return `
            <div class="results-details">
                <h4>音声認識結果</h4>
                <ul>
                    <li>文字起こし: 完了 (98.5%の精度)</li>
                    <li>話者識別: ${fileInfo.results.speakers}名を検出</li>
                    <li>抽出トピック: ${fileInfo.results.topics}件</li>
                    <li>質問検出: ${fileInfo.results.questions}件</li>
                </ul>
                
                <h4>主要トピック</h4>
                <ul>
                    <li>Q3業績について (出現回数: 15回)</li>
                    <li>半導体事業戦略 (出現回数: 12回)</li>
                    <li>ESG取り組み (出現回数: 8回)</li>
                </ul>
            </div>
        `;
    } else if (fileInfo.type === 'document') {
        return `
            <div class="results-details">
                <h4>文書解析結果</h4>
                <ul>
                    <li>数値データ: ${fileInfo.results.dataPoints}項目を抽出</li>
                    <li>FAQ候補: ${fileInfo.results.faqCandidates}件を生成</li>
                    <li>グラフ・図表: ${fileInfo.results.charts}件を検出</li>
                </ul>
                
                <h4>抽出された主要数値</h4>
                <ul>
                    <li>売上高: 前年同期比+12.5%</li>
                    <li>営業利益: 前年同期比+8.3%</li>
                    <li>ROE: 15.2%</li>
                </ul>
            </div>
        `;
    }
    return '<p>詳細な結果を表示できませんでした。</p>';
}

// ===== Web会議連携機能 =====
function initializeWebMeetingIntegration() {
    loadMeetingConnections();
}

function loadMeetingConnections() {
    // 接続状況の表示更新
    updateConnectionStatus();
}

function updateConnectionStatus() {
    // 実際の実装では、各サービスのAPI状況を確認
    console.log('Web会議サービス接続状況を更新中...');
}

function configureZoom() {
    showModal(
        'Zoom設定',
        `
        <div class="config-form">
            <div class="form-group">
                <label>API Key</label>
                <input type="text" placeholder="Zoom API Key" value="****">
            </div>
            <div class="form-group">
                <label>API Secret</label>
                <input type="password" placeholder="Zoom API Secret" value="****">
            </div>
            <div class="form-group">
                <label>Webhook URL</label>
                <input type="text" value="https://kagami.company.com/webhook/zoom">
            </div>
        </div>
        `,
        [
            {
                label: '保存',
                action: () => saveZoomConfig(),
                type: 'primary'
            },
            {
                label: 'キャンセル',
                action: () => {},
                type: 'secondary'
            }
        ]
    );
}

function disconnectZoom() {
    showModal(
        'Zoom接続解除',
        'Zoomとの連携を解除しますか？自動録画・処理機能が利用できなくなります。',
        [
            {
                label: '解除する',
                action: () => {
                    webMeetingConnections.zoom.connected = false;
                    showNotification('Zoomとの連携を解除しました', 'warning');
                    updateConnectionStatus();
                },
                type: 'danger'
            },
            {
                label: 'キャンセル',
                action: () => {},
                type: 'secondary'
            }
        ]
    );
}

function connectTeams() {
    showNotification('Microsoft Teamsとの連携を開始します...', 'info');
    
    // OAuth認証フローのシミュレーション
    setTimeout(() => {
        webMeetingConnections.teams.connected = true;
        webMeetingConnections.teams.lastSync = new Date().toLocaleString('ja-JP');
        showNotification('✅ Microsoft Teamsとの連携が完了しました', 'success');
        updateConnectionStatus();
    }, 3000);
}

function connectGoogleMeet() {
    showNotification('Google Meetとの連携を開始します...', 'info');
    
    // OAuth認証フローのシミュレーション
    setTimeout(() => {
        webMeetingConnections.googleMeet.connected = true;
        webMeetingConnections.googleMeet.lastSync = new Date().toLocaleString('ja-JP');
        showNotification('✅ Google Meetとの連携が完了しました', 'success');
        updateConnectionStatus();
    }, 3000);
}

function viewMeetingDetails(meetingId) {
    showNotification(`会議詳細画面 (${meetingId}) に移動します`, 'info');
    // 実際の実装では詳細画面に遷移
}

// ===== メール管理機能 =====
function initializeEmailManagement() {
    loadEmailAccounts();
    loadClassificationRules();
}

function loadEmailAccounts() {
    console.log('メールアカウント情報を読み込み中...');
    // 実際の実装では、メールサーバーからアカウント情報を取得
}

function loadClassificationRules() {
    console.log('メール分類ルールを読み込み中...');
    // 実際の実装では、設定されたルールを取得
}

function configureEmail(accountId) {
    showModal(
        'メールアカウント設定',
        `
        <div class="config-form">
            <div class="form-group">
                <label>IMAP Server</label>
                <input type="text" value="imap.company.com">
            </div>
            <div class="form-group">
                <label>Port</label>
                <input type="number" value="993">
            </div>
            <div class="form-group">
                <label>SSL/TLS</label>
                <select>
                    <option value="tls" selected>TLS</option>
                    <option value="ssl">SSL</option>
                </select>
            </div>
            <div class="form-group">
                <label>同期間隔</label>
                <select>
                    <option value="1">1分</option>
                    <option value="5" selected>5分</option>
                    <option value="15">15分</option>
                </select>
            </div>
        </div>
        `,
        [
            {
                label: '保存',
                action: () => showNotification('メールアカウント設定を保存しました', 'success'),
                type: 'primary'
            },
            {
                label: 'キャンセル',
                action: () => {},
                type: 'secondary'
            }
        ]
    );
}

function addEmailAccount() {
    showModal(
        '新規メールアカウント追加',
        `
        <div class="config-form">
            <div class="form-group">
                <label>メールアドレス</label>
                <input type="email" placeholder="example@company.com">
            </div>
            <div class="form-group">
                <label>パスワード</label>
                <input type="password" placeholder="パスワード">
            </div>
            <div class="form-group">
                <label>表示名</label>
                <input type="text" placeholder="アカウント名">
            </div>
            <div class="form-group">
                <label>自動設定</label>
                <select>
                    <option value="auto" selected>自動検出</option>
                    <option value="manual">手動設定</option>
                </select>
            </div>
        </div>
        `,
        [
            {
                label: '追加',
                action: () => showNotification('新しいメールアカウントを追加しました', 'success'),
                type: 'primary'
            },
            {
                label: 'キャンセル',
                action: () => {},
                type: 'secondary'
            }
        ]
    );
}

function editRule(ruleId) {
    showModal(
        '分類ルール編集',
        `
        <div class="config-form">
            <div class="form-group">
                <label>ルール名</label>
                <input type="text" value="緊急対応">
            </div>
            <div class="form-group">
                <label>キーワード</label>
                <input type="text" value="緊急, urgent, 至急, ASAP">
                <small>カンマ区切りで入力</small>
            </div>
            <div class="form-group">
                <label>優先度</label>
                <select>
                    <option value="high" selected>高</option>
                    <option value="medium">中</option>
                    <option value="low">低</option>
                </select>
            </div>
            <div class="form-group">
                <label>自動アクション</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" checked> 即座に通知</label>
                    <label><input type="checkbox"> 自動転送</label>
                    <label><input type="checkbox"> FAQチェック</label>
                </div>
            </div>
        </div>
        `,
        [
            {
                label: '保存',
                action: () => showNotification('分類ルールを更新しました', 'success'),
                type: 'primary'
            },
            {
                label: 'キャンセル',
                action: () => {},
                type: 'secondary'
            }
        ]
    );
}

function createNewRule() {
    showModal(
        '新規分類ルール作成',
        `
        <div class="config-form">
            <div class="form-group">
                <label>ルール名</label>
                <input type="text" placeholder="ルール名を入力">
            </div>
            <div class="form-group">
                <label>キーワード</label>
                <input type="text" placeholder="分類キーワード（カンマ区切り）">
            </div>
            <div class="form-group">
                <label>条件</label>
                <select>
                    <option value="any">いずれかのキーワードを含む</option>
                    <option value="all">すべてのキーワードを含む</option>
                    <option value="exact">完全一致</option>
                </select>
            </div>
            <div class="form-group">
                <label>対象</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" checked> 件名</label>
                    <label><input type="checkbox" checked> 本文</label>
                    <label><input type="checkbox"> 送信者</label>
                </div>
            </div>
        </div>
        `,
        [
            {
                label: '作成',
                action: () => showNotification('新しい分類ルールを作成しました', 'success'),
                type: 'primary'
            },
            {
                label: 'キャンセル',
                action: () => {},
                type: 'secondary'
            }
        ]
    );
}

function respondToEmail(emailId) {
    showNotification(`メール回答画面 (${emailId}) に移動します`, 'info');
    // 実際の実装では回答画面に遷移
}

function viewEmailDetails(emailId) {
    showNotification(`メール詳細画面 (${emailId}) に移動します`, 'info');
    // 実際の実装では詳細画面に遷移
}

// ===== 文書管理機能 =====
function initializeDocumentManagement() {
    loadDocumentList();
}

function loadDocumentList() {
    console.log('文書一覧を読み込み中...');
    // 実際の実装では、登録された文書一覧を取得
}

function manualTdnetSync() {
    showNotification('🔄 TDnetから最新の開示情報を取得中...', 'info');
    
    // 同期処理のシミュレーション
    setTimeout(() => {
        showNotification('✅ TDnet同期が完了しました（新規取得: 2件）', 'success');
    }, 3000);
}

function configureTdnet() {
    showModal(
        'TDnet設定',
        `
        <div class="config-form">
            <div class="form-group">
                <label>会社コード</label>
                <input type="text" placeholder="4桁の会社コード" value="1234">
            </div>
            <div class="form-group">
                <label>自動取得間隔</label>
                <select>
                    <option value="15" selected>15分</option>
                    <option value="30">30分</option>
                    <option value="60">1時間</option>
                </select>
            </div>
            <div class="form-group">
                <label>取得対象</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" checked> 決算短信</label>
                    <label><input type="checkbox" checked> 適時開示</label>
                    <label><input type="checkbox"> IR資料</label>
                </div>
            </div>
        </div>
        `,
        [
            {
                label: '保存',
                action: () => showNotification('TDnet設定を保存しました', 'success'),
                type: 'primary'
            },
            {
                label: 'キャンセル',
                action: () => {},
                type: 'secondary'
            }
        ]
    );
}

function filterDocuments() {
    const documentType = document.getElementById('documentType').value;
    const documentPeriod = document.getElementById('documentPeriod').value;
    
    showNotification(`フィルター適用: 種別=${documentType}, 期間=${documentPeriod}`, 'info');
    // 実際の実装では、フィルター条件に基づいて文書一覧を更新
}

function viewAnalysis(documentId) {
    showNotification(`文書解析結果画面 (${documentId}) に移動します`, 'info');
    // 実際の実装では解析結果画面に遷移
}

function generateFAQ(documentId) {
    showNotification(`文書 (${documentId}) からFAQを生成中...`, 'info');
    
    setTimeout(() => {
        showNotification('✅ FAQ候補12件を生成しました', 'success');
        setTimeout(() => {
            showModal(
                'FAQ生成完了',
                'AI-FAQ管理画面で生成されたFAQ候補を確認しますか？',
                [
                    {
                        label: 'FAQ管理画面へ',
                        action: () => navigateTo('ai-faq.html'),
                        type: 'primary'
                    },
                    {
                        label: '後で確認',
                        action: () => {},
                        type: 'secondary'
                    }
                ]
            );
        }, 1000);
    }, 3000);
}

function generateFAQFromFile(fileId) {
    const fileInfo = uploadedFiles.get(fileId);
    if (fileInfo) {
        showNotification(`"${fileInfo.name}" からFAQを生成中...`, 'info');
        setTimeout(() => {
            showNotification('✅ FAQ候補8件を生成しました', 'success');
        }, 2000);
    }
}

// ===== 処理状況更新 =====
function updateProcessingStats() {
    // 処理状況の統計を更新
    const audioProcessing = processingQueue.filter(id => {
        const file = uploadedFiles.get(id);
        return file && file.type === 'audio-video';
    }).length;
    
    const emailProcessing = Math.floor(Math.random() * 5) + 3; // シミュレーション
    const documentProcessing = Math.floor(Math.random() * 3) + 1; // シミュレーション
    
    // UI更新
    const statItems = document.querySelectorAll('.stat-item');
    if (statItems.length >= 3) {
        statItems[0].querySelector('.stat-value').textContent = audioProcessing;
        statItems[1].querySelector('.stat-value').textContent = emailProcessing;
        statItems[2].querySelector('.stat-value').textContent = documentProcessing;
    }
}

function updateProgressBars() {
    // 進行中の処理の進捗バーを更新
    processingQueue.forEach(fileId => {
        const fileInfo = uploadedFiles.get(fileId);
        if (fileInfo && fileInfo.status === 'processing') {
            updateFileInUI(fileInfo);
        }
    });
}

// ===== ユーティリティ関数 =====
function generateFileId() {
    return 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function navigateTo(page) {
    window.location.href = page;
}

function logout() {
    if (confirm('ログアウトしますか？')) {
        window.location.href = 'login.html';
    }
}

    // ===== パブリック API =====
    return {
        // 初期化
        init: (dependencies) => {
            logger = dependencies.logger || console;
            eventBus = dependencies.eventBus || { emit: () => {}, on: () => {} };
            securityValidator = dependencies.securityValidator || {};
            performanceMonitor = dependencies.performanceMonitor;
            
            return init();
        },
        
        // 状態アクセス
        get state() {
            return { ..._state };
        },
        
        get config() {
            return { ..._config };
        },
        
        // ファイル処理
        uploadFile: uploadFile,
        processFile: processFile,
        
        // セクション管理
        switchSection: switchSection,
        
        // 統計情報
        getProcessingStats: () => ({ ..._state.processingStats }),
        
        // Web会議連携
        connectWebMeetingService: connectWebMeetingService,
        
        // デバッグ用
        _debug: {
            state: _state,
            config: _config
        }
    };
    
    // ===== 内部関数 =====
    async function init() {
        try {
            logger.info('📥 データ取込・処理システム v2.0 - 起動中...');
            
            initializeSectionNavigation();
            initializeFileUpload();
            initializeDragAndDrop();
            initializeWebMeetingIntegration();
            
            logger.info('✅ データ取込・処理システム v2.0 - 起動完了');
            
        } catch (error) {
            logger.error('データ取込システム初期化エラー', { error: error.message });
            throw error;
        }
    }
    
    async function uploadFile(file) {
        try {
            // ファイルバリデーション
            const sanitizedName = EnhancedFileValidator.validateFile(file);
            
            // アップロード処理
            const uploader = new ChunkedUploader(file);
            const result = await uploader.upload((progress) => {
                eventBus.emit('upload:progress', { filename: file.name, progress });
            });
            
            // 状態更新
            _state.uploadedFiles.set(result.fileId, {
                file: file,
                uploadId: result.uploadId,
                status: 'uploaded',
                uploadTime: new Date().toISOString()
            });
            
            eventBus.emit('file:uploaded', { file, result });
            
            return result;
            
        } catch (error) {
            logger.error('ファイルアップロードエラー', { filename: file.name, error: error.message });
            throw error;
        }
    }
    
    async function processFile(fileId) {
        const fileData = _state.uploadedFiles.get(fileId);
        if (!fileData) {
            throw new Error('ファイルが見つかりません');
        }
        
        const file = fileData.file;
        const strategy = getProcessingStrategy(file);
        
        try {
            _state.uploadedFiles.set(fileId, {
                ...fileData,
                status: 'processing',
                processingStartTime: new Date().toISOString()
            });
            
            const result = await strategy.process(file);
            
            _state.uploadedFiles.set(fileId, {
                ...fileData,
                status: 'completed',
                result: result,
                processingEndTime: new Date().toISOString()
            });
            
            updateProcessingStats('success');
            
            return result;
            
        } catch (error) {
            _state.uploadedFiles.set(fileId, {
                ...fileData,
                status: 'error',
                error: error.message,
                processingEndTime: new Date().toISOString()
            });
            
            updateProcessingStats('error');
            throw error;
        }
    }
    
    function getProcessingStrategy(file) {
        for (const [type, strategy] of Object.entries(ProcessingStrategies)) {
            if (strategy.validate(file)) {
                return strategy;
            }
        }
        return ProcessingStrategies.default;
    }
    
    function updateProcessingStats(result) {
        _state.processingStats.totalProcessed++;
        if (result === 'success') {
            _state.processingStats.successCount++;
        } else if (result === 'error') {
            _state.processingStats.errorCount++;
        }
    }
    
    function switchSection(section) {
        _state.currentSection = section;
        eventBus.emit('section:changed', { section });
        logger.debug('セクション切り替え', { section });
    }
    
    function connectWebMeetingService(service, config) {
        _state.webMeetingConnections.set(service, {
            connected: true,
            lastSync: new Date().toISOString(),
            config: config
        });
        
        eventBus.emit('webmeeting:connected', { service, config });
        logger.info('Web会議サービス接続', { service });
    }
    
    // ===== 既存関数のリファクタリング =====
    function initializeSectionNavigation() {
        // セクションナビゲーションの初期化
    }
    
    function initializeFileUpload() {
        // ファイルアップロードの初期化
    }
    
    function initializeDragAndDrop() {
        // ドラッグ&ドロップの初期化
    }
    
    function initializeWebMeetingIntegration() {
        // Web会議連携の初期化
    }
    
    // ===== シミュレーション関数 =====
    async function simulateAudioProcessing(file) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
            type: 'audio',
            duration: '00:15:30',
            transcription: 'サンプル音声転写テキスト...',
            highlights: ['重要なポイント1', '重要なポイント2']
        };
    }
    
    async function simulateVideoProcessing(file) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        return {
            type: 'video',
            duration: '00:25:45',
            thumbnails: ['thumb1.jpg', 'thumb2.jpg'],
            transcription: 'サンプル動画転写テキスト...'
        };
    }
    
    async function simulateDocumentProcessing(file) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
            type: 'document',
            pageCount: 25,
            extractedText: 'サンプル文書テキスト...',
            summary: '文書の要約...'
        };
    }
    
    function generateAudioPreview(file) {
        return `<div class="audio-preview">🎵 ${file.name}</div>`;
    }
    
    function generateVideoPreview(file) {
        return `<div class="video-preview">🎬 ${file.name}</div>`;
    }
    
    function generateDocumentPreview(file) {
        return `<div class="document-preview">📄 ${file.name}</div>`;
    }
    
    function generateGenericPreview(file) {
        return `<div class="generic-preview">📎 ${file.name}</div>`;
    }
    
    function formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }
    
})();

// ===== モジュール初期化 =====
document.addEventListener('DOMContentLoaded', function() {
    if (window.KAGAMI) {
        DataInputModule.init({
            logger: KAGAMI.logger,
            eventBus: KAGAMI.events,
            securityValidator: KAGAMI.validator,
            performanceMonitor: KAGAMI.getPerformanceReport ? KAGAMI : null
        });
    } else {
        console.warn('KAGAMI コアモジュールが見つかりません');
        DataInputModule.init({});
    }
});

// ===== グローバル公開 =====
window.DataInputModule = DataInputModule;

console.log('📥 データ取込・処理JavaScript v2.0 - 読み込み完了'); 