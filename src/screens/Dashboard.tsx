import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Eye, Play } from "lucide-react";
import "../styles/Dashboard.css";
import Modal from "../components/Modal";
interface Interview {
  _id: string;
  user_id: string;
  interview_id: string;
  createdAt: string;
  job_title?: string;
  room_name?: string;
}
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Gets query parameters
  const [showSuccessModalError, setShowSuccessModalError] = useState(false);
  const [showSureModal, setShowSureModal] = useState(false);
  const isCompany = searchParams.get("isCompany") === "true";
  const [currentRoomId, setCurrentRoomId] = useState("");
  const [error, setError] = useState("");
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const { username } = useParams<{ username: string }>();
  const type = isCompany ? "company" : "user";
  const userId = username;

  // Inside Dashboard component
  const [activeTab, setActiveTab] = useState<"finished" | "pending">(
    "finished",
  );
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchInterviews = async () => {
    if (!userId) return;

    // Select endpoint based on tab
    const endpoint =
      activeTab === "finished" ? "get-interviews" : "get-pending-interviews";

    try {
      const response = await fetch(`${apiUrl}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, type }),
      });

      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setInterviews(data);
    } catch (error) {
      console.error(`Error fetching ${activeTab} interviews:`, error);
      setInterviews([]);
    }
  };

  // Re-fetch whenever the user ID or the active tab changes
  useEffect(() => {
    fetchInterviews();
  }, [userId, activeTab]);

  useEffect(() => {
    fetchInterviews();
  }, [userId]);

  const handleDelete = async (
    interviewId: string,
    status: "pending" | "finished",
  ) => {
    // const confirmed = window.confirm(
    //   "Are you sure you want to delete this interview?",
    // );
    // if (!confirmed) return;
    setShowSureModal(true);

    try {
      const res = await fetch(`${apiUrl}/delete-room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room_name: interviewId,
          status: status,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to delete");
      }

      // ✅ Update UI after backend success
      setInterviews((prev) =>
        prev.filter((i) => i.interview_id !== interviewId),
      );
      if (res.ok) {
        setShowDeletedModal(true);
      }
      setError("interview deleted successfully");
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.message || "Something went wrong");
    }
  };
  const goToResults = (interview_id: string) => {
    navigate(`/results?interview_id=${encodeURIComponent(interview_id)}`);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="dashboard-nav-container">
          <div
            className="dashboard-back-link"
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          >
            <ArrowLeft className="dashboard-meta-icon" /> Back
          </div>
          <div>
            <button
              className="button button-primary"
              onClick={() =>
                navigate(`/${userId}/configure?isCompany=${isCompany}`)
              }
            >
              <Plus className="dashboard-meta-icon" /> New Interview
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Interview Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage and review all your interviews
          </p>
        </div>

        <div
          className="dashboard-tabs-wrapper"
          style={{
            display: "inline-flex",
            backgroundColor: "#f1f5f9",
            padding: "4px",
            borderRadius: "12px",
            marginBottom: "2rem",
            border: "1px solid #e2e8f0",
          }}
        >
          <button
            onClick={() => setActiveTab("finished")}
            style={{
              padding: "8px 24px",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: "none",
              backgroundColor:
                activeTab === "finished" ? "#ffffff" : "transparent",
              color: activeTab === "finished" ? "#2563eb" : "#64748b",
              boxShadow:
                activeTab === "finished"
                  ? "0 2px 4px rgba(0,0,0,0.05)"
                  : "none",
            }}
          >
            Finished
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            style={{
              padding: "8px 24px",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: "none",
              backgroundColor:
                activeTab === "pending" ? "#ffffff" : "transparent",
              color: activeTab === "pending" ? "#2563eb" : "#64748b",
              boxShadow:
                activeTab === "pending" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
            }}
          >
            Pending
          </button>
        </div>

        {interviews.length === 0 ? (
          <div className="stat-card">
            <div className="empty-state">
              <p className="empty-state-text">
                No {activeTab} interviews found
              </p>
            </div>
          </div>
        ) : (
          <div className="interview-list">
            {interviews.map((interview) => (
              <div key={interview._id} className="interview-card">
                <div className="interview-card-header">
                  <div className="interview-card-title-section">
                    <h3 className="interview-card-title">
                      Interview #{interview.interview_id}
                    </h3>
                    <p className="interview-card-subtitle">
                      Created: {formatDate(interview.createdAt)}
                      {isCompany && interview.user_id && (
                        <span style={{ marginLeft: "12px", opacity: 0.7 }}>
                          • Candidate: {interview.user_id}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="interview-card-content">
                  <div className="interview-actions">
                    {/* ✅ NEW DETAILS BUTTON */}
                    <button
                      className="button button-outline button-sm"
                      onClick={() => {
                        setSelectedInterview(interview);
                        setIsModalOpen(true);
                      }}
                    >
                      Details
                    </button>

                    {activeTab === "finished" ? (
                      <button
                        className="button button-outline button-sm"
                        onClick={() => goToResults(interview.interview_id)}
                      >
                        <Eye className="interview-meta-icon" /> Show Result
                      </button>
                    ) : (
                      !isCompany && (
                        <button
                          className="button button-primary button-sm"
                          onClick={() =>
                            navigate(
                              `/start-interview/${interview.interview_id}?isCompany=false`,
                            )
                          }
                        >
                          <Play className="interview-meta-icon" /> Start
                          Interview
                        </button>
                      )
                    )}

                    <button
                      className="button button-destructive button-sm"
                      onClick={() => {
                        // handleDelete(interview.room_id || "", activeTab)
                        setShowSureModal(true);
                        console.log(interview.room_name);
                        setCurrentRoomId(interview.room_name || "");
                      }}
                    >
                      <Trash2 className="interview-meta-icon" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ MODAL */}
      {isModalOpen && selectedInterview && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Interview Details"
        >
          {selectedInterview && (
            <div>
              <p>
                <strong>ID:</strong> {selectedInterview.interview_id}
              </p>
              <p>
                <strong>User:</strong> {selectedInterview.user_id}
              </p>
              <p>
                <strong>Created:</strong> {selectedInterview.createdAt}
              </p>
              <p>
                <strong>Job title:</strong> {selectedInterview.job_title}
              </p>
            </div>
          )}
        </Modal>
      )}
      <Modal
        isOpen={showSuccessModalError}
        onClose={() => {
          setShowSuccessModalError(false);
        }}
        title="Error"
      >
        <p> Failure: {error}</p>
      </Modal>
      <Modal
        isOpen={showSureModal}
        onClose={() => {
          setShowSureModal(false);
        }}
        title="Error"
      >
        <p> Are you sure you wanna delete this Interview</p>
        <button
          className="button button-red"
          onClick={() => {
            handleDelete(currentRoomId, activeTab);
          }}
        >
          Yes
        </button>
      </Modal>
      <Modal
        isOpen={showDeletedModal}
        onClose={() => {
          setShowDeletedModal(false);
          setShowSureModal(false);
        }}
        title="Deleted"
      >
        <p> Room deleted successfully</p>
      </Modal>
    </div>
  );
};

export default Dashboard;
