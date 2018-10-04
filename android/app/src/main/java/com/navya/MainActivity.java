package com.navya;

import com.facebook.react.ReactActivity;

import android.os.Bundle;
import android.widget.ImageView;
import com.reactnativecomponent.splashscreen.RCTSplashScreen;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        RCTSplashScreen.openSplashScreen(this); // here
        // RCTSplashScreen.openSplashScreen(this, true, ImageView.ScaleToFit.CENTER);
        super.onCreate(savedInstanceState);
    }
    @Override
    protected String getMainComponentName() {
        return "Navya";
    }
}
