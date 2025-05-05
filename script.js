let questions = [];
let currentPage = 1;
const questionsPerPage = 5;
let selectedIndexes = []; // 用来保存勾选的题目索引

// 页面加载时读取题库
window.onload = async function () {
  const res = await fetch('questions.json');
  questions = await res.json();
  renderQuestions();
  setupFilter();
};

document.getElementById("jumpPageBtn").addEventListener("click", () => {
  const input = document.getElementById("jumpPageInput");
  const page = parseInt(input.value);
  const filtered = questions.filter(q =>
    q.type === selectedType &&
    q.topic === selectedKnowledge &&
    q.nandu === selectedDifficulty
  );
  const totalPages = Math.ceil(filtered.length / questionsPerPage);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderFilteredQuestions();
  } else {
    alert("无效页码！");
  }
});


// 渲染题目
function renderQuestions() {
  const container = document.getElementById('questionContainer');
  container.innerHTML = "";

  const type = document.getElementById("typeFilter").value;
  const filtered = type === "all" ? questions : questions.filter(q => q.type === type);

  const totalPages = Math.ceil(filtered.length / questionsPerPage);
  const start = (currentPage - 1) * questionsPerPage;
  const pageItems = filtered.slice(start, start + questionsPerPage);
  
  pageItems.forEach((q, i) => {
    const isChecked = selectedIndexes.includes(questions.indexOf(q)); // 检查当前题目是否被选中

    const div = document.createElement('div');
    div.className = "question";
    div.innerHTML = `
      <h3><input type="checkbox" class="question-select" data-index="${questions.indexOf(q)}" ${isChecked ? 'checked' : ''} /> (${q.nandu})【${q.type}】${q.topic}</h3>
      <p>${q.content}</p>
     <button onclick="toggleExplanation(this)">显示解析</button>
     <div class="explanation" style="display: none;">${q.explanation}</div>
    `;
    container.appendChild(div);
  });

  document.getElementById("pageInfo").innerText = `第 ${currentPage} 页 / 共 ${totalPages} 页`;
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;

  // 让 MathJax 渲染新内容
  MathJax.typesetPromise();
}

// 切换解析显示
function toggleExplanation(btn) {
  const expl = btn.nextElementSibling;
  if (expl.style.display === 'none') {
    expl.style.display = 'block';
    btn.textContent = '隐藏解析';
  } else {
    expl.style.display = 'none';
    btn.textContent = '显示解析';
  }
}

// 筛选
function setupFilter() {
  document.getElementById("typeFilter").addEventListener("change", () => {
    currentPage = 1;
    renderQuestions();
  });

  document.getElementById("prevPage").addEventListener("click", () => {
    currentPage--;
    renderQuestions();
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    currentPage++;
    renderQuestions();
  });
}

const knowledgePoints = {
  "选择题": ["行列式", "矩阵", "线性方程组", "向量", "二次型", "线性空间"],
  "填空题": ["行列式", "矩阵", "线性方程组", "向量", "二次型", "线性空间"],
  "判断题": ["行列式", "矩阵", "线性方程组", "向量", "二次型", "线性空间"],
  "计算题": ["行列式", "矩阵", "线性方程组", "向量", "二次型", "线性空间"],
  "证明题": ["行列式", "矩阵", "线性方程组", "向量", "二次型", "线性空间"],
};

const difficulties = ["容易", "中等", "困难"];

let selectedType = null;
let selectedKnowledge = null;
let selectedDifficulty = null;

document.querySelectorAll(".type-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedType = btn.dataset.type;
    selectedKnowledge = null;
    selectedDifficulty = null;

    renderKnowledgeButtons();
    document.getElementById("knowledgeContainer").style.display = "block";
    document.getElementById("difficultyContainer").style.display = "none";
    document.getElementById("questionContainer").innerHTML = ""; // 清空题目
  });
});

function renderKnowledgeButtons() {
  const container = document.getElementById("knowledgeContainer");
  container.innerHTML = "<label>知识点：</label>";
  knowledgePoints[selectedType].forEach(kp => {
    const btn = document.createElement("button");
    btn.className = "knowledge-btn";
    btn.textContent = kp;
    btn.addEventListener("click", () => {
      selectedKnowledge = kp;
      renderDifficultyButtons();
      document.getElementById("difficultyContainer").style.display = "block";
      document.getElementById("questionContainer").innerHTML = "";
    });
    container.appendChild(btn);
  });
}

function renderDifficultyButtons() {
  const container = document.getElementById("difficultyContainer");
  container.innerHTML = "<label>难度：</label>";
  difficulties.forEach(level => {
    const btn = document.createElement("button");
    btn.className = "difficulty-btn";
    btn.textContent = level;
    btn.addEventListener("click", () => {
      selectedDifficulty = level;
      currentPage = 1;
      renderFilteredQuestions();
    });
    container.appendChild(btn);
  });
}

function renderFilteredQuestions() {
  const filtered = questions.filter(q =>
    q.type === selectedType &&
    q.topic === selectedKnowledge &&
    q.nandu === selectedDifficulty
  );

  renderQuestionsFromList(filtered);
}

function renderQuestionsFromList(filtered) {
  const container = document.getElementById('questionContainer');
  container.innerHTML = "";

  const totalPages = Math.ceil(filtered.length / questionsPerPage);
  const start = (currentPage - 1) * questionsPerPage;
  const pageItems = filtered.slice(start, start + questionsPerPage);

  pageItems.forEach(q => {
    const isChecked = selectedIndexes.includes(questions.indexOf(q));
    const div = document.createElement('div');
    div.className = "question";
    div.innerHTML = `
      <h3><input type="checkbox" class="question-select" data-index="${questions.indexOf(q)}" ${isChecked ? 'checked' : ''} /> (${q.nandu})【${q.type}】${q.topic}</h3>
      <p>${q.content}</p>
      <button onclick="toggleExplanation(this)">显示解析</button>
      <div class="explanation" style="display: none;">${q.explanation}</div>
    `;
    container.appendChild(div);
  });

  document.getElementById("pageInfo").innerText = `第 ${currentPage} 页 / 共 ${totalPages} 页`;
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;

  MathJax.typesetPromise();
}


// 监听复选框选择
document.getElementById("questionContainer").addEventListener("change", (e) => {
  if (e.target.classList.contains("question-select")) {
    const index = parseInt(e.target.getAttribute("data-index"));
    if (e.target.checked) {
      selectedIndexes.push(index);
    } else {
      selectedIndexes = selectedIndexes.filter(i => i !== index);
    }
  }
});

// 生成试卷
document.getElementById("generatePaper").addEventListener("click", () => {
  const selectedQuestions = selectedIndexes.map(i => questions[i]);

  if (selectedQuestions.length === 0) {
    alert("请至少选择一道题目！");
    return;
  }

  showPaper(selectedQuestions);
});

// 显示试卷
function showPaper(selected) {
  const win = window.open("", "_blank");
  win.document.write(`
    <html>
    <head>
      <title>组卷结果</title>
      <script>
        window.MathJax = {
          tex: { inlineMath: [['\\\\(', '\\\\)'], ['\\$', '\\$']] },
          svg: { fontCache: 'global' }
        };
      </script>
      <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" async></script>
      <style>
        body { font-family: sans-serif; padding: 20px; line-height: 1.8; }
        .question { margin-bottom: 30px; }
      </style>
    </head>
    <body>
      <h1>试卷预览</h1>
      ${selected.map((q, idx) => `
        <div class="question">
          <strong>第 ${idx + 1} 题【${q.type}】${q.topic}：</strong>
          <p>${q.content}</p>
        </div>
      `).join("")}
    </body>
    </html>
  `);
  win.document.close();
}


// 导出 LaTeX 代码
document.getElementById("exportLatex").addEventListener("click", () => {
  const selectedQuestions = selectedIndexes.map(i => questions[i]);

  if (selectedQuestions.length === 0) {
    alert("请至少选择一道题目！");
    return;
  }

  const latexCode = generateLatex(selectedQuestions);
  downloadLatexFile(latexCode);
});


// 生成 LaTeX 格式的代码
function generateLatex(selectedQuestions) {
  let latex = `\\documentclass{ctexart}\n\\usepackage{amsmath}\n\\begin{document}\n\\title{试卷}\n\\maketitle\n\n`;

  selectedQuestions.forEach((q, idx) => {
    latex += `\\textbf{第 ${idx + 1} 题【${q.type}】${q.topic}:} \n`;
    latex += `${q.content}\n\n`;

    if (q.explanation) {
      latex += `\\textbf{解析:} ${q.explanation}\n\n`;
    }
  });

  latex += '\\end{document}';
  return latex;
}

// 下载 LaTeX 代码到文件
function downloadLatexFile(latexCode) {
  const blob = new Blob([latexCode], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'exam_paper.tex';
  link.click();
}

// 滑动面板控制逻辑
const toggleBtn = document.getElementById("togglePanelBtn");
const sidePanel = document.getElementById("sidePanel");
const closePanelBtn = document.getElementById("closePanelBtn");
const selectedListDiv = document.getElementById("selectedQuestionsList");

toggleBtn.addEventListener("click", () => {
  updateSelectedQuestionsList();
  sidePanel.classList.add("open");
});

closePanelBtn.addEventListener("click", () => {
  sidePanel.classList.remove("open");
});

function updateSelectedQuestionsList() {
  selectedListDiv.innerHTML = "";
  if (selectedIndexes.length === 0) {
    selectedListDiv.innerHTML = "<p>尚未勾选任何题目。</p>";
    return;
  }

  selectedIndexes.forEach(index => {
    const q = questions[index];
    const div = document.createElement("div");
    div.className = "selected-question";
    div.innerHTML = `
      <h4>【${q.type}】${q.topic}（${q.nandu}）</h4>
      <p>${q.content}</p>
      <hr />
    `;
    selectedListDiv.appendChild(div);
  });

  MathJax.typesetPromise();
}

// 处理：删除某一道题
function removeSelectedQuestion(indexToRemove) {
  const idx = selectedIndexes.indexOf(indexToRemove);
  if (idx !== -1) {
    selectedIndexes.splice(idx, 1);
    updateSelectedQuestionsList();
    renderQuestionCards(); // 更新主界面卡片的勾选状态
  }
}

// 处理：清空所有已选题
document.getElementById("clearAllBtn").addEventListener("click", () => {
  if (confirm("确定要清空所有已选题吗？")) {
    selectedIndexes = [];
    updateSelectedQuestionsList();
    renderQuestionCards();
  }
});

// 更新右侧面板内容（添加删除按钮）
function updateSelectedQuestionsList() {
  selectedListDiv.innerHTML = "";
  if (selectedIndexes.length === 0) {
    selectedListDiv.innerHTML = "<p>尚未勾选任何题目。</p>";
    return;
  }

  selectedIndexes.forEach(index => {
    const q = questions[index];
    const div = document.createElement("div");
    div.className = "selected-question";
    div.innerHTML = `
      <h4>
        【${q.type}】${q.topic}（${q.nandu}）
        <button onclick="removeSelectedQuestion(${index})" title="移除此题">❌</button>
      </h4>
      <p>${q.content}</p>
      <hr />
    `;
    selectedListDiv.appendChild(div);
  });

  MathJax.typesetPromise();
}
