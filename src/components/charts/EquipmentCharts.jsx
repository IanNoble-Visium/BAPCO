import { Line } from 'react-chartjs-2';

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 0 },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: 'rgba(255, 255, 255, 0.7)',
        padding: 10,
        font: { size: 11, family: 'Inter' }
      }
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 10 } }
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 10 } }
    }
  }
};

function EquipmentCharts({ data }) {
  const vibrationConfig = {
    labels: data.vibrationData.labels,
    datasets: [
      {
        label: 'Normal Baseline',
        data: data.vibrationData.normal,
        borderColor: '#6bcb77',
        backgroundColor: 'rgba(107, 203, 119, 0.1)',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        pointRadius: 0
      },
      {
        label: 'Current',
        data: data.vibrationData.current,
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0
      },
      {
        label: 'Threshold',
        data: data.vibrationData.threshold,
        borderColor: '#ffd93d',
        borderWidth: 2,
        borderDash: [10, 5],
        fill: false,
        pointRadius: 0
      }
    ]
  };

  const motorConfig = {
    labels: data.motorData.labels,
    datasets: [
      {
        label: 'Phase A',
        data: data.motorData.phaseA,
        borderColor: '#ff6b6b',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 0
      },
      {
        label: 'Phase B',
        data: data.motorData.phaseB,
        borderColor: '#ffd93d',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 0
      },
      {
        label: 'Phase C',
        data: data.motorData.phaseC,
        borderColor: '#4d96ff',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 0
      }
    ]
  };

  const bearingConfig = {
    labels: data.bearingData.labels,
    datasets: [
      {
        label: 'Drive End',
        data: data.bearingData.de,
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0
      },
      {
        label: 'Non-Drive End',
        data: data.bearingData.nde,
        borderColor: '#4d96ff',
        backgroundColor: 'rgba(77, 150, 255, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0
      },
      {
        label: 'Threshold',
        data: data.bearingData.threshold,
        borderColor: '#ffd93d',
        borderWidth: 2,
        borderDash: [10, 5],
        fill: false,
        pointRadius: 0
      }
    ]
  };

  const rulConfig = {
    labels: data.rulData.labels,
    datasets: [
      {
        label: 'Predicted RUL',
        data: data.rulData.predicted,
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Actual',
        data: data.rulData.actual,
        borderColor: '#6bcb77',
        borderWidth: 2,
        fill: false,
        tension: 0,
        pointRadius: 4,
        pointBackgroundColor: '#6bcb77'
      }
    ]
  };

  return (
    <div className="health-charts">
      <div className="health-chart-card">
        <h4>Vibration Analysis</h4>
        <div className="chart-container">
          <Line data={vibrationConfig} options={chartOptions} />
        </div>
      </div>
      <div className="health-chart-card">
        <h4>Motor Current Signature</h4>
        <div className="chart-container">
          <Line data={motorConfig} options={chartOptions} />
        </div>
      </div>
      <div className="health-chart-card">
        <h4>Bearing Temperature</h4>
        <div className="chart-container">
          <Line data={bearingConfig} options={chartOptions} />
        </div>
      </div>
      <div className="health-chart-card">
        <h4>Remaining Useful Life</h4>
        <div className="chart-container">
          <Line data={rulConfig} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default EquipmentCharts;
