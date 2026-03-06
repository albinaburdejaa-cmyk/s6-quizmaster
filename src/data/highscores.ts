import * as fs from 'fs';
import * as path from 'path';

export interface HighScore {
    name: string;
    score: number;
    categoryId: string;
    date: string;
}

export interface HighScores {
    [categoryId: string]: HighScore[];
}

const HIGHSCORES_FILE = path.join(__dirname, '../../highscores.json');

let highscores: HighScores = {
    mathematics: [],
    physics: [],
    sport: [],
    chemistry: []
};

// Load highscores from file
export function loadHighScores(): void {
    try {
        if (fs.existsSync(HIGHSCORES_FILE)) {
            const data = fs.readFileSync(HIGHSCORES_FILE, 'utf-8');
            highscores = JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading highscores:', error);
    }
}

// Save highscores to file
export function saveHighScores(): void {
    try {
        fs.writeFileSync(HIGHSCORES_FILE, JSON.stringify(highscores, null, 2));
    } catch (error) {
        console.error('Error saving highscores:', error);
    }
}

// Add a new highscore
export function addHighScore(categoryId: string, name: string, score: number): void {
    if (!highscores[categoryId]) {
        highscores[categoryId] = [];
    }

    const newScore: HighScore = {
        name,
        score,
        categoryId,
        date: new Date().toISOString()
    };

    highscores[categoryId].push(newScore);
    
    // Keep only top 10 scores per category
    highscores[categoryId].sort((a, b) => b.score - a.score);
    if (highscores[categoryId].length > 10) {
        highscores[categoryId] = highscores[categoryId].slice(0, 10);
    }

    saveHighScores();
}

// Get highscores for a category
export function getHighScores(categoryId: string): HighScore[] {
    return highscores[categoryId] || [];
}

// Get all highscores
export function getAllHighScores(): HighScores {
    return highscores;
}
