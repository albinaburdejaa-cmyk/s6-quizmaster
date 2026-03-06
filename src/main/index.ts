// src/main/index.ts

import express, { Request, Response } from 'express';
import { startQuiz } from '../new/index';
import { categories } from '../data/categories';
import { questions } from '../data/questions';
import { loadHighScores, addHighScore, getHighScores, getAllHighScores } from '../data/highscores';

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// Load highscores on startup
loadHighScores();

// Get HTML UI
app.get('/', (req: Request, res: Response) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Quizmaster</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
                .container { max-width: 800px; margin: 0 auto; }
                .header { text-align: center; color: white; margin-bottom: 30px; }
                .header h1 { font-size: 2.5em; margin-bottom: 10px; }
                .header p { font-size: 1.1em; opacity: 0.9; }
                
                .main-screen { background: white; border-radius: 12px; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
                .categories-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 30px; }
                .category-btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 1.1em; font-weight: bold; transition: transform 0.2s, box-shadow 0.2s; }
                .category-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
                .category-btn:active { transform: translateY(0); }
                
                .screen { display: none; }
                .screen.active { display: block; }
                
                .question-number { color: #999; font-size: 0.9em; margin-bottom: 10px; }
                .question-text { font-size: 1.3em; font-weight: bold; margin-bottom: 20px; color: #333; }
                .options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
                .option-btn { background: #f0f0f0; border: 2px solid #ddd; padding: 15px; border-radius: 8px; cursor: pointer; text-align: left; transition: all 0.2s; font-size: 1em; }
                .option-btn:hover { background: #e8e8e8; border-color: #667eea; }
                .option-btn.selected { background: #667eea; color: white; border-color: #667eea; }
                .option-btn.correct { background: #4caf50; color: white; border-color: #4caf50; }
                .option-btn.incorrect { background: #f44336; color: white; border-color: #f44336; }
                
                .buttons { display: flex; gap: 10px; justify-content: space-between; }
                button { background: #667eea; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 1em; transition: background 0.2s; }
                button:hover { background: #764ba2; }
                button:disabled { background: #ccc; cursor: not-allowed; }
                .btn-back { background: #999; }
                .btn-back:hover { background: #777; }
                
                .form-group { margin-bottom: 15px; }
                label { display: block; margin-bottom: 5px; color: #333; font-weight: bold; }
                input { width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-size: 1em; }
                input:focus { outline: none; border-color: #667eea; }
                
                .highscores-list { list-style: none; margin-top: 15px; }
                .highscores-list li { background: #f9f9f9; padding: 10px; margin-bottom: 8px; border-radius: 4px; display: flex; justify-content: space-between; }
                .highscores-list li strong { color: #667eea; }
                
                .result-message { padding: 15px; margin-bottom: 20px; border-radius: 8px; text-align: center; font-weight: bold; }
                .result-correct { background: #c8e6c9; color: #2e7d32; }
                .result-incorrect { background: #ffcdd2; color: #c62828; }
                
                .score-display { font-size: 1.5em; color: #667eea; margin-bottom: 20px; text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎯 Quizmaster</h1>
                    <p>Test your knowledge across multiple categories</p>
                </div>
                
                <!-- Main Menu Screen -->
                <div class="main-screen screen active" id="menuScreen">
                    <h2 style="margin-bottom: 20px; text-align: center; color: #333;">Select a Category</h2>
                    <div class="categories-grid" id="categoriesGrid"></div>
                    <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #eee;">
                        <h3 style="margin-bottom: 15px; color: #333;">📊 Highscores</h3>
                        <div id="highscoresContainer" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;"></div>
                    </div>
                </div>
                
                <!-- Player Name Screen -->
                <div class="main-screen screen" id="playerNameScreen">
                    <h2 style="margin-bottom: 20px; color: #333;">Enter Your Name</h2>
                    <form onsubmit="event.preventDefault(); startCategory();">
                        <div class="form-group">
                            <label>Your Name:</label>
                            <input type="text" id="playerNameInput" required placeholder="Enter your name">
                        </div>
                        <div class="buttons">
                            <button type="button" class="btn-back" onclick="goBack()">Back</button>
                            <button type="submit">Start Quiz</button>
                        </div>
                    </form>
                </div>
                
                <!-- Quiz Screen -->
                <div class="main-screen screen" id="quizScreen">
                    <div class="question-number" id="questionNumber"></div>
                    <div class="question-text" id="questionText"></div>
                    <div class="options" id="optionsContainer"></div>
                    <div id="resultMessage"></div>
                    <div class="buttons">
                        <button type="button" class="btn-back" onclick="goBack()" style="display: none;" id="backBtn">Back</button>
                        <button type="button" onclick="previousQuestion()" id="prevBtn" style="display: none;">Previous</button>
                        <button type="button" onclick="nextQuestion()" id="nextBtn">Next</button>
                    </div>
                </div>
                
                <!-- Results Screen -->
                <div class="main-screen screen" id="resultsScreen">
                    <h2 style="margin-bottom: 20px; text-align: center; color: #333;">Quiz Complete!</h2>
                    <div class="score-display" id="scoreDisplay"></div>
                    <div id="resultDetails" style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;"></div>
                    <div class="buttons" style="justify-content: center;">
                        <button type="button" onclick="goToMenu()">Back to Menu</button>
                    </div>
                </div>
            </div>
            
            <script>
                let currentCategory = null;
                let currentQuestionIndex = 0;
                let playerName = '';
                let categoryQuestions = [];
                let selectedAnswers = {};
                
                // Initialize
                async function init() {
                    const categoriesResponse = await fetch('/api/categories');
                    const cats = await categoriesResponse.json();
                    const grid = document.getElementById('categoriesGrid');
                    grid.innerHTML = '';
                    cats.forEach(cat => {
                        const btn = document.createElement('button');
                        btn.className = 'category-btn';
                        btn.textContent = cat.name;
                        btn.onclick = () => selectCategory(cat.id, cat.name);
                        grid.appendChild(btn);
                    });
                    
                    await loadHighScores();
                }
                
                async function loadHighScores() {
                    const response = await fetch('/api/highscores');
                    const data = await response.json();
                    const container = document.getElementById('highscoresContainer');
                    container.innerHTML = '';
                    
                    for (const [categoryId, scores] of Object.entries(data)) {
                        const div = document.createElement('div');
                        div.style.background = '#f9f9f9';
                        div.style.padding = '15px';
                        div.style.borderRadius = '8px';
                        div.innerHTML = '<strong style="color: #667eea; display: block; margin-bottom: 10px;">' + categoryId.charAt(0).toUpperCase() + categoryId.slice(1) + '</strong>';
                        
                        if (scores.length === 0) {
                            div.innerHTML += '<em style="color: #999;">No scores yet</em>';
                        } else {
                            const ul = document.createElement('ul');
                            ul.className = 'highscores-list';
                            scores.slice(0, 3).forEach((score, idx) => {
                                const li = document.createElement('li');
                                li.innerHTML = '<span>' + (idx + 1) + '. ' + score.name + '</span><strong>' + score.score + '/5</strong>';
                                ul.appendChild(li);
                            });
                            div.appendChild(ul);
                        }
                        container.appendChild(div);
                    }
                }
                
                function selectCategory(categoryId, categoryName) {
                    currentCategory = categoryId;
                    document.getElementById('menuScreen').classList.remove('active');
                    document.getElementById('playerNameScreen').classList.add('active');
                }
                
                function startCategory() {
                    playerName = document.getElementById('playerNameInput').value;
                    if (!playerName.trim()) {
                        alert('Please enter your name');
                        return;
                    }
                    
                    document.getElementById('playerNameScreen').classList.remove('active');
                    document.getElementById('quizScreen').classList.add('active');
                    loadQuizQuestions();
                }
                
                async function loadQuizQuestions() {
                    const response = await fetch('/api/questions/' + currentCategory);
                    categoryQuestions = await response.json();
                    currentQuestionIndex = 0;
                    selectedAnswers = {};
                    displayQuestion();
                }
                
                function displayQuestion() {
                    const q = categoryQuestions[currentQuestionIndex];
                    document.getElementById('questionNumber').textContent = 'Question ' + (currentQuestionIndex + 1) + ' of ' + categoryQuestions.length;
                    document.getElementById('questionText').textContent = q.question;
                    
                    const container = document.getElementById('optionsContainer');
                    container.innerHTML = '';
                    document.getElementById('resultMessage').innerHTML = '';
                    
                    q.options.forEach((option, idx) => {
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = 'option-btn';
                        if (selectedAnswers[currentQuestionIndex] === idx) {
                            btn.classList.add('selected');
                        }
                        btn.textContent = option;
                        btn.onclick = () => selectAnswer(idx);
                        container.appendChild(btn);
                    });
                    
                    document.getElementById('prevBtn').style.display = currentQuestionIndex > 0 ? 'block' : 'none';
                    document.getElementById('nextBtn').textContent = currentQuestionIndex === categoryQuestions.length - 1 ? 'Submit Quiz' : 'Next';
                    document.getElementById('backBtn').style.display = currentQuestionIndex === 0 ? 'block' : 'none';
                }
                
                function selectAnswer(optionIndex) {
                    selectedAnswers[currentQuestionIndex] = optionIndex;
                    displayQuestion();
                }
                
                function nextQuestion() {
                    if (currentQuestionIndex === categoryQuestions.length - 1) {
                        submitQuiz();
                    } else {
                        currentQuestionIndex++;
                        displayQuestion();
                    }
                }
                
                function previousQuestion() {
                    if (currentQuestionIndex > 0) {
                        currentQuestionIndex--;
                        displayQuestion();
                    }
                }
                
                async function submitQuiz() {
                    let correctCount = 0;
                    const results = categoryQuestions.map((q, idx) => {
                        const isCorrect = selectedAnswers[idx] === q.correctAnswer;
                        if (isCorrect) correctCount++;
                        return {
                            question: q.question,
                            userAnswer: q.options[selectedAnswers[idx]],
                            correctAnswer: q.options[q.correctAnswer],
                            isCorrect: isCorrect
                        };
                    });
                    
                    // Save score
                    await fetch('/api/highscores', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: playerName,
                            categoryId: currentCategory,
                            score: correctCount
                        })
                    });
                    
                    // Display results
                    document.getElementById('quizScreen').classList.remove('active');
                    document.getElementById('resultsScreen').classList.add('active');
                    document.getElementById('scoreDisplay').textContent = 'Your Score: ' + correctCount + ' / ' + categoryQuestions.length;
                    
                    const details = document.getElementById('resultDetails');
                    details.innerHTML = '';
                    results.forEach((r, idx) => {
                        const div = document.createElement('div');
                        div.style.marginBottom = '15px';
                        div.style.paddingBottom = '15px';
                        div.style.borderBottom = '1px solid #ddd';
                        div.innerHTML = '<strong>Question ' + (idx + 1) + ':</strong> ' + r.question + '<br>' +
                            '<div style="margin-top: 8px;">' +
                            '<div style="color: ' + (r.isCorrect ? '#2e7d32' : '#c62828') + '; font-weight: bold;">' + (r.isCorrect ? '✓ Correct' : '✗ Incorrect') + '</div>' +
                            '<div style="margin-top: 5px; font-size: 0.9em;">Your answer: ' + r.userAnswer + '</div>' +
                            (r.isCorrect ? '' : '<div style="margin-top: 5px; font-size: 0.9em; color: #2e7d32;">Correct answer: ' + r.correctAnswer + '</div>') +
                            '</div>';
                        details.appendChild(div);
                    });
                }
                
                function goBack() {
                    document.getElementById('playerNameScreen').classList.remove('active');
                    document.getElementById('quizScreen').classList.remove('active');
                    document.getElementById('menuScreen').classList.add('active');
                }
                
                function goToMenu() {
                    document.getElementById('resultsScreen').classList.remove('active');
                    document.getElementById('menuScreen').classList.add('active');
                    document.getElementById('playerNameInput').value = '';
                    init();
                }
                
                init();
            </script>
        </body>
        </html>
    `);
});

// API Routes
app.get('/api/categories', (req: Request, res: Response) => {
    res.json(categories);
});

app.get('/api/questions/:categoryId', (req: Request, res: Response) => {
    const categoryId = req.params.categoryId;
    const categoryQuestions = questions.filter(q => q.category === categoryId);
    res.json(categoryQuestions);
});

app.post('/api/highscores', (req: Request, res: Response) => {
    const { name, categoryId, score } = req.body;
    addHighScore(categoryId, name, score);
    res.json({ success: true });
});

app.get('/api/highscores', (req: Request, res: Response) => {
    res.json(getAllHighScores());
});

app.listen(PORT, () => {
    console.log(`\n✅ Quizmaster is running at http://localhost:${PORT}\n`);
    console.log("Opening browser...\n");
    startQuiz();
});