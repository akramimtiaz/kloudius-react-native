import { use, useState } from "react";
import { AuthContext } from "@/contexts/auth";
import { View, Text, TextInput, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import clsx from "clsx";
import { Toast } from "toastify-react-native";

const signUpSchema = z
  .object({
    name: z.string().nonempty("Name is required"),
    email: z.email("Email is required"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const navigation = useNavigation(); 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { signUp } = use(AuthContext);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SignUpForm) => {
    setIsLoading(true);
    try {
      signUp({
        name: data.name,
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: "We couldn`t create your account right now.",
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
          <Text className="text-2xl font-bold">Sign Up</Text>
          <Text className="text-base color-slate-600">
            Create a new account to get started.
          </Text>
        </View>
        <View className="gap-5">
          {/* Name */}
          <View className="gap-2">
            <Text className="text-base">Name</Text>
            <View
              className={clsx(
                "py-3 px-2 border rounded-md border-green-600",
                errors.name && "border-red-600"
              )}
            >
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="words"
                    autoComplete="name"
                  />
                )}
                name="name"
              />
            </View>
            {errors.name && (
              <Text className="color-red-600 font-semibold">
                {errors.name.message}
              </Text>
            )}
          </View>

          {/* Email */}
          <View className="gap-2">
            <Text className="text-base">Email</Text>
            <View
              className={clsx(
                "py-3 px-2 border rounded-md border-green-600",
                errors.email && "border-red-600"
              )}
            >
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
            {errors.email && (
              <Text className="color-red-600 font-semibold">
                {errors.email.message}
              </Text>
            )}
          </View>

          {/* Password */}
          <View className="gap-2">
            <Text className="text-base">Password</Text>
            <View
              className={clsx(
                "py-3 px-2 border rounded-md border-green-600",
                errors.password && "border-red-600"
              )}
            >
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password-new"
                  />
                )}
                name="password"
              />
            </View>
            {errors.password && (
              <Text className="color-red-600 font-semibold">
                {errors.password.message}
              </Text>
            )}
          </View>

          {/* Confirm Password */}
          <View className="gap-2">
            <Text className="text-base">Confirm Password</Text>
            <View
              className={clsx(
                "py-3 px-2 border rounded-md border-green-600",
                errors.confirmPassword && "border-red-600"
              )}
            >
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password-new"
                  />
                )}
                name="confirmPassword"
              />
            </View>

            {errors.confirmPassword && (
              <Text className="color-red-600 font-semibold">
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>

          <Pressable
            className="flex-row justify-center items-center self-stretch py-4 mt-4 bg-green-600 rounded-md"
            accessibilityLabel="Sign up button"
            disabled={isLoading}
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-base color-white font-bold">Register</Text>
          </Pressable>
        </View>
        <View className="flex-row justify-center pt-6">
          <Text>Already have an account? </Text>
          <Pressable onPress={() => navigation.goBack()}>
            <Text className="underline font-semibold color-green-800">
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
