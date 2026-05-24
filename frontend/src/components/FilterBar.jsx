import React from "react";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All" },
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "PROPOSAL_SENT", label: "Proposal Sent" },
  { value: "WON", label: "Won" },
  { value: "LOST", label: "Lost" }
];

function FilterBar({ searchQuery, setSearchQuery, selectedStatus, setSelectedStatus, leads }) {
  
  const getCount = (status) => {
    if (status === "ALL") return leads.length;
    return leads.filter(l => l.status === status).length;
  };

  return (
    <div className="filter-card">
      <div className="filter-row">
        <div className="search-input-wrapper">
          <svg
            className="search-icon"
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search leads by name or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="status-pills">
        {STATUS_OPTIONS.map((opt) => {
          const count = getCount(opt.value);
          const isActive = selectedStatus === opt.value;
          return (
            <button
              key={opt.value}
              className={`status-pill ${isActive ? "active" : ""}`}
              onClick={() => setSelectedStatus(opt.value)}
            >
              {opt.label}
              <span className="pill-count">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterBar;
