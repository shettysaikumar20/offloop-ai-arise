package com.offloop.ai.data.local

import androidx.room.TypeConverter
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.offloop.ai.model.Clue
import com.offloop.ai.model.ObservationTask
import com.offloop.ai.model.SocialChallenge

class Converters {
    private val gson = Gson()

    @TypeConverter
    fun fromClueList(value: List<Clue>?): String {
        return gson.toJson(value ?: emptyList<Clue>())
    }

    @TypeConverter
    fun toClueList(value: String): List<Clue> {
        val type = object : TypeToken<List<Clue>>() {}.type
        return try {
            gson.fromJson(value, type) ?: emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }

    @TypeConverter
    fun fromStringList(value: List<String>?): String {
        return gson.toJson(value ?: emptyList<String>())
    }

    @TypeConverter
    fun toStringList(value: String): List<String> {
        val type = object : TypeToken<List<String>>() {}.type
        return try {
            gson.fromJson(value, type) ?: emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }
}
