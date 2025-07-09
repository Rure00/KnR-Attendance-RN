import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(main)" 
        options={ {
          headerTitle:'main',
          title:'main'
        }}/>
      <Stack.Screen name="(settings)"
        options={ {
          headerTitle:'settings',
          title:'settings'
        }} />
    </Stack>
  );
}
