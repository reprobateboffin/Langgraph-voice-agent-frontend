export interface InterviewState{
    interviewStarted : boolean;
    showReport : boolean;
    candidateName : string;
    jobTitle : string;
    cvFilename : string;
    questionStyle: string;
    threadId : string;
    messages : Message[];
    qaPairs : QAPair[];
    finalReport : string
}

export interface Message {
    role : 'user' | 'assistant';
    content : string;
}
export interface QAPair {
  question: string;
  answer: string;
}

export interface Feedback {
  question_feedback: {
    rating: string;
    feedback: any;
  };
  answer_feedback: {
    rating: string;
    feedback: string;
  };
}

export interface StartInterviewData {
  job_title: string;
  question_type: string;
  cv: File;
}