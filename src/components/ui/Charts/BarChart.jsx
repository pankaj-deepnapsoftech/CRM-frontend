import { CChart } from "@coreui/react-chartjs";

export const BarChart = ({ labels, data, ChartColors }) => {
  
    return (
    <CChart
      type="bar"
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
  );
};
