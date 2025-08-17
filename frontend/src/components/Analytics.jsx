import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Spinner, Alert } from "reactstrap";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MessTrendsChart = () => {
  const [trendsData, setTrendsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await fetch("http://localhost:8080/analytic/mess-trends");
        if (!res.ok) throw new Error("Failed to fetch trends");
        const result = await res.json();
        setTrendsData(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  // Generate month-year labels with proper formatting
  const labels = [
    ...new Set(
      trendsData.map((item) => {
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return `${monthNames[item._id.month - 1]} ${item._id.year}`;
      })
    )
  ].sort();

  // Get all unique statuses
  const statuses = [
    ...new Set(trendsData.map((item) => item._id.status))
  ];

  // Enhanced color scheme with gradients
  const colorScheme = {
    Approved: {
      primary: '#10b981',
      gradient: 'rgba(16, 185, 129, 0.1)',
      shadow: 'rgba(16, 185, 129, 0.3)'
    },
    Pending: {
      primary: '#f59e0b',
      gradient: 'rgba(245, 158, 11, 0.1)',
      shadow: 'rgba(245, 158, 11, 0.3)'
    },
    Rejected: {
      primary: '#ef4444',
      gradient: 'rgba(239, 68, 68, 0.1)',
      shadow: 'rgba(239, 68, 68, 0.3)'
    }
  };

  // Build enhanced datasets
  const datasets = statuses.map((status, index) => {
    const statusCounts = labels.map((label) => {
      const [monthName, year] = label.split(" ");
      const monthIndex = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ].indexOf(monthName) + 1;
      
      const match = trendsData.find(
        (item) =>
          item._id.month === monthIndex &&
          item._id.year === parseInt(year) &&
          item._id.status.toLowerCase() === status.toLowerCase()
      );
      return match ? match.count : 0;
    });

    const colors = colorScheme[status] || {
      primary: '#6366f1',
      gradient: 'rgba(99, 102, 241, 0.1)',
      shadow: 'rgba(99, 102, 241, 0.3)'
    };

    return {
      label: status,
      data: statusCounts,
      borderColor: colors.primary,
      backgroundColor: colors.gradient,
      borderWidth: 3,
      pointBackgroundColor: colors.primary,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: colors.primary,
      pointHoverBorderColor: '#ffffff',
      pointHoverBorderWidth: 3,
      tension: 0.4,
      fill: true,
      shadowOffsetX: 0,
      shadowOffsetY: 4,
      shadowBlur: 10,
      shadowColor: colors.shadow
    };
  });

  const data = {
    labels,
    datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 13,
            weight: 'bold'
          },
          color: '#374151'
        }
      },
      title: {
        display: true,
        text: "📈 Mess Reduction Trends Analytics",
        font: {
          size: 18,
          weight: 'bold'
        },
        color: '#1f2937',
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        cornerRadius: 8,
        displayColors: true,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} applications`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            weight: '500'
          }
        },
        title: {
          display: true,
          text: 'Time Period',
          color: '#374151',
          font: {
            size: 13,
            weight: 'bold'
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            weight: '500'
          },
          stepSize: 1
        },
        title: {
          display: true,
          text: 'Number of Applications',
          color: '#374151',
          font: {
            size: 13,
            weight: 'bold'
          }
        }
      }
    },
    elements: {
      line: {
        borderJoinStyle: 'round',
        borderCapStyle: 'round'
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  // Calculate summary stats
  const totalApplications = trendsData.reduce((sum, item) => sum + item.count, 0);
  const approvedCount = trendsData
    .filter(item => item._id.status.toLowerCase() === 'approved')
    .reduce((sum, item) => sum + item.count, 0);
  const approvalRate = totalApplications ? ((approvedCount / totalApplications) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="text-center">
          <Spinner 
            color="primary" 
            style={{ 
              width: '3rem', 
              height: '3rem',
              borderWidth: '4px'
            }} 
          />
          <p className="mt-3 text-muted">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="danger" className="border-0 shadow-sm">
        <h6 className="alert-heading">⚠️ Error Loading Data</h6>
        {error}
      </Alert>
    );
  }

  return (
    <div className="mb-4">
      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <Card className="border-0 shadow-sm h-100">
            <CardBody className="text-center">
              <div className="text-primary mb-2">
                <i className="fas fa-chart-line fa-2x"></i>
              </div>
              <h3 className="text-primary mb-1">{totalApplications}</h3>
              <p className="text-muted mb-0">Total Applications</p>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="border-0 shadow-sm h-100">
            <CardBody className="text-center">
              <div className="text-success mb-2">
                <i className="fas fa-check-circle fa-2x"></i>
              </div>
              <h3 className="text-success mb-1">{approvedCount}</h3>
              <p className="text-muted mb-0">Approved</p>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="border-0 shadow-sm h-100">
            <CardBody className="text-center">
              <div className="text-info mb-2">
                <i className="fas fa-percentage fa-2x"></i>
              </div>
              <h3 className="text-info mb-1">{approvalRate}%</h3>
              <p className="text-muted mb-0">Approval Rate</p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Main Chart */}
      <Card className="border-0 shadow-sm">
        <CardBody>
          <div style={{ position: 'relative', height: '400px' }}>
            <Line data={data} options={options} />
          </div>
          
          {/* Chart Footer */}
          <div className="mt-4 pt-3 border-top">
            <div className="row text-center">
              {statuses.map((status) => {
                const count = trendsData
                  .filter(item => item._id.status.toLowerCase() === status.toLowerCase())
                  .reduce((sum, item) => sum + item.count, 0);
                const colors = colorScheme[status] || { primary: '#6366f1' };
                
                return (
                  <div key={status} className="col">
                    <div 
                      className="badge badge-pill px-3 py-2"
                      style={{ 
                        backgroundColor: colors.primary + '20',
                        color: colors.primary,
                        fontSize: '0.85rem'
                      }}
                    >
                      {status}: {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default MessTrendsChart;