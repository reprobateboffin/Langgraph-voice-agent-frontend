import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Calendar, Clock, Trash2, Eye, TrendingUp, Users, CheckCircle, XCircle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import "./Dashboard.css";

interface Interview {
  id: string;
  name: string;
  email: string;
  company: string;
  subject: string;
  difficulty: string;
  duration: string;
  createdAt: string;
  status: string;
}

const Dashboard = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("interviews");
    if (stored) {
      setInterviews(JSON.parse(stored));
    }
  }, []);

  // Calculate statistics
  const completedInterviews = interviews.filter(i => i.status === "completed");
  const totalCandidates = new Set(interviews.map(i => i.email)).size;
  
  // Mock scores for completed interviews (in production, this would come from actual feedback data)
  const interviewScores = completedInterviews.map((interview, index) => ({
    id: interview.id,
    name: interview.name,
    score: Math.floor(Math.random() * 3) + 7, // Random score 7-10 for demo
  }));

  const averageScore = interviewScores.length > 0 
    ? (interviewScores.reduce((sum, i) => sum + i.score, 0) / interviewScores.length).toFixed(1)
    : "0";

  const passedCount = interviewScores.filter(i => i.score >= 7).length;
  const failedCount = interviewScores.filter(i => i.score < 7).length;

  // Chart data for score distribution
  const scoreDistribution = Array.from({ length: 10 }, (_, i) => {
    const score = i + 1;
    return {
      score: score.toString(),
      count: interviewScores.filter(interview => interview.score === score).length,
    };
  });

  const handleDelete = (id: string) => {
    const updated = interviews.filter(i => i.id !== id);
    setInterviews(updated);
    localStorage.setItem("interviews", JSON.stringify(updated));
   alert("Interview removed")
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "badge-pending";
      case "completed": return "badge-completed";
      case "in-progress": return "badge-in-progress";
      default: return "badge-pending";
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p>{`Score: ${label}`}</p>
          <p>{`Candidates: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard">
      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="dashboard-nav-container">
          <Link to="/" className="dashboard-back-link">
            <ArrowLeft className="dashboard-meta-icon" />
            Back to Home
          </Link>
          <Link to="/configure">
            <button className="button button-primary">
              <Plus className="dashboard-meta-icon" />
              New Interview
            </button>
          </Link>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Interview Dashboard</h1>
          <p className="dashboard-subtitle">Manage and review all your interviews</p>
        </div>

        {/* Analytics Section */}
        {interviews.length > 0 && (
          <div className="analytics-section">
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-header">
                  <h3 className="stat-card-title">Average Score</h3>
                  <TrendingUp className="stat-card-icon" />
                </div>
                <div className="stat-card-value">{averageScore}/10</div>
                <p className="stat-card-description">
                  Based on {completedInterviews.length} completed
                </p>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <h3 className="stat-card-title">Total Candidates</h3>
                  <Users className="stat-card-icon" />
                </div>
                <div className="stat-card-value">{totalCandidates}</div>
                <p className="stat-card-description">
                  Unique candidates
                </p>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <h3 className="stat-card-title">Passed</h3>
                  <CheckCircle className="stat-card-icon" />
                </div>
                <div className="stat-card-value">{passedCount}</div>
                <p className="stat-card-description">
                  Score ≥ 7/10
                </p>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <h3 className="stat-card-title">Failed</h3>
                  <XCircle className="stat-card-icon" />
                </div>
                <div className="stat-card-value">{failedCount}</div>
                <p className="stat-card-description">
                  Score &lt; 7/10
                </p>
              </div>
            </div>

            {/* Score Distribution Chart */}
            {completedInterviews.length > 0 && (
              <div className="chart-card">
                <h3 className="chart-title">Interview Scores Distribution</h3>
                <p className="chart-description">Number of candidates by score (1-10)</p>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreDistribution}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="score" 
                        fontSize="12px"
                        label={{ value: 'Score', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        fontSize="12px"
                        label={{ value: 'Number of Candidates', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {scoreDistribution.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={parseInt(entry.score) >= 7 ? 'var(--primary)' : 'var(--muted-foreground)'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {interviews.length === 0 ? (
          <div className="stat-card">
            <div className="empty-state">
              <p className="empty-state-text">No interviews configured yet</p>
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
              <div key={interview.id} className="interview-card">
                <div className="interview-card-header">
                  <div className="interview-card-header-content">
                    <div className="interview-card-title-section">
                      <h3 className="interview-card-title">{interview.subject}</h3>
                      <p className="interview-card-subtitle">
                        {interview.name} • {interview.company}
                      </p>
                    </div>
                    <span className={`badge ${getStatusColor(interview.status)}`}>
                      {interview.status}
                    </span>
                  </div>
                </div>
                <div className="interview-card-content">
                  <div className="interview-meta-grid">
                    <div className="interview-meta-item">
                      <Calendar className="interview-meta-icon" />
                      <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="interview-meta-item">
                      <Clock className="interview-meta-icon" />
                      <span>{interview.duration} minutes</span>
                    </div>
                  </div>
                  <div className="interview-tags">
                    <span className="badge badge-outline">{interview.difficulty}</span>
                    <span className="interview-email">{interview.email}</span>
                  </div>
                  <div className="interview-actions">
                    {interview.status === "completed" ? (
                      <Link to={`/feedback/${interview.id}`}>
                        <button className="button button-outline button-sm">
                          <Eye className="interview-meta-icon" />
                          View Feedback
                        </button>
                      </Link>
                    ) : (
                      <Link to={`/interview/${interview.id}`}>
                        <button className="button button-outline button-sm">
                          <Eye className="interview-meta-icon" />
                          Start Interview
                        </button>
                      </Link>
                    )}
                    <button 
                      className="button button-destructive button-sm"
                      onClick={() => handleDelete(interview.id)}
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