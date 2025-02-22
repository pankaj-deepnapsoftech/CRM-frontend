import React, { useState } from "react";
import { CChart } from "@coreui/react-chartjs";

export const DynamicChart = ({ labels, data, ChartColors }) => {
  const [chartType, setChartType] = useState("pie"); 

  const chartOptions = {
    pie: {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            backgroundColor: ChartColors,
            data: data,
          },
        ],
      },
    },
    line: {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Line Data", 
            backgroundColor: ChartColors,
            borderColor: ChartColors[0],
            data: data,
            fill: false, 
          },
        ],
      },
    },
    bar: {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Bar Data", 
            backgroundColor: ChartColors,
            data: data,
          },
        ],
      },
    },
    area: {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Area Data", 
            backgroundColor: ChartColors[3],
            data: data,
            fill: true,
          },
        ],
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
      </div>

   
      <div
        className="chart-container mx-auto"
        style={{ width: "60%", height: "250px" }}
      >
        {chartType === "pie" && (
          <CChart
            type={chartOptions.pie.type}
            data={chartOptions.pie.data}
            options={{
              plugins: {
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
          <CChart
            type={chartOptions.line.type}
            data={chartOptions.line.data}
            options={{
              plugins: {
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
          <CChart
            type={chartOptions.bar.type}
            data={chartOptions.bar.data}
            options={{
              plugins: {
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
          <CChart
            type={chartOptions.area.type}
            data={chartOptions.area.data}
            options={{
              plugins: {
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

export const PieChart = ({ labels, data, ChartColors }) => {
  return (
    <div className="chart-container h-48 w-48">
      <CChart
        type="pie"
        data={{
          labels: labels,
          datasets: [
            {
              backgroundColor: ChartColors,
              data: data,
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              labels: {
                color: "#0a2440",
              },
            },
          },
        }}
      />
    </div>
  );
};
