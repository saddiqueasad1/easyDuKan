import { useIsFocused } from "@react-navigation/native";
import React, { Fragment, useContext } from "react";
import {
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { height, width } from "../utills/Dimension";
import { Color as AppColors } from "../utills/GlobalStyles";
export default function ScreenWrapper({
  children,
  statusBarColor = 'white',
  transclucent = false,
  scrollEnabled = false,
  backgroundImage,
  containerViewStyle = {},
  contentContainerStyle = {},
  headerUnScrollable = () => null,
  footerUnScrollable = () => null,
  backgroundColor ='white',
  imageBackgroundColor = 'white',
  barStyle = "dark-content",
  onTouchEnd,
  refreshing = false,
  onRefresh,
  showStatusBar = false,
  scrollViewRef,
}) {
//   const { AppColors } = useContext(ThemeContext);
  const styles = getStyles(AppColors);
  if (backgroundImage) {
    backgroundColor = AppColors.transparent;
  }
  function FocusAwareStatusBar(props) {
    const isFocused = useIsFocused();
    return isFocused ? <StatusBar {...props} hidden={showStatusBar} /> : null;
  }
  const content = () => {
    return (
      <>
        {headerUnScrollable()}
        <View
          style={[
            styles.mainViewContainer,
            containerViewStyle,
            {
              backgroundColor: transclucent
                ? AppColors.transparent
                : backgroundColor,
            },
          ]}
        >
          {scrollEnabled ? (
            <KeyboardAwareScrollView
              ref={scrollViewRef}
              contentContainerStyle={[
                styles.contentContainer,
                contentContainerStyle,
              ]}
              refreshControl={
                <RefreshControl
                  tintColor={AppColors.primary}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[AppColors.primary]}
                />
              }
              keyboardShouldPersistTaps="handled"
              enableAutomaticScroll={true}
              enableOnAndroid={true}
              extraHeight={100}
              enableResetScrollToCoords={false}
              extraScrollHeight={height(8)}
              showsVerticalScrollIndicator={false}
              onTouchEnd={onTouchEnd}
            >
              {children}
            </KeyboardAwareScrollView>
          ) : (
            children
          )}
          {footerUnScrollable()}
        </View>
      </>
    );
  };
  return (
    <Fragment>
      <FocusAwareStatusBar
        barStyle={barStyle}
        backgroundColor={statusBarColor}
        translucent={transclucent}
      />
      {!transclucent && (
        <SafeAreaView style={{ backgroundColor: statusBarColor }} />
      )}
      {backgroundImage ? (
        <ImageBackground
          source={backgroundImage}
          style={[
            styles.container,
            {
              height: height(30),
              marginTop: width(7),
            },
            { backgroundColor: imageBackgroundColor },
          ]}
          resizeMode={"center"}
        >
          {content()}
        </ImageBackground>
      ) : (
        content()
      )}
    </Fragment>
  );
}
import { StyleSheet } from "react-native";

const getStyles = (AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    mainViewContainer: {
      flex: 1,
    },
    contentContainer: {},
  });
export {getStyles};
