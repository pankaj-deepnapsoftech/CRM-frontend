import { CChart } from "@coreui/react-chartjs";

export const PieChart = ({ labels, data, ChartColors }) => {
  
    return (
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
  );
};
