import { Pressable, Text, View } from "react-native";
import { Provider } from "react-redux";
import { decrement, increment } from "./reducers/counter";
import store, { useAppDispatch, useAppSelector } from "./store";

export default function TestCase() {
  return (
    <Provider store={store}>
      <ChildView />
    </Provider>
  );
}

function ChildView() {
  const counterState = useAppSelector((state) => state.counter);
  const dispatch = useAppDispatch();

  return (
    <View>
      <Text>Count Of App : {counterState.count}</Text>
      <Pressable onPress={() => dispatch(increment(3))}>
        <Text>Count Up</Text>
      </Pressable>
      <Pressable onPress={() => dispatch(decrement(3))}>
        <Text>Count Down</Text>
      </Pressable>
    </View>
  );
}
