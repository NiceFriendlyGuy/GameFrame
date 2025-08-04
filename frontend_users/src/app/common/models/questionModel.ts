export interface Question {
    _id: string;
    name: string;
    correctAnswer: string;
    date: Date;
}

export type QuestionList = Question[];