export interface Question {
    id: string;
    category: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

export const questions: Question[] = [
    // Mathematics Questions
    {
        id: 'math_1',
        category: 'mathematics',
        question: 'What is 15 × 7?',
        options: ['100', '105', '110', '115'],
        correctAnswer: 1
    },
    {
        id: 'math_2',
        category: 'mathematics',
        question: 'What is the square root of 144?',
        options: ['10', '11', '12', '13'],
        correctAnswer: 2
    },
    {
        id: 'math_3',
        category: 'mathematics',
        question: 'What is 25% of 200?',
        options: ['40', '45', '50', '55'],
        correctAnswer: 2
    },
    {
        id: 'math_4',
        category: 'mathematics',
        question: 'What is the value of π (approximately)?',
        options: ['2.14', '3.14', '4.14', '5.14'],
        correctAnswer: 1
    },
    {
        id: 'math_5',
        category: 'mathematics',
        question: 'What is 8³ (8 cubed)?',
        options: ['512', '516', '520', '524'],
        correctAnswer: 0
    },
    
    // Physics Questions
    {
        id: 'physics_1',
        category: 'physics',
        question: 'What is the SI unit of force?',
        options: ['Joule', 'Newton', 'Pascal', 'Watt'],
        correctAnswer: 1
    },
    {
        id: 'physics_2',
        category: 'physics',
        question: 'What is the speed of light in vacuum?',
        options: ['3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s', '3 × 10¹² m/s'],
        correctAnswer: 1
    },
    {
        id: 'physics_3',
        category: 'physics',
        question: 'What is the formula for kinetic energy?',
        options: ['½mv', '½mv²', 'mv²', 'mgh'],
        correctAnswer: 1
    },
    {
        id: 'physics_4',
        category: 'physics',
        question: 'What is the acceleration due to gravity on Earth?',
        options: ['7.8 m/s²', '8.8 m/s²', '9.8 m/s²', '10.8 m/s²'],
        correctAnswer: 2
    },
    {
        id: 'physics_5',
        category: 'physics',
        question: 'What does Ohm\'s Law state (V = IR)?',
        options: ['Voltage equals current times resistance', 'Current equals voltage times resistance', 'Resistance equals voltage divided by current', 'Both A and C'],
        correctAnswer: 3
    },
    
    // Sport Questions
    {
        id: 'sport_1',
        category: 'sport',
        question: 'How many players are on a basketball team on the court?',
        options: ['3', '5', '7', '9'],
        correctAnswer: 1
    },
    {
        id: 'sport_2',
        category: 'sport',
        question: 'In tennis, what is a score of zero called?',
        options: ['Nil', 'Zero', 'Love', 'Nought'],
        correctAnswer: 2
    },
    {
        id: 'sport_3',
        category: 'sport',
        question: 'How many times has Brazil won the FIFA World Cup?',
        options: ['3 times', '4 times', '5 times', '6 times'],
        correctAnswer: 2
    },
    {
        id: 'sport_4',
        category: 'sport',
        question: 'What is the maximum number of strokes per hole in professional golf?',
        options: ['8', '9', '10', '12'],
        correctAnswer: 2
    },
    {
        id: 'sport_5',
        category: 'sport',
        question: 'In American football, how many points is a touchdown worth?',
        options: ['3', '4', '6', '7'],
        correctAnswer: 2
    },
    
    // Chemistry Questions
    {
        id: 'chemistry_1',
        category: 'chemistry',
        question: 'What is the chemical symbol for gold?',
        options: ['Gd', 'Au', 'Go', 'Gl'],
        correctAnswer: 1
    },
    {
        id: 'chemistry_2',
        category: 'chemistry',
        question: 'What is the atomic number of carbon?',
        options: ['4', '6', '8', '12'],
        correctAnswer: 1
    },
    {
        id: 'chemistry_3',
        category: 'chemistry',
        question: 'What is the pH of a neutral solution?',
        options: ['0', '5', '7', '14'],
        correctAnswer: 2
    },
    {
        id: 'chemistry_4',
        category: 'chemistry',
        question: 'What is the most abundant element in the Earth\'s atmosphere?',
        options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'],
        correctAnswer: 1
    },
    {
        id: 'chemistry_5',
        category: 'chemistry',
        question: 'What is the chemical formula for table salt?',
        options: ['NaCl', 'KCl', 'CaCl', 'MgCl'],
        correctAnswer: 0
    }
];
