package com.offloop.ai.camera

import android.content.Context
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.core.content.ContextCompat
import java.io.File
import java.text.SimpleDateFormat
import java.util.*

class PhotoCaptureHelper(private val context: Context) {

    fun createLocalPhotoFile(): File {
        val storageDir = context.getExternalFilesDir(null) ?: context.filesDir
        val timeStamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(Date())
        return File(storageDir, "OFFLOOP_QUEST_$timeStamp.jpg")
    }

    fun takePhoto(
        imageCapture: ImageCapture,
        onPhotoSaved: (String) -> Unit,
        onError: (ImageCaptureException) -> Unit
    ) {
        val photoFile = createLocalPhotoFile()
        val outputOptions = ImageCapture.OutputFileOptions.Builder(photoFile).build()

        imageCapture.takePicture(
            outputOptions,
            ContextCompat.getMainExecutor(context),
            object : ImageCapture.OnImageSavedCallback {
                override fun onImageSaved(outputFileResults: ImageCapture.OutputFileResults) {
                    onPhotoSaved(photoFile.absolutePath)
                }

                override fun onError(exception: ImageCaptureException) {
                    onError(exception)
                }
            }
        )
    }
}
