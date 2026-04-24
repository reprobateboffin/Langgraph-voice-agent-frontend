import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronUp, ChevronDown } from "lucide-react";
import "../styles/Configure.css";
import { useInterviewStore } from "../store/interviewStore";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface InterviewForm {
  name: string;
  position: string;
  difficulty: string;
  questions: number;
  cv: File | null;
  voice_id?: string; // ← new
  face_id?: string;
}

interface Character {
  id: string;
  name: string;
  voice_id: string;
  image: string; // URL to image
  face_id: string;
}

const Configure: React.FC = () => {
  const [loading, _setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSuccessModalError, setShowSuccessModalError] = useState(false);

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { username } = useParams<{ username: string }>();
  const saveInterview = useInterviewStore((s) => s.saveInterview);
  const [searchParams] = useSearchParams();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const isCompany = searchParams.get("isCompany") === "true";
  const [isCompanyState, _setIsCompanyState] = useState(isCompany);
  const [name, setName] = useState(!isCompanyState ? username : "");

  const companyName = isCompanyState
    ? (username ?? "usernameNotFound")
    : "usernameNotFound";

  const [position, setPosition] = useState("");
  const [difficulty, setDifficulty] = useState("Broad");
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState<number>(5);
  const [cv, setCv] = useState<File | null>(null);
  const [error, setError] = useState("");

  // ==================== NEW STATES FOR CHARACTERS ====================
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacterVoiceId, setSelectedCharacterVoiceId] = useState<
    string | null
  >(null);
  const [faceId, setFaceId] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch characters from FastAPI backend
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const res = await fetch(`${apiUrl}/characters`);
        if (!res.ok) throw new Error("Failed to fetch characters");

        const data: Character[] = await res.json();
        setCharacters(data);

        if (data.length > 0) {
          const firstVoiceId = data[0].voice_id;
          setSelectedCharacterVoiceId(firstVoiceId);
          console.log("Auto-selected voice_id:", firstVoiceId);
        }
      } catch (err) {
        console.error("Failed to fetch characters:", err);
        setError("Could not load interviewer characters");
      }
    };

    fetchCharacters();
  }, []); // ← empty dependency is fine here
  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    if (step == 1) navigate(-1);
  };

  // Vertical carousel helpers (shows exactly 2 characters at a time)
  const nextSlide = () => {
    if (currentIndex + 2 < characters.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (
      !name ||
      !position ||
      !difficulty ||
      !questions ||
      !cv ||
      !selectedCharacterVoiceId
    ) {
      setError("All fields are required.");
      setShowSuccessModalError(true);
      return;
    }

    const payload: InterviewForm = {
      name,
      position,
      difficulty,
      questions,
      cv,
      voice_id: selectedCharacterVoiceId,
      face_id: faceId,
    };
    saveInterview(payload);

    function shortUUID() {
      return Math.random().toString(36).substring(2, 10);
    }
    const roomName = `interview-${shortUUID()}`;

    try {
      const interviewLink = `${window.location.origin}/start-interview/${roomName}?isCompany=${isCompanyState}&image=${encodeURIComponent(selectedImage)}`;
      const formData = new FormData();
      const cleanName = name.replace(/[^a-zA-Z0-9._-]/g, "-");
      formData.append("username", cleanName);
      formData.append("job_title", position);
      formData.append("room_name", roomName);
      formData.append("question_type", difficulty);
      formData.append("max_step", String(questions ?? 2));
      formData.append("voice_id", selectedCharacterVoiceId); // ← NEW

      formData.append("face_id", faceId); // ← NEW

      if (isCompanyState) {
        formData.append("company_name", companyName);
      }
      if (cv) {
        formData.append("cv", cv);
      }

      // Save room in DB
      const res = await fetch(`${apiUrl}/register-room`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);

      if (isCompanyState) {
        const response = await fetch(`${apiUrl}/send-invite`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            link: interviewLink,
            username: username,
            job_title: position,
          }),
        });

        if (!response.ok) throw new Error("Failed to send email invitation");

        setShowSuccessModal(true);
      } else {
        const url = `/start-interview/${roomName}?isCompany=${isCompanyState}&image=${encodeURIComponent(selectedImage)}`;
        navigate(url, { replace: true });
      }
    } catch (err) {
      console.error("Failed to create interview:", err);
    }
  };
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        navigate(-1);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);
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
              <span>Step {step} of 4</span>
              <span>
                {step === 1 && "User Info"}
                {step === 2 && "Interview Settings"}
                {step === 3 && "Choose Interviewer"}
                {step === 4 && "Resources"}
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* STEP 1 - User Information */}
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
              {isCompanyState && (
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="text"
                    placeholder="John@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}
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

          {/* STEP 2 - Interview Setup */}
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
                  <option value="junior">Broad, follow-up</option>
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

          {step === 3 && (
            <div className="card">
              <h2>Choose Interviewer</h2>
              <p>Select the AI character who will conduct the interview</p>

              {characters.length === 0 ? (
                loading && <LoadingSpinner size="small" />
              ) : (
                // <p>Loading...</p>
                <>
                  <div className="character-carousel">
                    {characters
                      .slice(currentIndex, currentIndex + 2)
                      .map((char) => (
                        <div
                          key={char.id}
                          className={`character-card ${
                            selectedCharacterVoiceId === char.voice_id
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedCharacterVoiceId(char.voice_id);
                            setFaceId(char.face_id);
                            setSelectedImage(char.image);
                            console.log(
                              "Selected voice_id:",
                              selectedCharacterVoiceId,
                            );
                          }}
                        >
                          <img
                            src={char.image}
                            alt={char.name}
                            className="character-image"
                          />
                          <p className="character-name">{char.name}</p>
                        </div>
                      ))}
                  </div>

                  {/* Navigation arrows */}
                  <div className="carousel-nav">
                    <button
                      onClick={prevSlide}
                      disabled={currentIndex === 0}
                      className="nav-btn"
                    >
                      <ChevronUp size={24} />
                    </button>
                    <button
                      onClick={nextSlide}
                      disabled={currentIndex + 2 >= characters.length}
                      className="nav-btn"
                    >
                      <ChevronDown size={24} />
                    </button>
                  </div>

                  {selectedCharacterVoiceId && (
                    <p className="selected-info">
                      Selected:{" "}
                      {characters.find(
                        (c) => c.voice_id === selectedCharacterVoiceId,
                      )?.name || "Unknown"}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
          {/* STEP 4 - Resources (old Step 3) */}
          {step === 4 && (
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

            {step < 4 ? (
              <button onClick={handleNext} className="btn-primary">
                Next <ArrowRight className="icon-small" />
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn-primary">
                Create Interview
              </button>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate(-1);
        }}
        title="Success"
      >
        <p>The interview link is sent to the user.</p>
      </Modal>
      <Modal
        isOpen={showSuccessModalError}
        onClose={() => {
          setShowSuccessModalError(false);
        }}
        title="Error"
      >
        <p> Failure: {error}</p>
      </Modal>
    </div>
  );
};

export default Configure;
