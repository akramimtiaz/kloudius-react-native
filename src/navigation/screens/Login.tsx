import { AuthContext } from "@/contexts/auth";
import { TextInput } from "react-native";
import { Link } from "@react-navigation/native";
import { use, useState } from "react";
import { Button, Text, View, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.email("Email is required"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = use(AuthContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginForm) => {
    setIsLoading(true);
    try {
      login(data.email, data.password);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 py-8 px-4 gap-4">
        <View className="gap-2">
          <Text className="text-2xl font-bold">Login</Text>
          <Text className="text-base color-slate-600">
            Enter your email and password to log in.
          </Text>
        </View>
        <View className="gap-5">
          {/* Email */}
          <View className="gap-2">
            <Text className="text-base">Email</Text>
            <View className="py-3 px-2 border rounded-md border-green-600">
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                )}
                name="email"
              />
              {errors.email && <Text>{errors.email.message}</Text>}
            </View>
          </View>

          {/* Password */}
          <View className="gap-2">
            <Text className="text-base">Password</Text>
            <View className="py-3 px-2 border rounded-md border-green-600">
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password"
                  />
                )}
                name="password"
              />
              {errors.password && <Text>{errors.password.message}</Text>}
            </View>
          </View>

          <Pressable
            className="flex-row justify-center items-center self-stretch py-4 mt-4 bg-green-600 rounded-md"
            disabled={isLoading}
            accessibilityLabel="Login button"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-base color-white font-bold">Continue</Text>
          </Pressable>
        </View>
        <View className="flex-row justify-center pt-6">
          <Text>Dont have an account? </Text>
          <Link screen="SignUp">
            <Text className="underline font-semibold color-green-800">Register</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
