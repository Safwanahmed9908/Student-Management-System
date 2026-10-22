import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-badge">Term Work-2 Micro Project</div>
          <h1 className="hero-title">
            Student Management <span>System</span>
          </h1>
          <p className="hero-description">
            A comprehensive, full-stack web application designed for academic student record administration.
            Built strictly on the <strong>MERN</strong> stack (MongoDB, Express.js, React, Node.js) with JWT authentication and secure RESTful APIs.
          </p>

          <div className="hero-cta">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Go to Dashboard &rarr;
                </Link>
                <Link to="/add-student" className="btn btn-outline btn-lg">
                  + Add New Student
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-lg">
                  User Login &rarr;
                </Link>
                <Link to="/register" className="btn btn-outline btn-lg">
                  Register Account
                </Link>
              </>
            )}
          </div>

          {isAuthenticated && (
            <p className="logged-in-notice">
              Logged in as <strong>{user?.name}</strong> ({user?.email})
            </p>
          )}
        </div>
      </section>

      {/* Features Overview */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Core System Capabilities</h2>
          <p className="section-subtitle">
            Engineered to fulfill all Term Work-2 micro-project evaluation requirements
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Secure Authentication</h3>
              <p>
                JWT (JSON Web Token) based user sessions with salted bcrypt password hashing on the server.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Full CRUD Operations</h3>
              <p>
                Create, read, update, and delete student records directly synchronizing with MongoDB.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Real-Time Search</h3>
              <p>
                Instant live filtering across student names, unique roll numbers, departments, and emails.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Responsive Interface</h3>
              <p>
                Intuitive layout adapted seamlessly across desktop monitors, tablets, and mobile devices.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Protected API Routes</h3>
              <p>
                All student modification endpoints are guarded by Express middleware checking JWT validity.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🗄️</div>
              <h3>Mongoose Schema Validation</h3>
              <p>
                Robust schema models with unique roll numbers, regex email checks, and timestamps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section className="tech-section">
        <div className="container">
          <h3 className="tech-title">Technology Stack Overview</h3>
          <div className="tech-badges">
            <span className="tech-badge">🍃 MongoDB</span>
            <span className="tech-badge">⚡ Express.js</span>
            <span className="tech-badge">⚛️ React 18</span>
            <span className="tech-badge">🟢 Node.js</span>
            <span className="tech-badge">🔑 JWT Auth</span>
            <span className="tech-badge">🔒 Bcrypt</span>
            <span className="tech-badge">📡 Axios</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
