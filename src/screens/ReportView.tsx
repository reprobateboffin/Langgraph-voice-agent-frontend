import React from "react";

interface ReportViewProps {
  candidateName: string;
  jobTitle: string;
  cvFilename: string;
  questionStyle: string;
  finalReport: string;
  onNewInterview: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({
  candidateName,
  jobTitle,
  cvFilename,
  questionStyle,
  finalReport,
  onNewInterview,
}) => {
  const downloadReport = () => {
    const element = document.createElement("a");
    const file = new Blob([finalReport], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `report_${candidateName}_${jobTitle}.md`.replace(
      / /g,
      "_"
    );
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="report-container">
      <h1>Final Report: {jobTitle}</h1>

      <div className="report-header">
        <p>
          <strong>Candidate:</strong> {candidateName || "Not Provided"}
        </p>
        <p>
          <strong>Position:</strong> {jobTitle}
        </p>
        <p>
          <strong>CV:</strong> {cvFilename || "Not uploaded"}
        </p>
        <p>
          <strong>Question Style:</strong> {questionStyle}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="report-content">
        <div dangerouslySetInnerHTML={{ __html: finalReport }} />
      </div>

      <div className="report-actions">
        <button onClick={onNewInterview} className="new-interview-btn">
          Start New Interview
        </button>
        <button onClick={downloadReport} className="download-btn">
          Download Report (Markdown)
        </button>
      </div>
    </div>
  );
};

export default ReportView;
