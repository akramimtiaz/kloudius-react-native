import { AuthContext } from "@/contexts/auth";
import { TextInput } from "react-native";
import { Link } from "@react-navigation/native";
import { use } from "react";
import { Button, Text, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.email("Email is required"),
  password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
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
    login(data.email, data.password);
  };

  return (
    <View>
      <View>
        <Text>Login</Text>
        <Text>Enter your email and password to log in.</Text>
      </View>
      <View>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Email"
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

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Password"
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

        <Button 
          title="Continue" 
          accessibilityLabel="Login button"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignSelf: "center",
          alignItems: "center",
          maxWidth: "100%",
        }}
      >
        <View />
        <Text>Or, Login With</Text>
        <View />
      </View>
      <View>
        <Button title="Google" />
        <Button title="Facebook" />
      </View>
      <View>
        <Text>Dont have an account? </Text>
        <Link screen="SignUp">
          <Text>Register</Text>
        </Link>
      </View>
    </View>
  );
}
