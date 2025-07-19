import React, { ReactNode, useMemo } from "react";
import { View } from "react-native";

type GridViewProps<ItemT> = {
  data: ItemT[];
  mainAxis: "row" | "column";
  mainNum: number;
  mainGap?: number;
  crossGap?: number;
  renderItem: (item: ItemT, index: number) => ReactNode;
};

export default function GridView<ItemT = any>({
  data,
  mainAxis,
  mainNum,
  mainGap = 0,
  crossGap = 0,
  renderItem,
}: GridViewProps<ItemT>) {
  if (mainNum <= 0) throw new Error("mainNum must be >= 1");

  const crossAxis = mainAxis === "column" ? "row" : "column";
  const group = useMemo(() => {
    const array: ItemT[][] = [];
    let index = 0;
    let backet: ItemT[] = [];

    for (let idx = 0; idx < data.length; idx++) {
      backet.push(data[idx]);
      if (idx % mainNum == mainNum - 1) {
        array[index] = backet;
        backet = [];
        index++;
      }
    }

    if (backet.length > 0) {
      array[index] = backet;
    }

    return array;
  }, [data, mainNum]);

  if (group == undefined) return null;
  return (
    <View style={{ flexDirection: crossAxis, gap: crossGap }}>
      {group.map((group, groupIdx) => (
        <View key={groupIdx} style={{ flexDirection: mainAxis, gap: mainGap }}>
          {group.map((item, itemIdx) => (
            <React.Fragment key={itemIdx}>
              {renderItem(item, itemIdx)}
            </React.Fragment>
          ))}
        </View>
      ))}
    </View>
  );
}
