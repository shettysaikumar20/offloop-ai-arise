# OffLoop AI Proguard Rules
-keepattributes *Annotation*
-keepclassmembers class * {
    @androidx.room.* <methods>;
}
-keep class com.offloop.ai.data.model.** { *; }
-keep class com.offloop.ai.data.remote.** { *; }
