import { AuthContext } from "@/contexts/auth";
import { TextInput } from "react-native";
import { Link } from "@react-navigation/native";
import { use, useState } from "react";
import { Text, View, Pressable } from "react-native";
import clsx from 'clsx';
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toast } from 'toastify-react-native';
import Feather from '@expo/vector-icons/Feather';

const loginSchema = z.object({
  email: z.email("Email is required"),
  password: z.string().nonempty("Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const { login } = use(AuthContext);

  const togglePasswordVisibility = () => setIsPasswordVisible((curr) => !curr);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    reValidateMode: 'onBlur',
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } catch {
      Toast.show({
        type: 'error',
        text1: "Invalid credentials",
        text2: "Please try again.",
      });
      reset();
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
            <View className={clsx(
              "py-3 px-2 border rounded-md border-green-600",
              errors.email && 'border-red-600'
            )}>
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
            </View>
            {errors.email && <Text className="color-red-600 font-semibold">{errors.email.message}</Text>}
          </View>

          {/* Password */}
          <View className="gap-2">
            <Text className="text-base">Password</Text>
            <View className={clsx(
              "flex-row items-center gap-2 justify-between py-3 px-4 border rounded-md border-green-600",
              errors.password && 'border-red-600'
            )}>
              <View className="flex-1">
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry={!isPasswordVisible}
                      autoCapitalize="none"
                      autoComplete="password"
                    />
                  )}
                  name="password"
                />
              </View>
              <Pressable onPress={togglePasswordVisibility}>
                <Feather name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="black" />
              </Pressable>
            </View>
              {errors.password && <Text className="color-red-600 font-semibold">{errors.password.message}</Text>}
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
