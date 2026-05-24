import React, { useState, useEffect } from "react";
import axios from "axios";
import StatsSummary from "./components/StatsSummary";
import FilterBar from "./components/FilterBar";
import LeadCard from "./components/LeadCard";
import AddLeadModal from "./components/AddLeadModal";
import TimelineModal from "./components/TimelineModal";
import "./App.css";

function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Modal visibility states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeLeadId, setActiveLeadId] = useState(null);

  // Fetch leads when React mounts the App
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/leads");
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads from server:", error);
    } finally {
      setLoading(false);
      setActiveLeadId(null);
    }
  };

  // Create a new lead reactively
  const handleAddLead = async (leadData) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/leads",
        leadData,
      );
      // Optimistically append the new lead to local state first
      setLeads((prev) => [response.data, ...prev]);
      setIsAddOpen(false);
    } catch (error) {
      console.error("Error creating lead:", error);
      alert("Failed to create new lead. Please try again.");
    }
  };

  // Determines if a lead has a follow-up scheduled for the active calendar date (today)
  const isFollowUpToday = (lead) => {
    if (!lead.followUpAt) return false;
    const todayStr = new Date().toLocaleDateString("en-CA"); // local YYYY-MM-DD
    const followUpDate = lead.followUpAt.split(/[T ]/)[0];
    return followUpDate === todayStr;
  };

  // Compute filtered dataset based on search strings and selected status pill
  const getFilteredLeads = () => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.company &&
          lead.company.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        selectedStatus === "ALL" || lead.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  };

  const filtered = getFilteredLeads();

  // Split matches into Pinned Today items and general Pipeline leads
  const pinnedLeads = filtered.filter(isFollowUpToday);
  const otherLeads = filtered.filter((l) => !isFollowUpToday(l));

  return (
    <div className="container">
      {/* Dashboard Brand Header */}
      <header className="header-bar">
        <div className="brand-section">
          <h1>LeadFlow</h1>
          <p>Lightweight CRM & Activity Timeline Tracker</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>+</span> Add
          New Lead
        </button>
      </header>

      {/* Dynamics Performance Counters */}
      <StatsSummary leads={leads} />

      {/* Filter and Search Bar controls */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        leads={leads}
      />

      {/* CRM Main Pipeline Section */}
      <main style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px",
              color: "var(--text-secondary)",
            }}
          >
            Loading CRM pipeline leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="empty-state">
            <h3>No Leads Registered</h3>
            <p>
              Ready to start tracking your sales pipeline? Click the 'Add New
              Lead' button above!
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No Leads Match Filter</h3>
            <p>
              Try refining your search terms or selecting a different status
              filter.
            </p>
          </div>
        ) : (
          <>
            {/* Today's Pinned follow-up queue */}
            {pinnedLeads.length > 0 && (
              <div className="pinned-section">
                <div className="pinned-header">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5v3.793l2 2V11h-3v4.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5V11H2V5.793l2-2V.146zM3 10h10V6.707l-2-2V1h-6v3.707l-2 2V10z" />
                  </svg>
                  <span>Today's Follow-Ups Pinned</span>
                </div>
                <div className="leads-grid" style={{ marginBottom: "8px" }}>
                  {pinnedLeads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onClick={() => setActiveLeadId(lead.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* General Lead Pipeline Section */}
            {otherLeads.length > 0 && (
              <div>
                {pinnedLeads.length > 0 && (
                  <h3
                    className="section-title"
                    style={{ marginBottom: "16px" }}
                  >
                    Pipeline Leads
                  </h3>
                )}
                <div className="leads-grid">
                  {otherLeads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onClick={() => setActiveLeadId(lead.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Add Lead overlay sheet modal */}
      <AddLeadModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddLead}
      />

      {/* Timeline detail overlay sheet modal */}
      <TimelineModal
        isOpen={activeLeadId !== null}
        onClose={() => setActiveLeadId(null)}
        leadId={activeLeadId}
        onUpdate={fetchLeads} // Automatically refreshes the main grid when a discussion is saved!
      />
    </div>
  );
}

export default App;
