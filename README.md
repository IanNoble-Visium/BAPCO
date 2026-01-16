# BAPCO TruContext Dashboard Demo

A cutting-edge, interactive web dashboard for Bahrain Petroleum Company (BAPCO) featuring advanced 3D visualizations, real-time data animations, and a video game-like user experience.

## Overview

This dashboard demonstrates the TruContext platform capabilities for oil refinery operations monitoring, including:

- **3D Facility Visualization** - Interactive Three.js-powered digital twin of the refinery
- **Real-time Process Monitoring** - Live KPIs, temperature, pressure, and flow data
- **Predictive Maintenance** - AI-driven equipment health and failure predictions
- **Safety & Emissions Dashboard** - Personnel tracking and environmental compliance
- **IT/OT Cybersecurity** - Network topology and threat detection visualization

## Technologies Used

| Technology | Purpose |
|------------|---------|
| **Three.js** | 3D graphics, refinery models, particle systems |
| **GSAP (GreenSock)** | Scroll animations, page transitions, timeline effects |
| **anime.js** | Physics-based animations, morphing, staggered effects |
| **Chart.js** | Data visualizations, gauges, real-time charts |
| **Barba.js** | Smooth page transitions (SPA-like experience) |

## Project Structure

```
bapco-dashboard/
├── src/
│   ├── index.html          # Main HTML with all dashboard sections
│   ├── css/
│   │   ├── main.css        # Core styles and theme
│   │   ├── animations.css  # Keyframe animations
│   │   └── dashboard.css   # Dashboard-specific styles
│   ├── js/
│   │   ├── main.js         # Application entry point
│   │   ├── mockData.js     # Rich simulation data
│   │   ├── three-scenes.js # Three.js 3D visualizations
│   │   ├── charts.js       # Chart.js configurations
│   │   └── animations.js   # anime.js & GSAP animations
│   └── assets/
│       └── images/         # Reference images
├── veo-prompts.md          # 50 Veo 3.1 video prompts
└── README.md               # This file
```

## Quick Start

### Option 1: Direct File Opening
Simply open `src/index.html` in a modern web browser (Chrome, Firefox, Edge recommended).

### Option 2: Local Development Server
```bash
# Using Python
cd src
python -m http.server 8080

# Using Node.js
npx serve src

# Using PHP
cd src
php -S localhost:8080
```

Then navigate to `http://localhost:8080` in your browser.

## Dashboard Sections

### 1. Landing Page
- Cinematic video background placeholder (add your Veo-generated videos)
- Animated hero section with particle effects
- Real-time KPI stat cards with sparkline charts
- Scroll-triggered animations

### 2. 3D Facility Overview
- Interactive isometric view of the refinery
- Clickable facility sections with status indicators
- Mouse-controlled camera rotation and zoom
- Real-time activity feed sidebar

### 3. Process Monitoring
- Animated distillation tower visualization
- Temperature, pressure, and flow charts
- Circular gauge displays for key parameters
- Product yield breakdown

### 4. Equipment Health
- 3D ESP pump model with rotating components
- Vibration analysis charts
- Motor current and bearing temperature monitoring
- Predictive maintenance alerts with AI confidence scores
- Asset health table with RUL predictions

### 5. Safety & Emissions
- Personnel geofencing map with live tracking
- Emissions monitoring (NOx, SOx, VOC, CO2)
- Safety KPI rings (Days without LTI, Compliance)
- Active safety alerts panel

### 6. Cybersecurity
- Network topology visualization with data flow animation
- SCADA anomaly detection chart
- Real-time threat feed
- Access audit log table
- Security posture score

## Customization

### Adding B-Roll Videos
1. Generate videos using the prompts in `veo-prompts.md`
2. Place video files in `src/assets/videos/`
3. Update the video source in `index.html`:
```html
<video autoplay muted loop playsinline>
    <source src="assets/videos/your-video.mp4" type="video/mp4">
</video>
```

### Modifying Mock Data
Edit `src/js/mockData.js` to customize:
- KPI values and trends
- Equipment assets and health scores
- Safety alerts and incidents
- Cyber threat data

### Theming
The color scheme uses CSS custom properties in `main.css`:
```css
:root {
    --primary-cyan: #00d4ff;
    --primary-purple: #5b2d8c;
    --bg-dark: #0a0e17;
    --bg-card: #12161f;
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

WebGL support is required for 3D visualizations.

## Performance Notes

- The dashboard uses requestAnimationFrame for smooth 60fps animations
- Three.js scenes are optimized with LOD and frustum culling
- Chart.js updates use 'none' animation mode for real-time data
- Particle systems are limited to prevent performance issues

## Credits

- **TruContext Platform** by Visium Technologies
- **BAPCO** - Bahrain Petroleum Company
- Dashboard design inspired by modern industrial HMI systems

## License

This is a demonstration project for BAPCO. All rights reserved.

---

*Built with passion for Monday's demo!*
