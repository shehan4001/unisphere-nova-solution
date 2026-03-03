import Header from "../components/Header";
import Card from "../components/Card";
import Footer from "../components/Footer";

function Menu() {
  return (
    <div className="container">

      <Header />

      <div className="main-card">
        <h3>Academic Hub</h3>
        <p>
          Access your grades, enrollment status, financial aid,
          and official documents all in one place.
        </p>
        <button className="primary-btn">
          Go to Student Portal
        </button>
      </div>

      <div className="feature-grid">
        <Card
          image="https://source.unsplash.com/300x200/?award"
          title="Check-in & Rewards"
          description="Scan in, track visits, and earn rewards."
          buttonText="View Rewards"
        />

        <Card
          image="https://source.unsplash.com/300x200/?students"
          title="Campus Clubs Connector"
          description="Discover clubs, join events, and connect."
          buttonText="Explore Community"
        />

        <Card
          image="https://source.unsplash.com/300x200/?bus"
          title="Transit & Navigation"
          description="Live routes and campus maps."
          buttonText="View Routes"
        />

        <Card
          image="https://source.unsplash.com/300x200/?concert"
          title="Facility & Event Updates"
          description="Latest announcements and schedules."
          buttonText="Explore Events"
        />
      </div>

      <Footer />
    </div>
  );
}

export default Menu;