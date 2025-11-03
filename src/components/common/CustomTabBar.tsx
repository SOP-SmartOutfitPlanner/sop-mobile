import React, { useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text,
  Pressable,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import GradientIcon from "../gradient/GradientIcon";
import { AddActionSheet } from "../actions/AddActionSheet";

// Animated Tab Component
const AnimatedTab = ({
  isFocused,
  onPress,
  iconName,
  label,
}: {
  isFocused: boolean;
  onPress: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(isFocused ? 1 : 0.6);

  React.useEffect(() => {
    scale.value = withSpring(isFocused ? 1.1 : 1, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(isFocused ? 1 : 0.6, { duration: 200 });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.9);
      }}
      onPressOut={() => {
        scale.value = withSpring(isFocused ? 1.1 : 1);
      }}
      style={styles.tab}
    >
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        <GradientIcon name={iconName} size={24} focused={isFocused} />
        {label && (
          <Text
            style={[
              styles.label,
              {
                color: isFocused ? "#30cfd0" : "#8e8e93",
                fontWeight: isFocused ? "700" : "600",
              },
            ]}
          >
            {label}
          </Text>
        )}
        {isFocused && <View style={styles.activeIndicator} />}
      </Animated.View>
    </Pressable>
  );
};

// Animated Middle Button Component
const AnimatedMiddleButton = ({ onPress }: { onPress: () => void }) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.85);
    rotation.value = withSpring(90);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    rotation.value = withSpring(0);
  };

  return (
    <View style={styles.middleButtonContainer}>
      {/* Ripple effect ring - behind button */}
      <View style={styles.middleButtonRing} pointerEvents="none" />

      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressableArea}
      >
        <Animated.View style={animatedStyle}>
          <LinearGradient
            colors={["#30cfd0", "#330867"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.middleButton}
          >
            <View style={styles.middleButtonInner}>
              <Ionicons name="add" size={32} color="#fff" />
            </View>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </View>
  );
};

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const addSheetRef = useRef<BottomSheetModal>(null);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            // Nút giữa (index 2 trong 5 tabs)
            const isMiddleButton = index === 2;

            const onPress = () => {
              // Nếu là nút giữa, mở bottom sheet thay vì navigate
              if (isMiddleButton) {
                addSheetRef.current?.present();
                return;
              }

              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            // Icon mapping
            let iconName: keyof typeof Ionicons.glyphMap;
            let label = "";

            if (route.name === "Home") {
              iconName = isFocused ? "home" : "home-outline";
              label = "Home";
            } else if (route.name === "Wardrobe") {
              iconName = isFocused ? "albums" : "albums-outline";
              label = "Wardrobe";
            } else if (route.name === "Suggestion") {
              iconName = "add";
              label = "";
            } else if (route.name === "Outfit") {
              iconName = isFocused ? "shirt" : "shirt-outline";
              label = "Outfit";
            } else if (route.name === "Collection") {
              iconName = isFocused ? "bookmark" : "bookmark-outline";
              label = "Collection";
            } else {
              iconName = "help-outline";
              label = "";
            }

            // Render nút giữa với animation
            if (isMiddleButton) {
              return <AnimatedMiddleButton key={index} onPress={onPress} />;
            }

            // Render các tab thường với animation
            return (
              <AnimatedTab
                key={index}
                isFocused={isFocused}
                onPress={onPress}
                iconName={iconName}
                label={label}
              />
            );
          })}
        </View>
      </View>

      {/* Bottom Sheet Modal */}
      <AddActionSheet ref={addSheetRef} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: 85,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 15,
    paddingBottom: Platform.OS === "ios" ? 25 : 20,
    paddingTop: 8,
    borderTopWidth: 0,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabContent: {
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#30cfd0",
  },
  middleButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    top: -15,
  },
  pressableArea: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  middleButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#330867",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  middleButtonInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 32,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  middleButtonRing: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "rgba(48, 207, 208, 0.2)",
    zIndex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});

export default CustomTabBar;
