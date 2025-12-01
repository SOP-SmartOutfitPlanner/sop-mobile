import React, { useRef, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text,
  Pressable,
  LayoutChangeEvent,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { AddActionSheet } from "../actions/AddActionSheet";

// Animated Tab Component
const AnimatedTab = ({
  isFocused,
  onPress,
  iconName,
  label,
  iconFamily = "Ionicons",
}: {
  isFocused: boolean;
  onPress: () => void;
  iconName:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  iconFamily?: "Ionicons" | "MaterialCommunityIcons";
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(isFocused ? 1 : 0.7);

  React.useEffect(() => {
    scale.value = withSpring(isFocused ? 1.05 : 1, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(isFocused ? 1 : 0.7, { duration: 200 });
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
        scale.value = withSpring(0.95, {
          damping: 15,
          stiffness: 300,
        });
      }}
      onPressOut={() => {
        scale.value = withSpring(isFocused ? 1.05 : 1, {
          damping: 15,
          stiffness: 300,
        });
      }}
      style={styles.tabContentWrapper}
      hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }} // Better touch target
    >
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        {isFocused ? (
          // Active state: white icon (inside blue pill)
          iconFamily === "MaterialCommunityIcons" ? (
            <MaterialCommunityIcons
              name={iconName as keyof typeof MaterialCommunityIcons.glyphMap}
              size={21}
              color="#FFFFFF"
            />
          ) : (
            <Ionicons
              name={iconName as keyof typeof Ionicons.glyphMap}
              size={21}
              color="#FFFFFF"
            />
          )
        ) : // Inactive state: gray outline icon
        iconFamily === "MaterialCommunityIcons" ? (
          <MaterialCommunityIcons
            name={iconName as keyof typeof MaterialCommunityIcons.glyphMap}
            size={21}
            color="#9CA3AF"
          />
        ) : (
          <Ionicons
            name={iconName as keyof typeof Ionicons.glyphMap}
            size={21}
            color="#9CA3AF"
          />
        )}
        {label && (
          <Text
            style={[
              styles.label,
              {
                color: isFocused ? "#FFFFFF" : "#9CA3AF", // white when active, gray-400 when inactive
                fontWeight: isFocused ? "700" : "500",
              },
            ]}
            // numberOfLines={1}
            // ellipsizeMode="tail"
            // adjustsFontSizeToFit={true}
            // minimumFontScale={0.75}
          >
            {label}
          </Text>
        )}
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
      {/* Outer glow ring - multiple layers for depth */}
      <View style={styles.middleButtonOuterGlow} pointerEvents="none" />
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
  const [tabPositions, setTabPositions] = useState<{
    [key: string]: { left: number; width: number };
  }>({});
  const tabRefs = useRef<{ [key: string]: View | null }>({});

  // Calculate tab positions for animated indicator
  useEffect(() => {
    // Positions are calculated via onLayout callbacks in tabs
  }, [state.index]);

  const activeRoute = state.routes[state.index];
  const activePosition = activeRoute ? tabPositions[activeRoute.key] : null;

  // Animated indicator style with smoother animation
  const indicatorStyle = useAnimatedStyle(() => {
    if (!activePosition) {
      return { opacity: 0 };
    }
    return {
      left: withSpring(activePosition.left, {
        stiffness: 380,
        damping: 30,
        mass: 0.7,
      }),
      width: withSpring(activePosition.width, {
        stiffness: 380,
        damping: 30,
        mass: 0.7,
      }),
      opacity: withTiming(1, { duration: 200 }),
    };
  });

  return (
    <>
      <View style={styles.container}>
        {/* Glass morphism container - matching web style */}
        <View
          ref={(ref) => {
            tabRefs.current.container = ref;
          }}
          style={styles.glassContainer}
        >
          {Platform.OS === "ios" ? (
            <BlurView intensity={40} tint="light" style={styles.blurView}>
              <View style={styles.glassContent}>
                {/* Animated indicator - matching web gradient */}
                {activePosition && (
                  <Animated.View
                    style={[styles.animatedIndicator, indicatorStyle]}
                  >
                    {Platform.OS === "ios" && (
                      <BlurView
                        intensity={15}
                        tint="light"
                        style={StyleSheet.absoluteFill}
                      />
                    )}
                    <LinearGradient
                      colors={["#2563EB", "#3B82F6", "#60A5FA"]} // blue-600 → blue-500 → blue-400 (lighter gradient)
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={StyleSheet.absoluteFill}
                    />
                    {/* Inner highlight for depth */}
                    <LinearGradient
                      colors={["rgba(255, 255, 255, 0.15)", "transparent"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                  </Animated.View>
                )}

                {/* Tabs */}
                {state.routes.map((route, index) => {
                  const { options } = descriptors[route.key];
                  const isFocused = state.index === index;
                  const isMiddleButton = index === 2;

                  const onPress = () => {
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

                  // Icon mapping with optimized labels
                  let iconName:
                    | keyof typeof Ionicons.glyphMap
                    | keyof typeof MaterialCommunityIcons.glyphMap;
                  let label = "";
                  let iconFamily: "Ionicons" | "MaterialCommunityIcons" =
                    "Ionicons";

                  if (route.name === "Home") {
                    iconName = isFocused ? "home" : "home-outline";
                    label = "Home";
                  } else if (route.name === "Wardrobe") {
                    iconName = isFocused ? "wardrobe" : "wardrobe-outline";
                    label = "Wardrobe"; // Keep full for clarity
                    iconFamily = "MaterialCommunityIcons";
                  } else if (route.name === "Suggestion") {
                    iconName = isFocused ? "sparkles" : "sparkles-outline";
                    label = "Suggest"; // Already short
                  } else if (route.name === "Outfit") {
                    iconName = isFocused ? "shirt" : "shirt-outline";
                    label = "Outfit";
                  } else if (route.name === "Collection") {
                    iconName = isFocused ? "bookmark" : "bookmark-outline";
                    label = "Collection"; // Keep full for clarity
                  } else {
                    iconName = "help-outline";
                    label = "";
                  }

                  if (isMiddleButton) {
                    return (
                      <AnimatedMiddleButton key={index} onPress={onPress} />
                    );
                  }

                  return (
                    <View
                      key={index}
                      ref={(ref) => {
                        tabRefs.current[route.key] = ref;
                      }}
                      onLayout={(event) => {
                        const { width, x } = event.nativeEvent.layout;
                        setTabPositions((prev) => ({
                          ...prev,
                          [route.key]: { left: x, width },
                        }));
                      }}
                      style={styles.tab}
                    >
                      <AnimatedTab
                        isFocused={isFocused}
                        onPress={onPress}
                        iconName={iconName}
                        label={label}
                        iconFamily={iconFamily}
                      />
                    </View>
                  );
                })}
              </View>
            </BlurView>
          ) : (
            // Android fallback - use white background
            <View
              style={[styles.glassContent, { backgroundColor: "transparent" }]}
            >
              {/* Animated indicator */}
              {activePosition && (
                <Animated.View
                  style={[styles.animatedIndicator, indicatorStyle]}
                >
                  <LinearGradient
                    colors={["#0284C7", "#1D4ED8", "#1E40AF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                  {/* Inner highlight for depth */}
                  <LinearGradient
                    colors={["rgba(255, 255, 255, 0.2)", "transparent"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                </Animated.View>
              )}

              {/* Tabs - same as iOS */}
              {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;
                const isMiddleButton = index === 2;

                const onPress = () => {
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

                let iconName:
                  | keyof typeof Ionicons.glyphMap
                  | keyof typeof MaterialCommunityIcons.glyphMap;
                let label = "";
                let iconFamily: "Ionicons" | "MaterialCommunityIcons" =
                  "Ionicons";

                if (route.name === "Home") {
                  iconName = isFocused ? "home" : "home-outline";
                  label = "Home";
                } else if (route.name === "Wardrobe") {
                  iconName = isFocused ? "wardrobe" : "wardrobe-outline";
                  label = "Wardrobe";
                  iconFamily = "MaterialCommunityIcons";
                } else if (route.name === "Suggestion") {
                  iconName = isFocused ? "sparkles" : "sparkles-outline";
                  label = "Suggest";
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

                if (isMiddleButton) {
                  return <AnimatedMiddleButton key={index} onPress={onPress} />;
                }

                return (
                  <View
                    key={index}
                    ref={(ref) => {
                      tabRefs.current[route.key] = ref;
                    }}
                    onLayout={(event) => {
                      const { width, x } = event.nativeEvent.layout;
                      setTabPositions((prev) => ({
                        ...prev,
                        [route.key]: { left: x, width },
                      }));
                    }}
                    style={styles.tab}
                  >
                    <AnimatedTab
                      isFocused={isFocused}
                      onPress={onPress}
                      iconName={iconName}
                      label={label}
                      iconFamily={iconFamily}
                    />
                  </View>
                );
              })}
            </View>
          )}
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
    overflow: "visible", // Allow middle button to overflow
  },
  glassContainer: {
    height: Platform.OS === "ios" ? 88 : 80,
    overflow: "visible",
    borderRadius: 9999,
    marginHorizontal: 8,
    // Viền sáng, mỏng hơn để tổng thể nhìn nhẹ
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.45)",
    // Shadow mềm, nhẹ hơn để không bị tối nền
    shadowColor: "rgba(15, 23, 42, 0.35)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 14,
    // Nền glass sáng hơn, hơi xanh nhạt
    backgroundColor: "rgba(148, 163, 184, 0.18)", // slate-400 rất nhạt
  },
  blurView: {
    flex: 1,
    borderRadius: 50,
  },
  glassContent: {
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
    flex: 1,
    flexDirection: "row",
    paddingBottom: Platform.OS === "ios" ? 28 : 20,
    paddingTop: 8, // Reduced top padding
    paddingHorizontal: 8, // Balanced padding
    position: "relative",
    alignItems: "center",
    justifyContent: "space-evenly", // Even distribution
  },
  animatedIndicator: {
    position: "absolute",
    height: 50, // Height to cover icon + text + gap
    borderRadius: 9999, // rounded-full
    top: 10, // Aligned with tab content
    borderWidth: 0, // No border for cleaner look
    shadowColor: "rgba(37, 99, 235, 0.2)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden", // Ensure gradient stays within rounded corners
    ...Platform.select({
      ios: {
        shadowColor: "rgba(59, 130, 246, 0.3)",
      },
    }),
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  tabContentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabContent: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999, // rounded-full
  },
  middleButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    top: -18, // Lồi lên nhiều hơn (half of button height ~32px)
    zIndex: 50, // Ensure it's above everything including tab bar
    position: "relative",
  },
  pressableArea: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  middleButton: {
    width: 64, // Optimal size
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#30cfd0",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16, // High elevation for Android
    ...Platform.select({
      ios: {
        shadowColor: "#30cfd0",
      },
    }),
  },
  middleButtonInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.35)", // Visible white border
  },
  middleButtonOuterGlow: {
    position: "absolute",
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(48, 207, 208, 0.15)", // Outer glow
    shadowColor: "#30cfd0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 0,
  },
  middleButtonRing: {
    position: "absolute",
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: "rgba(48, 207, 208, 0.3)", // More visible ring
    shadowColor: "#30cfd0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 1,
  },
  label: {
    fontSize: 12, // Optimal size for readability
    fontWeight: "600",
    letterSpacing: 0.1, // Subtle letter spacing
    textAlign: "center",
    includeFontPadding: false, // Remove Android extra padding
    textAlignVertical: "center",
  },
});

export default CustomTabBar;
