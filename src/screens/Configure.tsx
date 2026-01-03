import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "./Configure.css";
import { useInterviewStore } from "../store/interviewStore";
import { api } from "../services/api";



interface InterviewForm {
name: string;
position: string;
difficulty: string;
questions: number;
cv: File | null;
}


const Configure: React.FC = () => {

  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const saveInterview = useInterviewStore((s) => s.saveInterview);
  const [name, setName] = useState("Akbar");
  const [position, setPosition] = useState("JS intern");
  const [difficulty, setDifficulty] = useState("Broad");
  const [questions, setQuestions] = useState<number>(5);
  const [cv, setCv] = useState<File | null>(null);
  const [error, setError] = useState("");
  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
   const joinRoom = async () => {
      try {
        // const data = await api.joinMeeting(name);
        // setTokenData(data);
        
      } catch (err) {
        console.error("Failed to join meeting:", err);
      }
    };
  const handleSubmit = async () => {

    if (!name || !position || !difficulty || !questions || !cv) {
            setError("All fields are required.");
            alert('fill all fields')
            return;
            }
    const payload: InterviewForm = {name, position, difficulty, questions, cv}
    saveInterview(payload);
  function shortUUID() {
  return Math.random().toString(36).substring(2, 10);
}
const roomName = `interview-${shortUUID()}`;
    
try {
  // const data = await api.joinMeeting(name);

  // // store it if you still want it in state
  // setTokenData(data);

  // ✅ pass actual data to next route
navigate('/start-interview', {
  state: {job_title: position,question_type: difficulty, cv:cv, username:name, room_name: roomName, question_no: questions}
});

} catch (err) {
  console.error("Failed to join meeting:", err);
}   
  // }
};

  return (
    <div className="configure-page">
      <nav className="nav">
        <div className="nav-container">
          <Link to="/" className="back-link">
            <ArrowLeft className="icon" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="configure-container">
        <div className="centered-content">

          {/* Progress */}
          <div className="progress-container">
            <div className="progress-info">
              <span>Step {step} of 3</span>
              <span>
                {step === 1 && "User Info"}
                {step === 2 && "Interview Settings"}
                {step === 3 && "Resources"}
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="card">
              <h2>User Information</h2>
              <p>Basic candidate information</p>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="position">Position</label>
                <input
                  id="position"
                  type="text"
                  placeholder="Frontend Developer"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="card">
              <h2>Interview Setup</h2>
              <p>Configure interview difficulty and question count</p>

              <div className="form-group">
                <label htmlFor="difficulty">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="">Select difficulty</option>
                  <option value="junior"> Broad, follow-up</option>
                  <option value="mid">Narrow, follow up</option>
                  <option value="senior">Broad, non follow up</option>
                  <option value="expert">Narrow, non follow up</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="questions">Number of Questions</label>
                <input
                  type="number"
                  id="questions"
                  min={1}
                  placeholder="5"
                  value={questions}
                  onChange={(e) => setQuestions(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="card">
              <h2>Resources</h2>
              <p>Upload candidate CV</p>

              <div className="form-group">
                <label htmlFor="cv">Candidate CV (PDF)</label>
                <input
                  id="cv"
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                  setCv(e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="button-group">
            <button onClick={handleBack} disabled={step === 1} className="btn-outline">
              <ArrowLeft className="icon-small" />
              Back
            </button>

            {step < 3 ? (
              <button onClick={handleNext} className="btn-primary">
                Next
                <ArrowRight className="icon-small" />
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn-primary">
                Create Interview
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Configure;
