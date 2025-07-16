import DatePickerModal from "@/components/date-piacker-modal";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

const steps = [
  { key: "name", type: "text", label: "이름을 입력해주세요" },
  { key: "birth", type: "date", label: "생년월일을 선택해주세요" },
  { key: "joinAt", type: "date", label: "입단일을 선택해주세요" },
  {
    key: "position",
    type: "radio",
    label: "포지션을 선택해주세요",
    options: ["FW", "MF", "DF", "GK"],
  },
];

export default function AddMemberScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const current = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("✅ 최종 데이터", formData);
    }
  };

  const renderInput = () => {
    switch (current.type) {
      case "text":
        return (
          <TextInput
            style={styles.input}
            placeholder={current.label}
            value={formData[current.key] || ""}
            onChangeText={(text) =>
              setFormData({ ...formData, [current.key]: text })
            }
          />
        );
      case "date":
        return (
          <>
            <Button
              title={
                formData[current.key]
                  ? new Date(formData[current.key]).toDateString()
                  : current.label
              }
              onPress={() => setShowDatePicker(true)}
            />
            {showDatePicker && (
              <DatePickerModal
                date={new Date()}
                mode="date"
                isShow={showDatePicker}
                onConfirm={(selectedDate: Date) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setFormData({
                      ...formData,
                      [current.key]: selectedDate.toISOString(),
                    });
                  }
                }}
                onCancel={() => {
                  setShowDatePicker(false);
                }}
              />
            )}
          </>
        );
      case "radio":
        return (
          <View style={{ gap: 10 }}>
            {current.options!!.map((option: string) => (
              <Button
                key={option}
                title={option}
                color={formData[current.key] === option ? "blue" : "gray"}
                onPress={() =>
                  setFormData({ ...formData, [current.key]: option })
                }
              />
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{current.label}</Text>
      {renderInput()}

      <View style={{ height: 20 }} />
      <Button title="다음" onPress={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});
