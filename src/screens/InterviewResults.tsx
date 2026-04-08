import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../styles/InterviewResults.css";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const InterviewResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const interview_id = searchParams.get("interview_id");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!interview_id) return;

      try {
        const res = await fetch(`${apiUrl}/get-interview-results`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ interview_id }),
        });

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [interview_id]);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-container">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard">
        <div className="dashboard-container">No results found</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* NAV */}
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
        </div>
      </nav>

      <div className="dashboard-container">
        {/* HEADER */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Interview Results</h1>
          <p className="dashboard-subtitle">Detailed evaluation and feedback</p>
        </div>

        <div className="results-section-title">Final Evaluation</div>

        <div className="results-card">
          {data.final_eval?.map((evalItem: any, i: number) => (
            <div key={i}>
              <div className="results-label">Overall Quality</div>
              <div className="results-value results-highlight">
                {evalItem.overall_quality}
              </div>

              <div className="results-divider" />

              <div className="results-label">Recommendation</div>
              <div className="results-value">{evalItem.recommendation}</div>

              <div className="results-divider" />

              <div className="results-label">Final Feedback</div>
              <div className="results-feedback">{evalItem.final_feedback}</div>

              <div className="results-divider" />

              <div className="results-label">Areas for Improvement</div>
              <ul className="results-list">
                {evalItem.areas_for_improvement?.map(
                  (area: string, idx: number) => (
                    <li key={idx}>{area}</li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
        <div className="results-section-title">Questions & Answers</div>

        {data.questions?.map((q: string, i: number) => (
          <div
            key={i}
            className="results-card"
            style={{ marginBottom: "1rem" }}
          >
            <div className="results-question">
              Q{i + 1}. {q}
            </div>

            <div className="results-label">Answer</div>
            <div className="results-answer">
              {typeof data.answers?.[i] === "string"
                ? data.answers[i].replace(/[\[\]']/g, "")
                : data.answers?.[i]}
            </div>

            {data.answer_eval?.[i] && (
              <>
                <div className="results-rating">
                  Rating: {data.answer_eval[i].rating}
                </div>

                <div className="results-feedback">
                  {data.answer_eval[i].feedback}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewResults;
