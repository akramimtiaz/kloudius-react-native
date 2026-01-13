import { use } from "react";
import { AuthContext } from "@/ contexts/auth-context";
import { Text } from "@react-navigation/elements";
import { Button, View } from "react-native";

export default function Home() {
  const { logOut } = use(AuthContext);
  return (
    <View>
      <Text>Home Screen!</Text>
      <Button title="Log Out" onPress={logOut} />
    </View>
  );
}
