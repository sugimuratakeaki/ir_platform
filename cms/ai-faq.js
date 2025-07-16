// 🤖 AI-FAQ管理 専用JavaScript v2.0

// ===== モジュラーアーキテクチャ =====
const AiFaqModule = (function() {
    'use strict';
    
    // ===== プライベート状態 =====
    const _state = {
        currentSection: 'generation',
        currentFAQ: null,
        generatedFAQs: new Map(),
        approvalQueue: [],
        publishedFAQs: new Map(),
        batchGenerationProcess: null,
        editorTabs: ['edit', 'preview', 'versions'],
        currentTab: 'edit',
        aiModels: new Map([
            ['gpt-4', { available: true, responseTime: '2-5秒', quality: 'high' }],
            ['claude', { available: true, responseTime: '1-3秒', quality: 'high' }],
            ['custom', { available: false, responseTime: 'N/A', quality: 'medium' }]
        ]),
        processingStats: {
            accuracy: 96.8,
            generatingCount: 3,
            pendingApproval: 5,
            totalGenerated: 1247,
            totalApproved: 1189,
            qualityAverage: 0.89
        }
    };
    
    const _config = {
        maxFaqLength: 2000,
        maxBatchSize: 50,
        autoSaveInterval: 30000,
        qualityThreshold: 0.8,
        approvalLevels: ['reviewer', 'manager', 'admin'],
        aiProvider: 'gpt-4',
        templates: {
            financial: 'IR・財務関連のFAQテンプレート',
            governance: 'ガバナンス関連のFAQテンプレート',
            general: '一般的なFAQテンプレート'
        }
    };
    
    // ===== 依存性注入 =====
    let logger, eventBus, securityValidator, performanceMonitor;

// ===== アプリケーション初期化 =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🤖 AI-FAQ管理システム - 起動中...');
    
    initializeAIFAQ();
    initializeSectionNavigation();
    initializeFAQGeneration();
    initializeFAQEditor();
    initializeApprovalSystem();
    initializeFAQManagement();
    
    console.log('✅ AI-FAQ管理システム - 起動完了');
});

// ===== AI-FAQ初期化 =====
function initializeAIFAQ() {
    // AI状況の更新
    updateAIStatus();
    
    // 定期的な状況更新（30秒ごと）
    setInterval(updateAIStatus, 30000);
    
    // FAQ生成の進行状況更新（5秒ごと）
    setInterval(updateGenerationProgress, 5000);
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
    document.querySelectorAll('.faq-section').forEach(sec => {
        sec.style.display = 'none';
    });
    document.getElementById(`${section}-section`).style.display = 'block';
    
    currentSection = section;
    
    // セクション別の初期化処理
    switch(section) {
        case 'generation':
            loadGenerationTools();
            break;
        case 'approval':
            loadApprovalQueue();
            break;
        case 'management':
            loadFAQManagement();
            break;
        case 'analytics':
            loadFAQAnalytics();
            break;
        case 'learning':
            loadLearningData();
            break;
    }
    
    showNotification(`${getSectionName(section)}に切り替えました`, 'info');
}

function getSectionName(section) {
    const names = {
        'generation': 'FAQ生成・編集',
        'approval': '承認キュー',
        'management': 'FAQ管理',
        'analytics': 'FAQ分析',
        'learning': '学習データ管理'
    };
    return names[section] || section;
}

// ===== FAQ生成機能 =====
function initializeFAQGeneration() {
    // 生成ボタンのイベントリスナー
    const generateBtn = document.querySelector('.generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateFAQ);
    }
    
    // 一括生成ボタンのイベントリスナー
    const batchGenerateBtn = document.querySelector('.batch-generate-btn');
    if (batchGenerateBtn) {
        batchGenerateBtn.addEventListener('click', startBatchGeneration);
    }
}

function generateFAQ() {
    const questionInput = document.getElementById('questionInput');
    const generationMode = document.getElementById('generationMode');
    const confidenceLevel = document.getElementById('confidenceLevel');
    
    if (!questionInput.value.trim()) {
        showNotification('質問を入力してください', 'warning');
        return;
    }
    
    const question = questionInput.value.trim();
    const mode = generationMode.value;
    const minConfidence = parseInt(confidenceLevel.value);
    
    showNotification('🤖 AI-FAQを生成中...', 'info');
    
    // 生成処理をシミュレーション
    setTimeout(() => {
        const generatedFAQ = simulateFAQGeneration(question, mode, minConfidence);
        displayGenerationResult(generatedFAQ);
    }, 3000);
}

function simulateFAQGeneration(question, mode, minConfidence) {
    const confidence = Math.random() * 20 + 80; // 80-100%の信頼度
    const faqId = generateFAQId();
    
    const faq = {
        id: faqId,
        question: question,
        answer: generateAnswer(question, mode),
        confidence: confidence,
        mode: mode,
        minConfidence: minConfidence,
        generatedAt: new Date(),
        status: confidence >= minConfidence ? 'ready' : 'needs_improvement',
        sources: [
            '📊 2024年Q3決算説明資料 (p.15-18)',
            '📋 中期経営計画 (半導体戦略部分)',
            '🎤 IR面談記録 (BlackRock社、2024/12/15)'
        ],
        metrics: {
            wordCount: Math.floor(Math.random() * 200) + 200,
            readingTime: Math.floor(Math.random() * 30) + 30,
            technicalLevel: mode === 'technical' ? '高' : mode === 'friendly' ? '低' : '中'
        }
    };
    
    generatedFAQs.set(faqId, faq);
    return faq;
}

function generateAnswer(question, mode) {
    const answers = {
        comprehensive: `詳細な回答を生成いたします。${question.replace('？', '')}について、包括的にご説明いたします。

当社の戦略は以下の通りです：

1. **第一段階**: 基盤強化フェーズ
   現在の事業基盤をさらに強化し、競争優位性を確立します。

2. **第二段階**: 成長加速フェーズ
   新規事業領域への展開を積極的に進めてまいります。

3. **第三段階**: 市場リーダー確立フェーズ
   業界をリードするポジションの確立を目指します。

これらの施策により、持続的な企業価値向上を実現してまいります。`,

        concise: `${question.replace('？', '')}について、簡潔にご説明いたします。

当社では以下の3つの重点施策を推進しています：
・基盤事業の強化と効率化
・新規事業領域への戦略的投資
・デジタル技術を活用した競争力向上

これらにより、中期的な成長目標の達成を目指しています。`,

        technical: `${question.replace('？', '')}について、技術的観点から詳細にご説明いたします。

【技術開発ロードマップ】
Phase 1: 次世代アーキテクチャの設計・検証
Phase 2: プロトタイプ開発とテスト実装
Phase 3: 商用化に向けた最適化

【投資計画】
研究開発費: 前年比120%
設備投資: 新工場建設を含む大型投資
人材投資: エンジニア100名の新規採用

技術的な差別化により、競合他社に対する優位性を確保します。`,

        friendly: `${question.replace('？', '')}について、分かりやすくご説明させていただきますね。

私たちの会社では、お客様により良いサービスをお届けするために、3つの大切な取り組みを進めています。

まず第一に、今ある事業をもっと良くしていくことです。これまで培ってきた技術やノウハウを活かして、より効率的で質の高いサービスを提供します。

第二に、新しい分野への挑戦です。時代の変化に合わせて、新しい技術や市場に積極的に取り組んでいます。

第三に、デジタル技術の活用です。最新のテクノロジーを使って、お客様の利便性向上を図っています。

これらの取り組みを通じて、持続的な成長を実現し、すべてのステークホルダーの皆様にご満足いただける企業を目指しています。`
    };
    
    return answers[mode] || answers.concise;
}

function displayGenerationResult(faq) {
    const resultsSection = document.getElementById('generationResults');
    const generatedQuestion = document.querySelector('.generated-question');
    const confidenceValue = document.querySelector('.confidence-value');
    const generatedAnswer = document.getElementById('generatedAnswer');
    
    // 結果セクションを表示
    resultsSection.style.display = 'block';
    
    // 生成されたFAQを表示
    generatedQuestion.textContent = faq.question;
    confidenceValue.textContent = `${faq.confidence.toFixed(1)}%`;
    confidenceValue.className = `confidence-value ${getConfidenceClass(faq.confidence)}`;
    generatedAnswer.innerHTML = faq.answer.replace(/\n/g, '<br>');
    
    // メタデータを更新
    updateFAQMetadata(faq);
    
    // 現在のFAQとして設定
    currentFAQ = faq;
    
    showNotification(`✅ FAQ生成完了 (信頼度: ${faq.confidence.toFixed(1)}%)`, 'success');
}

function getConfidenceClass(confidence) {
    if (confidence >= 90) return 'high';
    if (confidence >= 80) return 'medium';
    return 'low';
}

function updateFAQMetadata(faq) {
    const sourceReferences = document.querySelector('.source-references ul');
    const qualityMetrics = document.querySelector('.quality-metrics');
    
    // ソース参照を更新
    if (sourceReferences) {
        sourceReferences.innerHTML = faq.sources.map(source => 
            `<li>${source}</li>`
        ).join('');
    }
    
    // 品質メトリクスを更新
    if (qualityMetrics) {
        qualityMetrics.innerHTML = `
            <span class="metric">📝 文字数: ${faq.metrics.wordCount}文字</span>
            <span class="metric">🎯 専門度: ${faq.metrics.technicalLevel}</span>
            <span class="metric">⏱️ 読了時間: ${faq.metrics.readingTime}秒</span>
        `;
    }
}

// ===== FAQ編集機能 =====
function initializeFAQEditor() {
    // タブ切り替えイベント
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchEditorTab(tab);
        });
    });
    
    // エディタのリアルタイムプレビュー
    const editQuestion = document.getElementById('editQuestion');
    const editAnswer = document.getElementById('editAnswer');
    
    if (editQuestion) {
        editQuestion.addEventListener('input', updatePreview);
    }
    
    if (editAnswer) {
        editAnswer.addEventListener('input', updatePreview);
    }
}

function editGeneratedFAQ() {
    if (!currentFAQ) {
        showNotification('編集するFAQが選択されていません', 'warning');
        return;
    }
    
    // FAQ編集エディタを表示
    const editorSection = document.getElementById('faqEditor');
    editorSection.style.display = 'block';
    
    // 現在のFAQデータをエディタに設定
    document.getElementById('editQuestion').value = currentFAQ.question;
    document.getElementById('editAnswer').value = currentFAQ.answer;
    
    // プレビューを更新
    updatePreview();
    
    showNotification('✏️ 編集モードに切り替えました', 'info');
}

function switchEditorTab(tab) {
    // タブボタンの状態更新
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // タブコンテンツの表示切り替え
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}-tab`).classList.add('active');
    
    currentTab = tab;
    
    // タブ別の処理
    if (tab === 'preview') {
        updatePreview();
    }
}

function updatePreview() {
    const question = document.getElementById('editQuestion')?.value || '';
    const answer = document.getElementById('editAnswer')?.value || '';
    
    const previewQuestion = document.getElementById('previewQuestion');
    const previewAnswer = document.getElementById('previewAnswer');
    
    if (previewQuestion) {
        previewQuestion.textContent = question;
    }
    
    if (previewAnswer) {
        previewAnswer.innerHTML = answer.replace(/\n/g, '<br>');
    }
}

function insertFormatting(type) {
    const textarea = document.getElementById('editAnswer');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let insertText = '';
    switch(type) {
        case 'bold':
            insertText = `**${selectedText || 'テキスト'}**`;
            break;
        case 'italic':
            insertText = `*${selectedText || 'テキスト'}*`;
            break;
        case 'link':
            insertText = `[${selectedText || 'リンクテキスト'}](URL)`;
            break;
        case 'list':
            insertText = selectedText ? `• ${selectedText}` : '• リストアイテム';
            break;
    }
    
    textarea.value = textarea.value.substring(0, start) + insertText + textarea.value.substring(end);
    textarea.focus();
    
    updatePreview();
}

function checkGrammar() {
    showNotification('📝 文法チェックを実行中...', 'info');
    
    setTimeout(() => {
        const issues = Math.floor(Math.random() * 3);
        if (issues === 0) {
            showNotification('✅ 文法上の問題は見つかりませんでした', 'success');
        } else {
            showNotification(`⚠️ ${issues}件の文法上の注意点があります`, 'warning');
        }
    }, 2000);
}

function checkCompliance() {
    showNotification('⚖️ コンプライアンスチェックを実行中...', 'info');
    
    setTimeout(() => {
        const isCompliant = Math.random() > 0.2;
        if (isCompliant) {
            showNotification('✅ コンプライアンス上の問題はありません', 'success');
        } else {
            showNotification('⚠️ 法的リスクの可能性があります。法務部の確認が必要です', 'warning');
        }
    }, 1500);
}

function saveEditedFAQ() {
    if (!currentFAQ) return;
    
    const question = document.getElementById('editQuestion').value;
    const answer = document.getElementById('editAnswer').value;
    const category = document.getElementById('editCategory').value;
    const priority = document.getElementById('editPriority').value;
    const tags = document.getElementById('editTags').value;
    
    // FAQを更新
    currentFAQ.question = question;
    currentFAQ.answer = answer;
    currentFAQ.category = category;
    currentFAQ.priority = priority;
    currentFAQ.tags = tags.split(',').map(tag => tag.trim());
    currentFAQ.lastModified = new Date();
    
    // バージョン履歴に追加
    if (!currentFAQ.versions) {
        currentFAQ.versions = [];
    }
    currentFAQ.versions.push({
        version: `${currentFAQ.versions.length + 1}.0`,
        question: question,
        answer: answer,
        modifiedAt: new Date(),
        modifiedBy: '田中IR担当者'
    });
    
    showNotification('💾 FAQを保存しました', 'success');
}

function publishFAQ() {
    if (!currentFAQ) return;
    
    showModal(
        'FAQ公開確認',
        'このFAQを公開しますか？公開後は投資家に表示されます。',
        [
            {
                label: '公開する',
                action: () => {
                    currentFAQ.status = 'published';
                    currentFAQ.publishedAt = new Date();
                    publishedFAQs.set(currentFAQ.id, currentFAQ);
                    showNotification('🚀 FAQを公開しました', 'success');
                },
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

function cancelEdit() {
    const editorSection = document.getElementById('faqEditor');
    editorSection.style.display = 'none';
    showNotification('編集をキャンセルしました', 'info');
}

// ===== バッチ生成機能 =====
function startBatchGeneration() {
    const selectedSources = [];
    const sourceOptions = document.querySelectorAll('.source-option input[type="checkbox"]:checked');
    
    sourceOptions.forEach(option => {
        const optionInfo = option.closest('.source-option').querySelector('.option-title').textContent;
        selectedSources.push(optionInfo);
    });
    
    if (selectedSources.length === 0) {
        showNotification('生成ソースを選択してください', 'warning');
        return;
    }
    
    const totalFAQs = Math.floor(Math.random() * 10) + 8; // 8-17件
    
    showNotification(`⚡ ${totalFAQs}件のFAQ一括生成を開始します`, 'info');
    
    // バッチ生成進行状況を表示
    const batchProgress = document.getElementById('batchProgress');
    batchProgress.style.display = 'block';
    
    // 生成プロセスを開始
    batchGenerationProcess = {
        totalFAQs: totalFAQs,
        completedFAQs: 0,
        startTime: new Date(),
        sources: selectedSources
    };
    
    simulateBatchGeneration();
}

function simulateBatchGeneration() {
    if (!batchGenerationProcess) return;
    
    const process = batchGenerationProcess;
    const progressFill = document.getElementById('batchProgressFill');
    const progressText = document.getElementById('batchProgressText');
    const generationLog = document.getElementById('generationLog');
    
    const interval = setInterval(() => {
        process.completedFAQs++;
        
        const progressPercent = (process.completedFAQs / process.totalFAQs) * 100;
        progressFill.style.width = `${progressPercent}%`;
        progressText.textContent = `${process.completedFAQs} / ${process.totalFAQs} FAQ`;
        
        // ログ追加
        const logEntry = document.createElement('div');
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] FAQ ${process.completedFAQs} 生成完了: "質問 ${process.completedFAQs} について"`;
        generationLog.appendChild(logEntry);
        generationLog.scrollTop = generationLog.scrollHeight;
        
        if (process.completedFAQs >= process.totalFAQs) {
            clearInterval(interval);
            showNotification(`🎉 一括生成完了！${process.totalFAQs}件のFAQを生成しました`, 'success');
            
            // 承認キューに追加
            aiStatus.pendingApproval += process.totalFAQs;
            updateAIStatus();
        }
    }, 2000);
}

// ===== 承認システム =====
function initializeApprovalSystem() {
    loadApprovalQueue();
}

function loadApprovalQueue() {
    console.log('承認キューを読み込み中...');
    updateApprovalFilters();
}

function updateApprovalFilters() {
    // フィルター処理のシミュレーション
    console.log('承認キューフィルターを更新中...');
}

function quickApprove(faqId) {
    showModal(
        'FAQ承認確認',
        `このFAQを承認して公開しますか？\nFAQ ID: ${faqId}`,
        [
            {
                label: '承認・公開',
                action: () => {
                    approveFAQById(faqId);
                    showNotification(`✅ FAQ (${faqId}) を承認・公開しました`, 'success');
                },
                type: 'success'
            },
            {
                label: 'キャンセル',
                action: () => {},
                type: 'secondary'
            }
        ]
    );
}

function requestRevision(faqId) {
    showModal(
        'FAQ修正依頼',
        `
        <div class="revision-form">
            <div class="form-group">
                <label>修正理由</label>
                <select id="revisionReason">
                    <option value="accuracy">内容の正確性</option>
                    <option value="clarity">表現の明確性</option>
                    <option value="compliance">コンプライアンス</option>
                    <option value="style">文体・スタイル</option>
                    <option value="other">その他</option>
                </select>
            </div>
            <div class="form-group">
                <label>修正内容の詳細</label>
                <textarea id="revisionDetails" placeholder="具体的な修正内容を入力してください" rows="4"></textarea>
            </div>
        </div>
        `,
        [
            {
                label: '修正依頼送信',
                action: () => {
                    const reason = document.getElementById('revisionReason').value;
                    const details = document.getElementById('revisionDetails').value;
                    showNotification(`📝 FAQ (${faqId}) の修正依頼を送信しました`, 'warning');
                },
                type: 'warning'
            },
            {
                label: 'キャンセル',
                action: () => {},
                type: 'secondary'
            }
        ]
    );
}

function rejectFAQ(faqId) {
    showModal(
        'FAQ却下確認',
        `このFAQを却下しますか？却下したFAQは削除されます。\nFAQ ID: ${faqId}`,
        [
            {
                label: '却下',
                action: () => {
                    showNotification(`❌ FAQ (${faqId}) を却下しました`, 'error');
                    aiStatus.pendingApproval = Math.max(0, aiStatus.pendingApproval - 1);
                    updateAIStatus();
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

function expandFAQPreview(faqId) {
    showModal(
        `FAQ詳細プレビュー - ${faqId}`,
        `
        <div class="faq-detail-preview">
            <h4>Q. ESG経営における具体的な取り組みについて</h4>
            <div class="faq-full-answer">
                <p><strong>A.</strong> 当社では環境・社会・ガバナンスの3つの軸で包括的なESG経営を推進しています。</p>
                
                <h5>環境（Environment）への取り組み</h5>
                <ul>
                    <li>2030年カーボンニュートラル達成に向けた具体的ロードマップの策定</li>
                    <li>再生可能エネルギー比率の段階的拡大（現在35% → 2030年100%）</li>
                    <li>循環型経済への貢献（リサイクル率90%以上の維持）</li>
                </ul>
                
                <h5>社会（Social）への貢献</h5>
                <ul>
                    <li>ダイバーシティ&インクルージョンの推進（女性管理職比率30%目標）</li>
                    <li>働き方改革と従業員エンゲージメント向上</li>
                    <li>地域社会との連携強化と社会貢献活動</li>
                </ul>
                
                <h5>ガバナンス（Governance）の強化</h5>
                <ul>
                    <li>独立社外取締役比率の向上（現在40%）</li>
                    <li>透明性の高い情報開示とステークホルダー対話</li>
                    <li>リスク管理体制の継続的強化</li>
                </ul>
                
                <p>これらの取り組みを通じて、持続可能な社会の実現に貢献し、長期的な企業価値向上を目指しています。</p>
            </div>
            <div class="faq-metadata">
                <div class="metadata-item">
                    <strong>信頼度:</strong> 94.2%
                </div>
                <div class="metadata-item">
                    <strong>参照データ:</strong> ESG報告書2024、サステナビリティ戦略説明会資料
                </div>
                <div class="metadata-item">
                    <strong>最終更新:</strong> 2024/12/19 14:30
                </div>
            </div>
        </div>
        `,
        [
            {
                label: '承認',
                action: () => quickApprove(faqId),
                type: 'success'
            },
            {
                label: '修正依頼',
                action: () => requestRevision(faqId),
                type: 'warning'
            },
            {
                label: '閉じる',
                action: () => {},
                type: 'secondary'
            }
        ]
    );
}

function approveFAQById(faqId) {
    // FAQ承認処理
    aiStatus.pendingApproval = Math.max(0, aiStatus.pendingApproval - 1);
    aiStatus.totalApproved++;
    updateAIStatus();
}

function bulkApprove() {
    const selectedItems = document.querySelectorAll('.approval-item input:checked');
    if (selectedItems.length === 0) {
        showNotification('承認するFAQを選択してください', 'warning');
        return;
    }
    
    showModal(
        '一括承認確認',
        `選択された${selectedItems.length}件のFAQを一括承認しますか？`,
        [
            {
                label: `${selectedItems.length}件承認`,
                action: () => {
                    selectedItems.forEach(item => {
                        // 承認処理
                    });
                    showNotification(`✅ ${selectedItems.length}件のFAQを一括承認しました`, 'success');
                    aiStatus.pendingApproval = Math.max(0, aiStatus.pendingApproval - selectedItems.length);
                    updateAIStatus();
                },
                type: 'success'
            },
            {
                label: 'キャンセル',
                action: () => {},
                type: 'secondary'
            }
        ]
    );
}

// ===== FAQ管理機能 =====
function initializeFAQManagement() {
    // 検索機能の初期化
    const searchInput = document.getElementById('faqSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchFAQs, 500));
    }
    
    // チェックボックス全選択機能
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', toggleSelectAll);
    }
    
    // 行チェックボックスの監視
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateBulkActions);
    });
}

function loadFAQManagement() {
    console.log('FAQ管理データを読み込み中...');
    updateFAQList();
}

function searchFAQs() {
    const searchTerm = document.getElementById('faqSearchInput').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilterManagement').value;
    const sortOrder = document.getElementById('sortOrder').value;
    
    console.log('FAQ検索:', { searchTerm, statusFilter, categoryFilter, sortOrder });
    
    showNotification(`検索条件で${Math.floor(Math.random() * 50) + 20}件のFAQが見つかりました`, 'info');
}

function updateFAQList() {
    // FAQ一覧の更新処理
    console.log('FAQ一覧を更新中...');
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    
    rowCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
    
    updateBulkActions();
}

function updateBulkActions() {
    const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
    const count = selectedCheckboxes.length;
    
    // 選択件数の更新
    const selectedCountSpan = document.getElementById('selectedFAQCount');
    if (selectedCountSpan) {
        selectedCountSpan.textContent = count;
    }
    
    // 一括操作ボタンの有効/無効
    const bulkButtons = document.querySelectorAll('.bulk-management-actions button');
    bulkButtons.forEach(button => {
        button.disabled = count === 0;
    });
}

function editFAQ(faqId) {
    showNotification(`FAQ編集画面 (${faqId}) に移動します`, 'info');
    // 実際の実装では編集画面を表示
}

function viewFAQStats(faqId) {
    showModal(
        `FAQ統計情報 - ${faqId}`,
        `
        <div class="faq-stats">
            <h4>📊 閲覧統計</h4>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">1,247</div>
                    <div class="stat-label">総閲覧数</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">89</div>
                    <div class="stat-label">今週の閲覧数</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">4.7</div>
                    <div class="stat-label">平均評価</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">12</div>
                    <div class="stat-label">改善提案数</div>
                </div>
            </div>
            
            <h4>📈 トレンド分析</h4>
            <ul>
                <li>過去30日間で閲覧数が23%増加</li>
                <li>個人投資家からの閲覧が多い（68%）</li>
                <li>モバイルからのアクセスが増加傾向</li>
                <li>関連キーワード: 半導体、戦略、成長</li>
            </ul>
        </div>
        `,
        [
            {
                label: '詳細分析',
                action: () => navigateTo('analytics.html'),
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

function duplicateFAQ(faqId) {
    showNotification(`FAQ (${faqId}) を複製しました`, 'success');
}

function createNewFAQ() {
    // FAQ生成セクションに切り替え
    switchSection('generation');
    showNotification('新規FAQ作成モードに切り替えました', 'info');
}

function exportFAQs() {
    showNotification('📤 FAQ一覧をエクスポート中...', 'info');
    
    setTimeout(() => {
        showNotification('✅ FAQ一覧のエクスポートが完了しました', 'success');
    }, 2000);
}

function importFAQs() {
    showModal(
        'FAQインポート',
        `
        <div class="import-form">
            <div class="form-group">
                <label>インポートファイル</label>
                <input type="file" accept=".csv,.xlsx,.json" id="importFile">
                <small>対応形式: CSV, Excel, JSON</small>
            </div>
            <div class="form-group">
                <label>インポート設定</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" checked> 重複チェック</label>
                    <label><input type="checkbox" checked> 自動品質チェック</label>
                    <label><input type="checkbox"> 即座に公開</label>
                </div>
            </div>
        </div>
        `,
        [
            {
                label: 'インポート実行',
                action: () => {
                    showNotification('📥 FAQインポートを開始しました', 'info');
                    setTimeout(() => {
                        showNotification('✅ 23件のFAQをインポートしました', 'success');
                    }, 3000);
                },
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

// ===== ページネーション機能 =====
function previousPage() {
    console.log('前のページに移動');
}

function nextPage() {
    console.log('次のページに移動');
}

function changePageSize() {
    const pageSize = document.querySelector('.page-size').value;
    console.log(`表示件数を${pageSize}件に変更`);
}

// ===== AI状況更新 =====
function updateAIStatus() {
    // AI精度の更新
    const accuracyElement = document.querySelector('.ai-stats .stat-item:nth-child(1) .stat-value');
    if (accuracyElement) {
        // 微小な変動をシミュレーション
        aiStatus.accuracy += (Math.random() - 0.5) * 0.2;
        aiStatus.accuracy = Math.max(95, Math.min(99, aiStatus.accuracy));
        accuracyElement.textContent = `${aiStatus.accuracy.toFixed(1)}%`;
    }
    
    // 生成中の件数更新
    const generatingElement = document.querySelector('.ai-stats .stat-item:nth-child(2) .stat-value');
    if (generatingElement) {
        generatingElement.textContent = aiStatus.generatingCount;
    }
    
    // 承認待ち件数更新
    const pendingElement = document.querySelector('.ai-stats .stat-item:nth-child(3) .stat-value');
    if (pendingElement) {
        pendingElement.textContent = aiStatus.pendingApproval;
    }
}

function updateGenerationProgress() {
    // 生成進行中のFAQの進捗更新
    if (batchGenerationProcess && batchGenerationProcess.completedFAQs < batchGenerationProcess.totalFAQs) {
        console.log('バッチ生成進行中...');
    }
}

// ===== ユーティリティ関数 =====
function generateFAQId() {
    return 'faq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function navigateTo(page) {
    window.location.href = page;
}

function logout() {
    if (confirm('ログアウトしますか？')) {
        window.location.href = 'login.html';
    }
}

// ===== データ読み込み関数 =====
function loadGenerationTools() {
    console.log('FAQ生成ツールを読み込み中...');
}

function loadFAQAnalytics() {
    console.log('FAQ分析データを読み込み中...');
}

function loadLearningData() {
    console.log('学習データを読み込み中...');
}

// FAQ生成アクション関数
function approveFAQ() {
    if (!currentFAQ) return;
    quickApprove(currentFAQ.id);
}

function regenerateFAQ() {
    if (!currentFAQ) return;
    
    showNotification('🔄 FAQを再生成中...', 'info');
    
    setTimeout(() => {
        const newFAQ = simulateFAQGeneration(
            currentFAQ.question, 
            currentFAQ.mode, 
            currentFAQ.minConfidence
        );
        displayGenerationResult(newFAQ);
        showNotification('✅ FAQ再生成が完了しました', 'success');
    }, 2500);
}

function saveDraft() {
    if (!currentFAQ) return;
    
    currentFAQ.status = 'draft';
    currentFAQ.savedAt = new Date();
    showNotification('💾 FAQを下書きとして保存しました', 'success');
}

// バージョン管理関数
function revertVersion(version) {
    showModal(
        'バージョン復元確認',
        `バージョン ${version} に復元しますか？現在の変更は失われます。`,
        [
            {
                label: '復元する',
                action: () => {
                    showNotification(`🔄 バージョン ${version} に復元しました`, 'success');
                },
                type: 'warning'
            },
            {
                label: 'キャンセル',
                action: () => {},
                type: 'secondary'
            }
        ]
    );
}

function compareVersions(version1, version2) {
    showModal(
        `バージョン比較: ${version1} vs ${version2}`,
        `
        <div class="version-comparison">
            <div class="comparison-side">
                <h4>バージョン ${version1}</h4>
                <div class="version-content">
                    <p>初回AI生成版の内容がここに表示されます...</p>
                </div>
            </div>
            <div class="comparison-side">
                <h4>バージョン ${version2}</h4>
                <div class="version-content">
                    <p>最新版の内容がここに表示されます...</p>
                </div>
            </div>
        </div>
        `,
        [
            {
                label: '閉じる',
                action: () => {},
                type: 'secondary'
            }
        ]
    );
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
        
        // FAQ管理
        generateFaq: generateFaq,
        editFaq: editFaq,
        approveFaq: approveFaq,
        publishFaq: publishFaq,
        
        // バッチ処理
        batchGenerate: batchGenerate,
        batchApprove: batchApprove,
        
        // 品質管理
        assessQuality: assessQuality,
        
        // エディタ
        switchTab: switchTab,
        
        // 統計情報
        getStats: () => ({ ..._state.processingStats }),
        
        // デバッグ用
        _debug: {
            state: _state,
            config: _config
        }
    };
    
    // ===== 内部関数 =====
    async function init() {
        try {
            logger.info('🤖 AI-FAQ管理システム v2.0 - 起動中...');
            
            initializeSectionNavigation();
            initializeFAQGeneration();
            initializeFAQEditor();
            initializeApprovalSystem();
            initializeBatchGeneration();
            
            logger.info('✅ AI-FAQ管理システム v2.0 - 起動完了');
            
        } catch (error) {
            logger.error('AI-FAQ システム初期化エラー', { error: error.message });
            throw error;
        }
    }
    
    async function generateFaq(prompt, options = {}) {
        try {
            const provider = options.provider || _config.aiProvider;
            const strategy = AiGenerationStrategies[provider];
            
            if (!strategy) {
                throw new Error(`サポートされていないAIプロバイダー: ${provider}`);
            }
            
            logger.info('FAQ生成開始', { prompt, provider });
            
            const result = await strategy.generateFaq(prompt, options.context);
            
            if (strategy.validateResponse(result)) {
                const faqId = generateFaqId();
                _state.generatedFAQs.set(faqId, {
                    id: faqId,
                    question: result.question,
                    answer: result.answer,
                    quality: result.quality,
                    provider: provider,
                    generatedAt: new Date().toISOString(),
                    status: 'generated'
                });
                
                _state.processingStats.totalGenerated++;
                
                eventBus.emit('faq:generated', { faqId, result });
                
                return { faqId, ...result };
            } else {
                throw new Error('生成されたFAQの品質が基準を満たしていません');
            }
            
        } catch (error) {
            logger.error('FAQ生成エラー', { prompt, error: error.message });
            throw error;
        }
    }
    
    async function editFaq(faqId, updates) {
        const faq = _state.generatedFAQs.get(faqId);
        if (!faq) {
            throw new Error('FAQが見つかりません');
        }
        
        const updatedFaq = {
            ...faq,
            ...updates,
            updatedAt: new Date().toISOString(),
            version: (faq.version || 1) + 1
        };
        
        _state.generatedFAQs.set(faqId, updatedFaq);
        
        eventBus.emit('faq:edited', { faqId, updates });
        
        return updatedFaq;
    }
    
    async function approveFaq(faqId, approverLevel) {
        const faq = _state.generatedFAQs.get(faqId);
        if (!faq) {
            throw new Error('FAQが見つかりません');
        }
        
        faq.status = 'approved';
        faq.approvedBy = approverLevel;
        faq.approvedAt = new Date().toISOString();
        
        _state.processingStats.totalApproved++;
        
        eventBus.emit('faq:approved', { faqId, approverLevel });
        
        return faq;
    }
    
    async function publishFaq(faqId) {
        const faq = _state.generatedFAQs.get(faqId);
        if (!faq || faq.status !== 'approved') {
            throw new Error('FAQが承認されていません');
        }
        
        faq.status = 'published';
        faq.publishedAt = new Date().toISOString();
        
        _state.publishedFAQs.set(faqId, faq);
        
        eventBus.emit('faq:published', { faqId });
        
        return faq;
    }
    
    async function batchGenerate(prompts, options = {}) {
        const batchId = 'batch_' + Date.now();
        const results = [];
        
        _state.batchGenerationProcess = {
            id: batchId,
            total: prompts.length,
            completed: 0,
            errors: 0,
            startedAt: new Date().toISOString()
        };
        
        for (const prompt of prompts) {
            try {
                const result = await generateFaq(prompt, options);
                results.push(result);
                _state.batchGenerationProcess.completed++;
            } catch (error) {
                _state.batchGenerationProcess.errors++;
                logger.error('バッチ生成エラー', { prompt, error: error.message });
            }
            
            eventBus.emit('batch:progress', {
                batchId,
                progress: (_state.batchGenerationProcess.completed / prompts.length) * 100
            });
        }
        
        _state.batchGenerationProcess.completedAt = new Date().toISOString();
        
        eventBus.emit('batch:completed', { batchId, results });
        
        return results;
    }
    
    async function batchApprove(faqIds, approverLevel) {
        const results = [];
        
        for (const faqId of faqIds) {
            try {
                const result = await approveFaq(faqId, approverLevel);
                results.push(result);
            } catch (error) {
                logger.error('バッチ承認エラー', { faqId, error: error.message });
            }
        }
        
        return results;
    }
    
    async function assessQuality(faqContent) {
        // 品質評価の実装（簡略化）
        const quality = Math.random() * 0.3 + 0.7; // 0.7-1.0の範囲
        
        return {
            score: quality,
            feedback: quality > 0.9 ? '優秀' : quality > 0.8 ? '良好' : '改善が必要'
        };
    }
    
    function switchTab(tabName) {
        if (_state.editorTabs.includes(tabName)) {
            _state.currentTab = tabName;
            eventBus.emit('editor:tab_changed', { tab: tabName });
        }
    }
    
    function generateFaqId() {
        return 'faq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // ===== 既存関数のリファクタリング =====
    function initializeSectionNavigation() {
        // セクションナビゲーションの初期化
    }
    
    function initializeFAQGeneration() {
        // FAQ生成機能の初期化
    }
    
    function initializeFAQEditor() {
        // FAQエディタの初期化
    }
    
    function initializeApprovalSystem() {
        // 承認システムの初期化
    }
    
    function initializeBatchGeneration() {
        // バッチ生成の初期化
    }
    
    // ===== AI生成ストラテジー =====
    const AiGenerationStrategies = {
        'gpt-4': {
            generateFaq: async (prompt, context) => {
                // GPT-4シミュレーション
                await new Promise(resolve => setTimeout(resolve, 2000));
                return {
                    question: `AI生成質問: ${prompt}`,
                    answer: `AI生成回答: ${prompt}に対する詳細な回答です。`,
                    quality: 0.9 + Math.random() * 0.1
                };
            },
            validateResponse: (response) => response.quality > _config.qualityThreshold
        },
        
        'claude': {
            generateFaq: async (prompt, context) => {
                // Claudeシミュレーション
                await new Promise(resolve => setTimeout(resolve, 1500));
                return {
                    question: `Claude生成質問: ${prompt}`,
                    answer: `Claude生成回答: ${prompt}に対する回答です。`,
                    quality: 0.85 + Math.random() * 0.15
                };
            },
            validateResponse: (response) => response.quality > _config.qualityThreshold
        }
    };
    
})();

// ===== モジュール初期化 =====
document.addEventListener('DOMContentLoaded', function() {
    if (window.KAGAMI) {
        AiFaqModule.init({
            logger: KAGAMI.logger,
            eventBus: KAGAMI.events,
            securityValidator: KAGAMI.validator,
            performanceMonitor: KAGAMI.getPerformanceReport ? KAGAMI : null
        });
    } else {
        console.warn('KAGAMI コアモジュールが見つかりません');
        AiFaqModule.init({});
    }
});

// ===== グローバル公開 =====
window.AiFaqModule = AiFaqModule;

console.log('🤖 AI-FAQ JavaScript アプリケーション v2.0 - 読み込み完了'); 