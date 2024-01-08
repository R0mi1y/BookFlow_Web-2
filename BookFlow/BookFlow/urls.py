from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from book.views import BookView, CommentView
from user.views import UserView
from settings.views import SettingsView
from .swagger import schema_view
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


router = DefaultRouter()
router.register('book', BookView, basename="book")
router.register('settings', SettingsView, basename="settings")
router.register('comment', CommentView, basename="comment")
router.register('user', UserView, basename="user")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    # path('rest-api/', include('rest_framework.urls')),
    
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('doc/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-doc-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]