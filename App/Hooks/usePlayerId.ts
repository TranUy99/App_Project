// hooks/usePlayerId.ts
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

export function usePlayerId() {
    const [playerId, setPlayerId] = useState<string | null>(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        const fetchPlayerId = async () => {
            try {
                const storedId = await AsyncStorage.getItem("player_id");
                if (storedId) {
                    setPlayerId(storedId);
                } else {
                    console.log("No player_id found in storage");
                    setPlayerId(null);
                }
            } catch (error) {
                console.error("Error getting player_id:", error);
            }
        };

        if (isFocused) {
            fetchPlayerId();
        }
    }, [isFocused]);

    return playerId;
}
