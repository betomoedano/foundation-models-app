package expo.modules.foundationmodels

import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoFoundationModelsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoFoundationModels")

    // Foundation Models Methods - Android Implementation (Not Supported)
    AsyncFunction("checkAvailability") {
      getFoundationModelsAvailability()
    }
  }
  
  // Foundation Models is iOS-only, return not implemented for Android
  private fun getFoundationModelsAvailability(): Map<String, Any?> {
    val androidVersion = "Android ${Build.VERSION.RELEASE} (API ${Build.VERSION.SDK_INT})"
    
    return mapOf(
      "isAvailable" to false,
      "deviceSupported" to false,
      "osVersion" to androidVersion,
      "frameworkVersion" to null,
      "reason" to "Foundation Models framework is only available on iOS 26+ with Apple Intelligence. Android is not supported."
    )
  }
}
