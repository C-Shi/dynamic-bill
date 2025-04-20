import { View, Text, StyleSheet } from "react-native";
import Colors from "@/constant/Color";

type obj = { [key: string]: any };
type tableData = {
  columns: string[];
  cells: { values: string[]; styles?: obj }[];
};

export default function DataTable({
  data,
  headerStyle,
}: {
  data: tableData;
  headerStyle?: obj;
}) {
  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={[styles.row, styles.header, headerStyle]}>
        {data.columns.map((column: string, i: number) => (
          <Text key={i} style={styles.headerText}>
            {column}
          </Text>
        ))}
      </View>

      {/* Data Rows */}
      {data.cells.map((cell: any, i: number) => {
        return (
          <View key={i} style={styles.row}>
            {cell.values.map((v: string, i: number) => (
              <Text key={i} style={[styles.cell, cell.styles?.[i]]}>
                {v}
              </Text>
            ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.Background,
    borderRadius: 8,
    shadowColor: Colors.Main,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomColor: Colors.Card,
    borderBottomWidth: 1,
  },
  header: {
    backgroundColor: Colors.Primary,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    flex: 1,
    color: Colors.Background,
    fontWeight: "bold",
    textAlign: "center",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    color: Colors.Main,
  },
  positive: {
    color: "#2ca02c", // Green
  },
  negative: {
    color: "#d62728", // Red
  },
});
