from django.contrib import admin
from .models import User, UserProfile, Hackathon, HackathonParticipant, Team, TeamMember, Project, ChatMessage

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('email', 'first_name', 'last_name')
    list_filter = ('is_staff', 'is_active', 'date_joined')
    ordering = ('-date_joined',)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_student', 'college_name', 'college_level', 'is_professional', 'company_name', 'career_start_date')

@admin.register(Hackathon)
class HackathonAdmin(admin.ModelAdmin):
    list_display = ('title', 'start_date', 'end_date', 'registration_deadline')
    search_fields = ('title', 'description')
    list_filter = ('start_date', 'end_date', 'registration_deadline')
    ordering = ('-start_date',)

@admin.register(HackathonParticipant)
class HackathonParticipantAdmin(admin.ModelAdmin):
    list_display = ('user', 'hackathon', 'participation_type', 'team')
    search_fields = ('user__email', 'hackathon__title')
    list_filter = ('participation_type',)

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'hackathon')

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'team', 'role')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'hackathon')
    search_fields = ('title', 'user__email', 'hackathon__title')
    list_filter = ('hackathon',)

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'reciever', 'message', 'is_read', 'date')
    search_fields = ('sender__email', 'reciever__email', 'message')
    list_filter = ('is_read', 'date')
    ordering = ('-date',)
