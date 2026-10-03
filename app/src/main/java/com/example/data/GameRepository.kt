package com.example.data

import android.content.Context
import android.util.Log
import com.example.R
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.google.firebase.firestore.snapshots
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.tasks.await

private const val TAG = "GameRepository"

class GameRepository(private val db: FirebaseFirestore) {

    constructor(context: Context) : this(
        FirebaseFirestore.getInstance(
            context.applicationContext.getString(R.string.firestore_database_id)
        )
    )

    /**
     * Saves or updates the player's game progress in /users/{userId}
     */
    suspend fun saveUserProfile(profile: UserProfile): Result<Unit> = runCatching {
        require(profile.userId.isNotBlank()) { "User ID cannot be blank when saving profile" }
        db.collection("users")
            .document(profile.userId)
            .set(profile)
            .await()
        Log.d(TAG, "Successfully synced user profile for ${profile.userId}")
    }

    /**
     * Fetches the current user profile from /users/{userId}
     */
    suspend fun getUserProfile(userId: String): Result<UserProfile?> = runCatching {
        require(userId.isNotBlank()) { "User ID cannot be blank" }
        val snapshot = db.collection("users")
            .document(userId)
            .get()
            .await()
        if (snapshot.exists()) {
            snapshot.toObject(UserProfile::class.java)
        } else {
            null
        }
    }

    /**
     * Observes real-time updates for /users/{userId}
     */
    fun observeUserProfile(userId: String): Flow<UserProfile?> = callbackFlow {
        if (userId.isBlank()) {
            trySend(null)
            close()
            return@callbackFlow
        }

        val docRef = db.collection("users").document(userId)
        val registration = docRef.addSnapshotListener { snapshot, error ->
            if (error != null) {
                Log.w(TAG, "Failed to observe user profile: ${error.message}", error)
                return@addSnapshotListener
            }
            val profile = if (snapshot != null && snapshot.exists()) {
                snapshot.toObject(UserProfile::class.java)
            } else {
                null
            }
            trySend(profile)
        }

        awaitClose { registration.remove() }
    }

    /**
     * Submits a fast level completion record to /leaderboard/{entryId}
     */
    suspend fun submitLeaderboardScore(entry: LeaderboardEntry): Result<Unit> = runCatching {
        require(entry.userId.isNotBlank()) { "User ID cannot be blank" }
        val docRef = if (entry.entryId.isNotBlank()) {
            db.collection("leaderboard").document(entry.entryId)
        } else {
            db.collection("leaderboard").document()
        }
        val recordToSave = entry.copy(entryId = docRef.id)
        docRef.set(recordToSave).await()
        Log.d(TAG, "Leaderboard score submitted for level ${entry.level}")
    }

    /**
     * Observes top leaderboard scores for a given level
     */
    fun observeLeaderboard(level: Int): Flow<List<LeaderboardEntry>> = callbackFlow {
        val query = db.collection("leaderboard")
            .whereEqualTo("level", level)
            .orderBy("timeTaken", Query.Direction.ASCENDING)
            .limit(10)

        val registration = query.addSnapshotListener { snapshot, error ->
            if (error != null) {
                Log.w(TAG, "Failed to observe leaderboard: ${error.message}", error)
                return@addSnapshotListener
            }
            val list = snapshot?.documents?.mapNotNull { it.toObject(LeaderboardEntry::class.java) } ?: emptyList()
            trySend(list)
        }

        awaitClose { registration.remove() }
    }
}
