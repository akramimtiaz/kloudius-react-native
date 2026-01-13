import { use } from "react";
import { AuthContext } from "@/ contexts/auth-context";
import { View, Text, TextInput, Button } from 'react-native';
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@/components/ui/typography";
import { Link } from "@react-navigation/native";

const signUpSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.email().nonempty("Email is required"),
  password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().nonempty("Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const { signUp } = use(AuthContext);

  const {
    control,
    handleSubmit,
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
    signUp({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <View>
      <View>
        <Typography>Sign Up</Typography>
        <Typography>Create a new account to get started.</Typography>
      </View>
      <View>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="words"
              autoComplete="name"
            />
          )}
          name="name"
        />
        {errors.name && <Text>{errors.name.message}</Text>}

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
              autoComplete="password-new"
            />
          )}
          name="password"
        />
        {errors.password && <Text>{errors.password.message}</Text>}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Confirm Password"
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
        {errors.confirmPassword && <Text>{errors.confirmPassword.message}</Text>}

        <Button 
          title="Sign Up" 
          accessibilityLabel="Sign up button"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
      <View>
        <Typography>Already have an account? </Typography>
        <Link screen="Login">
          <Typography>Login</Typography>
        </Link>
      </View>
    </View>
  );
}
 