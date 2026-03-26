import React, { useState } from "react";
import Footer from '../../components/Footer/Footer'; 
import "./Reward.css";
import qrLogoImg from "../../assets/images/qr.png"; 

const Reward = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="reward-page-wrapper">
      <div className="reward-container">
        
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

        <div className="reward-action-grid">
          <div className="action-card full-width-card">
            <div className="action-icon-box light-blue-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="action-info">
              <h3 className="action-title">Redeem Points</h3>
              <p className="action-desc">Complete task and get points</p> 
            </div>
            <button className="view-shop-btn" onClick={toggleModal}>Tasks</button>
          </div>
        </div>

       
        <div className="section-header-row">
          <h2 className="section-title">Rewards</h2>
        </div>
        
        <div className="featured-rewards-grid">
           <div className="reward-item">
            <div className="reward-img-container">
              <img src="src/assets/images/rewords card 1.png" alt="Coffee" />
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

          <div className="reward-item">
            <div className="reward-img-container">
              <img src="src/assets/images/rewordscard2.png" alt="Hoodie" />
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

          <div className="reward-item">
            <div className="reward-img-container">
              <img src="src/assets/images/rewordscard3.png" alt="Library" />
            </div>
            <div className="reward-details">
              <div className="reward-header-inline">
                <h4>24h Library Access</h4>
                <span className="pts-badge-inline">500 pts</span>
              </div>
              <p>One-day pass for late night study sessions in quiet zones.</p>
              <button className="redeem-btn">Redeem</button>
            </div>
          </div>
        </div>

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

        <Footer/>

        {/* --- Modal (Pop-up) --- */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={toggleModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-header-left">
                  <div className="flash-icon-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                  <div>
                    <h3>Simple Challenges</h3>
                    <p>Quick wins to keep your academic momentum going today.</p>
                  </div>
                </div>
                <button className="close-modal" onClick={toggleModal}>&times;</button>
              </div>

              <div className="challenges-list">
               
                <ChallengeItem title="Log in today" desc="Daily streak maintained" pts="+10 pts" status="Claimed" progress="100" isFaint={false} />
                
                
                <ChallengeItem title="Read a campus announcement" desc="Stay informed with the latest news" pts="+15 pts" status="Complete" progress="100" isFaint={true} />
                <ChallengeItem title="Check your library balance" desc="Review loans and resource availability" pts="+10 pts" status="Complete" progress="100" isFaint={true} />
                <ChallengeItem title="Update your profile picture" desc="Personalize your website identity" pts="+25 pts" status="Complete" progress="100" isFaint={true} />
                <ChallengeItem title="Give a quick emoji reaction to a post" desc="Engage with the student community" pts="+5 pts" status="Complete" progress="100" isFaint={true} />
              </div>
              
              <div className="modal-footer">
                <span>4 quick challenges remaining</span>
                <button className="view-all-tasks">View All Tasks</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
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
        className={`progress-bar ${isFaint ? 'faint-progress' : ''}`} 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
    
    <button className="status-btn">{status}</button>
  </div>
);

export default Reward;