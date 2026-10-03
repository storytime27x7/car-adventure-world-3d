package com.example.ui

import android.annotation.SuppressLint
import android.content.Context
import android.util.Log
import android.view.View
import android.webkit.ConsoleMessage
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CloudDone
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import com.example.data.GameRepository
import com.example.data.LeaderboardEntry
import com.example.data.UserProfile
import com.google.firebase.auth.FirebaseUser
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONObject

private const val TAG = "GameContainer"

class WebAppInterface(
    private val currentUser: FirebaseUser,
    private val gameRepository: GameRepository,
    private val scope: CoroutineScope
) {
    @JavascriptInterface
    fun saveProgress(jsonString: String) {
        scope.launch(Dispatchers.IO) {
            try {
                val json = JSONObject(jsonString)
                val coins = json.optInt("coins", 100)
                val highestLvl = json.optInt("highestUnlockedLevel", 1)
                val selectedCar = json.optString("selectedCar", "beetle")

                val unlockedCarsList = mutableListOf<String>()
                val carsArr = json.optJSONArray("unlockedCars")
                if (carsArr != null) {
                    for (i in 0 until carsArr.length()) {
                        unlockedCarsList.add(carsArr.getString(i))
                    }
                } else {
                    unlockedCarsList.add("beetle")
                }

                val profile = UserProfile(
                    userId = currentUser.uid,
                    coins = coins,
                    highestUnlockedLevel = highestLvl,
                    selectedCar = selectedCar,
                    unlockedCars = unlockedCarsList
                )
                gameRepository.saveUserProfile(profile)
            } catch (e: Exception) {
                Log.e(TAG, "Error saving cloud progress: ${e.message}", e)
            }
        }
    }

    @JavascriptInterface
    fun submitScore(level: Int, timeTaken: Double, stars: Int) {
        scope.launch(Dispatchers.IO) {
            try {
                val entry = LeaderboardEntry(
                    userId = currentUser.uid,
                    displayName = currentUser.displayName ?: "Adventurer",
                    level = level,
                    timeTaken = timeTaken,
                    stars = stars
                )
                gameRepository.submitLeaderboardScore(entry)
            } catch (e: Exception) {
                Log.e(TAG, "Error submitting score to leaderboard: ${e.message}", e)
            }
        }
    }

    @JavascriptInterface
    fun getUserDisplayName(): String {
        return currentUser.displayName ?: "Adventurer"
    }

    @JavascriptInterface
    fun getUserId(): String {
        return currentUser.uid
    }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun GameContainer(
    currentUser: FirebaseUser,
    gameRepository: GameRepository,
    onSignOutClicked: () -> Unit,
    modifier: Modifier = Modifier
) {
    val scope = rememberCoroutineScope()

    Box(
        modifier = modifier
            .fillMaxSize()
            .testTag("game_container")
    ) {
        // Main Three.js Game WebView
        AndroidView(
            modifier = Modifier
                .fillMaxSize()
                .testTag("game_webview"),
            factory = { context ->
                WebView(context).apply {
                    settings.apply {
                        javaScriptEnabled = true
                        domStorageEnabled = true
                        databaseEnabled = true
                        allowFileAccess = true
                        allowContentAccess = true
                        mediaPlaybackRequiresUserGesture = false
                        cacheMode = WebSettings.LOAD_DEFAULT
                        useWideViewPort = true
                        loadWithOverviewMode = true
                        setSupportZoom(false)
                        builtInZoomControls = false
                        displayZoomControls = false
                    }

                    setLayerType(View.LAYER_TYPE_HARDWARE, null)

                    val jsBridge = WebAppInterface(currentUser, gameRepository, scope)
                    addJavascriptInterface(jsBridge, "AndroidFirebase")

                    webViewClient = object : WebViewClient() {
                        override fun onPageFinished(view: WebView?, url: String?) {
                            super.onPageFinished(view, url)
                            // Inject user identity into game session
                            val name = currentUser.displayName ?: "Player"
                            view?.evaluateJavascript(
                                "if (window.onCloudUserConnected) window.onCloudUserConnected('${currentUser.uid}', '$name');",
                                null
                            )
                        }
                    }

                    webChromeClient = object : WebChromeClient() {
                        override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                            return super.onConsoleMessage(consoleMessage)
                        }
                    }

                    loadUrl("file:///android_asset/index.html")
                }
            }
        )

        // Floating Cloud Sync Status Pill (Top Right, Non-intrusive)
        Row(
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(top = 10.dp, end = 16.dp)
                .background(Color(0xFF0F172A).copy(alpha = 0.85f), RoundedCornerShape(20.dp))
                .padding(horizontal = 10.dp, vertical = 4.dp)
                .testTag("cloud_sync_pill"),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .background(Color(0xFF34C759), CircleShape)
            )
            Icon(
                imageVector = Icons.Default.CloudDone,
                contentDescription = "Cloud Synced",
                tint = Color(0xFF00E5FF),
                modifier = Modifier.size(16.dp)
            )
            Text(
                text = currentUser.displayName ?: "Adventurer",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
            Spacer(modifier = Modifier.width(4.dp))
            IconButton(
                onClick = onSignOutClicked,
                modifier = Modifier
                    .size(24.dp)
                    .testTag("sign_out_button")
            ) {
                Icon(
                    imageVector = Icons.Default.ExitToApp,
                    contentDescription = "Sign Out",
                    tint = Color(0xFFFF9500),
                    modifier = Modifier.size(16.dp)
                )
            }
        }
    }
}
