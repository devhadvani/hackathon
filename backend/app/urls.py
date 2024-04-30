from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register the UserProfileViewSet
router = DefaultRouter()
router.register(r'user-profiles', views.UserProfileViewSet)
# router.register(r'user-profiles-update', views.UserProfileUpdateAPIView)

urlpatterns = [
    path('hello/', views.hello, name="hello"),
    path('api/v1/user-profiles-update/<int:pk>', views.UserProfileUpdateAPIView.as_view(), name="hello"),
    path('api/v1/hackathons/', views.HackathonListCreateAPIView.as_view(), name='hackathon-list-create'),
    path('api/v1/hackathons/<int:pk>/', views.HackathonRetrieveUpdateDestroyAPIView.as_view(), name='hackathon-detail'),
    path('api/v1/user-hackathons/<int:user_id>/', views.UserHackathonsAPIView.as_view(), name='user-hackathons'),
    path('api/v1/hackathons/<int:pk>/participate/', views.HackathonParticipantAPIView.as_view(), name='participate-hackathon'),
    path('api/v1/hackathons/participate/<int:pk>', views.HackathonParticipantRetrieveUpdateDestroyAPIView.as_view(), name='participate-hackathon-list'),
    path('api/v1/hackathons/<int:hackathon_id>/teams/create/', views.TeamCreateView.as_view(), name='team-create'),
    path('api/v1/hackathons/<int:hackathon_id>/teams/add-member/', views.TeamAddMemberView.as_view(), name='team-add-member'),
    path('api/v1/hackathons/<int:hackathon_id>/teams/remove-member/', views.RemoveTeamMemberView.as_view(), name='team-remove-member'),
    path('api/v1/hackathons/<int:hackathon_id>/project/create/', views.ProjectCreateView.as_view(), name='project-create'),
    path('api/v1/hackathons/<int:hackathon_id>/projects/', views.ProjectListView.as_view(), name='project-list'),
    path('api/v1/hackathons/<int:hackathon_id>/projects/<int:pk>/update/', views.ProjectUpdateAPIView.as_view(), name='project-update'),
    # path('api/v1/teams/<int:team_id>/remove-member/', RemoveTeamMemberView.as_view(), name='remove-team-member'),
    path("api/v1/auth/", include('djoser.urls')),
    path("api/v1/auth/", include('djoser.urls.jwt')),
    path('api/v1/', include(router.urls)),  
    path('mark-messages-as-read/',views.MarkMessagesAsRead.as_view(), name='mark_messages_as_read'),
    #for chat app
    path("my-messages/<user_id>/", views.MyInbox.as_view()),
    path("get-messages/<sender_id>/<reciever_id>/", views.GetMessages.as_view()),
    path("send-messages/", views.SendMessages.as_view()),
    path("profile/<int:pk>/", views.ProfileDetail.as_view()),
    path("search/<username>/", views.SearchUser.as_view()),
    path('unread-message-counts/<int:user_id>/', views.unread_message_counts, name='unread_message_counts'),
]
