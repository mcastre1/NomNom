import SignUp from "@/components/signup";
import { View } from "react-native";

export default function Register() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <SignUp/>
    </View>
  );
}
