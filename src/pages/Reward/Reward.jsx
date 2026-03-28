import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Reward.css";

// ✅ FIXED image imports
import qrLogoImg from "../../assets/images/qr.png";
import reward1 from "../../assets/images/rewords card 1.png";
import reward2 from "../../assets/images/rewordscard2.png";
import reward3 from "../../assets/images/rewordscard3.png";

const Reward = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <Header />

      <div className="reward-page-wrapper">
        <div className="reward-container">
          
          {/* HERO */}
          <section className="reward-hero-banner">
            <div className="reward-hero-content">
              <h2 className="reward-hero-title">Check-in & Rewards</h2>
              <p className="reward-hero-subtitle">
                Good morning, Alex. Ready for today's sessions?
              </p>
            </div>

            <div className="points-balance-card">
              <p className="points-label">CURRENT BALANCE</p>
              <div className="points-value-container">
                <span className="points-number">1,250</span>
                <span className="points-unit">pts</span>
              </div>
            </div>

            <div className="banner-qr-overlay">
              <img src={qrLogoImg} alt="QR Decoration" className="qr-background-img" />
            </div>
          </section>

          {/* ACTION */}
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

          {/* REWARDS */}
          <div className="section-header-row">
            <h2 className="section-title">Rewards</h2>
          </div>

          <div className="featured-rewards-grid">
            
            {/* CARD 1 */}
            <div className="reward-item">
              <div className="reward-img-container">
                <img src={reward1} alt="Coffee" />
              </div>
              <div className="reward-details">
                <div className="reward-header-inline">
                  <h4>Free Campus Coffee</h4>
                  <span className="pts-badge-inline">200 pts</span>
                </div>
                <p>Redeem for any medium beverage at the Union Cafe.</p>
                <button className="redeem-btn">Redeem</button>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="reward-item">
              <div className="reward-img-container">
                <img src={reward2} alt="Hoodie" />
              </div>
              <div className="reward-details">
                <div className="reward-header-inline">
                  <h4>Limited Edition Hoodie</h4>
                  <span className="pts-badge-inline">1,500 pts</span>
                </div>
                <p>Official Eduportal anniversary collection. High quality cotton.</p>
                <button className="redeem-btn-disabled">Need more pts</button>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="reward-item">
              <div className="reward-img-container">
                <img src={reward3} alt="Library" />
              </div>
              <div className="reward-details">
                <div className="reward-header-inline">
                  <h4>24h Library Access</h4>
                  <span className="pts-badge-inline">500 pts</span>
                </div>
                <p>One-day pass for late night study sessions.</p>
                <button className="redeem-btn">Redeem</button>
              </div>
            </div>

          </div>

          {/* ACTIVITY */}
          <div className="section-header-row mt-30">
            <h2 className="section-title">Recent Activity</h2>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-main">
                <div className="activity-check-icon">✅</div>
                <div className="activity-text">
                  <p className="act-title">Lecture: Advanced Algorithms</p>
                  <p className="act-date">Today, 09:30AM</p>
                </div>
              </div>
              <span className="points-added">+50 pts</span>
            </div>

            <div className="activity-item">
              <div className="activity-main">
                <div className="activity-check-icon blue-icon">📅</div>
                <div className="activity-text">
                  <p className="act-title">Library Check-in</p>
                  <p className="act-date">Yesterday, 02:15 PM</p>
                </div>
              </div>
              <span className="points-added">+25 pts</span>
            </div>

            <div className="activity-item">
              <div className="activity-main">
                <div className="activity-check-icon orange-icon">☕</div>
                <div className="activity-text">
                  <p className="act-title">Redeem: Campus Coffee</p>
                  <p className="act-date">Nov 12, 1:00 PM</p>
                </div>
              </div>
              <span className="points-subtracted">-200 pts</span>
            </div>
          </div>

          <Footer />

          {/* MODAL */}
          {isModalOpen && (
            <div className="modal-overlay" onClick={toggleModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                
                <div className="modal-header">
                  <div className="modal-header-left">
                    <div className="flash-icon-box">⚡</div>
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
                  <ChallengeItem title="Log in today" desc="Daily streak maintained" pts="+10 pts" status="Claimed" progress="100" />
                  <ChallengeItem title="Read announcement" desc="Stay informed" pts="+15 pts" status="Complete" progress="100" isFaint />
                  <ChallengeItem title="Check library" desc="Review resources" pts="+10 pts" status="Complete" progress="100" isFaint />
                </div>

                <div className="modal-footer">
                  <span>More challenges available</span>
                  <button className="view-all-tasks">View All</button>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

const ChallengeItem = ({ title, desc, pts, status, progress, isFaint }) => (
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
        className={`progress-bar ${isFaint ? "faint-progress" : ""}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>

    <button className="status-btn">{status}</button>
  </div>
);

export default Reward;