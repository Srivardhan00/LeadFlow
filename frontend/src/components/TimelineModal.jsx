import React, { useState, useEffect } from "react";
import axios from "axios";

function TimelineModal({ isOpen, onClose, leadId, onUpdate }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [followUpAt, setFollowUpAt] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && leadId) {
      fetchLeadDetails();
    }
  }, [isOpen, leadId]);

  const fetchLeadDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:8080/api/leads/${leadId}`,
      );
      setDetails(response.data);
      setStatus(response.data.status);

      // Map existing followUpAt to datetime-local format YYYY-MM-DDTHH:MM if it exists
      if (response.data.followUpAt) {
        const rawDate = response.data.followUpAt;
        const formatted = rawDate.substring(0, 16).replace(" ", "T");
        setFollowUpAt(formatted);
      } else {
        setFollowUpAt("");
      }
    } catch (err) {
      console.error("Error fetching lead details:", err);
      setError("Failed to load timeline history.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogDiscussion = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Please enter a discussion note.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        content: content.trim(),
        followUpAt: followUpAt ? followUpAt + ":00" : null, // format correctly for Jackson LocalDateTime
        status: status,
      };

      const response = await axios.post(
        `http://localhost:8080/api/leads/${leadId}/discussions`,
        payload,
      );

      // Update local states with the freshly returned timeline dataset
      setDetails(response.data);
      setStatus(response.data.status);
      setContent("");

      if (response.data.followUpAt) {
        const rawDate = response.data.followUpAt;
        const formatted = rawDate.substring(0, 16).replace(" ", "T");
        setFollowUpAt(formatted);
      } else {
        setFollowUpAt("");
      }

      // Propagate update signal to refresh parent list views!
      onUpdate();
    } catch (err) {
      console.error("Error logging discussion:", err);
      setError("Failed to log discussion details.");
    } finally {
      setSaving(false);
    }
  };

  const handleClearFollowUp = () => {
    setFollowUpAt("");
  };

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBadgeClass = (s) => {
    switch (s) {
      case "NEW":
        return "badge-new";
      case "CONTACTED":
        return "badge-contacted";
      case "QUALIFIED":
        return "badge-qualified";
      case "PROPOSAL_SENT":
        return "badge-proposal";
      case "WON":
        return "badge-won";
      case "LOST":
        return "badge-lost";
      default:
        return "badge-new";
    }
  };

  const formatStatusText = (s) => {
    return s ? s.replace("_", " ") : "";
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-content-large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Lead Timeline & Activity</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "var(--text-secondary)",
              }}
            >
              Loading pipeline timeline...
            </div>
          ) : error ? (
            <div
              style={{
                color: "var(--color-overdue)",
                textAlign: "center",
                padding: "20px",
              }}
            >
              {error}
            </div>
          ) : (
            <>
              {/* Lead Information Panel */}
              <div className="modal-lead-details">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <h3 style={{ fontSize: "20px", fontWeight: 800 }}>
                    {details.fullName}
                  </h3>
                  <span className={`badge ${getBadgeClass(details.status)}`}>
                    {formatStatusText(details.status)}
                  </span>
                </div>

                <div
                  className="form-row"
                  style={{
                    gap: "12px",
                    borderTop: "1px solid var(--border-light)",
                    paddingTop: "12px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        display: "block",
                      }}
                    >
                      Company
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>
                      {details.company || "Not Specified"}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        display: "block",
                      }}
                    >
                      Phone Number
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>
                      {details.phoneNumber || "Not Specified"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Log new activity form */}
              <span className="section-title">Log New Discussion Note</span>

              <form
                onSubmit={handleLogDiscussion}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div className="form-group">
                  <label htmlFor="content">Discussion Content *</label>
                  <textarea
                    id="content"
                    className="form-control"
                    style={{ minHeight: "80px", resize: "vertical" }}
                    placeholder="Enter what you discussed with this lead (e.g. Sent standard licensing estimates...)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="followUpAt">
                      Scheduled Follow-Up (Optional)
                      {followUpAt && (
                        <button
                          type="button"
                          onClick={handleClearFollowUp}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--color-overdue)",
                            fontSize: "11px",
                            marginLeft: "8px",
                            cursor: "pointer",
                            fontWeight: 700,
                          }}
                        >
                          Clear
                        </button>
                      )}
                    </label>
                    <input
                      id="followUpAt"
                      type="datetime-local"
                      className="form-control"
                      value={followUpAt}
                      onChange={(e) => setFollowUpAt(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="timelineStatus">Update Status</label>
                    <select
                      id="timelineStatus"
                      className="form-control"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="NEW">New</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="QUALIFIED">Qualified</option>
                      <option value="PROPOSAL_SENT">Proposal Sent</option>
                      <option value="WON">Won</option>
                      <option value="LOST">Lost</option>
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "4px",
                  }}
                >
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Saving Logs..." : "Log Interaction"}
                  </button>
                </div>
              </form>

              {/* Discussions History Track (moved below form to avoid nested scroll) */}
              <span className="section-title">
                Discussion Logs ({details.discussions?.length || 0})
              </span>

              <div className="timeline-section">
                {details.discussions && details.discussions.length > 0 ? (
                  <div className="timeline">
                    {details.discussions.map((disc) => (
                      <div key={disc.id} className="timeline-item">
                        <div className="timeline-dot"></div>
                        <span className="timeline-time">
                          {formatDate(disc.createdAt)}
                        </span>
                        <p className="timeline-content">{disc.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px 0",
                      color: "var(--text-muted)",
                      fontStyle: "italic",
                    }}
                  >
                    No discussion logs registered for this lead yet. Use the
                    form above to start!
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TimelineModal;
