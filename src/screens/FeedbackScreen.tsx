

import React from "react";
import { useInterviewStore } from "../store/interviewStore";
import "./FeedbackScreen.css";

const FeedbackScreen: React.FC = () => {
  const { candidateName, jobTitle, feedbackList, finalEvaluation, qaPairs } = useInterviewStore();

  console.log("Debug - Store State:", {
    candidateName,
    jobTitle,
    feedbackList,
    finalEvaluation,
    qaPairs
  });

  if (!feedbackList || feedbackList.length === 0) {
    return (
      <div className="feedback-container">
        <h1>📊 Interview Feedback Report</h1>
        <div className="no-feedback">No feedback available yet.</div>
      </div>
    );
  }

  const renderQuestionFeedback = (feedback: any, index: number) => {
    if (!feedback || !feedback.question_feedback) {
      return <p>No question feedback available.</p>;
    }

    const qf = feedback.question_feedback;
    const feedbackData = qf.feedback;

    return (
      <div className="feedback-details">
        <div className="rating">
          <strong>Overall Rating:</strong> {qf.rating}/10
        </div>
        
        {feedbackData && typeof feedbackData === 'object' ? (
          <div className="feedback-breakdown">
            <h4>Detailed Breakdown:</h4>
            <div className="feedback-categories">
              {feedbackData.clarity && (
                <div className="feedback-category">
                  <h5>🎯 Clarity</h5>
                  <div className="score">Score: {feedbackData.clarity.score}/10</div>
                  <p>{feedbackData.clarity.comment}</p>
                </div>
              )}
              
              {feedbackData.relevance && (
                <div className="feedback-category">
                  <h5>🔗 Relevance</h5>
                  <div className="score">Score: {feedbackData.relevance.score}/10</div>
                  <p>{feedbackData.relevance.comment}</p>
                </div>
              )}
              
              {feedbackData.depth && (
                <div className="feedback-category">
                  <h5>📊 Depth</h5>
                  <div className="score">Score: {feedbackData.depth.score}/10</div>
                  <p>{feedbackData.depth.comment}</p>
                </div>
              )}
              
              {feedbackData.alignment && (
                <div className="feedback-category">
                  <h5>🎯 Alignment</h5>
                  <div className="score">Score: {feedbackData.alignment.score}/10</div>
                  <p>{feedbackData.alignment.comment}</p>
                </div>
              )}
              
              {feedbackData.overall_comment && (
                <div className="feedback-category overall-comment">
                  <h5>📋 Overall Comment</h5>
                  <p>{feedbackData.overall_comment}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>{qf.feedback || "No detailed feedback"}</p>
        )}
      </div>
    );
  };

  const renderAnswerFeedback = (feedback: any, index: number) => {
    if (!feedback || !feedback.answer_feedback) {
      return <p>No answer feedback available.</p>;
    }

    const af = feedback.answer_feedback;

    return (
      <div className="feedback-details">
        <div className="rating">
          <strong>Overall Rating:</strong> {af.rating}/10
        </div>
        <div className="feedback-content">
          <p>{af.feedback}</p>
        </div>
      </div>
    );
  };

  const renderFinalEvaluation = (evaluation: any) => {
    if (!evaluation) return null;

    return (
      <div className="final-evaluation">
        <h2>📋 Final Evaluation</h2>
        
        {evaluation.overall_quality !== undefined && (
          <div className="eval-section">
            <h3>⭐ Overall Quality</h3>
            <div className="score-badge">{evaluation.overall_quality}/10</div>
          </div>
        )}

        {evaluation.strengths && evaluation.strengths.length > 0 && (
          <div className="eval-section">
            <h3>✅ Strengths</h3>
            <ul>
              {evaluation.strengths.map((strength: string, index: number) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
        )}

        {evaluation.areas_for_improvement && evaluation.areas_for_improvement.length > 0 && (
          <div className="eval-section">
            <h3>📈 Areas for Improvement</h3>
            <ul>
              {evaluation.areas_for_improvement.map((area: string, index: number) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>
        )}

        {evaluation.recommendation && (
          <div className="eval-section">
            <h3>🎯 Recommendation</h3>
            <p className="recommendation">{evaluation.recommendation}</p>
          </div>
        )}

        {evaluation.final_feedback && (
          <div className="eval-section">
            <h3>💬 Final Feedback</h3>
            <p>{evaluation.final_feedback}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="feedback-container">
      <h1>📊 Interview Feedback Report</h1>

      <div className="candidate-info">
        <p><strong>👤 Candidate:</strong> {candidateName || "N/A"}</p>
        <p><strong>💼 Position:</strong> {jobTitle || "N/A"}</p>
      </div>

      <div className="questions-feedback">
        <h2>❓ Questions & Answers Feedback</h2>
        
        {feedbackList.map((fb: any, idx: number) => (
          <div key={idx} className="feedback-item">
            <h3>Question {idx + 1}</h3>
            
            {/* Show the actual question and answer */}
            <div className="qa-pair">
              <div className="question">
                <h4>🗨️ Question:</h4>
                <p>{qaPairs[idx]?.question || `Question ${idx + 1}`}</p>
              </div>
              <div className="answer">
                <h4>💬 Your Answer:</h4>
                <p>{qaPairs[idx]?.answer || "No answer recorded"}</p>
              </div>
            </div>
            
            <div className="feedback-section">
              <h4>📝 Question Quality Feedback</h4>
              {renderQuestionFeedback(fb, idx)}
            </div>

            <div className="feedback-section">
              <h4>💬 Answer Quality Feedback</h4>
              {renderAnswerFeedback(fb, idx)}
            </div>
          </div>
        ))}
      </div>

      {finalEvaluation && renderFinalEvaluation(finalEvaluation)}
    </div>
  );
};

export default FeedbackScreen;