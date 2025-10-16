# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.yoga.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep React Native modules
-keep class * extends com.facebook.react.bridge.ReactContextBaseJavaModule { *; }
-keep class * extends com.facebook.react.bridge.BaseJavaModule { *; }
-keep class * extends com.facebook.react.uimanager.SimpleViewManager { *; }
-keep class * extends com.facebook.react.uimanager.ViewManager { *; }

# Keep React Native packages
-keep class com.facebook.react.uimanager.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.modules.** { *; }

# Keep Stripe
-keep class com.stripe.** { *; }

# Keep Onfido
-keep class com.onfido.** { *; }

# Keep Vision Camera
-keep class com.mrousavy.camera.** { *; }

# Keep ML Kit classes
-keep class com.google.mlkit.** { *; }
-keep class com.google.android.gms.** { *; }
-keep class com.google.mlkit.vision.barcode.Barcode { *; }
-keep class com.google.mlkit.vision.text.TextRecognizerOptions { *; }

# Keep Stripe push provisioning classes
-keep class com.stripe.android.pushProvisioning.** { *; }
-keep class com.stripe.android.pushProvisioning.PushProvisioningActivity$g { *; }
-keep class com.stripe.android.pushProvisioning.PushProvisioningActivityStarter$Args { *; }
-keep class com.stripe.android.pushProvisioning.PushProvisioningActivityStarter$Error { *; }
-keep class com.stripe.android.pushProvisioning.PushProvisioningActivityStarter { *; }
-keep class com.stripe.android.pushProvisioning.PushProvisioningEphemeralKeyProvider { *; }

# Remove logging
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}

# Remove debug information
-renamesourcefileattribute SourceFile
-keepattributes SourceFile,LineNumberTable

# Additional optimizations for smaller APK
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification
-dontpreverify

# Remove unused resources
-dontwarn android.support.**
-dontwarn com.facebook.react.**
-dontwarn com.facebook.jni.**

# Keep only necessary classes
-keep class com.doko.** { *; }

# Remove unused code
-assumenosideeffects class * {
    public static void d(...);
    public static void v(...);
    public static void i(...);
}

# Optimize for size
-optimizationpasses 5
-allowaccessmodification
-dontpreverify
