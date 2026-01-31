import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ParticlesComponent } from '../../shared/components/particles/particles.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ParticlesComponent],
  template: `
    <div class="home-page">
      <app-particles></app-particles>
      
      <!-- Navbar -->
      <nav class="home-nav glass">
        <div class="nav-container">
          <a routerLink="/" class="nav-logo">
            <img src="assets/logo.png" alt="ENET'COM Forum" class="logo-img" />
            <span class="logo-text">ENET'COM Forum</span>
          </a>
          
          <ul class="nav-links">
            <li><a href="#home" class="nav-link">Home</a></li>
            <li><a href="#about" class="nav-link">About</a></li>
            <li><a href="#features" class="nav-link">Features</a></li>
            <li><a href="#companies" class="nav-link">Partners</a></li>
            <li><a href="#contact" class="nav-link">Contact</a></li>
          </ul>

          <div class="nav-actions">
            <a routerLink="/login" class="btn-glass">Sign In</a>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section id="home" class="hero-section">
        <div class="hero-container">
          <div class="hero-content">
            <span class="hero-badge">
              <span class="badge-dot"></span>
              ENET'COM Career Forum 2026
            </span>
            
            <h1 class="hero-title">
              <span class="title-accent">Launch Your</span>
              <br />
              Career Journey
            </h1>
            
            <p class="hero-description">
              Connect with Tunisia's top tech companies, discover exciting internship
              opportunities, and take the first step towards your professional future.
            </p>
            
            <div class="hero-actions">
              <a routerLink="/login" class="btn-primary">
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>
              <a href="#features" class="btn-secondary">Learn More</a>
            </div>

            <div class="hero-stats">
              <div class="stat">
                <span class="stat-value">50+</span>
                <span class="stat-label">Partner Companies</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat">
                <span class="stat-value">200+</span>
                <span class="stat-label">Job Offers</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat">
                <span class="stat-value">1000+</span>
                <span class="stat-label">Active Students</span>
              </div>
            </div>
          </div>

          <div class="hero-visual">
            <div class="shield-container">
              <!-- Shield with Logo -->
              <div class="shield">
                <img src="assets/logo.png" alt="ENET'COM Forum" class="shield-logo" />
              </div>
              
              <!-- Floating Icons -->
              <div class="floating-icon icon-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              
              <div class="floating-icon icon-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              
              <div class="floating-icon icon-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              
              <div class="floating-icon icon-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              
              <div class="floating-icon icon-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>

              <!-- Connection Lines -->
              <svg class="connection-lines" viewBox="0 0 400 400">
                <circle cx="200" cy="200" r="150" fill="none" stroke-width="1" stroke-dasharray="5 5" />
                <circle cx="200" cy="200" r="180" fill="none" stroke-width="1" stroke-dasharray="8 8" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="features-section">
        <div class="section-container">
          <div class="section-header">
            <span class="section-badge">Features</span>
            <h2 class="section-title">Everything You Need</h2>
            <p class="section-description">
              Our platform provides all the tools for students and companies to connect effectively.
            </p>
          </div>

          <div class="features-grid">
            <div class="feature-card glass-card">
              <div class="feature-icon-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <h3 class="feature-title">PFE Opportunities</h3>
              <p class="feature-description">
                Browse and apply for end-of-study projects with leading companies in various tech sectors.
              </p>
            </div>

            <div class="feature-card glass-card">
              <div class="feature-icon-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 class="feature-title">Summer Internships</h3>
              <p class="feature-description">
                Find the perfect summer internship to gain hands-on experience during your break.
              </p>
            </div>

            <div class="feature-card glass-card">
              <div class="feature-icon-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <h3 class="feature-title">Full-time Jobs</h3>
              <p class="feature-description">
                Start your career with job offers tailored for fresh graduates and young professionals.
              </p>
            </div>

            <div class="feature-card glass-card">
              <div class="feature-icon-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 class="feature-title">Company Network</h3>
              <p class="feature-description">
                Connect directly with HR and recruitment teams from our partner companies.
              </p>
            </div>

            <div class="feature-card glass-card">
              <div class="feature-icon-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3 class="feature-title">Easy Applications</h3>
              <p class="feature-description">
                Submit applications with just a few clicks and track their status in real-time.
              </p>
            </div>

            <div class="feature-card glass-card">
              <div class="feature-icon-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="20" x2="12" y2="10"></line>
                  <line x1="18" y1="20" x2="18" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="16"></line>
                </svg>
              </div>
              <h3 class="feature-title">Analytics Dashboard</h3>
              <p class="feature-description">
                Get insights on your applications and discover trending opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-container glass-card">
          <div class="cta-content">
            <h2 class="cta-title">Ready to Start Your Journey?</h2>
            <p class="cta-description">
              Join thousands of students who have found their dream opportunities through our platform.
            </p>
          </div>
          <a routerLink="/login" class="btn-primary cta-btn">
            Get Started Now
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </section>

      <!-- Footer -->
      <footer class="home-footer">
        <div class="footer-container">
          <div class="footer-brand">
            <img src="assets/logo.png" alt="ENET'COM Forum" class="footer-logo" />
            <span class="footer-name">ENET'COM Forum</span>
          </div>
          <p class="footer-copyright">
            © 2026 ENET'COM Forum. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .home-page {
      min-height: 100vh;
    }

    .home-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 1rem 2rem;
    }

    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nav-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
    }

    .logo-img {
      width: 40px;
      height: 40px;
    }

    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--secondary-500), var(--primary-500));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }

    .nav-link:hover {
      color: var(--secondary-500);
    }

    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
    }

    /* Hero Section */
    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 6rem 2rem 4rem;
    }

    .hero-container {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    @media (max-width: 968px) {
      .hero-container {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .hero-visual {
        display: none;
      }
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(246, 139, 30, 0.1);
      border: 1px solid rgba(246, 139, 30, 0.3);
      border-radius: 50px;
      color: var(--secondary-500);
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 1.5rem;
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      background: var(--secondary-500);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .hero-title {
      font-family: 'Outfit', sans-serif;
      font-size: 4rem;
      font-weight: 800;
      line-height: 1.1;
      color: white;
      margin-bottom: 1.5rem;
    }

    .title-accent {
      background: linear-gradient(135deg, var(--secondary-500), var(--primary-500));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }
    }

    .hero-description {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
      margin-bottom: 2rem;
      max-width: 500px;
    }

    @media (max-width: 968px) {
      .hero-description {
        margin-left: auto;
        margin-right: auto;
      }
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 3rem;
    }

    @media (max-width: 968px) {
      .hero-actions {
        justify-content: center;
      }
    }

    .hero-stats {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    @media (max-width: 968px) {
      .hero-stats {
        justify-content: center;
      }
    }

    .stat {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-family: 'Outfit', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      color: var(--secondary-500);
    }

    .stat-label {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
    }

    /* Hero Visual */
    .hero-visual {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .shield-container {
      position: relative;
      width: 400px;
      height: 400px;
    }

    .shield {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 200px;
      height: 230px;
      background: linear-gradient(135deg, rgba(0, 61, 124, 0.3), rgba(246, 139, 30, 0.3));
      border: 3px solid var(--secondary-500);
      clip-path: polygon(50% 0%, 100% 15%, 100% 75%, 50% 100%, 0% 75%, 0% 15%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 40px rgba(246, 139, 30, 0.4);
    }

    .shield-logo {
      width: 100px;
      height: 100px;
      object-fit: contain;
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .floating-icon {
      position: absolute;
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      animation: float 4s ease-in-out infinite;
    }

    .icon-1 {
      top: 20%;
      left: 10%;
      background: linear-gradient(135deg, #00bcd4, #00838f);
      animation-delay: 0s;
    }

    .icon-2 {
      top: 10%;
      right: 20%;
      background: linear-gradient(135deg, var(--secondary-500), var(--accent-dark));
      animation-delay: 0.5s;
    }

    .icon-3 {
      bottom: 25%;
      left: 5%;
      background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
      animation-delay: 1s;
    }

    .icon-4 {
      bottom: 15%;
      right: 10%;
      background: linear-gradient(135deg, var(--accent-light), var(--secondary-500));
      animation-delay: 1.5s;
    }

    .icon-5 {
      top: 45%;
      right: 0;
      background: linear-gradient(135deg, var(--primary-300), var(--primary-500));
      animation-delay: 2s;
    }

    .connection-lines {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      height: 400px;
      animation: spin 60s linear infinite;
    }

    .connection-lines circle:nth-child(1) {
      stroke: rgba(246, 139, 30, 0.2);
    }

    .connection-lines circle:nth-child(2) {
      stroke: rgba(0, 61, 124, 0.15);
    }

    @keyframes spin {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }

    /* Features Section */
    .features-section {
      padding: 6rem 2rem;
    }

    .section-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .section-badge {
      display: inline-block;
      padding: 0.375rem 1rem;
      background: rgba(246, 139, 30, 0.1);
      border: 1px solid rgba(246, 139, 30, 0.3);
      border-radius: 50px;
      color: var(--secondary-500);
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 1rem;
    }

    .section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 1rem;
    }

    .section-description {
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.7);
      max-width: 600px;
      margin: 0 auto;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    @media (max-width: 968px) {
      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .features-grid {
        grid-template-columns: 1fr;
      }
    }

    .feature-card {
      padding: 2rem;
      transition: all 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 40px rgba(246, 139, 30, 0.2);
    }

    .feature-icon-lg {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(246, 139, 30, 0.2), rgba(0, 61, 124, 0.2));
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-500);
      margin-bottom: 1.5rem;
    }

    .feature-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.25rem;
      font-weight: 600;
      color: white;
      margin-bottom: 0.75rem;
    }

    .feature-description {
      font-size: 0.9375rem;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
    }

    /* CTA Section */
    .cta-section {
      padding: 4rem 2rem;
    }

    .cta-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 3rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }

    @media (max-width: 768px) {
      .cta-container {
        flex-direction: column;
        text-align: center;
      }
    }

    .cta-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.75rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.5rem;
    }

    .cta-description {
      color: rgba(255, 255, 255, 0.7);
    }

    .cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
    }

    /* Footer */
    .home-footer {
      padding: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    @media (max-width: 640px) {
      .footer-container {
        flex-direction: column;
        gap: 1rem;
      }
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .footer-logo {
      width: 32px;
      height: 32px;
    }

    .footer-name {
      font-family: 'Outfit', sans-serif;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.8);
    }

    .footer-copyright {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.5);
    }
  `]
})
export class HomeComponent {}
