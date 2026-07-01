import { useState } from 'react';

export default function HomeBookingLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    window.location.href = '/dashboard';
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    nav: {
      position: 'fixed',
      top: 0,
      width: '100%',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      transition: 'all 0.3s ease',
    },
    navContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      transition: 'transform 0.3s ease',
    },
    logoIcon: {
      fontSize: '2rem',
      animation: 'float 3s ease-in-out infinite',
    },
    logoText: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    navLinks: {
      display: 'flex',
      gap: '2rem',
      alignItems: 'center',
    },
    navLink: {
      color: '#333',
      fontWeight: '500',
      cursor: 'pointer',
      textDecoration: 'none',
      position: 'relative',
      padding: '5px 0',
      transition: 'color 0.3s ease',
    },
    hero: {
      marginTop: '80px',
      padding: '120px 2rem',
      textAlign: 'center',
      color: 'white',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden',
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
      pointerEvents: 'none',
    },
    heroContent: {
      position: 'relative',
      zIndex: 1,
    },
    heroTitle: {
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      marginBottom: '1rem',
      fontWeight: 'bold',
      textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
      letterSpacing: '-1px',
    },
    heroSubtitle: {
      fontSize: 'clamp(1.2rem, 3vw, 2rem)',
      marginBottom: '1.5rem',
      opacity: 0.95,
      fontWeight: '600',
    },
    heroDescription: {
      fontSize: 'clamp(1rem, 2vw, 1.2rem)',
      maxWidth: '800px',
      margin: '0 auto 2rem',
      opacity: 0.9,
      lineHeight: '1.8',
    },
    ctaContainer: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    btnPrimary: {
      padding: '15px 40px',
      fontSize: '1.1rem',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      fontWeight: '600',
      background: 'white',
      color: '#667eea',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    },
    btnSecondary: {
      padding: '15px 40px',
      fontSize: '1.1rem',
      borderRadius: '50px',
      cursor: 'pointer',
      fontWeight: '600',
      background: 'rgba(255,255,255,0.1)',
      color: 'white',
      border: '2px solid white',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
    },
    features: {
      background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
      padding: '100px 2rem',
    },
    sectionTitle: {
      textAlign: 'center',
      fontSize: 'clamp(2rem, 4vw, 2.5rem)',
      marginBottom: '3rem',
      color: '#333',
      fontWeight: 'bold',
      position: 'relative',
      paddingBottom: '1rem',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    featureCard: {
      padding: '2.5rem',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '20px',
      textAlign: 'center',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      cursor: 'pointer',
      border: '1px solid rgba(255,255,255,0.5)',
      position: 'relative',
      overflow: 'hidden',
    },
    featureIcon: {
      fontSize: '3.5rem',
      marginBottom: '1rem',
      display: 'inline-block',
      transition: 'transform 0.3s ease',
    },
    featureTitle: {
      fontSize: '1.5rem',
      marginBottom: '1rem',
      color: '#667eea',
      fontWeight: 'bold',
    },
    featureDesc: {
      color: '#555',
      lineHeight: '1.8',
      fontSize: '0.95rem',
    },
    stats: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '80px 2rem',
      color: 'white',
      position: 'relative',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '3rem',
      textAlign: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    statNumber: {
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      marginBottom: '0.5rem',
      fontWeight: 'bold',
      textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
    },
    statLabel: {
      fontSize: '1.2rem',
      opacity: 0.9,
      fontWeight: '500',
    },
    howItWorks: {
      padding: '100px 2rem',
      background: 'linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%)',
    },
    stepsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2.5rem',
      marginTop: '3rem',
      maxWidth: '1200px',
      margin: '3rem auto 0',
    },
    stepCard: {
      background: 'white',
      padding: '2.5rem 2rem 2rem',
      borderRadius: '20px',
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      transition: 'all 0.3s ease',
      border: '2px solid transparent',
    },
    stepNumber: {
      position: 'absolute',
      top: '-25px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '60px',
      height: '60px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.8rem',
      fontWeight: 'bold',
      boxShadow: '0 5px 20px rgba(102, 126, 234, 0.4)',
    },
    stepTitle: {
      marginTop: '1.5rem',
      marginBottom: '1rem',
      color: '#667eea',
      fontSize: '1.3rem',
      fontWeight: 'bold',
    },
    stepDesc: {
      color: '#666',
      lineHeight: '1.8',
      fontSize: '0.95rem',
    },
    footer: {
      background: 'linear-gradient(to bottom, #1a202c 0%, #2d3748 100%)',
      color: 'white',
      padding: '80px 2rem 30px',
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '3rem',
      marginBottom: '3rem',
      maxWidth: '1200px',
      margin: '0 auto 3rem',
    },
    footerTitle: {
      marginBottom: '1.5rem',
      color: '#667eea',
      fontSize: '1.3rem',
      fontWeight: 'bold',
    },
    footerLinks: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.8rem',
    },
    footerLink: {
      color: '#cbd5e0',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-block',
    },
    socialIcons: {
      display: 'flex',
      gap: '1rem',
      fontSize: '1.8rem',
      marginTop: '1.5rem',
    },
    footerBottom: {
      textAlign: 'center',
      paddingTop: '2rem',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      color: '#cbd5e0',
      maxWidth: '1200px',
      margin: '0 auto',
    },
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .fade-in-up {
          animation: fadeInUp 1s ease;
        }
        
        .fade-in-up-delay-1 {
          animation: fadeInUp 1s ease 0.2s backwards;
        }
        
        .fade-in-up-delay-2 {
          animation: fadeInUp 1s ease 0.4s backwards;
        }
        
        .fade-in-up-delay-3 {
          animation: fadeInUp 1s ease 0.6s backwards;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-link:hover {
          color: #667eea;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .btn-primary:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
        }

        .btn-secondary:hover {
          background: white;
          color: #667eea;
          transform: translateY(-3px);
        }

        .feature-card:hover {
          transform: translateY(-15px) scale(1.02);
          box-shadow: 0 20px 50px rgba(102, 126, 234, 0.3);
          border-color: #667eea;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.2) rotate(5deg);
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 20px;
        }

        .feature-card:hover::before {
          opacity: 1;
        }

        .step-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
          border-color: #667eea;
        }

        .footer-link:hover {
          color: white;
          transform: translateX(5px);
        }

        .social-icon {
          transition: transform 0.3s ease, filter 0.3s ease;
          cursor: pointer;
        }

        .social-icon:hover {
          transform: scale(1.3) rotate(5deg);
          filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5));
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 2px;
        }

        @media (max-width: 768px) {
          .nav-links-desktop {
            display: none;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.logo} className="logo">
            <span style={styles.logoIcon}>🏠</span>
            <span style={styles.logoText}>HomeBooking</span>
          </div>
          
          <div style={styles.navLinks}>
            <div className="nav-links-desktop" style={{ display: 'flex', gap: '2rem' }}>
              <a onClick={() => scrollToSection('home')} style={styles.navLink} className="nav-link">Home</a>
              <a onClick={() => scrollToSection('features')} style={styles.navLink} className="nav-link">Features</a>
              <a onClick={() => scrollToSection('how-it-works')} style={styles.navLink} className="nav-link">How It Works</a>
              <a onClick={() => scrollToSection('contact')} style={styles.navLink} className="nav-link">Contact</a>
            </div>
            
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ 
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#667eea',
              }}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div style={{ background: 'white', borderTop: '1px solid #e5e7eb', padding: '1rem 2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a onClick={() => scrollToSection('home')} style={{ ...styles.navLink, padding: '0.5rem 0' }}>Home</a>
              <a onClick={() => scrollToSection('features')} style={{ ...styles.navLink, padding: '0.5rem 0' }}>Features</a>
              <a onClick={() => scrollToSection('how-it-works')} style={{ ...styles.navLink, padding: '0.5rem 0' }}>How It Works</a>
              <a onClick={() => scrollToSection('contact')} style={{ ...styles.navLink, padding: '0.5rem 0' }}>Contact</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 className="fade-in-up" style={styles.heroTitle}>
            Your Dream Home Awaits
          </h1>
          <h2 className="fade-in-up-delay-1" style={styles.heroSubtitle}>
            Buy, Sell, or Rent Properties with Ease
          </h2>
          <p className="fade-in-up-delay-2" style={styles.heroDescription}>
            The ultimate platform for all your real estate needs. List your property, find your perfect home, or discover rental opportunities - all in one place. We support flexible payment options.
          </p>
          <div className="fade-in-up-delay-3" style={styles.ctaContainer}>
            <button onClick={handleGetStarted} style={styles.btnPrimary} className="btn-primary">
              Get Started
            </button>
            <button style={styles.btnSecondary} className="btn-secondary">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={styles.features}>
        <h2 style={styles.sectionTitle} className="section-title">
          Everything You Need in One Platform
        </h2>
        <div style={styles.featuresGrid}>
          {[
            { icon: '🏘️', title: 'Buy Properties', desc: 'Browse thousands of verified listings and find your dream home with advanced search filters and detailed property information.' },
            { icon: '💰', title: 'Sell Your Home', desc: 'List your property easily and reach thousands of potential buyers with our powerful marketing tools and wide audience reach.' },
            { icon: '🔑', title: 'Rent & Lease', desc: 'Find rental properties or list yours for rent. Flexible terms for both tenants and landlords with transparent agreements.' },
            { icon: '💳', title: 'Flexible Payments', desc: 'Choose between secure online payments or traditional offline methods - whatever works best for you and your transaction.' },
            { icon: '🛡️', title: 'Secure Transactions', desc: 'Bank-level security ensures your data and payments are always protected with end-to-end encryption.' },
            { icon: '👥', title: '24/7 Support', desc: 'Our dedicated team is always ready to help you with any questions, concerns, or technical assistance you may need.' }
          ].map((feature, index) => (
            <div key={index} style={styles.featureCard} className="feature-card">
              <div style={styles.featureIcon} className="feature-icon">{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.stats}>
        <div style={styles.statsGrid}>
          {[
            { number: '10,000+', label: 'Active Listings' },
            { number: '50,000+', label: 'Happy Users' },
            { number: '₹500Cr+', label: 'Total Transactions' },
            { number: '500+', label: 'Cities Covered' }
          ].map((stat, index) => (
            <div key={index}>
              <h3 style={styles.statNumber}>{stat.number}</h3>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={styles.howItWorks}>
        <h2 style={styles.sectionTitle} className="section-title">
          How It Works
        </h2>
        <div style={styles.stepsGrid}>
          {[
            { num: '1', title: 'Create Account', desc: 'Sign up in minutes and set up your profile with your preferences and requirements.' },
            { num: '2', title: 'Browse or List', desc: 'Search through properties or list your own with detailed descriptions and photos.' },
            { num: '3', title: 'Connect & Deal', desc: 'Connect directly with buyers, sellers, or renters and negotiate the best deal.' },
            { num: '4', title: 'Secure Payment', desc: 'Complete transactions safely with online or offline payment methods of your choice.' }
          ].map((step, index) => (
            <div key={index} style={styles.stepCard} className="step-card">
              <div style={styles.stepNumber}>{step.num}</div>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" style={styles.footer}>
        <div style={styles.footerGrid}>
          <div>
            <h3 style={styles.footerTitle}>🏠 HomeBooking</h3>
            <p style={{ lineHeight: '1.8', color: '#cbd5e0' }}>Making real estate transactions simple, secure, and accessible for everyone.</p>
            <div style={styles.socialIcons}>
              <a href="#" style={{ color: 'white' }} className="social-icon">📘</a>
              <a href="#" style={{ color: 'white' }} className="social-icon">🐦</a>
              <a href="#" style={{ color: 'white' }} className="social-icon">📸</a>
              <a href="#" style={{ color: 'white' }} className="social-icon">💼</a>
            </div>
          </div>
          <div>
            <h3 style={styles.footerTitle}>Quick Links</h3>
            <div style={styles.footerLinks}>
              <a onClick={() => scrollToSection('home')} style={styles.footerLink} className="footer-link">Home</a>
              <a onClick={() => scrollToSection('features')} style={styles.footerLink} className="footer-link">Features</a>
              <a onClick={() => scrollToSection('how-it-works')} style={styles.footerLink} className="footer-link">How It Works</a>
              <a href="#" style={styles.footerLink} className="footer-link">About Us</a>
            </div>
          </div>
          <div>
            <h3 style={styles.footerTitle}>Legal</h3>
            <div style={styles.footerLinks}>
              <a href="#" style={styles.footerLink} className="footer-link">Privacy Policy</a>
              <a href="#" style={styles.footerLink} className="footer-link">Terms of Service</a>
              <a href="#" style={styles.footerLink} className="footer-link">Cookie Policy</a>
              <a href="#" style={styles.footerLink} className="footer-link">Disclaimer</a>
            </div>
          </div>
          <div>
            <h3 style={styles.footerTitle}>Connect With Us</h3>
            <div style={styles.footerLinks}>
              <span style={{ color: '#cbd5e0' }}>📧 support@homebooking.com</span>
              <span style={{ color: '#cbd5e0' }}>📞 +91 1800-123-4567</span>
              <span style={{ color: '#cbd5e0' }}>📍 Bangalore, India</span>
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>&copy; 2025 HomeBooking. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}