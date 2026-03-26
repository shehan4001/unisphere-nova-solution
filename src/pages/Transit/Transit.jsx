import { useState } from "react";
import Footer from '../../components/Footer/Footer'; 
import "./Transit.css";

// ── Route data ──
const ROUTES = [
  { name: "CINEC → Gampaha Town",   sub: "Via Sudarshana Mw · Balummahara", time: "7:00 AM",  status: "active",   label: "ACTIVE"   },
  { name: "CINEC → Malabe Town",    sub: "Short campus shuttle",            time: "8:30 AM",  status: "inactive", label: "INACTIVE" },
  { name: "CINEC → Colombo",   sub: "Malabe · Battaramulla  · Rajagiriya · Borella · Colombo Fort  ",             time: "9:00 AM",  status: "inactive", label: "INACTIVE" },
]


const ROUTE_MAPS = [
  `https://www.google.com/maps/embed/v1/directions?key=AIzaSyB4VW2nE5ku0blzZSqg2mlA6AJtgiDnYro&origin=CINEC+Campus,+Malabe,+Sri+Lanka&destination=Gampaha+Town,+Sri+Lanka&waypoints=Keells+-+Pittugala,+296+Kaduwela+Rd,+Malabe,+Sri+Lanka&avoid=highways`,
  `https://www.google.com/maps/embed/v1/directions?key=AIzaSyB4VW2nE5ku0blzZSqg2mlA6AJtgiDnYro&origin=CINEC+Campus+car+park,+Malabe,+Sri+Lanka&destination=Malabe+Public+Bus+Stand,+Malabe,+Sri+Lanka&avoid=highways`,
  `https://www.google.com/maps/embed/v1/directions?key=AIzaSyB4VW2nE5ku0blzZSqg2mlA6AJtgiDnYro&origin=CINEC+Campus+car+park,+Malabe,+Sri+Lanka&destination=Fort,+Colombo,+Sri+Lanka&waypoints=Malabe+Public+Bus+Stand,+Malabe,+Sri+Lanka|Battaramulla+Junction+Bus+Station,+Battaramulla,+Sri+Lanka|Bus+Stop,+Colombo,+Sri+Lanka|Bus+Stop,+Colombo,+Sri+Lanka&avoid=highways`,
];

function LiveBadge() {
  return (
    <div className="live-badge">
      <div className="live-dot" />
      LIVE
    </div>
  );
}

function RouteItem({ route, isActive, onClick }) {
  return (
    <div
      className={`route-item${isActive ? " active" : ""}`}
      onClick={onClick}
    >
      <div className="rdot" />
      <div className="rib">
        <div className="rname">{route.name}</div>
        <div className="rsub">{route.sub}</div>
      </div>
      <div className="rir">
        <div className="rtime">{route.time}</div>
        <div className={`rstatus ${route.status}`}>{route.label}</div>
      </div>
    </div>
  );
}

export default function Transit() {
  const [activeRoute, setActiveRoute] = useState(0);

  return (
    <div className="transit-page">
      <main className="transit-main">

        <div className="page-header">
          <h1>Transit &amp; Navigation</h1>
          <p>Real-time campus shuttle tracking and facility status.</p>
        </div>

        
        <div className="tracker-card">

          
          <div className="tracker-header">
            <div className="tracker-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3"  y="3"  width="7" height="7" rx="1" />
                <rect x="14" y="3"  width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3"  y="14" width="7" height="7" rx="1" />
              </svg>
              Live Shuttle Tracker
            </div>
            <LiveBadge />
          </div>

          
          <div className="map-area">

            <iframe
              key={activeRoute}
              title={`Route: ${ROUTES[activeRoute].name}`}
              className="map-iframe"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={ROUTE_MAPS[activeRoute]}
            />

           
            <div className="overlay-sidebar">
              <div className="sidebar-header">
                <div className="sh-title">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857
                             M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857
                             m0 0a5.002 5.002 0 0 1 9.288 0" />
                  </svg>
                  CINEC Shuttle Routes
                </div>
                <div className="sh-sub">Estimated arrival at your closest stop</div>
              </div>

              <div className="routes-list">
                {ROUTES.map((route, i) => (
                  <RouteItem
                    key={i}
                    route={route}
                    isActive={i === activeRoute}
                    onClick={() => setActiveRoute(i)}
                  />
                ))}
              </div>
            </div>
            
          </div>
        </div>

      </main><Footer/>
    </div>
  );
}