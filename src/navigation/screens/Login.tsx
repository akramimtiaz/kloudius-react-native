import { AuthContext } from "@/ contexts/auth-context";
import { TextInput } from "react-native";
import { Typography } from "@/components/ui/typography";
import { Link } from "@react-navigation/native";
import { use } from "react";
import { Button, Text, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.email().nonempty("Email is required"),
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
        <Typography>Login</Typography>
        <Typography>Enter your email and password to log in.</Typography>
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
        <Typography>Or, Login With</Typography>
        <View />
      </View>
      <View>
        <Button title="Google" />
        <Button title="Facebook" />
      </View>
      <View>
        <Typography>Dont have an account? </Typography>
        <Link screen="SignUp">
          <Typography>Register</Typography>
        </Link>
      </View>
    </View>
  );
}
