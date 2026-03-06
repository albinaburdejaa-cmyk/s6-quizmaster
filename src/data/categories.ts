export interface Category {
    id: string;
    name: string;
    description: string;
}

export const categories: Category[] = [
    {
        id: 'mathematics',
        name: 'Mathematics',
        description: 'Test your math skills'
    },
    {
        id: 'physics',
        name: 'Physics',
        description: 'Explore physics concepts'
    },
    {
        id: 'sport',
        name: 'Sport',
        description: 'Sports trivia and facts'
    },
    {
        id: 'chemistry',
        name: 'Chemistry',
        description: 'Chemistry knowledge'
    }
];
