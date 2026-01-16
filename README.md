# BAPCO TruContext™ Dashboard

<div align="center">

![TruContext](https://img.shields.io/badge/TruContext-Operations%20Intelligence-00d4ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646cff?style=for-the-badge&logo=vite)
![Three.js](https://img.shields.io/badge/Three.js-r160-black?style=for-the-badge&logo=three.js)

**AI-Driven Operations Intelligence Dashboard for Bahrain Petroleum Company**

[Demo](http://localhost:3000) · [Documentation](#documentation) · [Deployment](#deployment)

</div>

---

## Overview

A cutting-edge, interactive web dashboard demonstrating the TruContext platform capabilities for oil refinery operations monitoring. Built with React + Vite for modern performance, featuring:

- **🏭 3D Digital Twins** - Interactive Three.js-powered facility visualization
- **📊 Real-time Analytics** - Live KPIs with Chart.js visualizations  
- **🔮 Predictive Maintenance** - AI-driven equipment health and RUL predictions
- **🌿 ESG Compliance** - Emissions monitoring aligned with Bahrain Vision 2030
- **🛡️ IT/OT Cybersecurity** - Network topology and SCADA threat detection

## Technology Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, Vite 5, React Router DOM |
| **3D Graphics** | Three.js r160 |
| **Animations** | GSAP 3.12, anime.js 3.2 |
| **Charts** | Chart.js 4, react-chartjs-2 |
| **Styling** | Custom CSS, CSS Variables, Tailwind (optional) |
| **Icons** | Lucide React |

## Project Structure

```
bapco-dashboard/
├── src/
│   ├── main.jsx                 # Application entry point
│   ├── App.jsx                  # Root component with routing
│   ├── context/
│   │   ├── AuthContext.jsx      # Authentication state
│   │   └── AppStateContext.jsx  # Global app state
│   ├── pages/
│   │   ├── Login.jsx            # Demo login (admin/admin)
│   │   ├── Dashboard.jsx        # Main dashboard layout
│   │   ├── Landing.jsx          # Hero section
│   │   ├── Facility.jsx         # 3D facility overview
│   │   ├── Process.jsx          # Process monitoring
│   │   ├── Equipment.jsx        # Equipment health
│   │   ├── Safety.jsx           # Safety & emissions
│   │   └── Cyber.jsx            # Cybersecurity ops
│   ├── components/
│   │   ├── layout/              # Navigation, Preloader
│   │   ├── three/               # 3D visualizations
│   │   ├── charts/              # Chart components
│   │   └── ui/                  # Reusable UI components
│   ├── hooks/
│   │   └── useRealTimeData.js   # Real-time data simulation
│   ├── data/
│   │   └── mockData.js          # Comprehensive mock dataset
│   └── styles/
│       ├── index.css            # Main styles & variables
│       ├── dashboard.css        # Dashboard components
│       └── animations.css       # Animation keyframes
├── public/
│   └── videos/                  # B-roll video assets
├── docs/                        # Requirements & references
├── index.html                   # Vite entry point (legacy)
├── index-vite.html              # React app entry point
├── package.json
├── vite.config.js
├── vercel.json                  # Vercel deployment config
├── netlify.toml                 # Netlify deployment config
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
cd @BAPCO

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:3000`

### Demo Credentials
```
Username: admin
Password: admin
```

## Build & Deployment

### Production Build
```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

## Dashboard Sections

### 1. Landing Page
- Animated hero with particle effects
- Real-time KPI stat cards (380K BPD capacity)
- Interactive 3D refinery preview
- GSAP scroll-triggered animations

### 2. 3D Facility Overview
- Isometric view of refinery units (CDU, RHCU, FCC)
- Clickable sections with live status
- Mouse-controlled camera rotation
- Real-time activity feed

### 3. Process Monitoring
- Animated distillation tower visualization
- Temperature, pressure, flow trend charts
- Circular gauge displays
- Product yield breakdown (LPG, Naphtha, Diesel)

### 4. Equipment Health
- 3D ESP pump model with rotating components
- Vibration & motor current analysis
- Bearing temperature monitoring
- Predictive alerts with AI confidence scores
- Asset table with RUL predictions

### 5. Safety & Emissions
- Personnel geofencing map
- Emissions monitoring (NOx, SOx, VOC, CO₂)
- Safety KPIs (847 days without LTI)
- Bahrain Vision 2030 compliance tracking

### 6. Cybersecurity
- IT/OT network topology visualization
- SCADA anomaly detection
- Real-time threat feed
- Access audit log
- Security posture score (87/100)

## Configuration

### Environment Variables
Copy `.env.example` to `.env`:
```env
VITE_APP_NAME=TruContext Dashboard
VITE_DEMO_MODE=true
VITE_ENABLE_REAL_TIME=true
```

### Theming
CSS variables in `src/styles/index.css`:
```css
:root {
  --primary-cyan: #00d4ff;
  --primary-purple: #5b2d8c;
  --bg-dark: #0a0e17;
  --bg-card: #12161f;
  --accent-green: #6bcb77;
  --accent-yellow: #ffd93d;
  --accent-red: #ff6b6b;
}
```

## BAPCO Context

This dashboard is tailored for **Bahrain Petroleum Company (BAPCO)**, addressing:

| Challenge | TruContext Solution |
|-----------|-------------------|
| Mature field optimization | AI-driven ESP/artificial lift monitoring |
| BMP modernization (267K→380K BPD) | Real-time feedstock stability tracking |
| Equipment failures | Predictive maintenance with 30-50% failure reduction |
| ESG compliance | Automated Scope 1/2 emissions dashboards |
| Cyber-physical threats | Unified IT/OT monitoring, SCADA protection |

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

**Note**: WebGL support required for 3D visualizations.

## Performance

- 60fps animations via requestAnimationFrame
- Code splitting for optimized bundle size
- Lazy-loaded Three.js scenes
- Chart.js with 'none' animation for real-time updates
- Optimized particle systems

## Credits

- **TruContext Platform** by Visium Technologies
- **BAPCO** - Bahrain Petroleum Company
- Design inspired by modern industrial HMI/SCADA systems

## License

Proprietary - Demonstration project for BAPCO. All rights reserved.

---

<div align="center">

**Built for Monday's Demo** 🚀

</div>
