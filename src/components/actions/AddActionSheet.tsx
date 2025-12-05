// components/sheets/AddActionSheet.tsx
import React, { forwardRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { AddItemModal } from "../wardrobe/modal/AddItemModal";

// Chiều cao của bottom tab bar
const TAB_BAR_HEIGHT = 140;

type IconFamily = "Ionicons" | "MaterialCommunityIcons" | "FontAwesome5";

type MenuItem = {
  iconFamily: IconFamily;
  icon: string;
  label: string;
  screen: string;
  badge?: string;
  color?: string;
};

const menuItems: MenuItem[] = [
  { 
    iconFamily: "MaterialCommunityIcons",
    icon: "tshirt-crew-outline", 
    label: "Add item", 
    screen: "AddItem",
    color: "#3b82f6"
  },
];

const outfitItems: MenuItem[] = [
  {
    iconFamily: "MaterialCommunityIcons",
    icon: "hanger",
    label: "Create new outfit",
    screen: "Outfit",
    color: "#8b5cf6",
  },
  {
    iconFamily: "MaterialCommunityIcons",
    icon: "palette-outline",
    label: "AI style suggestion",
    screen: "Suggestion",
    color: "#10b981",
    badge: "AI",
  }
];

export const AddActionSheet = forwardRef<BottomSheetModal>((props, ref) => {
  const navigation = useNavigation();
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);

  const handleItemPress = (screen: string) => {
    (ref as any).current?.dismiss();

    // Special handling for AddItem
    if (screen === "AddItem") {
      setTimeout(() => {
        setIsAddItemModalVisible(true);
      }, 300);
      return;
    }

    // Special handling for Outfit screen - navigate to Outfit tab and open create modal
    if (screen === "Outfit") {
      setTimeout(() => {
        // Navigate to Main (which contains BottomTabNavigator) then to Outfit tab
        (navigation as any).navigate("Main", {
          screen: "Outfit",
          params: { openCreateModal: true }
        });
      }, 300);
      return;
    }

    // Navigate to other screens
    setTimeout(() => {
      navigation.navigate(screen as never);
    }, 300);
  };

  const handleAddItemModalClose = () => {
    setIsAddItemModalVisible(false);
  };

  const handleAddItemModalSave = () => {
    setIsAddItemModalVisible(false);
    // Optionally trigger a refresh or callback here
  };

  const renderIcon = (item: MenuItem) => {
    const iconColor = "#ffffff";
    const iconSize = 22;

    switch (item.iconFamily) {
      case "MaterialCommunityIcons":
        return (
          <MaterialCommunityIcons
            name={item.icon as any}
            size={iconSize}
            color={iconColor}
          />
        );
      case "FontAwesome5":
        return (
          <FontAwesome5
            name={item.icon as any}
            size={iconSize}
            color={iconColor}
          />
        );
      case "Ionicons":
      default:
        return (
          <Ionicons name={item.icon as any} size={iconSize} color={iconColor} />
        );
    }
  };

  const renderMenuItem = (item: MenuItem, index: number) => {
    // Convert hex color to rgba for gradient
    const getGradientColors = (color: string) => {
      if (color === "#3b82f6") {
        return ["rgba(59, 130, 246, 0.15)", "rgba(59, 130, 246, 0.08)"] as const;
      } else if (color === "#8b5cf6") {
        return ["rgba(139, 92, 246, 0.15)", "rgba(139, 92, 246, 0.08)"] as const;
      } else if (color === "#10b981") {
        return ["rgba(16, 185, 129, 0.15)", "rgba(16, 185, 129, 0.08)"] as const;
      }
      return ["rgba(59, 130, 246, 0.15)", "rgba(59, 130, 246, 0.08)"] as const;
    };

    const gradientColors = getGradientColors(item.color || "#3b82f6");

    return (
      <TouchableOpacity
        key={index}
        style={styles.menuItemContainer}
        onPress={() => handleItemPress(item.screen)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.menuItemGradient}
        >
          <View style={[styles.iconContainer, { backgroundColor: item.color || "#3b82f6" }]}>
            {renderIcon(item)}
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuLabel}>{item.label}</Text>
            {item.badge && (
              <View style={[styles.badge, { backgroundColor: item.color || "#10b981" }]}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            )}
          </View>
          <Ionicons name="chevron-forward" size={18} color="rgba(148, 163, 184, 0.5)" />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.6}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <>
      <BottomSheetModal
        ref={ref}
        snapPoints={["50%"]}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.indicator}
        detached={true} // Thêm dòng này
        bottomInset={TAB_BAR_HEIGHT} // Đẩy sheet lên trên tab bar
        style={styles.sheetContainer} // Thêm margin horizontal
      >
        <BottomSheetView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Quick Actions</Text>
            <Text style={styles.subtitle}>Choose an action to get started</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wardrobe</Text>
            {menuItems.map((item, index) => renderMenuItem(item, index))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Outfit Creation</Text>
            {outfitItems.map((item, index) => renderMenuItem(item, index))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      {/* AddItemModal */}
      <AddItemModal
        visible={isAddItemModalVisible}
        onClose={handleAddItemModalClose}
        onSave={handleAddItemModalSave}
      />
    </>
  );
});

const styles = StyleSheet.create({
  sheetContainer: {
    marginHorizontal: 16,
  },
  sheetBackground: {
    backgroundColor: "#0f172a",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  indicator: {
    backgroundColor: "rgba(148, 163, 184, 0.4)",
    width: 40,
    height: 4,
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 12,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(148, 163, 184, 0.8)",
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(148, 163, 184, 0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItemContainer: {
    marginBottom: 10,
    borderRadius: 16,
    overflow: "hidden",
  },
  menuItemGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
