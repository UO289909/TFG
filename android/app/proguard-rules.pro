# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native / Hermes / SoLoader
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.soloader.** { *; }
-keep class com.facebook.react.soloader.** { *; }
-dontwarn com.facebook.hermes.**
-dontwarn com.facebook.react.**

# Devsupport / Inspector
-keep class com.facebook.react.devsupport.** { *; }

# TurboModule / Bridge
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.bridge.** { *; }

# Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }

# OkHttp / Networking
-dontwarn okhttp3.**
-dontwarn okio.**

# Text / Vector
-keep class com.facebook.react.views.text.** { *; }

# AndroidX
-dontwarn androidx.annotation.**