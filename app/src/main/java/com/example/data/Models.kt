package com.example.data

import com.google.firebase.Timestamp
import com.google.firebase.firestore.DocumentId

/**
 * Cloud-persisted user profile and game progress.
 * Stored at /users/{userId}
 */
data class UserProfile(
    @DocumentId
    val userId: String = "",
    val coins: Int = 100,
    val highestUnlockedLevel: Int = 1,
    val selectedCar: String = "beetle",
    val unlockedCars: List<String> = listOf("beetle"),
    val carPaints: Map<String, String> = mapOf("beetle" to "#ffcc00"),
    val carUpgrades: Map<String, Map<String, Long>> = emptyMap(),
    val levelStars: Map<String, Long> = mapOf("1" to 0L),
    val updatedAt: Timestamp = Timestamp.now()
)

/**
 * Global leaderboard record for level completion times.
 * Stored at /leaderboard/{entryId}
 */
data class LeaderboardEntry(
    @DocumentId
    val entryId: String = "",
    val userId: String = "",
    val displayName: String = "Adventurer",
    val level: Int = 1,
    val timeTaken: Double = 0.0,
    val stars: Int = 1,
    val createdAt: Timestamp = Timestamp.now()
)
