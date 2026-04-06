import { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ArrowLeft, Plus, Calendar, Trash2, Eye } from "lucide-react";
import "../styles/Dashboard.css";

interface Interview {
  _id: string;
  user_id: string;
  interview_id: string;
  createdAt: string;
}

const Dashboard = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Gets query parameters

  const isCompany = searchParams.get("isCompany") === "true";

  const { username } = useParams<{ username: string }>();
  const type = isCompany ? "company" : "user";
  const userId = username;

  // Fetch interviews from backend
  const fetchInterviews = async () => {
    if (!userId) return;

    try {
      const response = await fetch("http://localhost:8000/get-interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, type }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch interviews");
      }

      const data: Interview[] = await response.json();
      setInterviews(data);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      // Fallback to empty array
      setInterviews([]);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [userId]);

  const handleDelete = async (interviewId: string) => {
    if (!confirm("Are you sure you want to delete this interview?")) return;

    // TODO: Implement delete endpoint later
    const updated = interviews.filter((i) => i.interview_id !== interviewId);
    setInterviews(updated);
    alert("Interview deleted (frontend only for now)");
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
      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="dashboard-nav-container">
          <div
            className="dashboard-back-link"
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          >
            <ArrowLeft className="dashboard-meta-icon" />
            Back
          </div>
          <div>
            <button
              className="button button-primary"
              onClick={() => {
                navigate(`/${userId}/configure`);
              }}
            >
              <Plus className="dashboard-meta-icon" />
              New Interview
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

        {/* Analytics Section - Kept but will be empty until more data is added */}
        {interviews.length > 0 && (
          <div className="analytics-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-header">
                  <h3 className="stat-card-title">Total Interviews</h3>
                </div>
                <div className="stat-card-value">{interviews.length}</div>
              </div>
              {isCompany && (
                <div className="stat-card">
                  <div className="stat-card-header">
                    <h3 className="stat-card-title">User ID</h3>
                  </div>
                  <div className="stat-card-value">{userId}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {interviews.length === 0 ? (
          <div className="stat-card">
            <div className="empty-state">
              <p className="empty-state-text">No interviews found</p>
              <Link to="/configure">
                <button className="button button-primary">
                  <Plus className="dashboard-meta-icon" />
                  Create Your First Interview
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="interview-list">
            {interviews.map((interview) => (
              <div key={interview._id} className="interview-card">
                <div className="interview-card-header">
                  <div className="interview-card-header-content">
                    <div className="interview-card-title-section">
                      <h3 className="interview-card-title">
                        Interview #{interview.interview_id}
                      </h3>
                      <p className="interview-card-subtitle">
                        Created: {formatDate(interview.createdAt)}
                        {isCompany && (
                          <span style={{ marginLeft: "12px", opacity: 0.7 }}>
                            • User: {interview.user_id}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="interview-card-content">
                  <div className="interview-actions">
                    <div>
                      <button
                        className="button button-outline button-sm"
                        onClick={() => {
                          goToResults(interview.interview_id);
                        }}
                      >
                        <Eye className="interview-meta-icon" />
                        Show Result
                      </button>
                    </div>

                    <button
                      className="button button-destructive button-sm"
                      onClick={() => handleDelete(interview.interview_id)}
                    >
                      <Trash2 className="interview-meta-icon" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
