import { Dimensions } from "react-native";
const width = (number) => {
  let fullWidth = Dimensions.get("window").width;
  if (number >= 100) return fullWidth;
  else if (number <= 0) return 0;
  else return fullWidth * (number / 100);
};
const height = (number) => {
  let fullHeight = Dimensions.get("window").height;
  if (number >= 100) return fullHeight;
  else if (number <= 0) return 0;
  else return fullHeight * (number / 100);
};
const urlImage="https://cdn-icons-png.flaticon.com/512/149/149071.png"
export { height, width,urlImage };

