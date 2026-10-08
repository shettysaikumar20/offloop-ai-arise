package com.offloop.ai.location

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow

class CompassSensorHelper(context: Context) {
    private val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private val accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
    private val magnetometer = sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD)
    private val rotationVector = sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR)

    val compassHeadingFlow: Flow<Float> = callbackFlow {
        var lastAzimuth = 0f

        val listener = object : SensorEventListener {
            private val gravity = FloatArray(3)
            private val geomagnetic = FloatArray(3)
            private val rotationMatrix = FloatArray(9)
            private val orientation = FloatArray(3)

            override fun onSensorChanged(event: SensorEvent) {
                if (event.sensor.type == Sensor.TYPE_ROTATION_VECTOR) {
                    SensorManager.getRotationMatrixFromVector(rotationMatrix, event.values)
                    SensorManager.getOrientation(rotationMatrix, orientation)
                    val azimuth = (Math.toDegrees(orientation[0].toDouble()) + 360) % 360
                    // Low pass smoothing filter
                    lastAzimuth = (lastAzimuth * 0.75f + azimuth.toFloat() * 0.25f)
                    trySend(lastAzimuth)
                    return
                }

                if (event.sensor.type == Sensor.TYPE_ACCELEROMETER) {
                    System.arraycopy(event.values, 0, gravity, 0, 3)
                } else if (event.sensor.type == Sensor.TYPE_MAGNETIC_FIELD) {
                    System.arraycopy(event.values, 0, geomagnetic, 0, 3)
                }

                if (SensorManager.getRotationMatrix(rotationMatrix, null, gravity, geomagnetic)) {
                    SensorManager.getOrientation(rotationMatrix, orientation)
                    val azimuth = (Math.toDegrees(orientation[0].toDouble()) + 360) % 360
                    lastAzimuth = (lastAzimuth * 0.75f + azimuth.toFloat() * 0.25f)
                    trySend(lastAzimuth)
                }
            }

            override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
        }

        if (rotationVector != null) {
            sensorManager.registerListener(listener, rotationVector, SensorManager.SENSOR_DELAY_UI)
        } else {
            sensorManager.registerListener(listener, accelerometer, SensorManager.SENSOR_DELAY_UI)
            sensorManager.registerListener(listener, magnetometer, SensorManager.SENSOR_DELAY_UI)
        }

        awaitClose {
            sensorManager.unregisterListener(listener)
        }
    }
}
