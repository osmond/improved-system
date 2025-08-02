package com.improvedsystem.app

import android.os.Looper
import com.getcapacitor.BridgeActivity
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.PluginMethod
import com.getcapacitor.JSObject
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority

@CapacitorPlugin(name = "Location")
class LocationPlugin : Plugin() {
    private lateinit var fusedClient: FusedLocationProviderClient
    private var callback: LocationCallback? = null

    override fun load() {
        fusedClient = LocationServices.getFusedLocationProviderClient(context)
    }

    @PluginMethod
    fun start(call: PluginCall) {
        val request = LocationRequest.Builder(
            Priority.PRIORITY_BALANCED_POWER_ACCURACY,
            15 * 60 * 1000L
        ).setMinUpdateIntervalMillis(10 * 60 * 1000L).build()

        callback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                for (location in result.locations) {
                    val data = JSObject().apply {
                        put("timestamp", location.time)
                        put("lat", location.latitude)
                        put("lng", location.longitude)
                    }
                    notifyListeners("location", data)
                }
            }
        }

        fusedClient.requestLocationUpdates(request, callback!!, Looper.getMainLooper())
        call.resolve()
    }

    @PluginMethod
    fun stop(call: PluginCall) {
        callback?.let { fusedClient.removeLocationUpdates(it) }
        callback = null
        call.resolve()
    }
}

class MainActivity : BridgeActivity()
