import { Pressable, View, Text } from "react-native";
import { Tabs, router } from "expo-router";
import {
  Home,
  ShoppingBag,
  Car,
  BookOpen,
  MessageCircle,
  UserRound,
  Search,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GooseImage } from "../../components/GooseImage";
import { colors, fonts, radius } from "../../theme";
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        headerTitle: () => (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <GooseImage goose="logo" size={36} decorative />
            <Text
              style={{
                fontFamily: fonts.display,
                fontSize: 28,
                color: colors.ink,
              }}
            >
              Loop
            </Text>
          </View>
        ),
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Search Loop"
              onPress={() => router.push("/search")}
              style={{
                width: 44,
                height: 44,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.stroke,
                backgroundColor: colors.white,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Search size={20} color={colors.ink} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open profile"
              onPress={() => router.push("/profile")}
              style={({ pressed }) => ({
                marginRight: 16,
                height: 44,
                width: 44,
                borderRadius: radius.button,
                borderWidth: 1,
                borderColor: colors.stroke,
                backgroundColor: colors.white,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <UserRound size={20} color={colors.ink} />
            </Pressable>
          </View>
        ),
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.inkSoft,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.stroke,
          height: 64 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontFamily: fonts.bold, fontSize: 10 },
        tabBarItemStyle: { minHeight: 44 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              Icon={Home}
              color={color}
              focused={focused}
              fill={colors.accentSoft}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: "Marketplace",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              Icon={ShoppingBag}
              color={color}
              focused={focused}
              fill={colors.marketplaceSoft}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: "Rides",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              Icon={Car}
              color={color}
              focused={focused}
              fill={colors.ridesSoft}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          title: "Study",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              Icon={BookOpen}
              color={color}
              focused={focused}
              fill={colors.studySoft}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              Icon={MessageCircle}
              color={color}
              focused={focused}
              fill={colors.accentSoft}
            />
          ),
        }}
      />
    </Tabs>
  );
}
function TabIcon({
  Icon,
  color,
  focused,
  fill,
}: {
  Icon: typeof Home;
  color: string;
  focused: boolean;
  fill: string;
}) {
  return (
    <View
      style={{
        width: 44,
        height: 30,
        borderRadius: radius.pill,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: focused ? fill : "transparent",
      }}
    >
      <Icon size={20} color={color} strokeWidth={focused ? 2.5 : 1.8} />
    </View>
  );
}
