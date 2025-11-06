import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { Colors } from "../Themes";

export const ShowAlertSuccess = (textSuccess: string) => {
    if (textSuccess !== "") {
        Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Thông báo",
            titleStyle: { color: Colors.black },
            textBody: textSuccess,
            autoClose: 20000,
            textBodyStyle: { color: Colors.black },
        });
    }
};

export const ShowAlertFailure = (textFailure: string) => {
    if (textFailure !== "") {
        Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Thông báo",
            titleStyle: { color: Colors.black },
            textBody: textFailure,
            autoClose: 2000,
            textBodyStyle: { color: Colors.black },
        });
    }
};
