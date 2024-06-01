import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { RootState } from "../redux/store";
import ProfitGraph from "../components/ProfitGraphComponents/ProfitGraph";

const DailyReportScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const products = useSelector((state: RootState) => state.products);
  const bills = useSelector((state: RootState) => state.bills.bills);

  const [report, setReport] = useState({
    profit: 0,
    loss: 0,
    totalSales: 0,
    totalQuantity: 0,
  });

  useEffect(() => {
    calculateDailyReport();
  }, [selectedDate, products, bills]);

  const calculateDailyReport = () => {
    try {
      let profit = 0;
      let loss = 0;
      let totalSales = 0;
      let totalQuantity = 0;
      const todayBills = bills.filter(
        (bill) =>
          format(new Date(bill.date), "yyyy-MM-dd") ===
          format(selectedDate, "yyyy-MM-dd"),
      );

      todayBills.forEach((bill) => {
        bill.items.forEach((item) => {
          const product = products.find((p) => p.id === item.id);
          if (product) {
            const itemProfit =
              (item.unitPrice - product.purchasePrice) * item.quantity;
            profit += itemProfit;
            totalSales += item.total;
            totalQuantity += item.quantity;
            if (itemProfit < 0) {
              loss += Math.abs(itemProfit);
            }
          }
        });
      });

      setReport({ profit, loss, totalSales, totalQuantity });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ProfitGraph />

      <View style={styles.container}>
        <Text style={styles.header}>
          Daily Report for {format(selectedDate, "yyyy-MM-dd")}
        </Text>
        {/* <DatePicker
        style={styles.datePicker}
        date={selectedDate}
        mode="date"
        placeholder="Select date"
        format="YYYY-MM-DD"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        onDateChange={(date) => setSelectedDate(new Date(date))}
      /> */}
        <View style={styles.reportItem}>
          <Text>Total Sales: ${report.totalSales.toFixed(2)}</Text>
        </View>
        <View style={styles.reportItem}>
          <Text>Total Quantity Sold: {report.totalQuantity}</Text>
        </View>
        <View style={styles.reportItem}>
          <Text>Profit: ${report.profit.toFixed(2)}</Text>
        </View>
        <View style={styles.reportItem}>
          <Text>Loss: ${report.loss.toFixed(2)}</Text>
        </View>
        <View style={styles.reportItem}>
          <Text>Total Profit: ${(report.profit - report.loss).toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  reportItem: {
    padding: 8,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 4,
    elevation: 2,
  },
});

export default DailyReportScreen;
