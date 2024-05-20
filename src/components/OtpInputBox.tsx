import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

interface OtpInputBoxProps {
  length: number;
  onOtpChange: (otp: string) => void;
}

const OtpInputBox: React.FC<OtpInputBoxProps> = ({ length, onOtpChange }) => {
  const [otpArray, setOtpArray] = React.useState<string[]>(
    Array(length).fill(""),
  );

  const handleChangeText = (text: string, index: number) => {
    const newOtpArray = [...otpArray];
    newOtpArray[index] = text;

    if (text && index < length - 1) {
      const nextInput = refArray[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }

    setOtpArray(newOtpArray);
    onOtpChange(newOtpArray.join(""));
  };

  const refArray: TextInput[] = [];

  return (
    <View style={styles.container}>
      {otpArray.map((_, index) => (
        <TextInput
          key={index}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          value={otpArray[index]}
          onChangeText={(text) => handleChangeText(text, index)}
          ref={(ref) => {
            if (ref) {
              refArray[index] = ref;
            }
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    width: 40,
    height: 40,
    borderColor: "#000",
    borderWidth: 1,
    textAlign: "center",
  },
});

export default OtpInputBox;
