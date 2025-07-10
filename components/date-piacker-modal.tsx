import { SafeAreaView } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export type DatePickerMode = "date" | "time" | "datetime";

export default function DatePickerModal(
  date: Date,
  mode: DatePickerMode = "date",
  isShow: boolean,
  onConfirm: (selected: Date) => {},
  onCancel: () => {}
) {
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

// export default function DatePickerModal() {
//   const [date, setDate] = useState(new Date());
//   const [mode, setMode] = useState<"date" | "time" | "datetime">("date");
//   const [show, setShow] = useState(false);

//   const onChange = (selectedDate: Date) => {
//     const currentDate = selectedDate;
//     setShow(false);
//     setDate(currentDate);
//   };

//   const showMode = (currentMode: "date" | "time" | "datetime") => {
//     setShow(true);
//     setMode(currentMode);
//   };

//   const showDatepicker = () => {
//     showMode("date");
//   };

//   const showTimepicker = () => {
//     showMode("time");
//   };

//   return (
//     <SafeAreaView>
//       <Button onPress={showDatepicker} title="Show date picker!" />
//       <Button onPress={showTimepicker} title="Show time picker!" />
//       <Text>selected: {date.toLocaleString()}</Text>

//       {show && (
//         <DateTimePickerModal
//           isVisible={show}
//           mode={mode}
//           onConfirm={(date) => {
//             setShow(false);
//             setDate(date);
//           }}
//           onCancel={() => {
//             setShow(false);
//           }}
//           date={date}
//         />
//       )}
//     </SafeAreaView>
//   );
// }
