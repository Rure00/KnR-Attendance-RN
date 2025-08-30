import DatePickerModal from "@/components/date-piacker-modal";
import CustomTextInput from "@/components/input-text";
import { useKeyboardHeight } from "@/components/keyboard-state";
import CustomRadioButton from "@/components/radio-button";
import { colors } from "@/constants/colors";
import { Member, Position, positions } from "@/models/member";
import { fetchNewMember } from "@/redux/reducers/member-thunk";
import { useAppDispatch } from "@/redux/store";
import { dateToDotSeparated } from "@/utils/dateToDotSeparated";
import { Logger } from "@/utils/Logger";
import { stringify } from "@/utils/stringify";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function AddMemberScreen() {
  const router = useRouter();
  const dispatcher = useAppDispatch();

  const keyboardHeight = useKeyboardHeight();

  const [currentStep, setCurrentStep] = useState(0);

  const [showBirthPicker, setShowBirthPicker] = useState(false);
  const [showJoinAtPicker, setShowJoinAtPicker] = useState(false);

  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birth, setBirth] = useState(new Date(2000, 5, 1));
  const [joinAt, setJoinAt] = useState(new Date());
  const [position, setPosition] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  const checkNext =
    name.length >= 2 &&
    (currentStep < 1 || phoneNumber.length === 11) &&
    (currentStep < 4 || position.some((it) => it === true));

  useEffect(() => {
    switch (currentStep) {
      case 5: {
        const selectedPosition = position
          .map((isSelected, index) => (isSelected ? positions[index] : null))
          .filter((pos): pos is Position => pos !== null);

        const newMemberCreated: Omit<Member, "id"> = {
          name: name,
          birth: birth,
          phoneNumber: phoneNumber,
          joinAt: joinAt,
          position: selectedPosition,
        };

        (async () => {
          try {
            //await createNewMember(newMemberCreated);
            dispatcher(fetchNewMember(newMemberCreated));
            router.back();
          } catch (e) {
            Logger.error(stringify(e));
          }
        })();

        break;
      }
      case 2: {
        setShowBirthPicker(true);
        break;
      }
      case 3: {
        setShowJoinAtPicker(true);
        break;
      }
      default: {
      }
    }
  }, [currentStep]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.background}>
        {currentStep >= 4 && (
          <CustomRadioButton
            values={positions}
            label="포지션"
            onClick={(index) => {
              setPosition((prev) =>
                prev.map((val, i) => (i === index ? !val : val))
              );
            }}
            selectedValues={position}
            colorsOnSelect={[
              colors.yellow200,
              colors.blue200,
              colors.green200,
              colors.red200,
            ]}
            labelStyle={styles.label}
          />
        )}

        {currentStep >= 3 && (
          <Pressable
            onPress={() => {
              setShowJoinAtPicker(true);
            }}
          >
            <CustomTextInput
              value={dateToDotSeparated(joinAt)}
              containerStyle={styles.inputContainer}
              style={styles.input}
              labelStyle={styles.label}
              label={"입단일"}
              placeholder={"입단일"}
              editable={false}
              pointerEvents="none"
            />
          </Pressable>
        )}

        {currentStep >= 2 && (
          <Pressable
            onPress={() => {
              setShowBirthPicker(true);
            }}
          >
            <CustomTextInput
              value={dateToDotSeparated(birth)}
              containerStyle={styles.inputContainer}
              style={styles.input}
              labelStyle={styles.label}
              label={"생년월일"}
              placeholder={"생년월일"}
              editable={false}
              pointerEvents="none"
            />
          </Pressable>
        )}

        {currentStep >= 1 && (
          <CustomTextInput
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            inputMode="tel"
            containerStyle={styles.inputContainer}
            style={styles.input}
            labelStyle={styles.label}
            label={"휴대폰번호"}
            placeholder={"휴대폰번호"}
            isFocused={currentStep === 1}
          />
        )}

        {currentStep >= 0 && (
          <CustomTextInput
            value={name}
            onChangeText={(text) => setName(text)}
            inputMode="text"
            containerStyle={styles.inputContainer}
            style={styles.input}
            labelStyle={styles.label}
            label={"이름"}
            placeholder={"이름"}
            isFocused={currentStep === 0}
          />
        )}
      </View>

      <Pressable
        style={[
          { marginBottom: keyboardHeight },
          checkNext ? styles.nextButtonEnabled : styles.nextButtonDisabled,
        ]}
        onPress={() => {
          if (!checkNext) return;
          setCurrentStep((prev) => prev + 1);
        }}
      >
        <Text style={styles.nextTitle}>다음</Text>
      </Pressable>

      <DatePickerModal
        date={birth}
        mode={"date"}
        isShow={showBirthPicker}
        onConfirm={(date: Date) => {
          setBirth(date);
          setShowBirthPicker(false);
        }}
        onCancel={() => {
          setShowBirthPicker(false);
        }}
      />

      <DatePickerModal
        date={joinAt}
        mode={"date"}
        isShow={showJoinAtPicker}
        onConfirm={(date: Date) => {
          setJoinAt(date);
          setShowJoinAtPicker(false);
        }}
        onCancel={() => {
          setShowJoinAtPicker(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    gap: 17,
    paddingVertical: 13,
    paddingHorizontal: 13,
  },

  inputContainer: {},
  label: {
    fontSize: 16,
    color: colors.blue100,
    fontWeight: "semibold",
  },
  input: {
    padding: 12,
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.blue100,
  },

  nextButtonEnabled: {
    padding: 14,
    alignItems: "center",
    backgroundColor: colors.blue100,
    width: "100%",
  },
  nextTitle: {
    fontSize: 20,
    fontWeight: "400",
    color: colors.white,
  },

  nextButtonDisabled: {
    padding: 14,
    alignItems: "center",
    backgroundColor: colors.blue30,
    width: "100%",
  },
});
