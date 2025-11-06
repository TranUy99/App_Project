import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native'
import React from 'react'
import { ApplicationStyles, Colors, Fonts, Images, MetricsRes } from '../Themes'

const IntroScreen = () => {
  return (
    <ImageBackground source={Images.bg_intro} style={styles.container} resizeMode="cover">
      <Image source={Images.logo} style={styles.logo} />
      <Text style={styles.title}>Select your language</Text>
      <Text style={styles.subTitle}>Please choose the language you want to use on this App.</Text>
    </ImageBackground>
  )
}

export default IntroScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: MetricsRes.margin.huge,
  },

  logo: {
    width: MetricsRes.screenWidth * 0.5,
    height: MetricsRes.screenWidth * 0.5,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: MetricsRes.screenHeight * 0.1,
  },
  title: {
    fontSize: Fonts.size.h24,
    fontFamily: ApplicationStyles.fontFamily.bold,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: MetricsRes.margin.base,
  },
  subTitle: {
    fontSize: Fonts.size.h14,
    fontFamily: ApplicationStyles.fontFamily.regular,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: MetricsRes.margin.base,
  },
})