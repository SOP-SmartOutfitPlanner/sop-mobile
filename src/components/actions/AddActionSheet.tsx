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
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AddItemModal } from "../wardrobe/AddItemModal";

// Chiều cao của bottom tab bar
const TAB_BAR_HEIGHT = 140;

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  screen: string;
  badge?: string;
};

const menuItems: MenuItem[] = [
  { icon: "shirt-outline", label: "Add item", screen: "AddItem" }, // Changed screen name
  {
    icon: "heart-outline",
    label: "Add to wishlist",
    screen: "AddWishlist",
    // badge: "New",
  },
];

const outfitItems: MenuItem[] = [
  {
    icon: "body-outline",
    label: "Add to outfit",
    screen: "AddOutfit",
  },
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

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.4}
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
          <Text style={styles.title}>Item</Text>

          <View style={styles.section}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleItemPress(item.screen)}
              >
                <Ionicons name={item.icon} size={24} color="#000" />
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Outfits</Text>
          <View style={styles.section}>
            {outfitItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleItemPress(item.screen)}
              >
                <Ionicons name={item.icon} size={24} color="#000" />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
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
    // Thêm margin horizontal để sheet không chạm mép màn hình
    marginHorizontal: 16,
  },
  sheetBackground: {
    backgroundColor: "#fff",
    borderRadius: 20, // Border radius cho cả 4 góc vì sheet detached
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  indicator: {
    backgroundColor: "#ddd",
    width: 40,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#8e8e93",
    marginBottom: 16,
  },
  section: {
    gap: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 12,
  },
  menuLabel: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  badge: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e5e7",
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#8e8e93",
    marginBottom: 8,
  },
});
