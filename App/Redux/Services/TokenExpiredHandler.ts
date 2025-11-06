import { useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector } from '../Reducers/selector'
import { usePlayerId } from '../../Hooks/usePlayerId'
import { POST_LOGOUT_TOKEN_EXPIRED } from '../Actions/authActions'
import api from './api'

const TokenExpiredHandler = () => {
    const navigation: any = useNavigation()
    const dispatch = useDispatch()
    const isHandlingRef = useRef(false)
    const { tokenAccount } = useSelector(authSelector)
    const playerId = usePlayerId();
    useEffect(() => {
        const handleTokenExpired = () => {
            // Tránh gọi nhiều lần cùng lúc
            if (isHandlingRef.current) {
                return
            }
            isHandlingRef.current = true

            try {
                dispatch({
                    type: POST_LOGOUT_TOKEN_EXPIRED,
                    payload: {
                        body: {
                            player_id: playerId,
                        },
                        token: tokenAccount,
                    },
                })
                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'AuthStackScreen', params: { screen: 'LoginScreen' } }],
                    })
                    isHandlingRef.current = false
                }, 800)
            } catch (error) {
                console.error('Lỗi khi xử lý token hết hạn:', error)
                isHandlingRef.current = false
            }
        }

        // Set callback cho api service
        api.setTokenExpiredCallback(handleTokenExpired)

        return () => {
            // Cleanup
            api.setTokenExpiredCallback(() => { })
        }
    }, [dispatch, navigation])

    return null
}

export default TokenExpiredHandler
