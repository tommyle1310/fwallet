import React, { useEffect, useState } from "react";
import FFSafeAreaView from "@/src/components/FFSafeAreaView";
import { useNavigation } from "@react-navigation/native";
import FFAuthForm from "./FFAuthForm";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/src/navigation/AppNavigator";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "@/src/store/types";
import {
  loadTokenFromAsyncStorage,
  saveTokenToAsyncStorage,
  setAuthState,
} from "@/src/store/authSlice";
import axiosInstance from "@/src/utils/axiosConfig";
import { RootState } from "@/src/store/store";
import { decodeJWT } from "@/src/utils/functions";
import Spinner from "@/src/components/FFSpinner";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const handleLoginSubmit = async (email: string, password: string) => {
    const requestBody = {
      email: email,
      password: password,
    };

    try {
      setLoading(true);
      console.log("Loading state set to:", true);
      console.log("Requesting to:", axiosInstance.defaults.baseURL); // Debug URL

      const response = await axiosInstance.post(
        "/auth/login-fwallet",
        requestBody,
        {
          validateStatus: () => true, // Không reject trên non-2xx
        }
      );

      console.log("API Response:", response.data);

      const { EC, EM } = response.data;

      if (EC === 0) {
        const decoded = decodeJWT(response.data.data.access_token);
        console.log("Decoded JWT:", decoded);

        const {
          app_preferences,
          balance,
          email,
          user_id,
          user_type,
          fWallet_id,
        } = decoded;

        await dispatch(
          saveTokenToAsyncStorage({
            accessToken: response.data.data.access_token,
            app_preferences: app_preferences,
            balance: balance,
            email: email,
            fWalletId: fWallet_id,
            userId: user_id,
            user_type: user_type,
          })
        );

        navigation.navigate("Home");
      } else {
        console.error("Login Error:", {
          errorCode: EC,
          errorMessage: EM,
          fullResponse: response.data,
        });
        setError(EM || "Login failed");
      }
    } catch (error: any) {
      console.error("Login failed - Full error:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
        baseURL: axiosInstance.defaults.baseURL, // Debug baseURL
      });

      // Xử lý lỗi mạng cụ thể
      if (error.message === "Network Error") {
        setError(
          "Cannot connect to server. Check your network or server status."
        );
      } else {
        setError(error.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
      console.log("Loading state set to:", false);
    }
  };

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (isAuthenticated) {
    console.log("User is authenticated with token:", accessToken);
  } else {
    console.log("User is not authenticated");
  }

  // Fix: Sửa cú pháp render Spinner
  if (loading) {
    return <Spinner isVisible isOverlay />; // Trả về component thay vì JSX fragment
  }

  return (
    <FFSafeAreaView>
      <LinearGradient
        colors={["#8fa3d9", "#b5b3a1", "#b5e1a1"]}
        start={[1, 0]}
        end={[0, 1]}
        className="flex-1 items-center justify-center"
      >
        <FFAuthForm
          error={error}
          isSignUp={false}
          onSubmit={handleLoginSubmit}
          navigation={navigation}
        />
      </LinearGradient>
    </FFSafeAreaView>
  );
};

export default Login;
