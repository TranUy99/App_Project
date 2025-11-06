import { Dimensions } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const deviceWidth = Dimensions.get("window").width;

export const WIDTH_DESIGN = 375;
export const HEIGHT_DESIGN = 812;

export function FormatNumber(numTemp: string | number) {
    var strTemp = "" + numTemp;
    if (strTemp == "undefined") {
        return 0;
    } else {
        if (strTemp.length <= 3) return strTemp;
        let strResult = "";
        for (var i = 0; i < strTemp.length; i++) strTemp = strTemp.replace(".", "");
        var m = strTemp.lastIndexOf(".");
        if (m == -1) {
            for (var i = strTemp.length; i >= 0; i--) {
                if (strResult.length > 0 && (strTemp.length - i - 1) % 3 == 0) strResult = "," + strResult;
                strResult = strTemp.substring(i, i + 1) + strResult;
            }
        } else {
            var strphannguyen = strTemp.substring(0, strTemp.lastIndexOf("."));
            var strphanthapphan = strTemp.substring(strTemp.lastIndexOf("."), strTemp.length);
            var tam = 0;
            for (var i = strphannguyen.length; i >= 0; i--) {
                if (strResult.length > 0 && tam == 4) {
                    strResult = "," + strResult;
                    tam = 1;
                }

                strResult = strphannguyen.substring(i, i + 1) + strResult;
                tam = tam + 1;
            }
            strResult = strResult + strphanthapphan;
        }
        return strResult;
    }
}
export const formatDateD = (date: any) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};
export const toDeviceDp = function (designDp = 0, widthOrHeight = 0) {
    // 0 width, 1 height
    if (deviceWidth < WIDTH_DESIGN) {
        if (widthOrHeight === 0) {
            // based on width
            return wp((designDp * 100) / WIDTH_DESIGN);
        } else {
            return hp((designDp * 100) / HEIGHT_DESIGN);
        }
    } else {
        return designDp;
    }
};