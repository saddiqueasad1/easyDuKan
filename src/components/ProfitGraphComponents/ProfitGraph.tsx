import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { useSelector } from "react-redux";
import {
  format,
  subDays,
  eachDayOfInterval,
  subYears,
  eachMonthOfInterval,
} from "date-fns";
import { RootState } from "../../redux/store";

const screenWidth = Dimensions.get("window").width;

const ProfitGraph: React.FC = () => {
  const bills = useSelector((state: RootState) => state.bills.bills);

  const calculateDailyProfit = () => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: today });

    const data = days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      let profit = 0;

      bills.forEach((bill) => {
        if (format(new Date(bill.date), "yyyy-MM-dd") === dayStr) {
          bill.items.forEach((item) => {
            const itemProfit =
              (item.unitPrice - item.unitPrice) * item.purchasePrice;
            profit += itemProfit;
          });
        }
      });

      return { value: profit, label: format(day, "dd MMM") };
    });

    return data;
  };

  const calculateMonthlyProfit = () => {
    const today = new Date();
    const oneYearAgo = subYears(today, 1);
    const months = eachMonthOfInterval({ start: oneYearAgo, end: today });

    const data = months.map((month) => {
      const monthStr = format(month, "yyyy-MM");
      let profit = 0;

      bills.forEach((bill) => {
        if (format(new Date(bill.date), "yyyy-MM") === monthStr) {
          bill.items.forEach((item) => {
            const itemProfit =
              (item.unitPrice - item.unitPrice) * item.purchasePrice;
            profit += itemProfit;
          });
        }
      });

      return { value: profit, label: format(month, "MMM") };
    });

    return data;
  };

  const calculateYearlyProfit = () => {
    const years = [
      new Date().getFullYear() - 2,
      new Date().getFullYear() - 1,
      new Date().getFullYear(),
    ];

    const data = years.map((year) => {
      let profit = 0;

      bills.forEach((bill) => {
        if (new Date(bill.date).getFullYear() === year) {
          bill.items.forEach((item) => {
            const itemProfit =
              (item.unitPrice - item.unitPrice) * item.purchasePrice;
            profit += itemProfit;
          });
        }
      });

      return { value: profit, label: year.toString() };
    });

    return data;
  };

  const dailyProfitData = calculateDailyProfit();
  const monthlyProfitData = calculateMonthlyProfit();
  const yearlyProfitData = calculateYearlyProfit();

  return (
    <View>
      <Text style={styles.chartTitle}>Daily Profit (Last 30 Days)</Text>
      <BarChart
        data={dailyProfitData}
        width={screenWidth - 16}
        height={220}
        spacing={32}
        initialSpacing={10}
        color={"#ffa726"}
        thickness={2}
        hideRules
        hideYAxisText
        yAxisLabelTexts={dailyProfitData.map((item) => item.label)}
        yAxisColor="#ffa726"
        yAxisLabelTextStyle={{ color: "#ffa726" }}
        xAxisLabelTextStyle={{ color: "#ffa726" }}
        maxValue={Math.max(...dailyProfitData.map((item) => item.value)) + 10}
        noOfSections={4}
        yAxisSide="right"
        showScrollIndicator={true}
        scrollToEnd={true}
      />

      <Text style={styles.chartTitle}>Monthly Profit (Last 12 Months)</Text>
      <LineChart
        data={monthlyProfitData}
        width={screenWidth - 16}
        height={220}
        spacing={32}
        initialSpacing={10}
        color={"#ffa726"}
        thickness={2}
        hideRules
        hideYAxisText
        yAxisLabelTexts={monthlyProfitData.map((item) => item.label)}
        yAxisColor="#ffa726"
        yAxisLabelTextStyle={{ color: "#ffa726" }}
        xAxisLabelTextStyle={{ color: "#ffa726" }}
        maxValue={Math.max(...monthlyProfitData.map((item) => item.value)) + 10}
        noOfSections={4}
        yAxisSide="right"
        showScrollIndicator={true}
        scrollToEnd={true}
      />

      <Text style={styles.chartTitle}>Yearly Profit (Last 3 Years)</Text>
      <LineChart
        data={yearlyProfitData}
        width={screenWidth - 16}
        height={220}
        spacing={32}
        initialSpacing={10}
        color={"#ffa726"}
        thickness={2}
        hideRules
        hideYAxisText
        yAxisLabelTexts={yearlyProfitData.map((item) => item.label)}
        yAxisColor="#ffa726"
        yAxisLabelTextStyle={{ color: "#ffa726" }}
        xAxisLabelTextStyle={{ color: "#ffa726" }}
        maxValue={Math.max(...yearlyProfitData.map((item) => item.value)) + 10}
        noOfSections={4}
        yAxisSide="right"
        showScrollIndicator={true}
        scrollToEnd={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
    marginLeft: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default ProfitGraph;
