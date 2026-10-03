package com.example.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.auth.AuthManager
import com.example.data.GameRepository
import com.example.data.UserProfile
import com.google.firebase.auth.FirebaseUser
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

sealed interface AuthUiState {
    data object Idle : AuthUiState
    data object Loading : AuthUiState
    data class Authenticated(val user: FirebaseUser) : AuthUiState
    data class Error(val message: String) : AuthUiState
}

class AuthViewModel(
    private val authManager: AuthManager,
    private val gameRepository: GameRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<AuthUiState>(AuthUiState.Idle)
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    val currentUser: StateFlow<FirebaseUser?> = authManager.currentUserFlow
        .stateIn(viewModelScope, SharingStarted.Eagerly, authManager.currentUser)

    fun signInWithGoogle() {
        viewModelScope.launch {
            _uiState.value = AuthUiState.Loading
            val result = authManager.signInWithGoogle()
            result.onSuccess { user ->
                _uiState.value = AuthUiState.Authenticated(user)
                // Initialize default profile in Firestore if first time
                val existing = gameRepository.getUserProfile(user.uid).getOrNull()
                if (existing == null) {
                    gameRepository.saveUserProfile(UserProfile(userId = user.uid))
                }
            }.onFailure { error ->
                _uiState.value = AuthUiState.Error(error.localizedMessage ?: "Sign-in failed. Please try again.")
            }
        }
    }

    fun signOut() {
        authManager.signOut()
        _uiState.value = AuthUiState.Idle
    }

    fun clearError() {
        _uiState.value = AuthUiState.Idle
    }
}
