// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
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

joinMeeting: async (
  
  room_name: string,
  isCompany: Boolean
) => {
  const formData = new FormData();

  formData.append("room_name", room_name);
formData.append('is_company', String(isCompany)); // "true" or "false"



  const response = await fetch(`${BACKEND_URL}/join-meeting`, {
    method: "POST",
    body: formData, // NO Content-Type header
  });

  return response.json();
}



};