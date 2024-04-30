from rest_framework import serializers
from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer
from .models import UserProfile, Hackathon, HackathonParticipant, Project, Team, TeamMember,ChatMessage

User = get_user_model()

class CreateUserSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'google_id', 'profile_picture']

class UserProfileSerializer(serializers.ModelSerializer):
    # user = CreateUserSerializer()
    class Meta:
        model = UserProfile
        fields = '__all__'
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['user'] = CreateUserSerializer(instance.user).data
        # ret['project_info'] = ProjectSerializer()

        return ret

class HackathonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hackathon
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    # user = CreateUserSerializer() 
    class Meta:
        model = Project
        fields = '__all__'

class TeamMemberSerializer(serializers.ModelSerializer):
    user = CreateUserSerializer()

    class Meta:
        model = TeamMember
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = '__all__'

class HackathonParticipantSerializer(serializers.ModelSerializer):
    # user = CreateUserSerializer()
    team_members = TeamMemberSerializer(many=True, read_only=True, source='team.teammember_set')

    class Meta:
        model = HackathonParticipant
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['user'] = CreateUserSerializer(instance.user).data
        # ret['project_info'] = ProjectSerializer()

        return ret



class MessageSerializer(serializers.ModelSerializer):
    reciever_profile = UserProfileSerializer(read_only=True)
    sender_profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ['id','sender', 'reciever', 'reciever_profile', 'sender_profile' ,'message', 'is_read', 'date']
    
    def __init__(self, *args, **kwargs):
        super(MessageSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method=='POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 2

class HackathonResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hackathon
        fields = ['first_place_team', 'second_place_team', 'third_place_team']
