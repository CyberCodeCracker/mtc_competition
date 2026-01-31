import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" [class.fullscreen]="fullscreen">
      <div class="loading-content">
        <div class="spinner-container">
          <div class="spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-dot"></div>
          </div>
        </div>
        <p class="loading-text" *ngIf="message">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .loading-overlay.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(10, 22, 40, 0.9);
      backdrop-filter: blur(10px);
      z-index: 9999;
    }

    .loading-content {
      text-align: center;
    }

    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 1rem;
    }

    .spinner {
      position: relative;
      width: 60px;
      height: 60px;
    }

    .spinner-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 3px solid transparent;
      animation: spin 1.5s ease-in-out infinite;
    }

    .spinner-ring:nth-child(1) {
      border-top-color: #00d4aa;
      animation-delay: 0s;
    }

    .spinner-ring:nth-child(2) {
      border-right-color: #2196f3;
      animation-delay: 0.15s;
      width: 80%;
      height: 80%;
      top: 10%;
      left: 10%;
    }

    .spinner-ring:nth-child(3) {
      border-bottom-color: #00bcd4;
      animation-delay: 0.3s;
      width: 60%;
      height: 60%;
      top: 20%;
      left: 20%;
    }

    .spinner-dot {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 10px;
      height: 10px;
      background: linear-gradient(135deg, #00d4aa, #2196f3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: pulse 1s ease-in-out infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
      50% {
        transform: translate(-50%, -50%) scale(1.5);
        opacity: 0.5;
      }
    }

    .loading-text {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.875rem;
      margin-top: 1rem;
      animation: fadeInOut 2s ease-in-out infinite;
    }

    @keyframes fadeInOut {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() fullscreen = false;
  @Input() message = 'Loading...';
}
