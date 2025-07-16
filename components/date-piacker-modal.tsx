import { SafeAreaView } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export type DatePickerMode = "date" | "time" | "datetime";
type DatePickerProps = {
  date: Date;
  mode: DatePickerMode;
  isShow: boolean;
  onConfirm: (selected: Date) => void;
  onCancel: () => void;
};

export default function DatePickerModal({
  date,
  mode = "date",
  isShow,
  onConfirm,
  onCancel,
}: DatePickerProps) {
  return (
    <SafeAreaView>
      <DateTimePickerModal
        date={date}
        mode={mode}
        isVisible={isShow}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </SafeAreaView>
  );
}
