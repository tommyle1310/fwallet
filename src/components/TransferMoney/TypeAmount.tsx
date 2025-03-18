import { TouchableOpacity, View } from "react-native";
import { Contact } from "./ContactList";
import FFAvatar from "../FFAvatar";
import { IMAGE_URL } from "@/src/utils/constants";
import FFText from "../FFText";
import FFButton from "../FFButton";
import IconIonicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "@/src/store/types";
import { RootState } from "@/src/store/store";
import { useState } from "react";
import FFModal from "../FFModal";
import ModalConfirmPayment, {
  Type_RequestBodyCreateTransaction,
} from "../TopUp/ModalConfirmPayment";
import axiosInstance from "@/src/utils/axiosConfig";
import { saveTokenToAsyncStorage, setBalance } from "@/src/store/authSlice";
import Spinner from "../FFSpinner";

export interface SearchFwalletUserProps {
  handleNumberPress: (num: string) => void;
  handleBackspace: () => void;
  amount: string;
  contact: Contact;
}

export const TypeAmount: React.FC<SearchFwalletUserProps> = ({
  handleNumberPress,
  handleBackspace,
  amount,
  contact,
}) => {
  const {
    email,
    userId,
    balance,
    fWalletId,
    accessToken,
    app_preferences,
    user_type,
  } = useSelector((state: RootState) => state.auth); // Get token from Redux
  const dispatch = useDispatch();
  const [isShowModal, setIsShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState<"ERROR" | "SUCCESSFUL" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isShowConfirmPayment, setIsShowConfirmPayment] = useState(false);
  const [requestBody, setRequestBody] =
    useState<Type_RequestBodyCreateTransaction>({
      user_id: "",
      fwallet_id: "",
      transaction_type: "PURCHASE",
      amount: 0,
      balance_after: 0,
      status: "PENDING",
      source: "FWALLET",
      destination: "",
      destination_type: "FWALLET",
    });
  const handleTransfer = async () => {
    const parsedAmount = parseFloat(amount);

    setIsLoading(true);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setIsShowModal(true);
      return;
    }

    const requestBody = {
      user_id: userId as string,
      fwallet_id: fWalletId as string,
      transaction_type: "PURCHASE" as
        | "DEPOSIT"
        | "WITHDRAW"
        | "PURCHASE"
        | "REFUND",
      amount: parsedAmount,
      receiver_name: contact.name,
      balance_after: balance ? balance - parsedAmount : 0,
      status: "PENDING" as "PENDING" | "CANCELLED" | "FAILED" | "COMPLETED",
      source: "FWALLET" as "MOMO" | "FWALLET",
      destination: contact.fwalletId as string,
      destination_type: "FWALLET" as "TEMPORARY_WALLET_BALANCE" | "FWALLET",
    };
    setRequestBody(requestBody);

    const balance_after = balance ? balance - parsedAmount : 0;
    if (balance_after < 0) {
      setIsShowConfirmPayment(true);
    }
    const response = await axiosInstance.post(
      "/transactions",
      { ...requestBody, receiver_name: undefined },
      {
        validateStatus: () => true,
      }
    );
    console.log("Response for provided requestBody:", response.data);
    if (response.data?.EC === 0) {
      const newBalance = (balance ?? 0) - Number(parsedAmount);
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
    }
    setIsLoading(false);
    console.log("check transfer", requestBody);
  };

  if (isLoading) {
    return <Spinner isVisible isOverlay />;
  }

  return (
    <View className="flex-1">
      <View
        style={{
          alignItems: "center",
          marginBottom: 16,
          paddingTop: 24,
        }}
      >
        <FFAvatar
          size={60}
          avatar={contact.avatar.url ?? IMAGE_URL.DEFAULT_FLASHFOOD_AVATAR}
        />
        <FFText style={{ fontSize: 18, fontWeight: "bold", marginTop: 8 }}>
          {contact.name}
        </FFText>
        <FFText style={{ fontSize: 14, color: "#888" }}>
          {contact.walletDetails}
        </FFText>
      </View>
      <View className="p-4">
        <FFText style={{ fontSize: 32, textAlign: "center", marginBottom: 16 }}>
          ${amount || "0.00"}
        </FFText>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map(
            (num) => (
              <TouchableOpacity
                key={num}
                onPress={() => handleNumberPress(num)}
                style={{
                  width: "30%",
                  margin: "1.5%",
                  padding: 16,
                  backgroundColor: "#fcfcfc",
                  alignItems: "center",
                  borderRadius: 8,
                }}
              >
                <FFText style={{ fontSize: 24 }}>{num}</FFText>
              </TouchableOpacity>
            )
          )}
          <TouchableOpacity
            onPress={handleBackspace}
            style={{
              width: "30%",
              margin: "1.5%",
              padding: 16,
              backgroundColor: "#fcfcfc",
              alignItems: "center",
              borderRadius: 8,
            }}
          >
            <IconIonicons name="backspace" size={24} />
          </TouchableOpacity>
        </View>
        <FFButton
          className="w-full"
          style={{ marginTop: 32 }}
          onPress={() => {
            handleTransfer();
          }}
        >
          Send
        </FFButton>
      </View>

      <FFModal onClose={() => setIsShowModal(false)} visible={isShowModal}>
        <FFText>
          You have to enter a valid amount of money to proceed with this
          payment.
        </FFText>
      </FFModal>
      <FFModal
        visible={modalStatus === "SUCCESSFUL"}
        onClose={() => setModalStatus(null)}
      >
        <FFText>
          {modalStatus === "SUCCESSFUL"
            ? `You have successfully transfered money.`
            : "Something went wrong while transfering money, please contact Customer Support for more details"}
        </FFText>
      </FFModal>
      <ModalConfirmPayment
        requestBody={requestBody}
        isVisible={isShowConfirmPayment}
        onClose={() => setIsShowConfirmPayment(false)}
        value={amount}
      />
    </View>
  );
};
