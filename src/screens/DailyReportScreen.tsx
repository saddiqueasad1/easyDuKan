// screens/DailyReportScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import { useSelector } from "react-redux";
// import DateTimePicker from "@react-native-community/datetimepicker";
import { RootState } from "../redux/store";

const DailyReportScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const bills = useSelector((state: RootState) => state.bills.bills);
  const products = useSelector((state: RootState) => state.products);

  const onDateChange = (event: Event, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const filteredItems = bills.filter(
    (item) => new Date(item.date).toDateString() === selectedDate.toDateString()
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Report</Text>
      <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
      {/* {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )} */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.name}</Text>
            <Text>
              {item.quantity} x ${item.unitPrice}
            </Text>
            <Text>Total: ${item.total}</Text>
          </View>
        )}
      />
      <View style={styles.summaryContainer}>
        <Text>
          Total Quantity:{" "}
          {filteredItems.reduce((sum, item) => sum + item.quantity, 0)}
        </Text>
        <Text>
          Total Amount: $
          {filteredItems.reduce((sum, item) => sum + item.total, 0)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  summaryContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});

export default DailyReportScreen;
