import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Shirt, Calendar, Heart, Award } from "lucide-react-native";
import { NAVIGATION_ITEMS } from "../../constants/homeData";
import {
  COLORS,
  SPACING,
  SHADOWS,
  SIZES,
  BASE_STYLES,
} from "../../constants/homeStyles";

interface NavigationItemProps {
  item: (typeof NAVIGATION_ITEMS)[0];
}

const NavigationItem: React.FC<NavigationItemProps> = ({ item }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    // @ts-ignore - Navigation typing can be complex, ignoring for demo
    navigation.navigate(item.route);
  };

  const renderIcon = () => {
    const iconProps = { size: 24, color: COLORS.primary };
    switch (item.icon) {
      case "wardrobe":
        return <Shirt {...iconProps} />;
      case "planner":
        return <Calendar {...iconProps} />;
      case "favorites":
        return <Heart {...iconProps} />;
      case "collections":
        return <Award {...iconProps} />;
      default:
        return <Shirt {...iconProps} />;
    }
  };

  return (
    <TouchableOpacity style={styles.navItem} onPress={handlePress}>
      <View style={styles.navIconContainer}>{renderIcon()}</View>
      <Text style={styles.navTitle}>{item.title}</Text>
    </TouchableOpacity>
  );
};

export const QuickNavigation: React.FC = () => {
  return (
    <View style={[BASE_STYLES.cardBase, styles.container]}>
      <View style={styles.header}>
        <Text style={BASE_STYLES.titleBase}>Quick Navigation</Text>
      </View>

      <View style={styles.navigationGrid}>
        {NAVIGATION_ITEMS.map((item) => (
          <NavigationItem key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  navigationGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: SPACING.xs,
  },
  navIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  navTitle: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: "center",
    fontWeight: "500",
  },
});
