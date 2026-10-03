package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.auth.AuthManager
import com.example.data.GameRepository
import com.example.ui.AuthUiState
import com.example.ui.AuthViewModel
import com.example.ui.GameContainer
import com.example.ui.SignInScreen

class MainActivity : ComponentActivity() {

    private val authManager by lazy { AuthManager(applicationContext) }
    private val gameRepository by lazy { GameRepository(applicationContext) }

    private val authViewModel: AuthViewModel by viewModels {
        object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                return AuthViewModel(authManager, gameRepository) as T
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Enable edge-to-edge immersive sticky fullscreen
        hideSystemBars()

        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier
                        .fillMaxSize()
                        .testTag("main_surface")
                ) {
                    AppRoot(
                        authViewModel = authViewModel,
                        gameRepository = gameRepository
                    )
                }
            }
        }
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) {
            hideSystemBars()
        }
    }

    private fun hideSystemBars() {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        val insetsController = WindowCompat.getInsetsController(window, window.decorView)
        insetsController.systemBarsBehavior =
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        insetsController.hide(WindowInsetsCompat.Type.systemBars())
    }
}

@Composable
fun AppRoot(
    authViewModel: AuthViewModel,
    gameRepository: GameRepository,
    modifier: Modifier = Modifier
) {
    val currentUser by authViewModel.currentUser.collectAsStateWithLifecycle()
    val uiState by authViewModel.uiState.collectAsStateWithLifecycle()

    val user = currentUser
    if (user == null) {
        // Auth Gate: Interactive Sign-In with Google
        SignInScreen(
            uiState = uiState,
            onSignInClicked = { authViewModel.signInWithGoogle() },
            onClearError = { authViewModel.clearError() },
            modifier = modifier
        )
    } else {
        // Authenticated Session: Pass user and repository to feature
        GameContainer(
            currentUser = user,
            gameRepository = gameRepository,
            onSignOutClicked = { authViewModel.signOut() },
            modifier = modifier
        )
    }
}
