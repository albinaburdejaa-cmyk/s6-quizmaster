export interface Quiz {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface User {
    id: string;
    name: string;
    score: number;
}

export interface QuizResult {
    userId: string;
    quizId: string;
    score: number;
    date: Date;
}