import { Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import UpdateVersionAppComponent from './UpdateVersionAppComponents'
interface Props {
  visible: boolean
}
const UpdateVersionModal = ({ visible }: Props) => {
  if (!visible) return null
  return (
    <Modal visible={visible} transparent animationType="fade" style={styles.modal}>
      <TouchableWithoutFeedback>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <UpdateVersionAppComponent />
      </View>
    </Modal>
  )
}

export default UpdateVersionModal

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
