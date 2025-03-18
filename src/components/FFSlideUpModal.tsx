import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  withSpring,
  runOnJS,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import { useTheme } from "@/src/hooks/useTheme";
import IconIonicon from "react-native-vector-icons/Ionicons";

interface SlideUpModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SlideUpModal: React.FC<SlideUpModalProps> = ({
  isVisible,
  onClose,
  children,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const translateY = useSharedValue(screenHeight);
  const modalHeight = useSharedValue(screenHeight * 0.8); // Khởi tạo 80% màn hình

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        const keyboardHeight = e.endCoordinates.height;
        const availableHeight = screenHeight - keyboardHeight;
        // Đảm bảo modal chiếm ít nhất 60% và không vượt quá 90% màn hình
        const newHeight = Math.max(
          screenHeight * 0.6, // Tối thiểu 60%
          Math.min(screenHeight * 0.9, availableHeight * 0.9) // Tối đa 90% hoặc 90% khoảng trống
        );
        modalHeight.value = withTiming(newHeight, {
          duration: Platform.OS === "ios" ? e.duration : 250,
          easing: Easing.out(Easing.ease),
        });
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      (e) => {
        modalHeight.value = withTiming(screenHeight * 0.8, {
          duration: Platform.OS === "ios" ? e.duration : 250,
          easing: Easing.out(Easing.ease),
        });
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [screenHeight]);

  useEffect(() => {
    translateY.value = withTiming(isVisible ? 0 : screenHeight, {
      duration: 300,
      easing: isVisible ? Easing.out(Easing.ease) : Easing.in(Easing.ease),
    });
  }, [isVisible, screenHeight]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_) => {},
    onActive: (event) => {
      translateY.value = Math.max(0, event.translationY);
    },
    onEnd: (event) => {
      if (event.translationY > 100) {
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, { damping: 30, stiffness: 200 });
      }
    },
  });

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    height: modalHeight.value,
  }));

  if (!isVisible) return null;

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      <Animated.View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={styles.dragHandle}>
              <View style={styles.handleBar} />
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <IconIonicon name="close" color="white" size={16} />
              </TouchableOpacity>
            </Animated.View>
          </PanGestureHandler>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
            bounces={true}
            showsVerticalScrollIndicator={true}
          >
            <View
              style={[
                styles.contentContainer,
                { paddingBottom: Platform.OS === "ios" ? 34 : 24 },
              ]}
            >
              {children}
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // Phủ toàn màn hình
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "flex-end", // Modal từ dưới lên
    zIndex: 1000,
  },
  modalContainer: {
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    shadowColor: "rgba(0, 255, 0, 0.25)",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 20,
  },
  dragHandle: {
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Tối hơn cho dễ thấy
    borderRadius: 2,
  },
  closeButton: {
    position: "absolute",
    right: 0,
    backgroundColor: "red",
    padding: 4,
    borderRadius: 9999,
  },
  contentContainer: {
    flexGrow: 1, // Đảm bảo nội dung mở rộng đúng cách trong ScrollView
  },
});

export default SlideUpModal;
