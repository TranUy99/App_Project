import { Alert, PermissionsAndroid, Platform } from 'react-native'
import { Asset, launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { check, request, openSettings, PERMISSIONS, RESULTS } from 'react-native-permissions'

export type PickedFile = { uri: string; name: string; type: string }

let isAlertShowing = false
export const showOnce = (title: string, message: string, buttons: any[]) => {
  if (isAlertShowing) return
  isAlertShowing = true
  Alert.alert(title, message, buttons, { cancelable: true })
  setTimeout(() => {
    isAlertShowing = false
  }, 500)
}

// ===== iOS helpers: trả về { status, requestedNow } =====
type PermissionResult = { status: string; requestedNow: boolean }

const ensurePhotoLibraryPermissionIOS = async (): Promise<PermissionResult> => {
  try {
    let status = await check(PERMISSIONS.IOS.PHOTO_LIBRARY)
    let requestedNow = false

    // Nếu trạng thái hiện tại là DENIED (hoặc chưa từng hỏi), ta gọi request() đúng 1 lần.
    if (status === RESULTS.DENIED) {
      status = await request(PERMISSIONS.IOS.PHOTO_LIBRARY)
      requestedNow = true
    }

    return { status, requestedNow }
  } catch {
    return { status: RESULTS.DENIED, requestedNow: false }
  }
}

export const ensureCameraPermissionIOS: any = async (): Promise<PermissionResult> => {
  try {
    let status = await check(PERMISSIONS.IOS.CAMERA)
    let requestedNow = false

    if (status === RESULTS.DENIED) {
      status = await request(PERMISSIONS.IOS.CAMERA)
      requestedNow = true
    }

    return { status, requestedNow }
  } catch {
    return { status: RESULTS.DENIED, requestedNow: false }
  }
}

// ===== Android giữ nguyên =====
export const requestCameraPermission = async () => {
  if (Platform.OS !== 'android') return true
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Yêu cầu quyền Camera',
      message: 'Ứng dụng cần truy cập camera để chụp ảnh',
      buttonNeutral: 'Hỏi lại sau',
      buttonNegative: 'Từ chối',
      buttonPositive: 'Đồng ý',
    })
    return granted === PermissionsAndroid.RESULTS.GRANTED
  } catch {
    return false
  }
}

// ===== Handlers =====
export const showImagePickerAlert = (onSelected: (file: PickedFile) => void) => {
  const handlePressLibrary = () => {
    setTimeout(async () => {
      if (Platform.OS === 'ios') {
        const { status, requestedNow } = await ensurePhotoLibraryPermissionIOS()

        // Cho phép nếu GRANTED hoặc LIMITED
        if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
          launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, res => {
            const a: Asset | undefined = res.assets?.[0]
            if (a?.uri) {
              onSelected({
                uri: a.uri,
                name: a.fileName || 'image.jpg',
                type: a.type || 'image/jpeg',
              })
            }
          })
          return
        }

        // Nếu vừa mới request lần đầu mà user bấm Từ chối => KHÔNG hiện Alert (theo yêu cầu)
        if (requestedNow) return

        // Chỉ hiển thị Alert khi user bấm lại lần 2 trở đi và vẫn không có quyền
        if (status === RESULTS.BLOCKED || status === RESULTS.DENIED) {
          showOnce(
            'Thông báo',
            'Bạn đã từ chối quyền này, tính năng cập nhật hồ sơ sẽ không hoạt động. Bạn có muốn chuyển đến cài đặt để bật lại không?',
            [
              { text: 'Huỷ', style: 'cancel' },
              { text: 'Tiếp theo', onPress: () => openSettings() },
            ]
          )
        }
        return
      }

      // Android: image-picker sẽ tự xin quyền khi cần
      launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, res => {
        const a: Asset | undefined = res.assets?.[0]
        if (a?.uri) {
          onSelected({ uri: a.uri, name: a.fileName || 'image.jpg', type: a.type || 'image/jpeg' })
        }
      })
    }, 100)
  }

  const handlePressCamera = () => {
    setTimeout(async () => {
      if (Platform.OS === 'ios') {
        const { status, requestedNow } = await ensureCameraPermissionIOS()

        if (status === RESULTS.GRANTED) {
          launchCamera({ mediaType: 'photo' }, res => {
            const a: Asset | undefined = res.assets?.[0]
            if (a?.uri) {
              onSelected({
                uri: a.uri,
                name: a.fileName || 'image.jpg',
                type: a.type || 'image/jpeg',
              })
            }
          })
          return
        }

        if (requestedNow) return // Không show Alert ngay sau lần từ chối đầu tiên

        if (status === RESULTS.BLOCKED || status === RESULTS.DENIED) {
          showOnce(
            'Thông báo',
            'Bạn đã từ chối quyền này, tính năng cập nhật hồ sơ sẽ không hoạt động. Bạn có muốn chuyển đến cài đặt để bật lại không?',
            [
              { text: 'Huỷ', style: 'cancel' },
              { text: 'Tiếp theo', onPress: () => openSettings() },
            ]
          )
        }
        return
      }

      // Android
      const ok = await requestCameraPermission()
      if (!ok) return
      launchCamera({ mediaType: 'photo' }, res => {
        const a: Asset | undefined = res.assets?.[0]
        if (a?.uri) {
          onSelected({ uri: a.uri, name: a.fileName || 'image.jpg', type: a.type || 'image/jpeg' })
        }
      })
    }, 100)
  }

  Alert.alert(
    'Chọn ảnh',
    'Bạn muốn sử dụng ảnh từ đâu?',
    [
      { text: 'Thư viện', onPress: handlePressLibrary },
      { text: 'Chụp ảnh', onPress: handlePressCamera },
      { text: 'Huỷ', style: 'cancel' },
    ],
    { cancelable: true }
  )
}
export const showMultipleImagePickerAlert = (
  onSelected: (files: PickedFile[]) => void,
  maxCount: number = 5
) => {
  const handlePressLibrary = () => {
    setTimeout(async () => {
      if (Platform.OS === 'ios') {
        const { status, requestedNow } = await ensurePhotoLibraryPermissionIOS()

        // Cho phép nếu GRANTED hoặc LIMITED
        if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
          launchImageLibrary({ mediaType: 'photo', selectionLimit: maxCount }, res => {
            const assets = res.assets || []
            const files: PickedFile[] = assets.map(a => ({
              uri: a.uri || '',
              name: a.fileName || 'image.jpg',
              type: a.type || 'image/jpeg',
            }))
            if (files.length > 0) {
              onSelected(files)
            }
          })
          return
        }

        // Nếu vừa mới request lần đầu mà user bấm Từ chối => KHÔNG hiện Alert (theo yêu cầu)
        if (requestedNow) return

        // Chỉ hiển thị Alert khi user bấm lại lần 2 trở đi và vẫn không có quyền
        if (status === RESULTS.BLOCKED || status === RESULTS.DENIED) {
          showOnce(
            'Thông báo',
            'Bạn đã từ chối quyền này, tính năng cập nhật hồ sơ sẽ không hoạt động. Bạn có muốn chuyển đến cài đặt để bật lại không?',
            [
              { text: 'Huỷ', style: 'cancel' },
              { text: 'Tiếp theo', onPress: () => openSettings() },
            ]
          )
        }
        return
      }

      // Android: image-picker sẽ tự xin quyền khi cần
      launchImageLibrary({ mediaType: 'photo', selectionLimit: maxCount }, res => {
        const assets = res.assets || []
        const files: PickedFile[] = assets.map(a => ({
          uri: a.uri || '',
          name: a.fileName || 'image.jpg',
          type: a.type || 'image/jpeg',
        }))
        if (files.length > 0) {
          onSelected(files)
        }
      })
    }, 100)
  }

  const handlePressCamera = () => {
    setTimeout(async () => {
      if (Platform.OS === 'ios') {
        const { status, requestedNow } = await ensureCameraPermissionIOS()

        if (status === RESULTS.GRANTED) {
          launchCamera({ mediaType: 'photo' }, res => {
            const a: Asset | undefined = res.assets?.[0]
            if (a?.uri) {
              onSelected([
                {
                  uri: a.uri,
                  name: a.fileName || 'image.jpg',
                  type: a.type || 'image/jpeg',
                },
              ])
            }
          })
          return
        }

        if (requestedNow) return // Không show Alert ngay sau lần từ chối đầu tiên

        if (status === RESULTS.BLOCKED || status === RESULTS.DENIED) {
          showOnce(
            'Thông báo',
            'Bạn đã từ chối quyền này, tính năng cập nhật hồ sơ sẽ không hoạt động. Bạn có muốn chuyển đến cài đặt để bật lại không?',
            [
              { text: 'Huỷ', style: 'cancel' },
              { text: 'Tiếp theo', onPress: () => openSettings() },
            ]
          )
        }
        return
      }

      // Android
      const ok = await requestCameraPermission()
      if (!ok) return
      launchCamera({ mediaType: 'photo' }, res => {
        const a: Asset | undefined = res.assets?.[0]
        if (a?.uri) {
          onSelected([
            { uri: a.uri, name: a.fileName || 'image.jpg', type: a.type || 'image/jpeg' },
          ])
        }
      })
    }, 100)
  }

  Alert.alert(
    'Chọn ảnh',
    `Bạn có thể chọn tối đa ${maxCount} ảnh`,
    [
      { text: 'Thư viện', onPress: handlePressLibrary },
      { text: 'Chụp ảnh', onPress: handlePressCamera },
      { text: 'Huỷ', style: 'cancel' },
    ],
    { cancelable: true }
  )
}
