// import { Linking, Platform, Share, ToastAndroid } from "react-native";
import { formatDistanceToNow } from "date-fns";
import { es, de, it, enUS, fr } from "date-fns/locale";

import { height, width } from "./Dimension";
// export const toastMessage = (message) => {
//   ToastAndroid.show(message, ToastAndroid.SHORT);
// };
import { showMessage } from "react-native-flash-message";

export const successMessage = (description = "", message = "success") => {
  showMessage({
    message: message,
    description: description,
    type: "success",
    position: "top",
    statusBarHeight: height(4),
    floating: true,
    duration: 5000,
  });
};
export const errorMessage = (description = "", message = "error") => {
  showMessage({
    message: message,
    description: description,
    type: "danger",
    position: "top",
    statusBarHeight: height(4),
    floating: true,
    duration: 5000,
  });
};
export const infoMessage = (description = "", message = "info") => {
  showMessage({
    message: message,
    description: description,
    type: "info",
    position: "top",
    statusBarHeight: height(4),
    floating: true,
    duration: 5000,
  });
};

// const onPressCall = (phoneNumber) => {
//   const url =
//     Platform.OS == "ios" ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;

//   Linking.openURL(url)
//     .then((result) => {
//       if (result) {
//         console.log("Phone app opened successfully");
//       } else {
//         console.log("Unable to open phone app");
//       }
//     })
//     .catch((error) => console.error("Error opening phone app:", error));
// };
// const onPressEmail = (email, mymail, message = "") => {
//   const subject = `${message}`; // Optional: Replace with the subject of your email

//   const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
//   `mailto:${email}?subject=${encodeURIComponent(
//     subject
//   )}&cc=${encodeURIComponent(mymail)}`;

//   Linking.openURL(url)
//     .then((result) => {
//       if (result) {
//         console.log("Email app opened successfully");
//       } else {
//         console.log("Unable to open email app");
//       }
//     })
//     .catch((error) => console.error("Error opening email app:", error));
// };
// const onPressShare = async (id, title) => {
//   let message = `${WebLink}`;
//   try {
//     const result = await Share.share({
//       message: Platform.OS == "android" && `${title}\n${message}`,
//       title: "Eidcarosse",
//       url: message,
//     });
//   } catch (error) {
//     console.error("Error sharing:", error);
//   }
// };

// const openWhatsApp = (phoneNumber) => {
//   // Construct the WhatsApp URL
//   const whatsappURL = `whatsapp://send?phone=${phoneNumber}`;

//   // Open WhatsApp with the constructed URL
//   Linking.openURL(whatsappURL)
//     .then(() => {
//       console.log("WhatsApp opened successfully");
//     })
//     .catch((error) => {
//       console.error("Error opening WhatsApp:", error);
//       errorMessage("Whatsapp not exist");
//     });
// };
// const openWhatsAppChannel = (link) => {
//   Linking.openURL(link)
//     .then(() => {
//       console.log("WhatsApp opened successfully");
//     })
//     .catch((error) => {
//       Linking.openURL("https://whatsapp.com");
//       console.error("Error opening WhatsApp CHANEL", error);
//     });
// };

const calculateTimeDifference = (createdAt, l) => {
  let locale;
  switch (l) {
    case "fr":
      locale = fr;
      break;
    case "de":
      locale = de;
      break;
    case "it":
      locale = it;
      break;
    case "es":
      locale = es;
      break;
    case "en":
      locale = enUS;
      break;
    default:
      locale = de;
  }
  const distance = formatDistanceToNow(new Date(createdAt), {
    locale,
    addSuffix: true,
  });
  return distance;
};

const GlobalMethods = {
  calculateTimeDifference,
};
export default GlobalMethods;
