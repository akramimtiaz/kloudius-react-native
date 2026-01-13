import { PropsWithChildren } from "react";
import { Text } from "react-native";

export function Typography({ children }: PropsWithChildren) {
  return <Text>{children}</Text>;
};