// src/components/MessTrendsChart.js
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
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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
        setTrendsData(result.data || []); // ✅ Store only array part
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  // Generate month-year labels
  const labels = [
    ...new Set(
      trendsData.map((item) => `${item._id.month}-${item._id.year}`)
    )
  ];

  // Get all unique statuses
  const statuses = [
    ...new Set(trendsData.map((item) => item._id.status))
  ];

  // Build datasets dynamically for each status
  const datasets = statuses.map((status) => {
    const statusCounts = labels.map((label) => {
      const [month, year] = label.split("-");
      const match = trendsData.find(
        (item) =>
          item._id.month === parseInt(month) &&
          item._id.year === parseInt(year) &&
          item._id.status.toLowerCase() === status.toLowerCase()
      );
      return match ? match.count : 0;
    });

    // Assign different colors for each status
    const colorMap = {
      Approved: "green",
      Pending: "orange",
      Rejected: "red"
    };
    const borderColor = colorMap[status] || "blue";
    const bgColor = borderColor.replace(")", ", 0.2)").replace("rgb", "rgba");

    return {
      label: status,
      data: statusCounts,
      borderColor,
      backgroundColor: bgColor,
      tension: 0.3
    };
  });

  const data = {
    labels,
    datasets
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Mess Reduction Trends" }
    }
  };

  if (loading)
    return (
      <div className="text-center p-4">
        <Spinner color="primary" />
      </div>
    );

  if (error) return <Alert color="danger">{error}</Alert>;

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Mess Reduction Trends</CardTitle>
        <Line data={data} options={options} />
      </CardBody>
    </Card>
  );
};

export default MessTrendsChart;
