import { View, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import FFSafeAreaView from "@/src/components/FFSafeAreaView";
import FFText from "@/src/components/FFText";
import FFView from "@/src/components/FFView";
import IconFeather from "react-native-vector-icons/Feather";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import IconEntypo from "react-native-vector-icons/Entypo";
import FFJBRowItem from "@/src/components/FFJBRowItem";
import FFScreenTopSection from "@/src/components/FFScreenTopSection";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "@/src/utils/axiosConfig";
import { useSelector } from "@/src/store/types";
import { RootState } from "@/src/store/store";
import Spinner from "@/src/components/FFSpinner";

type HistoryTransactionScreenProp = StackNavigationProp<
  RootStackParamList,
  "HistoryTransaction"
>;

interface Transaction {
  id: string;
  type: string;
  amount: number;
  icon: JSX.Element;
  date: string;
  datestamp: string; // Date in YYYY-MM-DD format for grouping
  isPurchase: boolean;
  isReceived: boolean;
}

interface GroupedTransactions {
  [key: string]: Transaction[];
}

const HistoryTransactionScreen = () => {
  const navigation = useNavigation<HistoryTransactionScreenProp>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [groupedTransactions, setGroupedTransactions] =
    useState<GroupedTransactions>({});
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { balance, fWalletId } = useSelector((state: RootState) => state.auth); // Get token from Redux

  useEffect(() => {
    fetchHistoryTransaction();
  }, [fWalletId]);

  // Group transactions by date
  useEffect(() => {
    const grouped = transactions.reduce(
      (groups: GroupedTransactions, transaction) => {
        const dateKey = transaction.datestamp;
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(transaction);
        return groups;
      },
      {}
    );

    setGroupedTransactions(grouped);
  }, [transactions]);

  const fetchHistoryTransaction = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/fwallets/history/${fWalletId}`
      );
      if (response.data.EC === 0) {
        const fetchedTransactions = response.data.data.map(
          (transaction: any) => {
            const isPurchase = transaction.transaction_type === "PURCHASE";
            const date = new Date(transaction.timestamp * 1000);

            // Determine if this is money sent or received
            const isMoneyReceived =
              isPurchase && transaction.destination === fWalletId;
            const isMoneyTransferred =
              isPurchase &&
              transaction.source === "FWALLET" &&
              transaction.fwallet_id === fWalletId;

            // Set transaction type description
            let typeDescription = "Deposit";
            if (isMoneyReceived) {
              typeDescription = "Received Money";
            } else if (isMoneyTransferred) {
              typeDescription = "Transfer Money";
            }

            return {
              id: transaction.id,
              type: typeDescription,
              amount: parseFloat(transaction.amount),
              icon: isPurchase ? (
                isMoneyReceived ? (
                  <IconFeather name="arrow-down-left" size={24} color="green" />
                ) : (
                  <IconFeather name="arrow-up-right" size={24} color="orange" />
                )
              ) : (
                <IconFeather name="dollar-sign" size={24} color="green" />
              ),
              date: date.toLocaleString(),
              datestamp: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
              isPurchase: isPurchase,
              isReceived: isMoneyReceived,
            };
          }
        );
        setTransactions(fetchedTransactions);
      } else {
        console.error("Error fetching transactions:", response.data.EM);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching transactions:", error);
    }
  };

  // Get all dates sorted with most recent first
  const sortedDates = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  // Limit dates if not showing all
  const displayedDates = showAllTransactions
    ? sortedDates
    : sortedDates.slice(0, 3);

  // Format date for display (e.g., "Today", "Yesterday", or "March 15, 2025")
  const formatDateHeader = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const transactionDate = new Date(dateStr);

    if (transactionDate.getTime() === today.getTime()) {
      return "Today";
    } else if (transactionDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return transactionDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  // Toggle section expansion
  const toggleSection = (dateKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [dateKey]: !prev[dateKey],
    }));
  };
  if (isLoading) {
    return <Spinner isVisible isOverlay />;
  }
  return (
    <FFSafeAreaView>
      <FFScreenTopSection title="History Transaction" navigation={navigation} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <FFView
          style={{
            alignItems: "center",
            marginBottom: 24,
            borderRadius: 12,
            paddingTop: 12,
            elevation: 3,
          }}
        >
          <FFText>Your balance</FFText>
          <FFText
            style={{
              fontSize: 32,
              fontWeight: "bold",
              marginVertical: 8,
              color: "#4d9c39",
            }}
          >
            ${balance}
          </FFText>
        </FFView>

        {displayedDates.map((dateKey) => {
          const isExpanded = expandedSections[dateKey] || false;
          const dateTransactions = groupedTransactions[dateKey];
          const displayTransactions = isExpanded
            ? dateTransactions
            : dateTransactions.slice(0, 5);
          const hasMore = dateTransactions.length > 5;

          return (
            <FFView
              key={dateKey}
              style={{
                marginBottom: 24,
                borderRadius: 12,
                elevation: 3,
                padding: 12,
                gap: 12,
              }}
            >
              <FFJBRowItem
                leftItem=""
                rightItem=""
                childLeft={
                  <FFText style={{ fontWeight: "bold", fontSize: 16 }}>
                    {formatDateHeader(dateKey)}
                  </FFText>
                }
                childRight={
                  hasMore &&
                  (isExpanded ? (
                    <IconEntypo name="chevron-up" size={24} />
                  ) : (
                    <IconEntypo name="chevron-right" size={24} />
                  ))
                }
                onPressRight={() => hasMore && toggleSection(dateKey)}
              />
              <View>
                {displayTransactions.map((transaction) => (
                  <FFView
                    key={transaction.id}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {transaction.icon}
                      <View style={{ marginLeft: 12 }}>
                        <FFText style={{ fontSize: 16, fontWeight: "bold" }}>
                          {transaction.type}
                        </FFText>
                        <FFText style={{ fontSize: 14, color: "#888" }}>
                          {transaction.date}
                        </FFText>
                      </View>
                    </View>
                    <FFText
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color:
                          transaction.isPurchase && !transaction.isReceived
                            ? "red"
                            : "green",
                      }}
                    >
                      {transaction.isPurchase && !transaction.isReceived
                        ? `-${transaction.amount}$`
                        : `+${transaction.amount}$`}
                    </FFText>
                  </FFView>
                ))}

                {!isExpanded && hasMore && (
                  <TouchableOpacity
                    style={{ alignItems: "center", paddingVertical: 8 }}
                    onPress={() => toggleSection(dateKey)}
                  >
                    <FFText
                      style={{
                        color: "#63c550",
                        fontWeight: "bold",
                        fontSize: 14,
                      }}
                    >
                      Show {dateTransactions.length - 5} more transactions
                    </FFText>
                  </TouchableOpacity>
                )}
              </View>
            </FFView>
          );
        })}

        {!showAllTransactions && sortedDates.length > 3 && (
          <TouchableOpacity
            style={{
              alignItems: "center",
              paddingVertical: 8,
              backgroundColor: "#f5f5f5",
              borderRadius: 8,
              marginBottom: 24,
            }}
            onPress={() => setShowAllTransactions(true)}
          >
            <FFText
              style={{ color: "#63c550", fontWeight: "bold", fontSize: 14 }}
            >
              Show more days
            </FFText>
          </TouchableOpacity>
        )}
      </ScrollView>
    </FFSafeAreaView>
  );
};

export default HistoryTransactionScreen;
