import { View } from "react-native";
import { Tabs } from "expo-router";
import {
  Home,
  ShoppingBag,
  Car,
  BookOpen,
  MessageCircle,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GooseImage } from "../../components/GooseImage";
import { PressableScale } from "../../components/PressableScale";
import { colors, fonts, radius } from "../../theme";
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
        tabBarButton: (props) => (
          <PressableScale
            onPress={props.onPress}
            onLongPress={props.onLongPress}
            accessibilityRole={props.accessibilityRole}
            accessibilityState={props.accessibilityState}
            accessibilityLabel={props.accessibilityLabel}
            testID={props.testID}
            style={props.style}
          >
            {props.children}
          </PressableScale>
        ),
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
