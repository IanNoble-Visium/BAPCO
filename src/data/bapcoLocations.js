/**
 * BAPCO Geographic Locations Data
 * Coordinates and metadata for all BAPCO facilities in Bahrain
 */

export const BAHRAIN_CENTER = {
  lat: 26.0667,
  lng: 50.5577,
  name: 'Kingdom of Bahrain'
};

export const GLOBE_CONFIG = {
  radius: 10,
  segments: 64,
  initialZoom: 2.5,
  minZoom: 1.5,
  maxZoom: 8,
  rotationSpeed: 0.001
};

export const bapcoLocations = [
  {
    id: 'sitra-refinery',
    name: 'Sitra Refinery',
    shortName: 'Main Refinery',
    type: 'refinery',
    description: 'BAPCO\'s flagship 267,000 BPD refinery (expanding to 380,000 BPD)',
    lat: 26.1567,
    lng: 50.6131,
    capacity: '267,000 BPD',
    status: 'operational',
    priority: 'hero',
    drillDown: true,
    units: [
      { id: 'cdu-1', name: 'CDU - Crude Distillation', capacity: '225,000 BPD' },
      { id: 'rhcu-1', name: 'RHCU - Hydrocracking', capacity: '65,000 BPD' },
      { id: 'fcc-1', name: 'FCC - Fluid Catalytic Cracker', capacity: '45,000 BPD' },
      { id: 'hds-1', name: 'HDS - Hydrodesulfurization', capacity: '80,000 BPD' }
    ]
  },
  {
    id: 'awali-township',
    name: 'Awali Township',
    shortName: 'Awali HQ',
    type: 'administrative',
    description: 'BAPCO headquarters and residential township established in 1930s',
    lat: 26.0847,
    lng: 50.5269,
    status: 'operational',
    priority: 'secondary',
    drillDown: false
  },
  {
    id: 'bahrain-field',
    name: 'Bahrain Field (Jebel Dukhan)',
    shortName: 'Awali Oil Field',
    type: 'oilfield',
    description: 'First oil discovered May 31, 1932 - Historic Awali Field',
    lat: 26.0333,
    lng: 50.4833,
    production: '~45,000 BPD',
    status: 'operational',
    priority: 'secondary',
    drillDown: false
  },
  {
    id: 'sitra-marine-terminal',
    name: 'Sitra Marine Terminal',
    shortName: 'Marine Terminal',
    type: 'terminal',
    description: 'Crude oil and petroleum products export terminal',
    lat: 26.1500,
    lng: 50.6300,
    capacity: 'Export capacity for refined products',
    status: 'operational',
    priority: 'secondary',
    drillDown: false
  },
  {
    id: 'sitra-marketing-terminal',
    name: 'Sitra Marketing Terminal',
    shortName: 'Marketing Terminal',
    type: 'distribution',
    description: 'Domestic fuel distribution and marketing operations',
    lat: 26.1520,
    lng: 50.6180,
    status: 'operational',
    priority: 'secondary',
    drillDown: false
  },
  {
    id: 'tank-farm',
    name: 'Sitra Tank Farm',
    shortName: 'Tank Farm',
    type: 'storage',
    description: 'Storage facilities for 14 million barrels of crude and products',
    lat: 26.1550,
    lng: 50.6100,
    capacity: '14,000,000 BBL',
    status: 'operational',
    priority: 'secondary',
    drillDown: false
  },
  {
    id: 'saudi-pipeline',
    name: 'AB-4 Pipeline (Saudi Aramco)',
    shortName: 'Aramco Pipeline',
    type: 'infrastructure',
    description: '112km pipeline from Abqaiq delivering ~350,000 BPD from Saudi Arabia',
    lat: 26.12,
    lng: 50.55,
    capacity: '350,000 BPD',
    status: 'operational',
    priority: 'tertiary',
    drillDown: false
  }
];

export const locationTypeColors = {
  refinery: '#00d4ff',
  administrative: '#6bcb77',
  oilfield: '#ffd93d',
  terminal: '#ff6b6b',
  distribution: '#9d4edd',
  storage: '#4d96ff',
  infrastructure: '#ff9f43'
};

export const locationTypeIcons = {
  refinery: '⚙️',
  administrative: '🏢',
  oilfield: '🛢️',
  terminal: '🚢',
  distribution: '⛽',
  storage: '🏗️',
  infrastructure: '🔗'
};

export function latLngToVector3(lat, lng, radius = 10) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return { x, y, z };
}

export function getLocationById(id) {
  return bapcoLocations.find(loc => loc.id === id);
}

export function getLocationsByType(type) {
  return bapcoLocations.filter(loc => loc.type === type);
}

export function getHeroLocation() {
  return bapcoLocations.find(loc => loc.priority === 'hero');
}

export default bapcoLocations;
