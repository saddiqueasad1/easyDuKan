import * as ImagePicker from "expo-image-picker";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";
import DropDownMenu from "./DropDownMenu";

const FilePickerModal = (
  { onFilesSelected, multi = false, setPermission },
  ref
) => {
  const { t } = useTranslation();
  const [isVisible, setVisible] = useState(false);
  const [check, setCheck] = useState(false);

  useEffect(() => {
    async function a() {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setCheck(status);
    }
    a();
  }, []);
  useImperativeHandle(ref, () => ({
    show: function () {
      setVisible(true);
    },
    hide: function () {
      setVisible(false);
    },
    cleanTempImages: () => {
      ImagePicker.cleanTempImages()
        .then(() => {
          console.log("removed all tmp images from tmp directory");
        })
        .catch(console.log);
    },
  }));
  const openCamera = async () => {
    try {
      if (check !== "granted") {
        Linking.openSettings();
      }
      await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.5,
      })
        .then((a) => onFilesSelected(a.assets))
        .catch((e) => console.log("my log", e));
    } catch (error) {
      console.error("Image picker error:", error);
    }
  };
  const openGallery = async () => {
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: multi,
      selectionLimit: 7,
      aspect: [4, 3],
      quality: 0.5,
    })
      .then((a) => onFilesSelected(a.assets))
      .catch((e) => console.log("my log", e));
  };

  function openPicker(type = 0) {
    setVisible(false);
    setTimeout(type == 0 ? openCamera : openGallery, 400);
  }
  return (
    <DropDownMenu
      isVisible={isVisible}
      firstBtnText={t("addPost.takephoto")}
      secondBtnText={t("addPost.choosefromgallery")}
      onPressFirstBtn={() => openPicker(0)}
      onPressSecondBtn={() => openPicker(1)}
      onClose={() => setVisible(false)}
    />
  );
};
export default forwardRef(FilePickerModal);
