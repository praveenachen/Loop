import { Image, type ImageStyle, type StyleProp } from "react-native";
const assets = {
  backpack: require("../assets/geese/goose-backpack.png"),
  driver: require("../assets/geese/goose-driver.png"),
  reader: require("../assets/geese/goose-reader.png"),
  trophy: require("../assets/geese/goose-trophy.png"),
  logoTransparent: require("../assets/geese/logo-goose-transparent.png"),
  logo: require("../assets/geese/logo-goose.png"),
  logoSolid: require("../assets/geese/logo-goose-solid.png"),
};
export type Goose = keyof typeof assets;
export function GooseImage({
  goose,
  size = 112,
  style,
  decorative = false,
}: {
  goose: Goose;
  size?: number;
  style?: StyleProp<ImageStyle>;
  decorative?: boolean;
}) {
  return (
    <Image
      source={assets[goose]}
      resizeMode="contain"
      style={[{ width: size, height: size }, style]}
      accessible={!decorative}
      accessibilityLabel={`Loop ${goose} goose`}
    />
  );
}
