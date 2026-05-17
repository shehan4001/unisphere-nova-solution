import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Reward.css";

import {
  isTaskAvailableToday,
  markTaskVisited,
} from "../../utils/taskProgress";

import qrLogoImg from "../../assets/images/qr.png";
import reward1 from "../../assets/images/rewords card 1.png";
import reward2 from "../../assets/images/rewordscard2.png";
import reward3 from "../../assets/images/rewordscard3.png";

const defaultTasks = [
  { id: "daily_login", title: "Daily Login", desc: "Open UniSphere today", pts: 10, progress: "100" },
  { id: "visit_student_portal", title: "Visit Student Portal", desc: "Check your academic hub", pts: 20, progress: "100" },
  { id: "view_rewards_page", title: "View Rewards Page", desc: "Explore available rewards", pts: 10, progress: "100" },
  { id: "explore_campus_clubs", title: "Explore Campus Clubs", desc: "Discover student communities", pts: 15, progress: "100" },
  { id: "check_transit_routes", title: "Check Transit Routes", desc: "View campus navigation routes", pts: 15, progress: "100" },
  { id: "explore_events", title: "Explore Events", desc: "Read latest campus events", pts: 20, progress: "100" },
  { id: "read_facility_update", title: "Read Facility Update", desc: "Stay updated with campus facilities", pts: 15, progress: "100" },
];

const rewards = [
  {
    id: "coffee",
    title: "Free Campus Coffee",
    desc: "Redeem for any medium beverage at the Union Cafe.",
    points: 200,
    image: reward1,
    alt: "Coffee",
  },
  {
    id: "hoodie",
    title: "Limited Edition Hoodie",
    desc: "Official Eduportal anniversary collection. High quality cotton.",
    points: 1500,
    image: reward2,
    alt: "Hoodie",
  },
  {
    id: "library",
    title: "24h Library Access",
    desc: "One-day pass for late night study sessions.",
    points: 500,
    image: reward3,
    alt: "Library",
  },
];

const Reward = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [points, setPoints] = useState(0);
  const [claimedTasks, setClaimedTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showAllActivities, setShowAllActivities] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const studentId = storedUser?.ID;

  const fetchRewardData = async () => {
    if (!studentId) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/rewards/${studentId}`);

      setPoints(res.data.points ?? 0);
      setClaimedTasks(res.data.claimedTasks ?? []);
      setActivities(res.data.activities ?? []);
    } catch (err) {
      console.error("Reward fetch error:", err);
      alert("Failed to load reward data.");
    }
  };

  useEffect(() => {
    markTaskVisited("view_rewards_page");
  }, []);

  useEffect(() => {
    fetchRewardData();
  }, [studentId]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleClaimTask = async (task) => {
    if (!studentId) {
      alert("Please login first.");
      return;
    }

    const isAvailable = isTaskAvailableToday(task.id);

    if (!isAvailable) {
      alert("Please complete this task first.");
      return;
    }

    if (claimedTasks.includes(task.id)) return;

    try {
      await axios.post("http://localhost:5000/api/rewards/claim-task", {
        studentId,
        taskId: task.id,
        title: task.title,
        points: task.pts,
      });

      fetchRewardData();
    } catch (err) {
      alert(err.response?.data?.message || "Task claim failed.");
    }
  };

  const handleRedeem = async (reward) => {
    if (!studentId) {
      alert("Please login first.");
      return;
    }

    if (points < reward.points) {
      alert("You do not have enough points.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/rewards/redeem", {
        studentId,
        rewardTitle: reward.title,
        pointsRequired: reward.points,
      });

      alert(`${reward.title} redeemed successfully!`);
      fetchRewardData();
    } catch (err) {
      alert(err.response?.data?.message || "Redeem failed.");
    }
  };

  return (
    <div className="reward-page">
      <Header />

      <main className="reward-page-wrapper">
        <div className="reward-container">
          <section className="reward-hero-banner">
            <div className="reward-hero-content">
              <h2 className="reward-hero-title">Check-in & Rewards</h2>

              <p className="reward-hero-subtitle">
                Ready for today's sessions?
              </p>
            </div>

            <div className="points-balance-card">
              <p className="points-label">CURRENT BALANCE</p>
              <div className="points-value-container">
                <span className="points-number">{points.toLocaleString()}</span>
                <span className="points-unit">pts</span>
              </div>
            </div>

            <div className="banner-qr-overlay">
              <img src={qrLogoImg} alt="QR Decoration" className="qr-background-img" />
            </div>
          </section>

          <div className="reward-action-grid">
            <div className="action-card full-width-card">
              <div className="action-icon-box light-blue-bg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>

              <div className="action-info">
                <h3 className="action-title">Redeem Points</h3>
                <p className="action-desc">Complete task and get points</p>
              </div>

              <button className="view-shop-btn" onClick={toggleModal}>
                Tasks
              </button>
            </div>
          </div>

          <div className="section-header-row">
            <h2 className="section-title">Rewards</h2>
          </div>

          <div className="featured-rewards-grid">
            {rewards.map((reward) => (
              <div className="reward-item" key={reward.id}>
                <div className="reward-img-container">
                  <img src={reward.image} alt={reward.alt} />
                </div>

                <div className="reward-details">
                  <div className="reward-header-inline">
                    <h4>{reward.title}</h4>
                    <span className="pts-badge-inline">
                      {reward.points.toLocaleString()} pts
                    </span>
                  </div>

                  <p>{reward.desc}</p>

                  {points >= reward.points ? (
                    <button className="redeem-btn" onClick={() => handleRedeem(reward)}>
                      Redeem
                    </button>
                  ) : (
                    <button className="redeem-btn-disabled" disabled>
                      Need more pts
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="section-header-row mt-30">
            <h2 className="section-title">Recent Activity</h2>

            {activities.length > 5 && (
              <button
                className="view-all-btn"
                onClick={() => setShowAllActivities(!showAllActivities)}
              >
                {showAllActivities ? "Show Less" : "View All"}
              </button>
            )}
          </div>

          <div className="activity-list">
            {activities.length === 0 ? (
              <div className="activity-item">
                <div className="activity-main">
                  <div className="activity-text">
                    <p className="act-title">No recent activity yet</p>
                    <p className="act-date">Claim a task or redeem a reward to see activity.</p>
                  </div>
                </div>
              </div>
            ) : (
              (showAllActivities ? activities : activities.slice(0, 5)).map((activity) => (
                <div className="activity-item" key={activity.id}>
                  <div className="activity-main">
                    <div className="activity-text">
                      <p className="act-title">{activity.title}</p>
                      <p className="act-date">{activity.date}</p>
                    </div>
                  </div>

                  <span
                    className={
                      activity.type === "add"
                        ? "points-added"
                        : "points-subtracted"
                    }
                  >
                    {activity.points}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />

      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                <div>
                  <h3>Simple Challenges</h3>
                  <p>Quick wins to keep your momentum.</p>
                </div>
              </div>

              <button className="close-modal" onClick={toggleModal}>
                &times;
              </button>
            </div>

            <div className="challenges-list">
              {defaultTasks.map((task) => {
                const isClaimed = claimedTasks.includes(task.id);
                const isAvailable = isTaskAvailableToday(task.id);

                return (
                  <ChallengeItem
                    key={task.id}
                    title={task.title}
                    desc={task.desc}
                    pts={`+${task.pts} pts`}
                    status={
                      isClaimed
                        ? "Claimed"
                        : isAvailable
                        ? "Claim"
                        : "Locked"
                    }
                    progress={task.progress}
                    isClaimed={isClaimed}
                    isAvailable={isAvailable}
                    onClaim={() => handleClaimTask(task)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ChallengeItem = ({
  title,
  desc,
  pts,
  status,
  progress,
  isClaimed,
  isAvailable,
  onClaim,
}) => (
  <div className="challenge-item">
    <div className="challenge-info">
      <div>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
      <span className="challenge-pts">{pts}</span>
    </div>

    <div className="progress-bar-container">
      <div
        className="progress-bar"
        style={{ width: isClaimed ? `${progress}%` : "0%" }}
      ></div>
    </div>

    <button
      className="status-btn"
      onClick={onClaim}
      disabled={isClaimed || !isAvailable}
      style={{
        opacity: isClaimed || !isAvailable ? 0.7 : 1,
        cursor: isClaimed || !isAvailable ? "not-allowed" : "pointer",
      }}
    >
      {status}
    </button>
  </div>
);

export default Reward;