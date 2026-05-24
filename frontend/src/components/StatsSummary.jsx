import React from "react";

function StatsSummary({ leads }) {
  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.status === "WON").length;
  
  const todayStr = new Date().toLocaleDateString("en-CA"); // Generates local YYYY-MM-DD
  const todayFollowUps = leads.filter(l => {
    if (!l.followUpAt) return false;
    const followUpDate = l.followUpAt.split(/[T ]/)[0];
    return followUpDate === todayStr;
  }).length;

  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  return (
    <div className="stats-grid">
      <div className="stat-card stat-active">
        <span className="stat-title">Total Leads</span>
        <span className="stat-value">{totalLeads}</span>
        <span className="stat-subtext">Registered in LeadFlow CRM</span>
      </div>
      <div className="stat-card stat-followup">
        <span className="stat-title">Today's Follow-Ups</span>
        <span className="stat-value">{todayFollowUps}</span>
        <span className="stat-subtext">Action items scheduled for today</span>
      </div>
      <div className="stat-card stat-won">
        <span className="stat-title">Won Leads</span>
        <span className="stat-value">{wonLeads}</span>
        <span className="stat-subtext">Success conversion rate: {conversionRate}%</span>
      </div>
    </div>
  );
}

export default StatsSummary;
