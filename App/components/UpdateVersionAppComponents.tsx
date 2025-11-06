import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ApplicationStyles, Colors, Fonts, MetricsRes } from '../Themes'
import { useSelector } from 'react-redux'
import { settingSelector } from '../Redux/Reducers/selector'

const URL_APP_STORE =
  'https://apps.apple.com/us/app/supportmobile-thu-mua-m%C3%A1y-c%C5%A9/id6751322300'
const URL_CH_PLAY = 'https://play.google.com/store/apps/details?id=com.supportmobile'

const UpdateVersionAppComponent = () => {
  const { dataSetting } = useSelector(settingSelector)
  let newVersion = Platform.OS == 'ios' ? `(${dataSetting?.version_app})` : `(${dataSetting?.version_app_android})`;

  const onPress = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL(URL_APP_STORE)
    } else {
      Linking.openURL(URL_CH_PLAY)
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Cập nhật ứng dụng mới nhất ${newVersion}`}</Text>
      <Text style={styles.description}>{dataSetting?.note_version_app}</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text>Cập nhật</Text>
      </TouchableOpacity>
    </View>
  )
}

export default UpdateVersionAppComponent

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: MetricsRes.radius.large,
    padding: MetricsRes.margin.base,
    width: '90%',
  },
  title: {
    fontSize: Fonts.size.h20,
    fontWeight: '700',
    color: Colors.gray,
    fontFamily: ApplicationStyles.fontFamily.bold,
    textAlign: 'center',
    marginBottom: MetricsRes.margin.medium,
  },
  description: {
    fontSize: Fonts.size.h14,
    fontWeight: '400',
    color: Colors.gray,
    fontFamily: ApplicationStyles.fontFamily.regular,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginTop: MetricsRes.margin.medium,
  },
})
