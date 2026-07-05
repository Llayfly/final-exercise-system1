// ==================== Data Store ====================
const STORAGE_KEY = 'quiz_system_data';
const STATS_KEY = 'quiz_system_stats';

// Default sample data
const DEFAULT_DATA = {
    banks: [
        {
            id: 'default_1',
            name: '计算机基础',
            createdAt: new Date().toISOString(),
            questions: [
                {
                    id: 'q1', type: 'choice',
                    question: 'HTML 的全称是什么？',
                    options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language'],
                    answer: 0,
                    explanation: 'HTML 是 Hyper Text Markup Language（超文本标记语言）的缩写'
                },
                {
                    id: 'q2', type: 'choice',
                    question: 'CSS 中，以下哪个属性用于设置字体大小？',
                    options: ['text-size', 'font-size', 'font-style', 'text-font'],
                    answer: 1,
                    explanation: 'font-size 属性用于设置字体大小'
                },
                {
                    id: 'q3', type: 'choice',
                    question: 'JavaScript 中，以下哪个方法可以将字符串转换为整数？',
                    options: ['Number.toInt()', 'parseInt()', 'Math.round()', 'String.toNumber()'],
                    answer: 1,
                    explanation: 'parseInt() 是 JavaScript 内置的全局函数，可以将字符串解析为整数'
                },
                {
                    id: 'q4', type: 'choice',
                    question: 'TCP 协议属于 OSI 模型的哪一层？',
                    options: ['网络层', '传输层', '应用层', '数据链路层'],
                    answer: 1,
                    explanation: 'TCP（传输控制协议）属于 OSI 模型的传输层'
                },
                {
                    id: 'q5', type: 'choice',
                    question: '以下哪种数据结构遵循先进后出（FILO）的原则？',
                    options: ['队列', '栈', '链表', '数组'],
                    answer: 1,
                    explanation: '栈（Stack）是一种后进先出（LIFO）/先进后出（FILO）的数据结构'
                },
                {
                    id: 'q6', type: 'choice',
                    question: '在 SQL 中，用于从数据库中检索数据的关键字是？',
                    options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'],
                    answer: 2,
                    explanation: 'SELECT 语句用于从数据库中检索数据'
                },
                {
                    id: 'q7', type: 'judge',
                    question: 'HTTP 是一种有状态的协议。',
                    answer: false,
                    explanation: 'HTTP 是无状态协议，服务器不会保存客户端的状态信息。Cookie 和 Session 是用来解决无状态问题的机制。'
                },
                {
                    id: 'q8', type: 'judge',
                    question: 'Python 是一种解释型语言。',
                    answer: true,
                    explanation: 'Python 代码由解释器逐行执行，不需要预先编译成机器码'
                },
                {
                    id: 'q9', type: 'judge',
                    question: 'IPv6 地址长度为 128 位。',
                    answer: true,
                    explanation: 'IPv6 地址由 128 位二进制数组成，通常用十六进制表示'
                },
                {
                    id: 'q10', type: 'judge',
                    question: 'Git 是一种集中式版本控制系统。',
                    answer: false,
                    explanation: 'Git 是一种分布式版本控制系统（DVCS），每个开发者都有完整的代码仓库副本'
                },
                {
                    id: 'q11', type: 'judge',
                    question: 'JSON 格式支持注释。',
                    answer: false,
                    explanation: '标准 JSON 格式不支持注释。JSON5 和其他扩展格式才支持注释功能'
                },
                {
                    id: 'q12', type: 'short',
                    question: '简述面向对象编程（OOP）的三大特性。',
                    answer: '封装、继承、多态。封装是将数据和操作数据的方法封装在一起；继承是子类继承父类的属性和方法；多态是同一操作作用于不同对象时产生不同的行为。',
                    explanation: '这三大特性是面向对象编程的基础概念'
                },
                {
                    id: 'q13', type: 'short',
                    question: '简述 GET 和 POST 请求的主要区别。',
                    answer: '1. GET 参数在 URL 中，POST 参数在请求体中；2. GET 有长度限制，POST 没有；3. GET 可以被缓存和收藏，POST 不可以；4. GET 不安全，POST 相对安全。',
                    explanation: 'GET 和 POST 是 HTTP 中最常用的两种请求方法'
                },
                {
                    id: 'q14', type: 'short',
                    question: '什么是 RESTful API？',
                    answer: 'RESTful API 是一种遵循 REST（Representational State Transfer）架构风格设计的 Web API。它使用 HTTP 方法（GET、POST、PUT、DELETE）对资源进行操作，URL 表示资源路径，状态码表示操作结果。',
                    explanation: 'REST 是一种软件架构风格，RESTful API 广泛用于现代 Web 开发'
                }
            ]
        }
    ]
};

const DEFAULT_STATS = {
    totalDone: 0,
    totalCorrect: 0,
    todayDone: 0,
    todayCorrect: 0,
    todayDate: new Date().toISOString().split('T')[0],
    streak: 0,
    maxStreak: 0,
    typeStats: { choice: { done: 0, correct: 0 }, judge: { done: 0, correct: 0 }, short: { done: 0, correct: 0 } },
    history: [], // [{date, correct, total, type}]
    wrongQuestions: [] // [{question, userAnswer, correctAnswer, type, timestamp}]
};

// ==================== State ====================
let appData = {};
let stats = {};
let currentBankId = null;
let practiceState = {
    questions: [],
    currentIndex: 0,
    answers: [],
    mode: 'practice', // practice or exam
    isActive: false
};
let uploadedFile = null;
let uploadedFileType = null;
let parsedPreviewQuestions = []; // stores parsed questions for preview

// ==================== Init ====================
function init() {
    loadData();
    setupNavigation();
    updateHomeStats();
    renderBankList();
    updateBankSelect();
    updateStats();
}

function loadData() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        const savedStats = localStorage.getItem(STATS_KEY);
        appData = savedData ? JSON.parse(savedData) : JSON.parse(JSON.stringify(DEFAULT_DATA));
        stats = savedStats ? JSON.parse(savedStats) : JSON.parse(JSON.stringify(DEFAULT_STATS));
        // Reset today's date if needed
        const today = new Date().toISOString().split('T')[0];
        if (stats.todayDate !== today) {
            stats.todayDone = 0;
            stats.todayCorrect = 0;
            stats.todayDate = today;
        }
    } catch (e) {
        appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
        stats = JSON.parse(JSON.stringify(DEFAULT_STATS));
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// ==================== Navigation ====================
function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showPage(btn.dataset.page);
        });
    });
}

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`page-${pageName}`).classList.add('active');
    document.querySelector(`.nav-btn[data-page="${pageName}"]`).classList.add('active');

    if (pageName === 'home') {
        updateHomeStats();
    } else if (pageName === 'bank') {
        renderBankList();
    } else if (pageName === 'stats') {
        updateStats();
    }
}

// ==================== Home Stats ====================
function updateHomeStats() {
    const totalQ = getAllQuestions().length;
    const totalDone = stats.totalDone;
    const rate = totalDone > 0 ? Math.round((stats.totalCorrect / totalDone) * 100) : 0;
    document.getElementById('totalQuestions').textContent = totalQ;
    document.getElementById('totalDone').textContent = totalDone;
    document.getElementById('correctRate').textContent = rate + '%';
    document.getElementById('bankCount').textContent = appData.banks.length;
}

function getAllQuestions() {
    return appData.banks.flatMap(b => b.questions);
}

// ==================== Practice ====================
function startPractice(type) {
    showPage('practice');
    const typeSelect = document.getElementById('practice-type-select');
    if (type === 'random') {
        typeSelect.value = 'all';
    } else {
        typeSelect.value = type;
    }
    // Reset to setup
    document.getElementById('practice-setup').classList.remove('hidden');
    document.getElementById('practice-area').classList.add('hidden');
    document.getElementById('practice-result').classList.add('hidden');
}

function startQuickPractice() {
    showPage('practice');
    document.getElementById('practice-bank-select').value = 'all';
    document.getElementById('practice-type-select').value = 'all';
    document.getElementById('practice-count').value = 10;
    document.getElementById('practice-mode').value = 'practice';
    beginPractice();
}

function beginPractice() {
    const bankId = document.getElementById('practice-bank-select').value;
    const type = document.getElementById('practice-type-select').value;
    const count = parseInt(document.getElementById('practice-count').value) || 10;
    const mode = document.getElementById('practice-mode').value;

    let questions = [];
    if (bankId === 'all') {
        questions = getAllQuestions();
    } else {
        const bank = appData.banks.find(b => b.id === bankId);
        if (bank) questions = [...bank.questions];
    }

    // Filter by type
    if (type !== 'all') {
        questions = questions.filter(q => q.type === type);
    }

    if (questions.length === 0) {
        showToast('没有找到符合条件的题目，请检查题库', 'error');
        return;
    }

    // Shuffle and limit
    questions = shuffleArray(questions).slice(0, Math.min(count, questions.length));

    practiceState = {
        questions,
        currentIndex: 0,
        answers: new Array(questions.length).fill(null),
        mode,
        isActive: true
    };

    document.getElementById('practice-setup').classList.add('hidden');
    document.getElementById('practice-area').classList.remove('hidden');
    document.getElementById('practice-result').classList.add('hidden');

    showQuestion();
}

function showQuestion() {
    const idx = practiceState.currentIndex;
    const total = practiceState.questions.length;
    const q = practiceState.questions[idx];

    // Update progress
    document.getElementById('progress-text').textContent = `${idx + 1} / ${total}`;
    document.getElementById('progress-fill').style.width = `${((idx + 1) / total) * 100}%`;

    // Type badge
    const typeMap = { choice: '选择题', judge: '判断题', short: '简答题' };
    const badgeClass = `badge-${q.type}`;
    document.getElementById('progress-type').className = `badge ${badgeClass}`;
    document.getElementById('progress-type').textContent = typeMap[q.type];

    // Question info
    document.getElementById('question-number').textContent = `第 ${idx + 1} 题`;
    document.getElementById('question-type-badge').className = `question-type-badge badge ${badgeClass}`;
    document.getElementById('question-type-badge').textContent = typeMap[q.type];
    document.getElementById('question-text').textContent = q.question;

    // Hide all answer inputs
    document.getElementById('choice-options').classList.add('hidden');
    document.getElementById('judge-options').classList.add('hidden');
    document.getElementById('short-answer').classList.add('hidden');
    document.getElementById('answer-panel').classList.add('hidden');

    // Show appropriate input
    if (q.type === 'choice') {
        showChoiceOptions(q);
    } else if (q.type === 'judge') {
        // Rebuild judge buttons each time to avoid stale state
        const container = document.getElementById('judge-options');
        container.innerHTML = `
            <button class="btn btn-option" onclick="answerJudge(true)">正确 ✓</button>
            <button class="btn btn-option" onclick="answerJudge(false)">错误 ✗</button>
        `;
        container.classList.remove('hidden');
    } else if (q.type === 'short') {
        document.getElementById('short-answer').classList.remove('hidden');
        document.getElementById('short-input').value = '';
    }

    // Show answer panel in exam mode if already answered
    if (practiceState.mode === 'practice' && practiceState.answers[idx] !== null) {
        showAnswer();
    }
}

function showChoiceOptions(q) {
    const container = document.getElementById('choice-options');
    container.classList.remove('hidden');
    const labels = ['A', 'B', 'C', 'D'];
    container.innerHTML = q.options.map((opt, i) => `
        <button class="choice-option-btn" onclick="answerChoice(${i})" data-index="${i}">
            <span class="option-label">${labels[i]}</span>
            <span>${escapeHtml(opt)}</span>
        </button>
    `).join('');
}

function answerChoice(selectedIndex) {
    if (practiceState.answers[practiceState.currentIndex] !== null) return;
    practiceState.answers[practiceState.currentIndex] = selectedIndex;

    const q = practiceState.questions[practiceState.currentIndex];
    const isCorrect = selectedIndex === q.answer;

    // Visual feedback
    const btns = document.querySelectorAll('.choice-option-btn');
    btns.forEach((btn, i) => {
        btn.onclick = null;
        if (i === q.answer) {
            btn.classList.add('correct');
        }
        if (i === selectedIndex && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    if (practiceState.mode === 'practice') {
        setTimeout(() => showAnswer(), 500);
    } else {
        // In exam mode, auto-advance
        setTimeout(() => {
            if (practiceState.currentIndex < practiceState.questions.length - 1) {
                practiceState.currentIndex++;
                showQuestion();
            } else {
                showResult();
            }
        }, 800);
    }
}

function answerJudge(answer) {
    if (practiceState.answers[practiceState.currentIndex] !== null) return;
    practiceState.answers[practiceState.currentIndex] = answer;

    const q = practiceState.questions[practiceState.currentIndex];
    const isCorrect = answer === q.answer;

    // Visual feedback on buttons
    const btns = document.querySelectorAll('#judge-options .btn-option');
    btns.forEach(btn => {
        btn.onclick = null;
        const btnValue = btn.textContent.includes('正确');
        if (btnValue === q.answer) {
            btn.classList.add('correct');
        }
        if (btnValue === answer && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    if (practiceState.mode === 'practice') {
        setTimeout(() => showAnswer(), 500);
    } else {
        setTimeout(() => {
            if (practiceState.currentIndex < practiceState.questions.length - 1) {
                practiceState.currentIndex++;
                showQuestion();
            } else {
                showResult();
            }
        }, 800);
    }
}

function answerShort() {
    const input = document.getElementById('short-input');
    const userAnswer = input.value.trim();
    if (!userAnswer) {
        showToast('请输入你的答案', 'error');
        return;
    }
    if (practiceState.answers[practiceState.currentIndex] !== null) return;
    practiceState.answers[practiceState.currentIndex] = userAnswer;

    if (practiceState.mode === 'practice') {
        showAnswer();
    } else {
        if (practiceState.currentIndex < practiceState.questions.length - 1) {
            practiceState.currentIndex++;
            showQuestion();
        } else {
            showResult();
        }
    }
}

function showAnswer() {
    const idx = practiceState.currentIndex;
    const q = practiceState.questions[idx];
    const userAnswer = practiceState.answers[idx];
    const panel = document.getElementById('answer-panel');
    const body = document.getElementById('answer-body');
    const resultEl = document.getElementById('answer-result');
    const typeMap = { choice: '选择题', judge: '判断题', short: '简答题' };

    let isCorrect = false;
    let answerHtml = '';

    if (q.type === 'choice') {
        isCorrect = userAnswer === q.answer;
        const labels = ['A', 'B', 'C', 'D'];
        answerHtml = `
            <p><strong>你的答案：</strong>${labels[userAnswer]}</p>
            <p><strong>正确答案：</strong>${labels[q.answer]}. ${escapeHtml(q.options[q.answer])}</p>
        `;
    } else if (q.type === 'judge') {
        isCorrect = userAnswer === q.answer;
        answerHtml = `
            <p><strong>你的答案：</strong>${userAnswer ? '正确' : '错误'}</p>
            <p><strong>正确答案：</strong>${q.answer ? '正确' : '错误'}</p>
        `;
    } else if (q.type === 'short') {
        // For short answer, we show the reference but mark as correct by default (self-evaluation)
        isCorrect = true; // Short answers are self-evaluated
        answerHtml = `
            <p><strong>你的答案：</strong>${escapeHtml(userAnswer)}</p>
            <p><strong>参考答案：</strong>${escapeHtml(q.answer)}</p>
        `;
    }

    if (q.explanation) {
        answerHtml += `<p><strong>解析：</strong>${escapeHtml(q.explanation)}</p>`;
    }

    panel.className = `answer-panel ${isCorrect ? 'answer-correct' : 'answer-wrong'}`;
    resultEl.textContent = isCorrect ? '回答正确!' : '回答错误!';
    body.innerHTML = answerHtml;

    // Update next button text
    const nextBtn = document.getElementById('next-btn');
    if (idx === practiceState.questions.length - 1) {
        nextBtn.textContent = '查看结果';
    } else {
        nextBtn.textContent = '下一题';
    }

    panel.classList.remove('hidden');
}

function nextQuestion() {
    if (practiceState.currentIndex < practiceState.questions.length - 1) {
        practiceState.currentIndex++;
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    practiceState.isActive = false;
    let correct = 0;
    const results = [];

    practiceState.questions.forEach((q, i) => {
        const userAnswer = practiceState.answers[i];
        if (userAnswer === null) return;

        let isCorrect = false;
        if (q.type === 'choice') {
            isCorrect = userAnswer === q.answer;
        } else if (q.type === 'judge') {
            isCorrect = userAnswer === q.answer;
        } else {
            isCorrect = true; // self-eval
        }

        if (isCorrect) correct++;

        // Update stats
        stats.totalDone++;
        stats.typeStats[q.type].done++;
        stats.todayDone++;
        if (isCorrect) {
            stats.totalCorrect++;
            stats.typeStats[q.type].correct++;
            stats.todayCorrect++;
            stats.streak++;
            if (stats.streak > stats.maxStreak) stats.maxStreak = stats.streak;
        } else {
            stats.streak = 0;
            // Add to wrong questions
            let userAnsText = '';
            let correctAnsText = '';
            if (q.type === 'choice') {
                const labels = ['A', 'B', 'C', 'D'];
                userAnsText = labels[userAnswer] || '未作答';
                correctAnsText = labels[q.answer];
            } else if (q.type === 'judge') {
                userAnsText = userAnswer ? '正确' : '错误';
                correctAnsText = q.answer ? '正确' : '错误';
            } else {
                userAnsText = String(userAnswer);
                correctAnsText = q.answer;
            }
            stats.wrongQuestions.push({
                questionId: q.id,
                question: q.question,
                type: q.type,
                userAnswer: userAnsText,
                correctAnswer: correctAnsText,
                explanation: q.explanation || '',
                timestamp: new Date().toISOString()
            });
        }

        results.push({ question: q, userAnswer, isCorrect });
    });

    // Add to history
    const today = new Date().toISOString().split('T')[0];
    const existing = stats.history.find(h => h.date === today);
    if (existing) {
        existing.correct += correct;
        existing.total += practiceState.questions.length;
    } else {
        stats.history.push({ date: today, correct, total: practiceState.questions.length });
    }

    saveData();

    // Show result UI
    document.getElementById('practice-area').classList.add('hidden');
    document.getElementById('practice-result').classList.remove('hidden');

    const total = practiceState.questions.length;
    const wrong = total - correct;
    const rate = total > 0 ? Math.round((correct / total) * 100) : 0;

    document.getElementById('result-total').textContent = total;
    document.getElementById('result-correct').textContent = correct;
    document.getElementById('result-wrong').textContent = wrong;
    document.getElementById('result-rate').textContent = rate + '%';

    // Pie chart
    renderPieChart(correct, wrong, rate);
}

function renderPieChart(correct, wrong, rate) {
    const chart = document.getElementById('result-chart');
    const correctDeg = (correct / (correct + wrong)) * 360;
    chart.innerHTML = `
        <div class="pie-chart" style="background: conic-gradient(var(--success) 0deg ${correctDeg}deg, var(--danger) ${correctDeg}deg 360deg);">
            <div class="pie-chart-center">
                <span class="value">${rate}%</span>
                <span class="label">正确率</span>
            </div>
        </div>
        <div style="display:flex;justify-content:center;gap:24px;font-size:13px;">
            <span style="color:var(--success);">&#9679; 正确 ${correct}</span>
            <span style="color:var(--danger);">&#9679; 错误 ${wrong}</span>
        </div>
    `;
}

function endPracticeEarly() {
    // Check if any questions were answered
    const answered = practiceState.answers.filter(a => a !== null).length;
    if (answered > 0) {
        showResult();
    } else {
        practiceState.isActive = false;
        document.getElementById('practice-area').classList.add('hidden');
        document.getElementById('practice-setup').classList.remove('hidden');
    }
}

function reviewAnswers() {
    // Show wrong modal
    const list = document.getElementById('wrong-review-list');
    const wrongs = practiceState.questions.filter((q, i) => {
        const a = practiceState.answers[i];
        if (a === null) return false;
        if (q.type === 'choice') return a !== q.answer;
        if (q.type === 'judge') return a !== q.answer;
        return false;
    });

    if (wrongs.length === 0) {
        list.innerHTML = '<p class="empty-text">没有错题，全部正确！</p>';
    } else {
        const labels = ['A', 'B', 'C', 'D'];
        list.innerHTML = wrongs.map((q, i) => {
            const idx = practiceState.questions.indexOf(q);
            const userAns = practiceState.answers[idx];
            let yourAns = '', correctAns = '';
            if (q.type === 'choice') {
                yourAns = labels[userAns];
                correctAns = labels[q.answer] + '. ' + escapeHtml(q.options[q.answer]);
            } else {
                yourAns = userAns ? '正确' : '错误';
                correctAns = q.answer ? '正确' : '错误';
            }
            return `
                <div class="wrong-review-item">
                    <div class="wrong-review-q">${i + 1}. ${escapeHtml(q.question)}</div>
                    <div class="wrong-review-detail">
                        <p><span class="your-ans">你的答案：${yourAns}</span></p>
                        <p><span class="correct-ans">正确答案：${correctAns}</span></p>
                        ${q.explanation ? `<p>解析：${escapeHtml(q.explanation)}</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    showModal('wrong-modal');
}

function practiceWrongQuestions() {
    closeModal('wrong-modal');
    if (stats.wrongQuestions.length === 0) {
        showToast('暂无错题', 'info');
        return;
    }
    // Collect unique wrong question IDs
    const wrongIds = [...new Set(stats.wrongQuestions.map(w => w.questionId))];
    let questions = [];
    appData.banks.forEach(bank => {
        bank.questions.forEach(q => {
            if (wrongIds.includes(q.id)) {
                questions.push(q);
            }
        });
    });

    if (questions.length === 0) {
        showToast('错题对应的原题已被删除', 'info');
        return;
    }

    questions = shuffleArray(questions);

    practiceState = {
        questions,
        currentIndex: 0,
        answers: new Array(questions.length).fill(null),
        mode: 'practice',
        isActive: true
    };

    document.getElementById('practice-setup').classList.add('hidden');
    document.getElementById('practice-area').classList.remove('hidden');
    document.getElementById('practice-result').classList.add('hidden');
    showQuestion();
}

// ==================== Bank Page Direct Upload ====================
let bankPageFile = null;
let bankPageQuestions = [];

document.addEventListener('DOMContentLoaded', () => {
    // Bank page file input
    const bankFileInput = document.getElementById('bank-file-input');
    if (bankFileInput) {
        bankFileInput.addEventListener('change', async function () {
            if (this.files[0]) await handleBankPageUpload(this.files[0]);
        });
    }
    // Drag & drop on bank upload area
    const bankArea = document.getElementById('bank-upload-area');
    if (bankArea) {
        bankArea.addEventListener('dragover', e => { e.preventDefault(); e.stopPropagation(); bankArea.classList.add('drag-over'); });
        bankArea.addEventListener('dragleave', e => { e.preventDefault(); e.stopPropagation(); bankArea.classList.remove('drag-over'); });
        bankArea.addEventListener('drop', async e => {
            e.preventDefault(); e.stopPropagation();
            bankArea.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file) await handleBankPageUpload(file);
        });
    }
});

async function handleBankPageUpload(file) {
    const area = document.getElementById('bank-upload-area');
    const statusEl = document.getElementById('bank-upload-status');
    const ext = file.name.split('.').pop().toLowerCase();
    const bankName = file.name.replace(/\.\w+$/i, '');

    // Check format
    const supported = ['docx', 'xlsx', 'xls', 'csv', 'txt', 'json'];
    if (!supported.includes(ext)) {
        showBankUploadError(area, statusEl, '不支持的文件格式，请使用 .docx .xlsx .csv .txt .json');
        return;
    }

    // Show loading state
    area.classList.add('processing');
    statusEl.classList.remove('hidden');
    statusEl.className = 'upload-loading';
    statusEl.innerHTML = `<span style="animation:spin 1s linear infinite;display:inline-block;">⚙️</span> 正在解析「${escapeHtml(file.name)}」...`;

    try {
        let questions = [];

        if (ext === 'json') {
            const text = await file.text();
            const raw = JSON.parse(text);
            if (Array.isArray(raw)) questions = raw;
            else if (raw && Array.isArray(raw.banks)) questions = raw.banks.flatMap(b => b.questions || []);
            else if (raw && Array.isArray(raw.questions)) questions = raw.questions;
        } else if (ext === 'csv' || ext === 'txt') {
            const text = await file.text();
            questions = parseCSVSmart(text);
            if (questions.length === 0) questions = parsePastedTextSmart(text);
        } else if (ext === 'docx') {
            questions = await parseWordDocx(file);
        } else if (ext === 'xlsx' || ext === 'xls') {
            questions = await parseExcel(file);
        }

        // Validate
        const normalized = [];
        let failCount = 0;
        questions.forEach((q, i) => {
            const result = normalizeQuestion(q, i);
            if (result) normalized.push(result);
            else failCount++;
        });

        area.classList.remove('processing');

        if (normalized.length === 0) {
            showBankUploadError(area, statusEl, `未能从文档中解析到有效题目${failCount > 0 ? '（' + failCount + '条数据格式不正确）' : ''}`);
            return;
        }

        bankPageQuestions = normalized;

        // Show preview with confirm button
        const typeCounts = { choice: 0, judge: 0, short: 0 };
        normalized.forEach(q => typeCounts[q.type]++);
        const previewHtml = normalized.slice(0, 8).map((q, i) => {
            const typeMap = { choice: '选择题', judge: '判断题', short: '简答题' };
            const labels = ['A', 'B', 'C', 'D'];
            let ans = '';
            if (q.type === 'choice') ans = labels[q.answer];
            else if (q.type === 'judge') ans = q.answer ? '正确' : '错误';
            else ans = q.answer.substring(0, 30) + (q.answer.length > 30 ? '...' : '');
            return `<div style="padding:6px 0;border-bottom:1px solid var(--gray-100);font-size:12px;display:flex;gap:8px;">
                <span class="badge badge-${q.type}" style="flex-shrink:0;">${typeMap[q.type]}</span>
                <span style="flex:1;color:var(--gray-700);">${escapeHtml(q.question)}</span>
                <span style="color:var(--success);flex-shrink:0;">${escapeHtml(ans)}</span>
            </div>`;
        }).join('') + (normalized.length > 8 ? `<div style="padding:6px 0;font-size:12px;color:var(--gray-400);">...还有 ${normalized.length - 8} 道题</div>` : '');

        statusEl.className = '';
        statusEl.classList.remove('hidden');
        statusEl.innerHTML = `
            <div class="upload-success" style="margin-bottom:8px;">解析成功：共 ${normalized.length} 道题（选择题 ${typeCounts.choice} / 判断题 ${typeCounts.judge} / 简答题 ${typeCounts.short}）${failCount > 0 ? '，' + failCount + '条跳过' : ''}</div>
            <div style="margin-bottom:8px;">
                <label style="font-size:13px;">题库名称：</label>
                <input type="text" id="bank-page-name" value="${escapeHtml(bankName)}" style="padding:6px 10px;border:1px solid var(--gray-300);border-radius:6px;font-size:13px;width:200px;">
            </div>
            <div class="upload-preview-mini">${previewHtml}</div>
            <div style="margin-top:10px;display:flex;gap:8px;justify-content:center;">
                <button class="btn btn-primary" onclick="confirmBankPageImport()">确认导入整个题库</button>
                <button class="btn btn-ghost" onclick="cancelBankPageUpload()">取消</button>
            </div>
        `;

        area.classList.add('has-file');
    } catch (e) {
        area.classList.remove('processing');
        showBankUploadError(area, statusEl, '解析失败：' + e.message);
        console.error(e);
    }
}

function showBankUploadError(area, statusEl, msg) {
    area.classList.remove('has-file');
    statusEl.className = 'upload-error';
    statusEl.classList.remove('hidden');
    statusEl.innerHTML = `❌ ${escapeHtml(msg)}`;
    setTimeout(() => { statusEl.classList.add('hidden'); statusEl.innerHTML = ''; }, 5000);
}

function confirmBankPageImport() {
    if (bankPageQuestions.length === 0) return;
    const nameInput = document.getElementById('bank-page-name');
    const bankName = (nameInput ? nameInput.value.trim() : '') || '导入题库';

    const bank = {
        id: 'bank_' + Date.now(),
        name: bankName,
        createdAt: new Date().toISOString(),
        questions: bankPageQuestions
    };

    appData.banks.push(bank);
    saveData();

    // Reset upload area
    cancelBankPageUpload();

    // Refresh
    renderBankList();
    showToast(`成功导入题库「${bankName}」，共 ${bankPageQuestions.length} 道题`, 'success');

    // Auto-select the new bank
    selectBank(bank.id);
}

function cancelBankPageUpload() {
    bankPageFile = null;
    bankPageQuestions = [];
    const area = document.getElementById('bank-upload-area');
    const statusEl = document.getElementById('bank-upload-status');
    area.classList.remove('has-file', 'processing');
    statusEl.classList.add('hidden');
    statusEl.innerHTML = '';
    document.getElementById('bank-file-input').value = '';
}

// ==================== Bank Management ====================
function renderBankList() {
    const container = document.getElementById('bank-list');
    if (appData.banks.length === 0) {
        container.innerHTML = '<div class="empty-text">暂无题库，请导入或创建</div>';
        return;
    }

    container.innerHTML = appData.banks.map(bank => {
        const choiceCount = bank.questions.filter(q => q.type === 'choice').length;
        const judgeCount = bank.questions.filter(q => q.type === 'judge').length;
        const shortCount = bank.questions.filter(q => q.type === 'short').length;
        const isActive = bank.id === currentBankId;

        return `
            <div class="bank-item ${isActive ? 'active' : ''}" onclick="selectBank('${bank.id}')">
                <div class="bank-item-name">${escapeHtml(bank.name)}</div>
                <div class="bank-item-meta">
                    <span>共 ${bank.questions.length} 题</span>
                    <span>选择${choiceCount}</span>
                    <span>判断${judgeCount}</span>
                    <span>简答${shortCount}</span>
                </div>
                <div class="bank-item-actions">
                    <button class="btn btn-danger btn-small" onclick="event.stopPropagation(); deleteBank('${bank.id}')">删除题库</button>
                </div>
            </div>
        `;
    }).join('');

    updateBankSelect();
}

function selectBank(bankId) {
    currentBankId = bankId;
    renderBankList();
    renderQuestions();
}

function deleteBank(bankId) {
    if (appData.banks.length <= 1) {
        showToast('至少保留一个题库', 'error');
        return;
    }
    if (!confirm('确定要删除这个题库吗？')) return;
    appData.banks = appData.banks.filter(b => b.id !== bankId);
    if (currentBankId === bankId) {
        currentBankId = null;
        document.getElementById('questions-title').textContent = '选择一个题库查看题目';
        document.getElementById('questions-list').innerHTML = '';
    }
    saveData();
    renderBankList();
    updateBankSelect();
    showToast('题库已删除', 'success');
}

function renderQuestions() {
    if (!currentBankId) return;
    const bank = appData.banks.find(b => b.id === currentBankId);
    if (!bank) return;

    document.getElementById('questions-title').textContent = bank.name + ' - 题目列表';
    const list = document.getElementById('questions-list');
    const typeFilter = document.getElementById('filter-type').value;
    const searchText = document.getElementById('filter-search').value.trim().toLowerCase();

    let questions = bank.questions;
    if (typeFilter !== 'all') {
        questions = questions.filter(q => q.type === typeFilter);
    }
    if (searchText) {
        questions = questions.filter(q => q.question.toLowerCase().includes(searchText));
    }

    if (questions.length === 0) {
        list.innerHTML = '<div class="empty-text">没有找到匹配的题目</div>';
        return;
    }

    const typeMap = { choice: '选择题', judge: '判断题', short: '简答题' };
    const labels = ['A', 'B', 'C', 'D'];

    list.innerHTML = questions.map(q => {
        let answerText = '';
        if (q.type === 'choice') {
            answerText = labels[q.answer] + '. ' + escapeHtml(q.options[q.answer]);
        } else if (q.type === 'judge') {
            answerText = q.answer ? '正确' : '错误';
        } else {
            answerText = escapeHtml(q.answer.substring(0, 50)) + (q.answer.length > 50 ? '...' : '');
        }

        return `
            <div class="question-item">
                <div class="question-item-header">
                    <span class="badge badge-${q.type}">${typeMap[q.type]}</span>
                </div>
                <div class="question-item-text">${escapeHtml(q.question)}</div>
                <div class="question-item-footer">
                    <span style="font-size:12px;color:var(--gray-500);">答案：${answerText}</span>
                    <div class="question-item-actions">
                        <button class="btn btn-danger" style="background:var(--danger-bg);color:var(--danger);" onclick="deleteQuestion('${bank.id}','${q.id}')">删除</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterQuestions() {
    renderQuestions();
}

function deleteQuestion(bankId, questionId) {
    const bank = appData.banks.find(b => b.id === bankId);
    if (!bank) return;
    bank.questions = bank.questions.filter(q => q.id !== questionId);
    saveData();
    renderQuestions();
    renderBankList();
    showToast('题目已删除', 'success');
}

function updateBankSelect() {
    const selects = [document.getElementById('practice-bank-select'), document.getElementById('add-q-bank')];
    selects.forEach(select => {
        if (!select) return;
        const currentValue = select.value;
        select.innerHTML = '<option value="all">所有题库</option>' +
            appData.banks.map(b => `<option value="${b.id}">${escapeHtml(b.name)} (${b.questions.length}题)</option>`).join('');
        if (currentValue) select.value = currentValue;
    });
}

// ==================== Import ====================
let docFile = null; // {name, ext, arrayBuffer}

function showImportModal() {
    uploadedFile = null;
    uploadedFileType = null;
    docFile = null;
    parsedPreviewQuestions = [];
    document.getElementById('json-file-input').value = '';
    document.getElementById('csv-file-input').value = '';
    document.getElementById('doc-file-input').value = '';
    document.getElementById('import-json-name').value = '';
    document.getElementById('import-csv-name').value = '';
    document.getElementById('import-paste-name').value = '';
    document.getElementById('import-doc-name').value = '';
    document.getElementById('paste-input').value = '';
    document.getElementById('json-upload-area').classList.remove('has-file');
    document.getElementById('csv-upload-area').classList.remove('has-file');
    document.getElementById('doc-upload-area').classList.remove('has-file');
    const docUploadP = document.getElementById('doc-upload-area').querySelector('p');
    if (docUploadP) docUploadP.textContent = '点击选择文件 或 拖拽文档到此处';
    document.getElementById('import-preview').classList.add('hidden');
    document.getElementById('import-loading').classList.add('hidden');
    document.getElementById('btn-parse').classList.remove('hidden');
    document.getElementById('btn-confirm').classList.add('hidden');
    document.getElementById('import-doc-name-group').classList.remove('hidden');
    switchImportTab('json');
    showModal('import-modal');
}

function toggleAdvancedImport() {
    const el = document.getElementById('advanced-import');
    const txt = document.getElementById('advanced-toggle-text');
    if (el.classList.contains('hidden')) {
        el.classList.remove('hidden');
        txt.textContent = '收起更多导入方式 ▲';
    } else {
        el.classList.add('hidden');
        txt.textContent = '展开更多导入方式 ▼';
    }
}

function switchImportTab(tab) {
    document.querySelectorAll('.import-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.import-panel').forEach(p => p.classList.remove('active'));
    document.querySelector(`.tab-btn[onclick="switchImportTab('${tab}')"]`).classList.add('active');
    document.getElementById(`import-${tab}`).classList.add('active');
}

// ==================== File Upload & Drag-Drop ====================
document.addEventListener('DOMContentLoaded', () => {
    // Main doc file input
    const docInput = document.getElementById('doc-file-input');
    if (docInput) {
        docInput.addEventListener('change', async function () {
            if (this.files[0]) await handleDocFile(this.files[0]);
        });
    }

    // Drag & drop on doc upload area
    const docArea = document.getElementById('doc-upload-area');
    if (docArea) {
        docArea.addEventListener('dragover', e => { e.preventDefault(); docArea.classList.add('drag-over'); });
        docArea.addEventListener('dragleave', () => { docArea.classList.remove('drag-over'); });
        docArea.addEventListener('drop', async e => {
            e.preventDefault();
            docArea.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file) await handleDocFile(file);
        });
    }

    // Sub-panel file inputs
    document.querySelectorAll('#json-file-input, #csv-file-input').forEach(input => {
        input.addEventListener('change', async function () {
            const file = this.files[0];
            if (file) {
                const text = await file.text();
                uploadedFile = { name: file.name, content: text };
                uploadedFileType = this.id.includes('json') ? 'json' : 'csv';
                const areaId = uploadedFileType === 'json' ? 'json-upload-area' : 'csv-upload-area';
                document.getElementById(areaId).classList.add('has-file');
                document.getElementById(areaId).querySelector('p').textContent = file.name;
                const nameInput = document.getElementById(`import-${uploadedFileType}-name`);
                if (!nameInput.value) nameInput.value = file.name.replace(/\.\w+$/i, '');
                resetImportPreview();
            }
        });
    });
});

async function handleDocFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    docFile = { name: file.name, ext, file };
    const area = document.getElementById('doc-upload-area');
    area.classList.add('has-file');
    area.querySelector('p').textContent = file.name;
    const nameInput = document.getElementById('import-doc-name');
    if (!nameInput.value) nameInput.value = file.name.replace(/\.\w+$/i, '');

    // Auto-parse for text-based formats
    if (['csv', 'txt', 'json'].includes(ext)) {
        const text = await file.text();
        docFile.content = text;
    }
    // For docx/xlsx/xls, we'll parse on doParse
    resetImportPreview();
}

function resetImportPreview() {
    document.getElementById('import-preview').classList.add('hidden');
    document.getElementById('import-loading').classList.add('hidden');
    document.getElementById('btn-parse').classList.remove('hidden');
    document.getElementById('btn-confirm').classList.add('hidden');
    parsedPreviewQuestions = [];
}

function resetPastePreview() {
    resetImportPreview();
}

function handleFileUpload(type) {
    // Kept for backward compatibility
}

// ==================== Parse Entry Point ====================
async function doParse() {
    // Check if using the main doc upload
    if (docFile) {
        await parseDocFile();
        return;
    }

    // Check if using advanced panels
    const activeTab = document.querySelector('.import-panel.active');
    const tabId = activeTab ? activeTab.id : '';

    try {
        let questions = [];

        if (tabId === 'import-json') {
            if (!uploadedFile) { showToast('请选择 JSON 文件', 'error'); return; }
            const raw = JSON.parse(uploadedFile.content);
            if (Array.isArray(raw)) questions = raw;
            else if (raw && Array.isArray(raw.banks)) questions = raw.banks.flatMap(b => b.questions || []);
            else if (raw && Array.isArray(raw.questions)) questions = raw.questions;
        } else if (tabId === 'import-csv') {
            if (!uploadedFile) { showToast('请选择 CSV 文件', 'error'); return; }
            questions = parseCSVSmart(uploadedFile.content);
        } else if (tabId === 'import-paste') {
            const text = document.getElementById('paste-input').value.trim();
            if (!text) { showToast('请粘贴题目内容', 'error'); return; }
            questions = parsePastedTextSmart(text);
        }

        if (!Array.isArray(questions) || questions.length === 0) {
            showToast('未能解析到有效题目，请检查格式', 'error');
            return;
        }

        showParsedResult(questions);
    } catch (e) {
        showToast('解析失败：' + e.message, 'error');
        console.error(e);
    }
}

// ==================== Document Parser (Word/Excel/CSV/TXT/JSON) ====================
async function parseDocFile() {
    document.getElementById('import-loading').classList.remove('hidden');
    document.getElementById('import-preview').classList.add('hidden');

    try {
        let questions = [];
        const { ext, name, file } = docFile;

        if (ext === 'json') {
            const raw = JSON.parse(docFile.content);
            if (Array.isArray(raw)) questions = raw;
            else if (raw && Array.isArray(raw.banks)) questions = raw.banks.flatMap(b => b.questions || []);
            else if (raw && Array.isArray(raw.questions)) questions = raw.questions;
        } else if (ext === 'csv' || ext === 'txt') {
            // Try CSV parse first; if that fails or returns empty, try smart text parse
            questions = parseCSVSmart(docFile.content);
            if (questions.length === 0) {
                questions = parsePastedTextSmart(docFile.content);
            }
        } else if (ext === 'docx') {
            questions = await parseWordDocx(file);
        } else if (ext === 'doc') {
            showToast('暂不支持 .doc 格式，请将文件另存为 .docx 格式后重试', 'error');
            document.getElementById('import-loading').classList.add('hidden');
            return;
        } else if (ext === 'xlsx' || ext === 'xls') {
            questions = await parseExcel(file);
        } else {
            showToast('不支持的文件格式：.' + ext, 'error');
            document.getElementById('import-loading').classList.add('hidden');
            return;
        }

        document.getElementById('import-loading').classList.add('hidden');

        if (!Array.isArray(questions) || questions.length === 0) {
            showToast('未能从文档中解析到有效题目，请检查文件内容', 'error');
            return;
        }

        showParsedResult(questions);
    } catch (e) {
        document.getElementById('import-loading').classList.add('hidden');
        showToast('文档解析失败：' + e.message, 'error');
        console.error(e);
    }
}

// ==================== Word .docx Parser ====================
async function parseWordDocx(file) {
    // Use JSZip to unzip .docx and extract text from document.xml
    const JSZipModule = await loadJSZip();
    const zip = await JSZipModule.loadAsync(file);
    const xmlFile = zip.file('word/document.xml');
    if (!xmlFile) throw new Error('无效的 .docx 文件');

    const xmlText = await xmlFile.async('string');
    // Extract all text content between <w:t> tags
    const textParts = [];
    const regex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
    let match;
    while ((match = regex.exec(xmlText)) !== null) {
        textParts.push(match[1]);
    }

    const fullText = textParts.join('');
    return parsePastedTextSmart(fullText);
}

// ==================== Excel .xlsx/.xls Parser ====================
async function parseExcel(file) {
    const XLSXModule = await loadXLSX();
    const data = new Uint8Array(await file.arrayBuffer());
    const workbook = XLSXModule.read(data, { type: 'array' });

    const questions = [];
    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSXModule.utils.sheet_to_json(sheet, { header: 1 });

        if (jsonData.length < 2) return;

        const headers = jsonData[0].map(h => String(h || '').trim().toLowerCase());
        const hasTypeCol = headers.some(h => ['type', '题型', '类型', 'questiontype'].includes(h));

        if (hasTypeCol) {
            // Structured: use CSV-like parsing
            const csvText = jsonData.map(row => row.map(cell => {
                const v = String(cell || '').trim();
                return v.includes(',') ? `"${v}"` : v;
            }).join(',')).join('\n');
            questions.push(...parseCSVSmart(csvText));
        } else {
            // Unstructured: treat each row as text line
            const textLines = jsonData.slice(1)
                .map(row => row.map(cell => String(cell || '').trim()).filter(c => c).join('\t'))
                .filter(l => l);
            const fullText = textLines.join('\n');
            questions.push(...parsePastedTextSmart(fullText));
        }
    });

    return questions;
}

// ==================== Library Loaders (cached) ====================
let _jszipPromise = null;
function loadJSZip() {
    if (!_jszipPromise) {
        _jszipPromise = loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js')
            .then(() => window.JSZip);
    }
    return _jszipPromise;
}

let _xlsxPromise = null;
function loadXLSX() {
    if (!_xlsxPromise) {
        _xlsxPromise = loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js')
            .then(() => window.XLSX);
    }
    return _xlsxPromise;
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            // Already loaded
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error('加载脚本失败: ' + src));
        document.head.appendChild(script);
    });
}

// ==================== Preview & Import ====================
function showParsedResult(questions) {
    const normalized = [];
    const failed = [];
    questions.forEach((q, i) => {
        const result = normalizeQuestion(q, i);
        if (result) {
            result._selected = true;
            normalized.push(result);
        } else {
            failed.push(i + 1);
        }
    });

    parsedPreviewQuestions = normalized;
    renderPreview(normalized, failed);
    document.getElementById('import-preview').classList.remove('hidden');
    document.getElementById('btn-parse').classList.add('hidden');
    document.getElementById('btn-confirm').classList.remove('hidden');

    if (normalized.length === 0) {
        showToast('没有有效的题目数据', 'error');
    } else {
        showToast(`成功解析 ${normalized.length} 道题目${failed.length > 0 ? '，' + failed.length + '条解析失败' : ''}`, 'info');
    }
}

function renderPreview(questions, failed) {
    const list = document.getElementById('preview-list');
    const countEl = document.getElementById('preview-count');
    const failedEl = document.getElementById('preview-failed');
    const typeMap = { choice: '选择题', judge: '判断题', short: '简答题' };
    const labels = ['A', 'B', 'C', 'D'];

    countEl.textContent = questions.length + ' 题';
    failedEl.textContent = failed.length > 0 ? `以下条目解析失败：${failed.join(', ')}，已跳过` : '';

    list.innerHTML = questions.map((q, i) => {
        let detail = '';
        if (q.type === 'choice') {
            detail = q.options.map((opt, j) => `${labels[j]}. ${escapeHtml(opt)}`).join('&nbsp;&nbsp;') + `<br><strong>答案：</strong>${labels[q.answer]}`;
        } else if (q.type === 'judge') {
            detail = `<strong>答案：</strong>${q.answer ? '正确' : '错误'}`;
        } else {
            detail = `<strong>参考答案：</strong>${escapeHtml(q.answer.substring(0, 80))}${q.answer.length > 80 ? '...' : ''}`;
        }

        return `
            <div style="padding:10px 14px;border-bottom:1px solid var(--gray-100);display:flex;align-items:flex-start;gap:10px;font-size:13px;" id="preview-item-${i}">
                <label style="margin-top:2px;cursor:pointer;">
                    <input type="checkbox" checked onchange="parsedPreviewQuestions[${i}]._selected=this.checked;updatePreviewCount();">
                </label>
                <div style="flex:1;">
                    <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                        <span class="badge badge-${q.type}">${typeMap[q.type]}</span>
                        <span style="color:var(--gray-400);font-size:11px;">第${i + 1}题</span>
                    </div>
                    <div style="font-weight:500;margin-bottom:2px;">${escapeHtml(q.question)}</div>
                    <div style="color:var(--gray-500);font-size:12px;">${detail}</div>
                </div>
            </div>
        `;
    }).join('');
}

function toggleAllPreview() {
    const checked = document.getElementById('select-all-preview').checked;
    parsedPreviewQuestions.forEach(q => q._selected = checked);
    document.querySelectorAll('#preview-list input[type="checkbox"]').forEach(cb => cb.checked = checked);
    updatePreviewCount();
}

function updatePreviewCount() {
    const selected = parsedPreviewQuestions.filter(q => q._selected).length;
    document.getElementById('preview-count').textContent = selected + ' 题';
    document.getElementById('select-all-preview').checked = selected === parsedPreviewQuestions.length;
}

function doImport() {
    try {
        // Determine bank name: prioritize doc name, then advanced panel name
        let bankName = document.getElementById('import-doc-name').value.trim();
        if (!bankName && docFile) {
            bankName = docFile.name.replace(/\.\w+$/i, '');
        }
        if (!bankName) {
            const activeTab = document.querySelector('.import-panel.active');
            const tabId = activeTab ? activeTab.id : '';
            if (tabId === 'import-json') bankName = document.getElementById('import-json-name').value.trim();
            else if (tabId === 'import-csv') bankName = document.getElementById('import-csv-name').value.trim();
            else if (tabId === 'import-paste') bankName = document.getElementById('import-paste-name').value.trim();
        }
        if (!bankName) bankName = '导入题库';

        const selectedQuestions = parsedPreviewQuestions.filter(q => q._selected).map(q => {
            const { _selected, ...rest } = q;
            return rest;
        });

        if (selectedQuestions.length === 0) {
            showToast('没有选中任何题目', 'error');
            return;
        }

        const bank = {
            id: 'bank_' + Date.now(),
            name: bankName,
            createdAt: new Date().toISOString(),
            questions: selectedQuestions
        };

        appData.banks.push(bank);
        saveData();
        closeModal('import-modal');
        renderBankList();
        showToast(`成功导入 ${selectedQuestions.length} 道题目到「${bankName}」`, 'success');
    } catch (e) {
        showToast('导入失败：' + e.message, 'error');
        console.error(e);
    }
}



function parseCSVSmart(text) {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l);
    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase().replace(/^['"]|['"]$/g, ''));
    const questions = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length < 2) continue;

        const row = {};
        headers.forEach((h, idx) => { row[h] = (values[idx] || '').trim().replace(/^['"]|['"]$/g, ''); });

        // Determine type from multiple possible column names
        let type = '';
        const typeVal = String(row['type'] || row['题型'] || row['类型'] || row['questiontype'] || '').trim().toLowerCase();

        if (typeVal === 'choice' || typeVal === '选择题' || typeVal === '1') {
            type = 'choice';
        } else if (typeVal === 'judge' || typeVal === '判断题' || typeVal === '2') {
            type = 'judge';
        } else if (typeVal === 'short' || typeVal === '简答题' || typeVal === '3' || typeVal === 'essay') {
            type = 'short';
        } else {
            // Try to guess from number of options
            const opts = [row['optiona'] || row['选项a'] || row['a'], row['optionb'] || row['选项b'] || row['b'],
                          row['optionc'] || row['选项c'] || row['c'], row['optiond'] || row['选项d'] || row['d']].filter(o => o);
            if (opts.length >= 2) {
                type = 'choice';
            } else if (['正确', '错误', '对', '错', 'true', 'false', '是', '否'].includes(String(row['answer'] || row['答案'] || '').trim().toLowerCase())) {
                type = 'judge';
            } else if (row['answer'] || row['答案']) {
                type = 'short';
            } else {
                continue; // can't determine type
            }
        }

        const q = {
            type,
            question: row['question'] || row['题目'] || row['题干'] || ''
        };

        if (!q.question) continue;

        if (type === 'choice') {
            q.options = [
                row['optiona'] || row['选项a'] || row['a'] || '',
                row['optionb'] || row['选项b'] || row['b'] || '',
                row['optionc'] || row['选项c'] || row['c'] || '',
                row['optiond'] || row['选项d'] || row['d'] || ''
            ].filter(o => o);
            const ansStr = String(row['answer'] || row['答案'] || 'A').trim().toUpperCase();
            const ansMap = { A: 0, B: 1, C: 2, D: 3, '0': 0, '1': 1, '2': 2, '3': 3 };
            q.answer = ansMap[ansStr] !== undefined ? ansMap[ansStr] : 0;
        } else if (type === 'judge') {
            const ansStr = String(row['answer'] || row['答案'] || '').trim().toLowerCase();
            q.answer = ['正确', '对', 'true', '是', 'yes', '1'].includes(ansStr);
        } else {
            q.answer = row['answer'] || row['答案'] || '';
        }

        q.explanation = row['explanation'] || row['解析'] || row['分析'] || '';
        questions.push(q);
    }

    return questions;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += ch;
        }
    }
    result.push(current.trim());
    return result;
}

// Parse a multi-line text block into a question (used for Word doc blocks)
function parseTextBlock(block) {
    const lines = block.split(/\r?\n/).map(l => l.trim()).filter(l => l);
    if (lines.length === 0) return null;

    const fullText = block;
    const firstLine = lines[0];

    // Detect type from prefix
    let type = null;
    if (/^(选择题|选择|choice|单选|多选)\s*[:：]/i.test(firstLine)) type = 'choice';
    else if (/^(判断题|判断|judge|判断对错|判断正误)\s*[:：]/i.test(firstLine)) type = 'judge';
    else if (/^(简答题|简答|short|essay|问答|论述)\s*[:：]/i.test(firstLine)) type = 'short';

    // Auto-detect type from content if no prefix
    if (!type) {
        const hasABC = lines.some(l => /^[A-D][.、．)\]】]\s*/.test(l.trim()));
        const isJudge = lines.some(l => /^[（(]?\s*[(（]?正确|错误|对|错|√|×|✓/i.test(l));
        const hasAnswer = lines.some(l => /^(答案|参考答案|正确答案)\s*[：:]/i.test(l));
        if (hasABC) type = 'choice';
        else if (isJudge) type = 'judge';
        else if (hasAnswer) type = 'short';
    }

    if (!type) return null;

    // Extract question text (first line, stripping prefix)
    let questionText = firstLine.replace(/^(选择题|选择|choice|单选|多选|判断题|判断|judge|判断对错|判断正误|简答题|简答|short|essay|问答|论述)\s*[:：]\s*/i, '').trim();

    let options = [];
    let answer = '';
    let explanation = '';

    if (type === 'choice') {
        // Collect A-D options from lines
        const optRegex = /^[A-D][.、．)\]】]\s*(.+)/;
        const remainingLines = lines.slice(1);
        for (const l of remainingLines) {
            const m = l.trim().match(optRegex);
            if (m) options.push(m[1]);
        }
        // If no options found with markers, try each line as an option
        if (options.length < 2) {
            for (const l of remainingLines) {
                const t = l.trim();
                if (t && !t.match(/^(答案|解析|正确答案|参考答案)/i) && t.length < 200) {
                    options.push(t.replace(/^[A-D][.、．)\]】]\s*/, ''));
                    if (options.length >= 6) break;
                }
            }
        }
        // Find answer
        const ansLine = lines.find(l => /^([（(]?\s*答案|正确答案)\s*[：:]/i.test(l));
        if (ansLine) {
            const ansMatch = ansLine.match(/[A-D]/i);
            answer = ansMatch ? 'ABCD'.indexOf(ansMatch[0].toUpperCase()) : 0;
        } else {
            answer = 0;
        }
        // Find explanation
        const explLine = lines.find(l => /^(解析|分析|解释|详解)\s*[：:]/i.test(l));
        if (explLine) explanation = explLine.replace(/^(解析|分析|解释|详解)\s*[：:]\s*/i, '');
    } else if (type === 'judge') {
        const ansLine = lines.find(l => /^[（(]?\s*(答案|正确答案)\s*[：:]/i.test(l)) || lines.find(l => /\s*(正确|错误|对|错|√|×|✓)\s*$/.test(l));
        if (ansLine) {
            answer = /正确|对|√|✓/i.test(ansLine);
        } else {
            answer = true;
        }
        const explLine = lines.find(l => /^(解析|分析|解释)\s*[：:]/i.test(l));
        if (explLine) explanation = explLine.replace(/^(解析|分析|解释)\s*[：:]\s*/i, '');
    } else {
        const ansLine = lines.find(l => /^(答案|参考答案|正确答案)\s*[：:]/i.test(l));
        if (ansLine) answer = ansLine.replace(/^(答案|参考答案|正确答案)\s*[：:]\s*/i, '');
        const explLine = lines.find(l => /^(解析|分析|解释)\s*[：:]/i.test(l));
        if (explLine) explanation = explLine.replace(/^(解析|分析|解释)\s*[：:]\s*/i, '');
    }

    return { type, question: questionText, options: options.length >= 2 ? options : undefined, answer, explanation };
}

function parsePastedTextSmart(text) {
    // Smart multi-line parser: tries to detect format automatically
    // First, split by blank lines to get question blocks (common in Word documents)
    const rawLines = text.split(/\r?\n/).map(l => l.trim());

    // Try block-based parsing first (separated by blank lines)
    const blocks = [];
    let currentBlock = [];
    for (const line of rawLines) {
        if (line === '') {
            if (currentBlock.length > 0) {
                blocks.push(currentBlock.join('\n'));
                currentBlock = [];
            }
        } else {
            currentBlock.push(line);
        }
    }
    if (currentBlock.length > 0) blocks.push(currentBlock.join('\n'));

    // If blocks were found (multiple blank-line-separated sections), parse each block
    if (blocks.length > 1) {
        const blockQuestions = [];
        for (const block of blocks) {
            const q = parseTextBlock(block);
            if (q) blockQuestions.push(q);
        }
        if (blockQuestions.length > 0) return blockQuestions;
    }

    // Fallback: line-by-line parsing
    const lines = rawLines.filter(l => l);
    if (lines.length === 0) return [];

    const questions = [];

    // Detect delimiter for each line (|, tab, comma, or mixed)
    function splitLine(line) {
        // Try | first (most common in quiz format)
        if (line.includes('|')) return line.split('|').map(p => p.trim());
        // Try tab
        if (line.includes('\t')) return line.split('\t').map(p => p.trim());
        // Try comma (but careful with Chinese comma)
        if (line.includes(',')) return line.split(',').map(p => p.trim());
        return [line];
    }

    // Detect question type from prefix
    function detectTypeFromPrefix(text) {
        const t = text.toLowerCase();
        if (/^(选择题|选择|choice)\s*[:：]/.test(t)) return 'choice';
        if (/^(判断题|判断|judge|判断对错)\s*[:：]/.test(t)) return 'judge';
        if (/^(简答题|简答|short|essay|问答)\s*[:：]/.test(t)) return 'short';
        return null;
    }

    // Detect if a line looks like it has option markers (A. / A、/ A ) pattern
    function hasOptionPattern(parts) {
        let optionCount = 0;
        for (const p of parts) {
            if (/^[A-D][.、．)\]】]/.test(p.trim())) optionCount++;
        }
        return optionCount >= 2;
    }

    // Parse a single line into a question object
    function parseLine(parts, lineNum) {
        if (parts.length < 2) return null;

        const first = parts[0];

        // Strategy 1: Has explicit type prefix
        const prefixType = detectTypeFromPrefix(first);

        if (prefixType === 'choice') {
            const questionText = first.replace(/^(选择题|选择|choice)\s*[:：]\s*/i, '').trim();
            // Collect options: find parts that start with A/B/C/D
            const options = [];
            let answerIdx = -1;
            let explanation = '';

            for (let i = 1; i < parts.length; i++) {
                const p = parts[i].trim();
                if (!p) continue;
                const optMatch = p.match(/^[A-D][.、．)\]】]\s*(.+)/);
                if (optMatch) {
                    options.push(optMatch[1]);
                } else if (answerIdx === -1 && /^[A-D]$/i.test(p)) {
                    answerIdx = 'ABCD'.indexOf(p.toUpperCase());
                } else {
                    // Could be explanation or last option
                    if (options.length > 0 && answerIdx === -1) {
                        answerIdx = 'ABCD'.indexOf(p.toUpperCase());
                        if (answerIdx === -1) explanation = p;
                    } else {
                        explanation = explanation ? explanation + ' ' + p : p;
                    }
                }
            }

            // Fallback: if no option markers found, treat parts[1..n-2] as options, parts[n-2] as answer, parts[n-1] as explanation
            if (options.length < 2) {
                options.length = 0;
                for (let i = 1; i < parts.length - 2; i++) {
                    const p = parts[i].trim();
                    if (p) options.push(p.replace(/^[A-D][.、．)\]】]\s*/, ''));
                }
                if (parts.length >= 2) {
                    const ansPart = parts[parts.length - 2].trim().toUpperCase();
                    const ansMap = { A: 0, B: 1, C: 2, D: 3 };
                    if (ansMap[ansPart] !== undefined) answerIdx = ansMap[ansPart];
                }
                if (parts.length >= 1) explanation = parts[parts.length - 1] || '';
            }

            if (options.length < 2 || answerIdx === -1) answerIdx = 0;

            return {
                type: 'choice',
                question: questionText,
                options,
                answer: answerIdx,
                explanation
            };
        }

        if (prefixType === 'judge') {
            const questionText = first.replace(/^(判断题|判断|judge|判断对错)\s*[:：]\s*/i, '').trim();
            const ansStr = (parts[1] || '').trim().toLowerCase();
            const answer = ['正确', '对', 'true', '是', 'yes', '✓', '√'].includes(ansStr);
            const explanation = parts[2] || parts[1] === (ansStr) ? '' : parts.slice(2).join(' ');

            return {
                type: 'judge',
                question: questionText,
                answer,
                explanation: typeof parts[2] === 'string' ? parts.slice(2).join(' ') : ''
            };
        }

        if (prefixType === 'short') {
            const questionText = first.replace(/^(简答题|简答|short|essay|问答)\s*[:：]\s*/i, '').trim();
            const answer = parts[1] || '';
            const explanation = parts.slice(2).join(' ') || '';

            return {
                type: 'short',
                question: questionText,
                answer,
                explanation
            };
        }

        // Strategy 2: No explicit prefix - detect from content
        // Check if it has option patterns -> choice
        if (hasOptionPattern(parts)) {
            const questionText = first;
            const options = [];
            let answerIdx = 0;
            let explanation = '';
            let lastTextPart = null;

            for (let i = 1; i < parts.length; i++) {
                const p = parts[i].trim();
                if (!p) continue;
                const optMatch = p.match(/^[A-D][.、．)\]】]\s*(.+)/);
                if (optMatch) {
                    options.push(optMatch[1]);
                } else {
                    lastTextPart = p;
                }
            }

            if (lastTextPart && /^[A-D]$/i.test(lastTextPart)) {
                answerIdx = 'ABCD'.indexOf(lastTextPart.toUpperCase());
                lastTextPart = null;
            }

            if (lastTextPart) {
                explanation = lastTextPart;
            }

            if (options.length < 2) return null;

            return {
                type: 'choice',
                question: questionText,
                options,
                answer: answerIdx,
                explanation
            };
        }

        // Strategy 3: Very few parts (2-3) - could be judge or short
        if (parts.length === 2) {
            const ans = (parts[1] || '').trim().toLowerCase();
            if (['正确', '错误', '对', '错', 'true', 'false', '是', '否', '✓', '×', '√'].includes(ans)) {
                return {
                    type: 'judge',
                    question: first,
                    answer: ['正确', '对', 'true', '是', 'yes', '✓', '√'].includes(ans),
                    explanation: ''
                };
            } else {
                // Assume short answer
                return {
                    type: 'short',
                    question: first,
                    answer: parts[1] || '',
                    explanation: ''
                };
            }
        }

        if (parts.length === 3) {
            const ans = (parts[1] || '').trim().toLowerCase();
            if (['正确', '错误', '对', '错', 'true', 'false', '是', '否', '✓', '×', '√'].includes(ans)) {
                return {
                    type: 'judge',
                    question: first,
                    answer: ['正确', '对', 'true', '是', 'yes', '✓', '√'].includes(ans),
                    explanation: parts[2] || ''
                };
            } else {
                return {
                    type: 'short',
                    question: first,
                    answer: parts[1] || '',
                    explanation: parts[2] || ''
                };
            }
        }

        // Strategy 4: 4+ parts with no type prefix - try as choice if parts 2-5 look like options
        if (parts.length >= 4) {
            const maybeOptions = parts.slice(1, parts.length - 1).map(p => p.trim()).filter(p => p);
            if (maybeOptions.length >= 2 && maybeOptions.length <= 6) {
                const ansPart = parts[parts.length - 1].trim().toUpperCase();
                const ansMap = { A: 0, B: 1, C: 2, D: 3 };
                let answerIdx = ansMap[ansPart] !== undefined ? ansMap[ansPart] : 0;

                return {
                    type: 'choice',
                    question: first,
                    options: maybeOptions,
                    answer: answerIdx,
                    explanation: ''
                };
            }
        }

        return null;
    }

    for (let i = 0; i < lines.length; i++) {
        const parts = splitLine(lines[i]);
        const q = parseLine(parts, i + 1);
        if (q && q.question) {
            questions.push(q);
        }
    }

    return questions;
}

function normalizeQuestion(q, index) {
    if (!q || !q.question || !q.type) return null;
    const type = q.type.toLowerCase();
    if (!['choice', 'judge', 'short'].includes(type)) return null;

    const normalized = {
        id: 'q_' + Date.now() + '_' + index + '_' + Math.random().toString(36).substr(2, 5),
        type,
        question: String(q.question).trim(),
        explanation: q.explanation || ''
    };

    if (type === 'choice') {
        if (!Array.isArray(q.options) || q.options.length < 2) return null;
        normalized.options = q.options.map(o => String(o).trim());
        normalized.answer = typeof q.answer === 'number' ? q.answer : 0;
    } else if (type === 'judge') {
        normalized.answer = Boolean(q.answer);
    } else {
        normalized.answer = String(q.answer || '').trim();
    }

    return normalized;
}

// ==================== Add Question ====================
function showAddQuestionModal() {
    if (appData.banks.length === 0) {
        showToast('请先创建或导入题库', 'error');
        return;
    }
    updateBankSelect();
    const select = document.getElementById('add-q-bank');
    // Remove "all" option for add question
    const allOpt = select.querySelector('option[value="all"]');
    if (allOpt) allOpt.remove();

    toggleAddQuestionFields();
    showModal('add-question-modal');
}

function toggleAddQuestionFields() {
    const type = document.getElementById('add-q-type').value;
    document.getElementById('add-q-choice-fields').classList.toggle('hidden', type !== 'choice');
    document.getElementById('add-q-judge-fields').classList.toggle('hidden', type !== 'judge');
    document.getElementById('add-q-short-fields').classList.toggle('hidden', type !== 'short');
}

function addQuestion() {
    const bankId = document.getElementById('add-q-bank').value;
    if (!bankId || bankId === 'all') {
        showToast('请选择一个题库', 'error');
        return;
    }
    const bank = appData.banks.find(b => b.id === bankId);
    if (!bank) return;

    const type = document.getElementById('add-q-type').value;
    const question = document.getElementById('add-q-text').value.trim();
    if (!question) {
        showToast('请输入题目内容', 'error');
        return;
    }

    const explanation = document.getElementById('add-q-explanation').value.trim();
    const q = {
        id: 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        type,
        question,
        explanation
    };

    if (type === 'choice') {
        const optA = document.getElementById('add-q-optA').value.trim();
        const optB = document.getElementById('add-q-optB').value.trim();
        if (!optA || !optB) {
            showToast('选择题至少需要两个选项', 'error');
            return;
        }
        const optC = document.getElementById('add-q-optC').value.trim();
        const optD = document.getElementById('add-q-optD').value.trim();
        q.options = [optA, optB, optC, optD].filter(o => o);
        q.answer = parseInt(document.getElementById('add-q-choice-answer').value);
    } else if (type === 'judge') {
        q.answer = document.getElementById('add-q-judge-answer').value === 'true';
    } else {
        q.answer = document.getElementById('add-q-short-answer').value.trim();
        if (!q.answer) {
            showToast('请输入参考答案', 'error');
            return;
        }
    }

    bank.questions.push(q);
    saveData();
    closeModal('add-question-modal');
    renderBankList();
    if (currentBankId === bankId) renderQuestions();
    showToast('题目已添加', 'success');
}

// ==================== Export ====================
function exportBank() {
    if (appData.banks.length === 0) {
        showToast('没有可导出的题库', 'error');
        return;
    }

    const dataStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz_banks_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('题库已导出', 'success');
}

// ==================== Stats ====================
function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    if (stats.todayDate !== today) {
        stats.todayDone = 0;
        stats.todayCorrect = 0;
        stats.todayDate = today;
        saveData();
    }

    document.getElementById('stat-total-done').textContent = stats.totalDone;
    const acc = stats.totalDone > 0 ? Math.round((stats.totalCorrect / stats.totalDone) * 100) : 0;
    document.getElementById('stat-accuracy').textContent = acc + '%';
    document.getElementById('stat-streak').textContent = stats.streak;
    document.getElementById('stat-today').textContent = stats.todayDone;

    // Render chart
    renderAccuracyChart();

    // Type stats
    renderTypeStats();

    // Wrong questions list
    renderWrongList();
}

function renderAccuracyChart() {
    const container = document.getElementById('accuracy-chart');
    const history = stats.history.slice(-10); // Last 10 entries

    if (history.length === 0) {
        container.innerHTML = '<div class="empty-text">暂无做题记录</div>';
        return;
    }

    const maxVal = Math.max(...history.map(h => h.total), 1);
    container.innerHTML = history.map(h => {
        const rate = h.total > 0 ? Math.round((h.correct / h.total) * 100) : 0;
        const height = Math.max(4, (h.total / maxVal) * 160);
        const dateLabel = h.date.slice(5); // MM-DD
        return `
            <div class="chart-bar-group">
                <span class="chart-bar-value">${rate}%</span>
                <div class="chart-bar" style="height:${height}px;background:linear-gradient(to top,${rate >= 60 ? 'var(--success)' : 'var(--danger)'},${rate >= 60 ? '#34d399' : '#fca5a5'})"></div>
                <span class="chart-bar-label">${dateLabel}</span>
            </div>
        `;
    }).join('');
}

function renderTypeStats() {
    const container = document.getElementById('type-stats-grid');
    const types = [
        { key: 'choice', name: '选择题', cls: 'choice' },
        { key: 'judge', name: '判断题', cls: 'judge' },
        { key: 'short', name: '简答题', cls: 'short' }
    ];

    container.innerHTML = types.map(t => {
        const done = stats.typeStats[t.key].done;
        const correct = stats.typeStats[t.key].correct;
        const rate = done > 0 ? Math.round((correct / done) * 100) : 0;
        return `
            <div class="type-stat-card ${t.cls}">
                <div class="type-stat-number">${rate}%</div>
                <div class="type-stat-label">${t.name}（${done}题）</div>
            </div>
        `;
    }).join('');
}

function renderWrongList() {
    const list = document.getElementById('wrong-list');
    const count = document.getElementById('wrong-count');
    count.textContent = stats.wrongQuestions.length;

    if (stats.wrongQuestions.length === 0) {
        list.innerHTML = '<div class="empty-text">暂无错题，继续加油！</div>';
        return;
    }

    // Show last 20 wrong questions
    const recent = stats.wrongQuestions.slice(-20).reverse();
    const typeMap = { choice: '选择题', judge: '判断题', short: '简答题' };

    list.innerHTML = recent.map(w => `
        <div class="wrong-item">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                <span class="badge badge-${w.type}">${typeMap[w.type]}</span>
                <span style="font-size:12px;color:var(--gray-400);">${new Date(w.timestamp).toLocaleString()}</span>
            </div>
            <div style="font-size:14px;margin-bottom:4px;">${escapeHtml(w.question)}</div>
            <div style="font-size:12px;">
                <span class="your-ans">你的答案：${w.userAnswer}</span>
                <span style="margin-left:12px;" class="correct-ans">正确答案：${w.correctAnswer}</span>
            </div>
        </div>
    `).join('');
}

// ==================== Utility ====================
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', init);
