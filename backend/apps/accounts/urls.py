from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    ProfileView,
    ChangePasswordView,
    PasswordResetView,
    UserProfileViewSet,
)

router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet)
router.register(r'register', RegisterView, basename='register')
router.register(r'login', LoginView, basename='login')
router.register(r'logout', LogoutView, basename='logout')
router.register(r'profile', ProfileView, basename='profile')
router.register(r'password-change', ChangePasswordView, basename='password-change')
router.register(r'password-reset', PasswordResetView, basename='password-reset')

urlpatterns = [
    path("", include(router.urls)),
]
