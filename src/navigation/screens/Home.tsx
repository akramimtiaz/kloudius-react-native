import { use } from "react";
import { AuthContext } from "@/contexts/auth";
import { Pressable, View, Text } from "react-native";

export default function Home() {
  const { user, logOut } = use(AuthContext);

  return (
    <View className="flex-1 py-16 px-8 bg-white items-stretch justify-between">
      <View className="gap-2 items-center">
        <Text className="text-2xl font-bold">Welcome Back</Text>
        <Text className="text-4xl font-bold color-green-600">
          {user?.name} 👋
        </Text>
      </View>
      <Pressable
        className="flex-row justify-center items-center self-stretch py-4 mt-4 bg-green-600 rounded-md"
        onPress={logOut}
      >
        <Text className="text-base color-white font-bold">Log Out</Text>
      </Pressable>
    </View>
  );
}
