import React from "react";

function LeadCard({ lead, onClick }) {
  const { fullName, company, phoneNumber, status, followUpAt, lastDiscussionContent, lastDiscussionCreatedAt } = lead;

  // Calculates dynamic relative time elapsed since the last discussion was logged
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "No discussions yet";
    const now = new Date();
    const past = new Date(dateString);
    if (isNaN(past.getTime())) return "Unknown time";
    const diffMs = now - past;
    if (diffMs < 0) return "Just now";
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${diffDays}d ago`;
  };

  // Evaluates scheduled follow-up dates to classify them as "Today", "Overdue", or standard
  const getFollowUpInfo = () => {
    if (!followUpAt) return null;
    const now = new Date();
    const dateVal = new Date(followUpAt);
    
    const todayStr = now.toLocaleDateString("en-CA");
    const followUpDayStr = dateVal.toLocaleDateString("en-CA");
    const isToday = todayStr === followUpDayStr;
    
    // An follow-up is overdue if it's in the past, not today, and the lead status is active (not WON/LOST)
    const isOverdue = dateVal < now && !isToday && status !== "WON" && status !== "LOST";

    const formattedDate = dateVal.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    return { isToday, isOverdue, formattedDate };
  };

  const fuInfo = getFollowUpInfo();

  // Dynamic class assignment for status indicators
  const getBadgeClass = (s) => {
    switch (s) {
      case "NEW": return "badge-new";
      case "CONTACTED": return "badge-contacted";
      case "QUALIFIED": return "badge-qualified";
      case "PROPOSAL_SENT": return "badge-proposal";
      case "WON": return "badge-won";
      case "LOST": return "badge-lost";
      default: return "badge-new";
    }
  };

  const formatStatusText = (s) => {
    return s.replace("_", " ");
  };

  return (
    <div 
      className={`lead-card ${fuInfo?.isOverdue ? "overdue-alert" : ""}`}
      onClick={onClick}
    >
      <div className="lead-header">
        <div className="lead-title-section">
          <span className="lead-name">{fullName}</span>
          {(company || phoneNumber) && (
            <span className="lead-company">
              {company && <span>🏢 {company}</span>}
            </span>
          )}
        </div>
        <span className={`badge ${getBadgeClass(status)}`}>
          {formatStatusText(status)}
        </span>
      </div>

      <div className="lead-meta-row">
        {phoneNumber && (
          <div className="meta-item">
            <span>📞</span>
            <span>{phoneNumber}</span>
          </div>
        )}
        <div className="meta-item">
          <span>📅</span>
          <span>Last Discussion: {lead.lastDiscussionCreatedAt ? new Date(lead.lastDiscussionCreatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Not discussed yet"}</span>
        </div>
      </div>

      <div className="lead-discussion-preview">
        <span className="discussion-preview-label">Last Interaction</span>
        <span className="discussion-preview-content">
          {lastDiscussionContent || "No discussion notes logged yet."}
        </span>
        <span className="discussion-time-ago">
          {lastDiscussionCreatedAt ? formatTimeAgo(lastDiscussionCreatedAt) : "Never"}
        </span>
      </div>

      {fuInfo && (
        <div className={`lead-followup-badge ${fuInfo.isOverdue ? "overdue" : fuInfo.isToday ? "today" : "ok"}`}>
          <span>🔔</span>
          <span>
            {fuInfo.isOverdue 
              ? `Overdue: ${fuInfo.formattedDate}` 
              : fuInfo.isToday 
                ? `Today @ ${new Date(followUpAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
                : `Next: ${fuInfo.formattedDate}`
            }
          </span>
        </div>
      )}
    </div>
  );
}

export default LeadCard;
