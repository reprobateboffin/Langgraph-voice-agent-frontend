// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const BACKEND_URL = "http://localhost:8000";
export const api = {
    startInterview : async (formData: FormData) => {
        const response = await fetch(`${BACKEND_URL}/start_interview`, {
            method: 'POST',
            body : formData,
        });
     
        return response.json();
    },
    
    continueInterview : async (userResponse:string, threadId: string) =>{
        const response = await fetch(`${BACKEND_URL}/continue_interview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                user_response: userResponse,
                thread_id : threadId,
            })
        });
        return response.json();
    },
  joinMeeting: async (username: string) => {
  const response = await fetch(`${BACKEND_URL}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  return response.json();
}
};