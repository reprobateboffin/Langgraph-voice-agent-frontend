import { create } from "zustand";

interface Message {
  role: "user" | "assistant";
  content: string;
  threadId: string;
}

interface QaPair {
  question: string;
  answer: string;
}
interface FinalEvaluation {
  overall_quality?: string;
  strengths: string[];
  areas_for_improvement: string[];
  recommendation?: string;
  final_feedback?: string;
}
interface InterviewForm {
  name: string;
  position: string;
  difficulty: string;
  questions: number;
  cv: File | null;
}

interface InterviewState {
  form: InterviewForm
  interviewStarted: boolean;
  messages: Message[];
  threadId?: string;
  showReport: boolean;
  finalReport: string;
  candidateName: string;
  jobTitle: string;
  cvFilename?: string;
  questionStyle: string;
  qaPairs: QaPair[];
  maxSteps: number;
  currentStep: number;
  mode:string

  feedbackList: any[]; 
  finalEvaluation: FinalEvaluation; 
  setField: (field: keyof InterviewForm, value: any) => void;
  saveInterview: (data: InterviewForm) => void;
  setInterviewStarted: (val: boolean) => void;
  setThreadId: (id: string) => void;
  setMaxSteps: (steps: number) => void;
  setMode : (val:string) => void;
  setCurrentStep: (step: number) => void;
  incrementStep: () => void;
  addMessage: (msg: Message) => void;
  addQaPair: (pair: QaPair) => void;
  setFeedbackList: (fb: any[]) => void;
  setFinalEvaluation: (fe: any) => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
    form: {
    name: "",
    position: "",
    difficulty: "",
    questions: 0,
    cv: null,
  },

  interviewStarted: false,
  messages: [],
  threadId: undefined,
  showReport: false,
  finalReport: "",
  candidateName: "",
  jobTitle: "",
  cvFilename: "",
  questionStyle: "",
  qaPairs: [],
  mode: "chat",

  feedbackList: [],          // ✅ FIXED
finalEvaluation: {
  overall_quality: undefined,
  strengths: [],
  areas_for_improvement: [],
  recommendation: "",
  final_feedback: "",
},

  maxSteps: 3,
  currentStep: 1,
  setField: (field, value) =>
    set((state) => ({
      form: { ...state.form, [field]: value },
    })),
  setInterviewStarted: (val) => set({ interviewStarted: val }),
  setThreadId: (id) => set({ threadId: id }),
  setMaxSteps: (steps) => set({ maxSteps: steps }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setMode : (val) => set({mode:val}),
  incrementStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.maxSteps),
    })),

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  addQaPair: (pair) =>
    set((state) => ({ qaPairs: [...state.qaPairs, pair] })),

  setFeedbackList: (fb) => set({ feedbackList: fb }),
  setFinalEvaluation: (fe) => set({ finalEvaluation: fe }),
  saveInterview: (data) => {
    const all = JSON.parse(localStorage.getItem("interviews") || "[]");
    all.push({
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      status: "pending",
    });
    localStorage.setItem("interviews", JSON.stringify(all));
  },

  reset: () =>
    set({
      interviewStarted: false,
      messages: [],
      threadId: undefined,
      showReport: false,
      finalReport: "",
      candidateName: "",
      jobTitle: "",
      cvFilename: "",
      questionStyle: "",
      qaPairs: [],
      feedbackList: [],      
finalEvaluation: {
  overall_quality: undefined,
  strengths: [],
  areas_for_improvement: [],
  recommendation: "",
  final_feedback: "",
},

      maxSteps: 3,
      currentStep: 1,
    }),
}));
