
export interface Poll {
  _id: string;
  name: string;
  question?: string;
  correctAnswer: string;
  date: string;

}


export type PollListResponse = Poll[];