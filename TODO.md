# BAPCO TruContext Dashboard - TODO

> Last Updated: January 16, 2026

## 🔴 Critical - Before Monday Demo

### 3D Facility Geographic Visualization Enhancement (Plan B - Depth Focus)

> **Goal**: Replace Three.js with Babylon.js for impressive geographic visualization with drill-down into Sitra Refinery

#### Phase 1: Babylon.js Setup & Geographic Globe (4-6 hrs)
- [ ] Install Babylon.js dependencies (`@babylonjs/core`, `@babylonjs/gui`, `@babylonjs/loaders`)
- [ ] Create `BabylonScene.jsx` - Core scene wrapper with React integration
- [ ] Create `bapcoLocations.js` - Geographic coordinates for all BAPCO facilities
- [ ] Create `GlobeView.jsx` - Earth globe focused on Arabian Gulf/Bahrain
- [ ] Implement location markers with labels for all facilities
- [ ] Add smooth camera orbit and zoom constraints
- [ ] Implement click-to-select marker interaction

#### Phase 2: Sitra Refinery Detailed Model & Drill-Down (4-6 hrs)
- [ ] Create `SitraRefinery.jsx` - Hero facility 3D model
- [ ] Model CDU (Crude Distillation Unit) - cylindrical towers with platforms
- [ ] Model RHCU (Resid Hydrocracking Unit) - BMP highlight feature
- [ ] Model FCC (Fluid Catalytic Cracker) - reactor/regenerator pair
- [ ] Model Tank Farm - storage spheres and cylindrical tanks
- [ ] Model Marine Terminal - loading jetty with ship berths
- [ ] Model Control Building - main operations center
- [ ] Implement drill-down camera animation (Globe → Refinery → Building)
- [ ] Add breadcrumb navigation for level traversal

#### Phase 3: Interactive Callouts & Data Binding (3-4 hrs)
- [ ] Create `FacilityCallouts.jsx` - Labeled hotspots like abir.holdings
- [ ] Implement click-to-explore callout interaction
- [ ] Create sidebar panel with facility sections (like campusalbano.se)
- [ ] Bind real-time data from `mockData.js` to 3D elements
- [ ] Add status-based color coding (operational/warning/critical)
- [ ] Synchronize compass indicator with camera rotation

#### Phase 4: Visual Polish & Performance (2-3 hrs)
- [ ] Apply industrial blue/cyan material palette
- [ ] Add animated pipeline flow particles
- [ ] Implement post-processing (bloom, ambient occlusion)
- [ ] Add environment lighting and reflections
- [ ] Optimize LOD for performance
- [ ] Add loading states and transitions
- [ ] Final integration testing with Facility page

#### BAPCO Locations Data (Research Complete)
| Facility | Type | Coordinates | Status |
|----------|------|-------------|--------|
| Sitra Refinery (Main) | Refinery | 26.1567°N, 50.6131°E | Hero Model |
| Awali Township | Admin/Residential | 26.0847°N, 50.5269°E | Marker |
| Bahrain Field (Jebel Dukhan) | Oil Field | 26.0333°N, 50.4833°E | Marker |
| Sitra Marine Terminal | Export Terminal | 26.1500°N, 50.6300°E | Marker |
| Sitra Marketing Terminal | Distribution | 26.1520°N, 50.6180°E | Marker |
| Tank Farm | Storage (14M bbl) | 26.1550°N, 50.6100°E | Part of Hero |

---

### Authentication & Access
- [x] Implement static login page (admin/admin)
- [x] Session persistence (localStorage/sessionStorage)
- [x] Protected route wrapper
- [ ] Add "Forgot Password" placeholder link (non-functional, for UI completeness)

### Core Functionality
- [x] Migrate to React + Vite architecture
- [x] All 6 dashboard pages functional
- [x] Navigation with active state
- [x] Real-time data simulation hooks
- [ ] **Test all page transitions** - verify smooth GSAP animations
- [ ] **Test 3D scenes load correctly** - HeroRefinery, FacilityView, EquipmentViewer, TowerVisualization
- [ ] **Test charts render** - ProcessCharts, EquipmentCharts

### Visual Polish
- [ ] Verify preloader animation timing
- [ ] Check responsive layout on 1920x1080 (demo screen)
- [ ] Ensure all icons display correctly
- [ ] Test dark theme consistency across pages

### Deployment
- [x] Vercel configuration (vercel.json)
- [x] Netlify configuration (netlify.toml)
- [ ] **Deploy to Vercel/Netlify**
- [ ] Test deployed version thoroughly
- [ ] Share deployment URL for stakeholder preview

---

## 🟡 High Priority - Demo Enhancement

### Research-Based Features (Post Core Completion)

#### Feature 1: ESG Compliance Scorecard
- [ ] Add Bahrain Vision 2030 progress tracker widget
- [ ] Animated progress rings for sustainability targets
- [ ] Zero Routine Flaring initiative progress indicator
- [ ] Net Zero commitment timeline visualization

#### Feature 2: AI Anomaly Prediction Timeline
- [ ] Create prediction timeline component
- [ ] Show predicted failures with confidence intervals
- [ ] Animate predictions appearing on timeline
- [ ] Connect to mock predictive data

#### Feature 3: What-If Simulator (Stretch Goal)
- [ ] Interactive 3D equipment selection
- [ ] Failure scenario simulation panel
- [ ] Cascading impact visualization
- [ ] Cost impact calculator

### Visual Enhancements
- [ ] Add more particle effects to Landing page
- [ ] Enhance 3D refinery model detail
- [ ] Add animated data flow lines in Facility view
- [ ] Implement thermal overlay mode in Facility

### Data & Charts
- [ ] Add more detailed emissions breakdown
- [ ] Implement historical trend comparison
- [ ] Add export functionality for charts
- [ ] Create downloadable PDF report generator

---

## 🟢 Post-Demo Refinements

### Architecture Improvements
- [ ] Implement lazy loading for pages
- [ ] Add React.Suspense boundaries
- [ ] Optimize Three.js scene disposal
- [ ] Add error boundaries for graceful failures
- [ ] Implement service worker for offline capability

### Serverless Backend (Future)
- [ ] Create `/api/auth` endpoint for proper authentication
- [ ] Create `/api/data` endpoint for mock data API
- [ ] Create `/api/health` endpoint for monitoring
- [ ] Set up environment-based configuration
- [ ] Add rate limiting and basic security

### Testing
- [ ] Add unit tests for hooks (useAuth, useRealTimeData)
- [ ] Add component tests for critical UI elements
- [ ] Add E2E tests with Playwright for demo flow
- [ ] Performance testing with Lighthouse

### Accessibility
- [ ] Add ARIA labels to all interactive elements
- [ ] Ensure keyboard navigation works
- [ ] Test with screen reader
- [ ] Add focus indicators for keyboard users

### Documentation
- [ ] Add JSDoc comments to all components
- [ ] Create component storybook
- [ ] Document API integration points
- [ ] Create deployment runbook

---

## 🔧 Technical Debt

### Code Quality
- [ ] Refactor large components into smaller units
- [ ] Extract common chart configurations
- [ ] Create shared animation utilities
- [ ] Standardize error handling patterns

### Performance
- [ ] Audit bundle size and optimize
- [ ] Implement virtual scrolling for large lists
- [ ] Optimize Three.js geometry reuse
- [ ] Add image/asset optimization pipeline

### Security (Production)
- [ ] Replace hardcoded credentials with proper auth
- [ ] Implement CSRF protection
- [ ] Add Content Security Policy headers
- [ ] Security audit of dependencies

---

## 📋 Research Findings - Feature Ideas

Based on BAPCO research, these features would add significant value:

### Mature Field Optimization
- **Lateral Well Placement AI** - Visualization showing AI-recommended well positions
- **ESP Performance Dashboard** - Dedicated view for artificial lift monitoring
- **Sand Production Alerts** - Early warning system visualization

### Refinery Modernization (BMP)
- **Capacity Ramp-Up Tracker** - Progress from 267K to 380K BPD
- **New CDU Integration Status** - 225K BPD unit commissioning progress
- **RHCU Performance (65K BPD)** - Resid Hydrocracking specific metrics

### Sustainability (Net Zero by 2060)
- **Flaring Reduction Progress** - Zero Routine Flaring by 2030 tracker
- **Carbon Intensity Metrics** - CO2/barrel production tracking
- **Renewable Energy Integration** - Solar/wind contribution to operations

### Strategic Partnerships
- **TotalEnergies Integration** - Trading network visualization
- **Market Access Dashboard** - Global distribution metrics

---

## 📝 Notes

### Demo Flow Recommendation
1. **Login** → Show credentials, demonstrate session persistence
2. **Landing** → Hero animation, key KPIs, scroll to explore
3. **Facility** → 3D overview, click sections, show activity feed
4. **Process** → Tower visualization, real-time charts, gauges
5. **Equipment** → 3D ESP pump, predictive alerts, asset table
6. **Safety** → Personnel map, emissions dashboard, alerts
7. **Cyber** → Network topology, threat feed, audit log

### Key Talking Points
- "Unified Operations Intelligence" - single pane of glass
- "AI-Driven Analytics" - predictive maintenance, anomaly detection
- "Digital Twins" - 3D visualization of physical assets
- "Bahrain Vision 2030 Aligned" - ESG compliance, sustainability
- "IT/OT Convergence" - cybersecurity for industrial systems

---

## ✅ Completed

- [x] BAPCO research (modernization, ESG, challenges)
- [x] Codebase analysis and architecture review
- [x] "Manus AI" reference search (none found)
- [x] React + Vite project setup
- [x] Authentication context and login page
- [x] All 6 dashboard pages migrated
- [x] Three.js visualization components
- [x] Chart.js components with react-chartjs-2
- [x] Mock data hooks with real-time simulation
- [x] CSS styles migrated and enhanced
- [x] Deployment configurations (Vercel, Netlify)
- [x] README.md updated with comprehensive docs
- [x] TODO.md created (this file)
