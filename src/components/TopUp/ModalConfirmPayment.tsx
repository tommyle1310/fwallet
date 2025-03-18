import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import FFText from "../FFText";
import FFButton from "../FFButton";
import { ScrollView } from "react-native-gesture-handler";
import SlideUpModal from "../FFSlideUpModal";
import { data_horizontal_scrollable_list_Card } from "@/src/data/screens/data_topup";
import FFAvatar from "../FFAvatar";
import { SERVICE_FEE } from "@/src/utils/constants";
import axiosInstance from "@/src/utils/axiosConfig";
import { useDispatch, useSelector } from "@/src/store/types";
import { RootState } from "@/src/store/store";
import {
  loadTokenFromAsyncStorage,
  saveTokenToAsyncStorage,
  setBalance,
} from "@/src/store/authSlice";
import FFModal from "../FFModal";
import Spinner from "../FFSpinner";

export type Type_RequestBodyCreateTransaction = {
  user_id: string;
  fwallet_id: string;
  transaction_type: "DEPOSIT" | "WITHDRAW" | "PURCHASE" | "REFUND";
  amount: number;
  balance_after: number;
  status: "PENDING" | "CANCELLED" | "FAILED" | "COMPLETED";
  source: "MOMO" | "FWALLET";
  destination_type: "FWALLET" | "TEMPORARY_WALLET_BALANCE";
  destination: string;
  receiver_name?: string;
};

interface Props_ModalConfirmPayment {
  value: string;
  isVisible: boolean;
  onClose: () => void;
  requestBody?: Type_RequestBodyCreateTransaction;
}

const ModalConfirmPayment = ({
  value,
  requestBody,
  isVisible,
  onClose,
}: Props_ModalConfirmPayment) => {
  const [selectedPaymentMethod, setSelectPaymentMethod] = useState<
    "MOMO" | "VCB" | "OTHERS"
  >("MOMO");
  const [error, setError] = useState("");
  const [modalStatus, setModalStatus] = useState<"ERROR" | "SUCCESSFUL" | null>(
    null
  );
  const [isOpenModalStatus, setIsOpenModalStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    email,
    userId,
    balance,
    fWalletId,
    accessToken,
    app_preferences,
    user_type,
  } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      await dispatch(loadTokenFromAsyncStorage());
      setLoading(false);
    };
    loadToken();
  }, [dispatch]);

  if (loading) {
    return <Spinner isVisible isOverlay />;
  }

  const handleConfirmPayment = async () => {
    setIsLoading(true);

    // Nếu không có requestBody từ props, tạo defaultDepositRequestBody
    if (!requestBody) {
      // Kiểm tra userId và fWalletId trước khi tạo request body
      if (!userId || !fWalletId) {
        setError("User ID or Wallet ID is missing");
        setModalStatus("ERROR");
        setIsOpenModalStatus(true);
        setIsLoading(false);
        return;
      }

      const defaultDepositRequestBody: Type_RequestBodyCreateTransaction = {
        user_id: userId,
        fwallet_id: fWalletId,
        transaction_type: "DEPOSIT",
        amount: Number(value), // Chuyển value thành number
        balance_after: (balance ?? 0) + Number(value),
        status: "PENDING",
        source: selectedPaymentMethod === "MOMO" ? "MOMO" : "FWALLET", // Dựa vào phương thức chọn
        destination_type: "FWALLET",
        destination: fWalletId,
      };

      try {
        const response = await axiosInstance.post(
          "/transactions",
          defaultDepositRequestBody,
          {
            validateStatus: () => true,
          }
        );
        console.log("Response for default deposit:", response.data);

        if (response.data?.EC === 0) {
          const newBalance = (balance ?? 0) + Number(value);
          dispatch(setBalance(newBalance));
          dispatch(
            saveTokenToAsyncStorage({
              accessToken: accessToken ?? "",
              app_preferences: app_preferences ?? {},
              balance: newBalance,
              email: email ?? "",
              fWalletId: fWalletId,
              userId: userId,
              user_type: user_type ?? [],
            })
          );
          setModalStatus("SUCCESSFUL");
          setIsOpenModalStatus(true);
        } else {
          setError(response.data?.EM || "Transaction failed");
          setModalStatus("ERROR");
          setIsOpenModalStatus(true);
        }
      } catch (error: any) {
        setError(error.message || "Network error or request failed");
        setModalStatus("ERROR");
        setIsOpenModalStatus(true);
      } finally {
        setIsLoading(false);
      }
      return; // Thoát sau khi xử lý defaultDepositRequestBody
    }

    // Xử lý khi có requestBody từ props
    console.log("Request body from props:", requestBody);
    try {
      const response = await axiosInstance.post(
        "/transactions",
        { ...requestBody, receiver_name: undefined },
        {
          validateStatus: () => true,
        }
      );
      console.log("Response for provided requestBody:", response.data);

      if (response.data?.EC === 0) {
        const newBalance =
          requestBody.transaction_type === "DEPOSIT"
            ? (balance ?? 0) + Number(value)
            : (balance ?? 0) - Number(value);
        dispatch(setBalance(newBalance));
        dispatch(
          saveTokenToAsyncStorage({
            accessToken: accessToken ?? "",
            app_preferences: app_preferences ?? {},
            balance: newBalance,
            email: email ?? "",
            fWalletId: fWalletId ?? "",
            userId: userId ?? "",
            user_type: user_type ?? [],
          })
        );
        setModalStatus("SUCCESSFUL");
        setIsOpenModalStatus(true);
      } else {
        setError(response.data?.EM || "Transaction failed");
        setModalStatus("ERROR");
        setIsOpenModalStatus(true);
      }
    } catch (error: any) {
      setError(error.message || "Network error or request failed");
      setModalStatus("ERROR");
      setIsOpenModalStatus(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner isVisible isOverlay />;
  }

  return (
    <>
      <SlideUpModal isVisible={isVisible} onClose={onClose}>
        <FFText style={{ fontWeight: "bold", marginBottom: 10 }}>
          Account/Card
        </FFText>
        <View>
          <ScrollView
            horizontal
            contentContainerStyle={{
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
            }}
            style={{ paddingHorizontal: 10 }}
          >
            {data_horizontal_scrollable_list_Card.map((item, index) => (
              <TouchableOpacity
                onPress={() => setSelectPaymentMethod(item.name)}
                key={index}
                style={[
                  {
                    padding: 8,
                    borderRadius: 16,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderWidth: 1,
                    height: "auto",
                  },
                  {
                    borderColor:
                      selectedPaymentMethod === item.name ? "#5BCD33" : "#ccc",
                  },
                ]}
              >
                <View
                  className="items-center flex-row gap-2 justify-between"
                  style={{ height: "auto" }}
                >
                  <FFAvatar size={36} avatar={item.avatar} />
                  <View className="gap-1 flex-col">
                    <FFText
                      style={{ color: "#2E890E", textTransform: "capitalize" }}
                    >
                      {item.name}
                    </FFText>
                    <FFText style={{ fontSize: 12 }}>
                      {item.serviceFee === 0 ? "Free" : item.serviceFee}
                    </FFText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="border border-gray-300 rounded-lg p-4 gap-4 mt-6">
          <View className="justify-between flex-row items-center">
            <FFText style={{ color: "#bbb", fontWeight: 400 }}>Service</FFText>
            <FFText
              style={{
                width: "80%",
                textAlign: "right",
              }}
            >
              {requestBody
                ? `Transfer money to ${requestBody?.receiver_name}`
                : "Deposit to FWallet"}
            </FFText>
          </View>
          <View className="justify-between flex-row items-center">
            <FFText style={{ color: "#bbb", fontWeight: 400 }}>Source</FFText>
            <FFText style={{ textTransform: "capitalize" }}>
              {selectedPaymentMethod}
            </FFText>
          </View>
          <View className="justify-between flex-row items-center">
            <FFText style={{ color: "#bbb", fontWeight: 400 }}>Amount</FFText>
            <FFText>${value}</FFText>
          </View>
          <View
            style={{ height: 1, backgroundColor: "#ddd", marginTop: 10 }}
          ></View>
          <View className="justify-between flex-row items-center">
            <FFText style={{ color: "#bbb", fontWeight: 400 }}>
              Service Fee
            </FFText>
            <FFText>{SERVICE_FEE === 0 ? "Free" : `${SERVICE_FEE}%`}</FFText>
          </View>
        </View>
        <View style={{ flex: 1, marginTop: 40 }} className="gap-2 self-end">
          <View className="justify-between flex-row items-center">
            <FFText style={{ color: "#bbb", fontWeight: 400, fontSize: 20 }}>
              Total
            </FFText>
            <FFText style={{ fontSize: 20 }}>
              ${parseFloat(value) - parseFloat(value) * SERVICE_FEE}
            </FFText>
          </View>
          <FFButton onPress={handleConfirmPayment} isLinear className="w-full">
            Confirm
          </FFButton>
        </View>

        <FFModal
          visible={isOpenModalStatus}
          onClose={() => setIsOpenModalStatus(false)}
        >
          <FFText>
            {modalStatus === "ERROR" ? error : "Your payment is succeeded! 😁"}
          </FFText>
        </FFModal>
      </SlideUpModal>
    </>
  );
};

export default ModalConfirmPayment;
