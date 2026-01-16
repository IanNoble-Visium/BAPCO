import { useEffect, useRef } from 'react';
import {
  Vector3,
  Color3,
  MeshBuilder,
  StandardMaterial,
  Animation
} from '@babylonjs/core';
import { AdvancedDynamicTexture, TextBlock, Rectangle, Control, Line, Ellipse, StackPanel } from '@babylonjs/gui';

const CALLOUT_STYLES = {
  operational: {
    color: '#6bcb77',
    bgColor: 'rgba(107, 203, 119, 0.15)',
    borderColor: '#6bcb77'
  },
  warning: {
    color: '#ffd93d',
    bgColor: 'rgba(255, 217, 61, 0.15)',
    borderColor: '#ffd93d'
  },
  critical: {
    color: '#ff6b6b',
    bgColor: 'rgba(255, 107, 107, 0.15)',
    borderColor: '#ff6b6b'
  }
};

export function createCallout(guiTexture, mesh, data, onClick) {
  const style = CALLOUT_STYLES[data.status] || CALLOUT_STYLES.operational;

  const container = new Rectangle(`callout_${data.id}`);
  container.width = '220px';
  container.height = 'auto';
  container.adaptHeightToChildren = true;
  container.cornerRadius = 12;
  container.color = style.borderColor;
  container.thickness = 2;
  container.background = 'rgba(10, 14, 23, 0.95)';
  container.shadowColor = 'rgba(0, 0, 0, 0.5)';
  container.shadowBlur = 10;
  container.paddingTop = '12px';
  container.paddingBottom = '12px';
  container.paddingLeft = '16px';
  container.paddingRight = '16px';
  container.isPointerBlocker = true;
  container.isVisible = false;
  guiTexture.addControl(container);
  container.linkWithMesh(mesh);
  container.linkOffsetY = -100;

  const stack = new StackPanel();
  stack.isVertical = true;
  container.addControl(stack);

  const headerRow = new StackPanel();
  headerRow.isVertical = false;
  headerRow.height = '24px';
  headerRow.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  stack.addControl(headerRow);

  const statusDot = new Ellipse(`dot_${data.id}`);
  statusDot.width = '10px';
  statusDot.height = '10px';
  statusDot.color = style.color;
  statusDot.background = style.color;
  statusDot.paddingRight = '8px';
  headerRow.addControl(statusDot);

  const title = new TextBlock(`title_${data.id}`);
  title.text = data.shortName || data.name;
  title.color = 'white';
  title.fontSize = 14;
  title.fontWeight = 'bold';
  title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  title.resizeToFit = true;
  headerRow.addControl(title);

  const statusText = new TextBlock(`status_${data.id}`);
  statusText.text = data.status.toUpperCase();
  statusText.color = style.color;
  statusText.fontSize = 10;
  statusText.height = '16px';
  statusText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  statusText.paddingTop = '4px';
  stack.addControl(statusText);

  if (data.capacity) {
    const capacityText = new TextBlock(`capacity_${data.id}`);
    capacityText.text = `Capacity: ${data.capacity}`;
    capacityText.color = '#a0aec0';
    capacityText.fontSize = 11;
    capacityText.height = '18px';
    capacityText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    capacityText.paddingTop = '8px';
    stack.addControl(capacityText);
  }

  if (data.temperature) {
    const tempText = new TextBlock(`temp_${data.id}`);
    tempText.text = `Temperature: ${data.temperature}`;
    tempText.color = '#a0aec0';
    tempText.fontSize = 11;
    tempText.height = '18px';
    tempText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    stack.addControl(tempText);
  }

  if (data.pressure) {
    const pressureText = new TextBlock(`pressure_${data.id}`);
    pressureText.text = `Pressure: ${data.pressure}`;
    pressureText.color = '#a0aec0';
    pressureText.fontSize = 11;
    pressureText.height = '18px';
    pressureText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    stack.addControl(pressureText);
  }

  const exploreBtn = new Rectangle(`btn_${data.id}`);
  exploreBtn.width = '100%';
  exploreBtn.height = '32px';
  exploreBtn.cornerRadius = 6;
  exploreBtn.color = '#00d4ff';
  exploreBtn.thickness = 1;
  exploreBtn.background = 'rgba(0, 212, 255, 0.1)';
  exploreBtn.paddingTop = '12px';
  exploreBtn.isPointerBlocker = true;
  stack.addControl(exploreBtn);

  const btnText = new TextBlock();
  btnText.text = 'Click to Explore →';
  btnText.color = '#00d4ff';
  btnText.fontSize = 11;
  btnText.fontWeight = 'bold';
  exploreBtn.addControl(btnText);

  exploreBtn.onPointerEnterObservable.add(() => {
    exploreBtn.background = 'rgba(0, 212, 255, 0.2)';
  });

  exploreBtn.onPointerOutObservable.add(() => {
    exploreBtn.background = 'rgba(0, 212, 255, 0.1)';
  });

  exploreBtn.onPointerClickObservable.add(() => {
    if (onClick) onClick(data);
  });

  const connector = new Line(`line_${data.id}`);
  connector.lineWidth = 2;
  connector.color = style.borderColor;
  connector.alpha = 0.6;
  connector.dash = [5, 3];
  guiTexture.addControl(connector);
  connector.linkWithMesh(mesh);
  connector.connectedControl = container;
  connector.isVisible = false;

  return {
    container,
    connector,
    show: () => {
      container.isVisible = true;
      connector.isVisible = true;
    },
    hide: () => {
      container.isVisible = false;
      connector.isVisible = false;
    },
    toggle: () => {
      container.isVisible = !container.isVisible;
      connector.isVisible = container.isVisible;
    },
    updateData: (newData) => {
      if (newData.capacity) {
        const cap = container.getDescendants().find(c => c.name === `capacity_${data.id}`);
        if (cap) cap.text = `Capacity: ${newData.capacity}`;
      }
    }
  };
}

export function createFloatingLabel(guiTexture, mesh, text, color = '#00d4ff') {
  const label = new Rectangle();
  label.width = '80px';
  label.height = '24px';
  label.cornerRadius = 4;
  label.color = color;
  label.thickness = 1;
  label.background = 'rgba(10, 14, 23, 0.8)';
  guiTexture.addControl(label);
  label.linkWithMesh(mesh);
  label.linkOffsetY = -40;

  const labelText = new TextBlock();
  labelText.text = text;
  labelText.color = 'white';
  labelText.fontSize = 10;
  label.addControl(labelText);

  return label;
}

export function createMetricBadge(guiTexture, mesh, value, unit, status = 'operational') {
  const style = CALLOUT_STYLES[status];
  
  const badge = new Rectangle();
  badge.width = '60px';
  badge.height = '40px';
  badge.cornerRadius = 6;
  badge.color = style.borderColor;
  badge.thickness = 1;
  badge.background = style.bgColor;
  guiTexture.addControl(badge);
  badge.linkWithMesh(mesh);
  badge.linkOffsetY = -60;
  badge.linkOffsetX = 40;

  const stack = new StackPanel();
  stack.isVertical = true;
  badge.addControl(stack);

  const valueText = new TextBlock();
  valueText.text = value;
  valueText.color = 'white';
  valueText.fontSize = 14;
  valueText.fontWeight = 'bold';
  valueText.height = '20px';
  stack.addControl(valueText);

  const unitText = new TextBlock();
  unitText.text = unit;
  unitText.color = '#a0aec0';
  unitText.fontSize = 9;
  unitText.height = '14px';
  stack.addControl(unitText);

  return badge;
}

export default { createCallout, createFloatingLabel, createMetricBadge };
