package vn.m4uapp

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen;

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState) // hoặc super.onCreate(null) nếu bạn có lý do đặc biệt
    }

    override fun getMainComponentName(): String = "m4uapp"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
