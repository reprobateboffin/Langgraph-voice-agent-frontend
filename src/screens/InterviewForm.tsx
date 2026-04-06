import React, { useState } from "react";
import { api } from "../services/api";
import { useInterviewStore } from "../store/interviewStore";
import { useNavigate } from "react-router-dom";
import "../styles/InterviewForm.css";
const InterviewForm: React.FC<{}> = () => {
  const navigate = useNavigate();
  const [candidateName, setCandidateName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [questionStyle, setQuestionStyle] = useState("");
  const { setThreadId, setInterviewStarted, addMessage } = useInterviewStore();

  const questionStyles = [
    { value: "broad_followup", label: "1. Broad, follow-up" },
    { value: "narrow_followup", label: "2. Narrow, follow-up" },
    { value: "broad_nonfollowup", label: "3. Broad, non-follow-up" },
    { value: "narrow_nonfollowup", label: "4. Narrow, non-follow-up" },
  ];

  const interviewStarted = useInterviewStore((state) => state.interviewStarted);
  const { mode } = useInterviewStore();
  const onSubmit = async (
    candidateName: string,
    jobTitle: string,
    cvFile: File,
    questionStyle: string,
  ) => {
    const formData = new FormData();
    formData.append("job_title", jobTitle);
    formData.append("question_type", questionStyle);
    formData.append("cv", cvFile);
    const response = await api.startInterview(formData);
    console.log(`RESPONSE HAS BEEN FETCHED and it IS ${response.message}`);
    setThreadId(response.thread_id);
    setInterviewStarted(true);
    addMessage({
      role: "assistant",
      content: response.message,
      threadId: response.thread_id,
    });
    if (response) {
      if (mode == "chat") {
        navigate("/messages-chat");
      }
      if (mode == "voice") {
        navigate("/messages-voice");
      }
    }
    // handleStartInterviewResponse(response);
    // console.log(`response fetched is : ${response}`);
  };
  const onBack = () => {};
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !cvFile) {
      alert("Please fill in all required fields");
      return;
    }
    onSubmit(candidateName, jobTitle, cvFile, questionStyle);
  };

  return (
    <div className="form-container">
      <button onClick={onBack} className="back-button">
        ← Back
      </button>

      <h1>AI Interviewer Setup</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Name</label>
          <input
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="e.g. Muhammad"
          />
        </div>

        <div className="form-group">
          <label>Job Title *</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. JS Intern"
            required
          />
        </div>

        <div className="form-group">
          <label>Upload CV (required) *</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setCvFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        <div className="form-group">
          <label>Choose Question Style *</label>
          <div className="radio-group">
            {questionStyles.map((style) => (
              <label key={style.value} className="radio-label">
                <input
                  type="radio"
                  value={style.value}
                  checked={questionStyle === style.value}
                  onChange={(e) => setQuestionStyle(e.target.value)}
                  required
                />
                {style.label}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button">
          Start Interview
        </button>
      </form>
    </div>
  );
};

export default InterviewForm;
