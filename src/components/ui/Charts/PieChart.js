import React, { useState } from "react";
import { Line, Pie, Bar, Doughnut, Radar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Filler, RadialLinearScale } from "chart.js";

// Register the necessary chart.js components
ChartJS.register(
  Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Filler, RadialLinearScale
);

const DynamicChart = ({ labels, data, ChartColors }) => {
  const [chartType, setChartType] = useState("pie");

  const chartOptions = {
    pie: {
      labels: labels,
      datasets: [
        {
          backgroundColor: ChartColors,
          data: data,
        },
      ],
    },
    line: {
      labels: labels,
      datasets: [
        {
          label: "Line Data",
          backgroundColor: ChartColors[0],
          borderColor: ChartColors[0],
          data: data,
          fill: false,
        },
      ],
    },
    bar: {
      labels: labels,
      datasets: [
        {
          label: "Bar Data",
          backgroundColor: ChartColors,
          data: data,
        },
      ],
    },
    area: {
      labels: labels,
      datasets: [
        {
          label: "Area Data",
          backgroundColor: ChartColors[0] + "33", // Add transparency to the fill color
          borderColor: ChartColors[0],
          data: data,
          fill: true, // Enable filling the area under the line
        },
      ],
    },
    doughnut: {
      labels: labels,
      datasets: [
        {
          backgroundColor: ChartColors,
          data: data,
        },
      ],
    },
   
  };

  const tooltipOptions = {
    position: "nearest", 
    intersect: false, 
    callbacks: {
      label: function (tooltipItem) {
        return `${tooltipItem.label}: ${tooltipItem.raw}`;
      },
    },
  };

  return (
    <div>
      <div className="flex justify-center gap-x-4 mb-4">
        <button
          onClick={() => setChartType("pie")}
          className="text-blue-500 font-semibold hover:text-blue-600"
        >
          Pie Chart
        </button>
        <button
          onClick={() => setChartType("line")}
          className="text-blue-500 font-semibold hover:text-blue-600"
        >
          Line Chart
        </button>
        <button
          onClick={() => setChartType("bar")}
          className="text-blue-500 font-semibold hover:text-blue-600"
        >
          Bar Chart
        </button>
        <button
          onClick={() => setChartType("area")}
          className="text-blue-500 font-semibold hover:text-blue-600"
        >
          Area Chart
        </button>
        <button
          onClick={() => setChartType("doughnut")}
          className="text-blue-500 font-semibold hover:text-blue-600"
        >
          Doughnut Chart
        </button>
        
      </div>

      <div className={`chart-container flex items-center justify-center mx-auto ${chartType === "pie" || chartType === "doughnut" ? "mr-20" : ""}`} style={{ width: "80%", height: "500px", position: "relative" }}>
        {chartType === "pie" && (
          <Pie
            data={chartOptions.pie}
            options={{
              responsive: true,
              plugins: {
                tooltip: tooltipOptions,
                legend: {
                  labels: {
                    color: "#0a2440",
                  },
                },
              },
            }}
          />
        )}

        {chartType === "line" && (
          <Line
            data={chartOptions.line}
            options={{
              responsive: true,
              plugins: {
                tooltip: tooltipOptions,
                legend: {
                  labels: {
                    color: "#0a2440",
                  },
                },
              },
            }}
          />
        )}

        {chartType === "bar" && (
          <Bar
            data={chartOptions.bar}
            options={{
              responsive: true,
              plugins: {
                tooltip: tooltipOptions,
                legend: {
                  labels: {
                    color: "#0a2440",
                  },
                },
              },
            }}
          />
        )}

        {chartType === "area" && (
          <Line
            data={chartOptions.area}
            options={{
              responsive: true,
              plugins: {
                tooltip: tooltipOptions,
                legend: {
                  labels: {
                    color: "#0a2440",
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        )}

        {chartType === "doughnut" && (
          <Doughnut
            data={chartOptions.doughnut}
            options={{
              responsive: true,
              plugins: {
                tooltip: tooltipOptions,
                legend: {
                  labels: {
                    color: "#0a2440",
                  },
                },
              },
            }}
          />
        )}

      
      </div>
    </div>
  );
};

export default DynamicChart;