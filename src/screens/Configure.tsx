import { useEffect, useState } from "react";
import {
  useNavigate,
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import "../styles/Configure.css";
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
  const { username } = useParams<{ username: string }>();
  const saveInterview = useInterviewStore((s) => s.saveInterview);
  const [searchParams] = useSearchParams(); // Gets query parameters

  // Convert string "true" → actual boolean
  const isCompany = searchParams.get("isCompany") === "true";

  // Optional: store in state if you need to change it later
  const [isCompanyState, setIsCompanyState] = useState(isCompany);
  const [name, setName] = useState(!isCompanyState ? username : "");

  const companyName = isCompanyState
    ? (username ?? "usernameNotFound")
    : "usernameNotFound";

  const [position, setPosition] = useState("");
  const [difficulty, setDifficulty] = useState("Broad");

  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState<number>(5);
  const [cv, setCv] = useState<File | null>(null);
  const [steps, setSteps] = useState("3");
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
      alert("fill all fields");
      return;
    }
    const payload: InterviewForm = {
      name,
      position,
      difficulty,
      questions,
      cv,
    };
    saveInterview(payload);
    function shortUUID() {
      return Math.random().toString(36).substring(2, 10);
    }
    const roomName = `interview-${shortUUID()}`;

    try {
      // const data = await api.joinMeeting(name);

      // // store it if you still want it in state
      // setTokenData(data);
      const interviewLink = `${window.location.origin}/start-interview/${roomName}?isCompany=${isCompanyState}`;
      const formData = new FormData();
      const cleanName = name.replace(/[^a-zA-Z0-9._-]/g, "-");
      formData.append("username", cleanName);
      formData.append("job_title", position);
      formData.append("room_name", roomName);
      formData.append("question_type", difficulty);
      formData.append("max_step", String(questions ?? 2));
      if (isCompanyState) {
        formData.append("company_name", companyName);
      }
      // ✅ THIS is how you send CV
      if (cv) {
        formData.append("cv", cv);
      }
      //save the room in db
      const res = await fetch("http://localhost:8000/register-room", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);
      // In your handleSubmit function, replace the navigation part:
      if (isCompanyState) {
        const response = await fetch("http://127.0.0.1:8000/send-invite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            link: interviewLink,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send email invitation");
        }

        const url = `/start-interview/${roomName}?isCompany=${isCompanyState}`;
        console.log("🔵 About to navigate to:", url);
        console.log("🔵 isCompanyState value:", isCompanyState);
        console.log("🔵 isCompanyState type:", typeof isCompanyState);

        // Use replace instead of navigate to avoid any history issues
        navigate(-1);
      } else {
        const url = `/start-interview/${roomName}?isCompany=${isCompanyState}`;
        console.log("🟢 About to navigate to:", url);
        navigate(url, { replace: true });
      }
    } catch (err) {
      console.error("Failed to join meeting:", err);
    }
    // }
  };

  return (
    <div className="configure-page">
      <nav className="config-nav">
        <div className="config-nav-container">
          <div
            className="dashboard-back-link"
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          >
            <ArrowLeft className="dashboard-meta-icon" />
            Back
          </div>
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
                {step === 4 && "steps"}
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
                  value={!isCompanyState ? username : name}
                  disabled={!isCompanyState}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {isCompanyState ? (
                <div className="form-group">
                  <label htmlFor="name">Email</label>
                  <input
                    id="email"
                    type="text"
                    placeholder="John@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              ) : null}
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
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="btn-outline"
            >
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
