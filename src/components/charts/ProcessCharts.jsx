import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: 'rgba(255, 255, 255, 0.7)',
        padding: 10,
        font: {
          size: 11,
          family: 'Inter'
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)'
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.5)',
        font: {
          size: 10
        }
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)'
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.5)',
        font: {
          size: 10
        }
      }
    }
  }
};

function ProcessCharts({ timeRange, data }) {
  const temperatureConfig = {
    labels: data.temperature.labels,
    datasets: data.temperature.datasets.map(ds => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.color,
      backgroundColor: `${ds.color}20`,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4
    }))
  };

  const pressureConfig = {
    labels: data.pressure.labels,
    datasets: data.pressure.datasets.map(ds => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.color,
      backgroundColor: `${ds.color}20`,
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4
    }))
  };

  const flowConfig = {
    labels: data.flow.labels,
    datasets: data.flow.datasets.map(ds => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.color,
      backgroundColor: `${ds.color}20`,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4
    }))
  };

  const yieldConfig = {
    labels: data.yield.labels,
    datasets: [{
      data: data.yield.data,
      backgroundColor: data.yield.colors,
      borderColor: data.yield.colors.map(c => c),
      borderWidth: 2
    }]
  };

  const yieldOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 15,
          font: {
            size: 11,
            family: 'Inter'
          }
        }
      }
    },
    cutout: '60%'
  };

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <div className="chart-header">
          <h4>Temperature Profile</h4>
          <div className="chart-actions">
            <button className="chart-btn">📊</button>
            <button className="chart-btn">⬇️</button>
          </div>
        </div>
        <div className="chart-container">
          <Line data={temperatureConfig} options={chartDefaults} />
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h4>Pressure Monitoring</h4>
          <div className="chart-actions">
            <button className="chart-btn">📊</button>
            <button className="chart-btn">⬇️</button>
          </div>
        </div>
        <div className="chart-container">
          <Line data={pressureConfig} options={chartDefaults} />
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h4>Flow Rates</h4>
          <div className="chart-actions">
            <button className="chart-btn">📊</button>
            <button className="chart-btn">⬇️</button>
          </div>
        </div>
        <div className="chart-container">
          <Line data={flowConfig} options={chartDefaults} />
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h4>Product Yield Distribution</h4>
          <div className="chart-actions">
            <button className="chart-btn">📊</button>
            <button className="chart-btn">⬇️</button>
          </div>
        </div>
        <div className="chart-container doughnut">
          <Doughnut data={yieldConfig} options={yieldOptions} />
        </div>
      </div>
    </div>
  );
}

export default ProcessCharts;
