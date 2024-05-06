from django.shortcuts import render
from  rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, UserProfile,Hackathon, HackathonParticipant, Team,TeamMember,Project, ChatMessage
from .serializers import UserProfileSerializer,CreateUserSerializer, HackathonSerializer,HackathonParticipantSerializer,TeamSerializer,TeamMemberSerializer,ProjectSerializer,MessageSerializer,HackathonResultSerializer
from rest_framework import status,viewsets,generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import F
import logging
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from django.utils import timezone
from datetime import datetime


from django.db.models import OuterRef, Subquery
from django.db.models import Q

logger = logging.getLogger(__name__)



@api_view(['GET'])
def hello(request):
    return Response({'message': 'Hello, world!'})

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class UserProfileUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class HackathonListCreateAPIView(generics.ListCreateAPIView):
    queryset = Hackathon.objects.all()
    serializer_class = HackathonSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        data = request.data
        registration_deadline = data.get('registration_deadline')
        start_date = data.get('start_date')
        if registration_deadline >= start_date:
            return Response({'error': 'Registration close date must be before the hackathon start date'}, status=status.HTTP_400_BAD_REQUEST)
        current_datetime = str(timezone.now())

        print(current_datetime)
        if registration_deadline < current_datetime or start_date < current_datetime:
            return Response({'error': 'All dates must be in the future'}, status=status.HTTP_400_BAD_REQUEST)
        end_date = data.get('end_date')
        if end_date <= start_date:
            return Response({'error': 'End date must be after the hackathon start date'}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)
        
class HackathonRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Hackathon.objects.all()
    serializer_class = HackathonSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class UserHackathonsAPIView(generics.ListAPIView):
    serializer_class = HackathonSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Hackathon.objects.filter(organizers=user_id)

class UserParticipatedHackathonAPIView(generics.ListAPIView):
    serializer_class = HackathonSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Filter hackathons where the user is a team member using teakke
        return Hackathon.objects.filter(teammember__user=user)

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework.response import Response
from rest_framework import status   

def send_registration_email(user_email):
    message = "Thank you for registering for the hackathon."
    send_mail(
        subject='Registration Confirmation',
        message=message,
        from_email='info@journal-bullet.com',
        recipient_list=[user_email],
        fail_silently=False,
    )
class HackathonParticipantAPIView(generics.ListCreateAPIView):
    queryset = HackathonParticipant.objects.all()
    serializer_class = HackathonParticipantSerializer

    def get_queryset(self):
        hackathon_id = self.kwargs.get('pk')
        return HackathonParticipant.objects.filter(hackathon_id=hackathon_id)

    def create(self, request, *args, **kwargs):
        hackathon_id = kwargs.get('pk')
        print("id", hackathon_id)
        data = request.data
        existing_participant = HackathonParticipant.objects.filter(user=request.user, hackathon_id=hackathon_id).exists()
        if existing_participant:
            return Response({'error': 'You have already registered for this hackathon'}, status=status.HTTP_400_BAD_REQUEST)

        data['hackathon'] = hackathon_id
        data['user'] = request.user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        send_registration_email(request.user.email)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


    # def list(self, request, *args, **kwargs):
    #     try:
    #         queryset = self.get_queryset()
    #         serializer = self.get_serializer(queryset, many=True)

    #         for data in serializer.data:
    #             user_info = data.pop('user')  # Remove 'user' field from data
    #             data['user'] = user_info  # Add 'user' field back to data with user information

    #         return Response(serializer.data, status=status.HTTP_200_OK)
    #     except Exception as e:
    #         logger.error(f"Error in HackathonParticipantAPIView list method: {str(e)}")
    #         return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class HackathonParticipantRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HackathonParticipantSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        hackathon_id = self.kwargs.get('pk')
        return HackathonParticipant.objects.filter(id=hackathon_id)


class TeamCreateView(generics.CreateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

    def create(self, request, *args, **kwargs):
        user = request.user
        hackathon_id = kwargs.get('hackathon_id')
        data = request.data
        print("dfdsf",user)

        # Check if the user has already participated in the hackathon
        participants = HackathonParticipant.objects.filter(user=user, hackathon_id=hackathon_id)
        if not participants.exists():
            return Response({'error': 'You have not participated in this hackathon'}, status=status.HTTP_400_BAD_REQUEST)

        team_name = data.get('name')
        if not team_name:
            return Response({'error': 'Team name is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the team with the provided name
        team = Team.objects.create(name=team_name, hackathon_id=hackathon_id)
        leader_role = 'Leader'
        TeamMember.objects.create(team=team, user=user, role=leader_role, hackathon_id=hackathon_id)

        # Update the participant's information to indicate that they have created a team
        participant = participants.first()
        participant.has_created_team = True
        participant.team = team
        participant.save()

        # Prepare the response serializer
        serializer = self.get_serializer(team)

        # Return the successful response with the created team data
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class TeamAddMemberView(generics.CreateAPIView):
    queryset = TeamMember.objects.all()  # Since we're creating team members
    serializer_class = TeamMemberSerializer

    def create(self, request, *args, **kwargs):
        user = request.user
        hackathon_id = kwargs.get('hackathon_id')
        data = request.data
        print("sds",user)

        # Check if the user has already participated in the hackathon
        participants = HackathonParticipant.objects.filter(user=user, hackathon_id=hackathon_id)
        if not participants.exists():
            return Response({'error': 'You have not participated in this hackathon'}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure that the user has already created a team
        participant = participants.first()
        if not participant.has_created_team:
            return Response({'error': 'You have not created a team yet'}, status=status.HTTP_400_BAD_REQUEST)
        team = participant.team
        email = data.get('email')
        if not email:
            return Response({'error': 'Email is required to add a team member'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            member_user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            return Response({'error': f'User with email {email} not found'}, status=status.HTTP_404_NOT_FOUND)

        if HackathonParticipant.objects.filter(user=member_user, hackathon_id=hackathon_id).exists():
            return Response({'error': f'User {member_user.email} has already participated in this hackathon'}, status=status.HTTP_400_BAD_REQUEST)

        if TeamMember.objects.filter(user=member_user, team=team).exists():
            return Response({'error': f'User {member_user.email} has already added in this team'}, status=status.HTTP_400_BAD_REQUEST)


        role = 'Member'  # Assuming newly added members are regular members
        TeamMember.objects.create(team=team, user=member_user, role=role, hackathon_id=hackathon_id)
        send_registration_email(email)
        return Response({'message': f'User {member_user.email} added to the team successfully'}, status=status.HTTP_201_CREATED)


class RemoveTeamMemberView(APIView):
    def delete(self, request, *args, **kwargs):
        try:
            email = request.data.get('email')
            if not email:
                return Response({'error': 'Email is required to remove a team member'}, status=status.HTTP_400_BAD_REQUEST)

            team_member = TeamMember.objects.get(user__email=email, hackathon_id=self.kwargs.get('hackathon_id'))
            
            if team_member.role == 'Leader':
                return Response({'error': 'Team leader cannot be removed'}, status=status.HTTP_400_BAD_REQUEST)

            team_member.delete()
            
            return Response({'message': f'Team member with email {email} removed successfully'}, status=status.HTTP_200_OK)
        except TeamMember.DoesNotExist:
            return Response({'error': f'Team member with email {email} not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class ProjectCreateView(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def create(self, request, *args, **kwargs):
        user = request.user
        data = request.data
        hackathon_id = kwargs.get('hackathon_id')
        team_id = data.get('team')
        print(user)
        print(data)
        print(team_id)

        # Check if the user is authenticated
        if not user.is_authenticated:
            return Response({'error': 'Authentication credentials were not provided'}, status=status.HTTP_401_UNAUTHORIZED)

        # Check if the user is a registered participant in the specified hackathon
        try:
            participant = HackathonParticipant.objects.get(user=user, hackathon_id=hackathon_id)
        except HackathonParticipant.DoesNotExist:
            return Response({'error': 'You are not a registered participant in this hackathon'}, status=status.HTTP_403_FORBIDDEN)

        # try:
        #     team_member = TeamMember.objects.get(user=user, team_id=team_id, role='Leader', hackathon_id=hackathon_id)
        # except TeamMember.DoesNotExist:
        #     return Response({'error': 'Only the team leader can create a project'}, status=status.HTTP_403_FORBIDDEN)
        # if team_member.team_id != team_id:
        #     return Response({'error': 'Invalid team ID'}, status=status.HTTP_400_BAD_REQUEST)

        data['hackathon'] = hackathon_id
        data['user'] = user.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProjectListView(generics.ListAPIView):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        hackathon_id = self.kwargs.get('hackathon_id')
        return Project.objects.filter(hackathon_id=hackathon_id)

class ProjectUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    # permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data
        print("Instance:", instance)
        print("Instance ID:", instance.id)
        print("Hackathon ID:", instance.hackathon_id)
        print("User ID:", instance.user_id)
        # data['title'] = "sdfdkfj"
        # data['description'] = "rgtsefjk"
        serializer = self.get_serializer(instance, data=data, partial=partial)
        print("Serialized Data:", serializer.initial_data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


# class HackathonResultAPIView(generics.RetrieveUpdateAPIView):
#     queryset = Hackathon.objects.all()
#     serializer_class = HackathonResultSerializer



from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied

class IsHackathonCreatorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow the creator of a hackathon to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the creator of the hackathon
        return obj.organizers.filter(id=request.user.id).exists()

class HackathonResultAPIView(generics.RetrieveUpdateAPIView):
    queryset = Hackathon.objects.all()
    serializer_class = HackathonResultSerializer
    permission_classes = [IsHackathonCreatorOrReadOnly]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance.organizers.filter(id=request.user.id).exists():
            raise PermissionDenied("You are not allowed to update hackathon results.")
        return super().update(request, *args, **kwargs)












# ----------- Chatapp ---------


class MyInbox(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']

        messages = ChatMessage.objects.filter(
            id__in =  Subquery(
                User.objects.filter(
                    Q(sender__reciever=user_id) |
                    Q(reciever__sender=user_id)
                ).distinct().annotate(
                    last_msg=Subquery(
                        ChatMessage.objects.filter(
                            Q(sender=OuterRef('id'),reciever=user_id) |
                            Q(reciever=OuterRef('id'),sender=user_id)
                        ).order_by('-id')[:1].values_list('id',flat=True) 
                    )
                ).values_list('last_msg', flat=True).order_by("-id")
            )
        ).order_by("-id")
            
        return messages
    
class GetMessages(generics.ListAPIView):
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        sender_id = self.kwargs['sender_id']
        reciever_id = self.kwargs['reciever_id']
        messages =  ChatMessage.objects.filter(sender__in=[sender_id, reciever_id], reciever__in=[sender_id, reciever_id])
        return messages

class SendMessages(generics.CreateAPIView):
    serializer_class = MessageSerializer

class ProfileDetail(generics.RetrieveUpdateAPIView):
    serializer_class = CreateUserSerializer
    queryset = User.objects.all()
    # permission_classes = [IsAuthenticated]  


class SearchUser(generics.ListAPIView):
    serializer_class = CreateUserSerializer
    queryset = User.objects.all()
    # permission_classes = [IsAuthenticated]  

    def list(self, request, *args, **kwargs):
        username = self.kwargs['username']
        logged_in_user = 1
        print(username)
        print(logged_in_user)
        users = User.objects.filter(Q(email__icontains=username)  | Q(email__icontains=username))
        print(users)
        if not users.exists():
            return Response(
                {"detail": "No users found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)
        
class MarkMessagesAsRead(generics.UpdateAPIView):
    queryset = ChatMessage.objects.all()
    serializer_class = MessageSerializer

    def update(self, request, *args, **kwargs):
        message_ids = request.data.get('messageIds', [])
        print(message_ids)
        try:
            # Update messages with the provided IDs and mark them as read
            messages = ChatMessage.objects.filter(id__in=message_ids)
            messages.update(is_read=True)
            return Response({'detail': 'Messages marked as read successfully.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def unread_message_counts(request, user_id):
    try:
        unread_counts = {}
        for chat_id in ChatMessage.objects.filter(reciever_id=user_id, is_read=False).values_list('sender_id', flat=True).distinct():
            unread_counts[chat_id] = ChatMessage.objects.filter(sender_id=chat_id, reciever_id=user_id, is_read=False).count()

        return Response(unread_counts)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class TeamCreateAndAddMemberView(generics.CreateAPIView):
#     queryset = Team.objects.all()
#     serializer_class = TeamSerializer

#     def create(self, request, *args, **kwargs):
#         user = request.user
#         hackathon_id = kwargs.get('hackathon_id')
#         data = request.data

#         participants = HackathonParticipant.objects.filter(user=user, hackathon_id=hackathon_id)
#         if not participants.exists():
#             return Response({'error': 'You have not participated in this hackathon'}, status=status.HTTP_400_BAD_REQUEST)

#         team_name = data.get('name')
#         if not team_name:
#             return Response({'error': 'Team name is required'}, status=status.HTTP_400_BAD_REQUEST)

#         team = Team.objects.create(name=team_name, hackathon_id=hackathon_id)
#         leader_role = 'Leader'
#         TeamMember.objects.create(team=team, user=user, role=leader_role, hackathon_id=hackathon_id)

#         participant = participants.first()
#         participant.has_created_team = True
#         participant.team = team
#         participant.save()

#         serializer = self.get_serializer(team)

#         return Response(serializer.data, status=status.HTTP_201_CREATED)

#     def post(self, request, *args, **kwargs):
#         user = request.user
#         hackathon_id = kwargs.get('hackathon_id')
#         data = request.data

#         participants = HackathonParticipant.objects.filter(user=user, hackathon_id=hackathon_id)
#         if not participants.exists():
#             return Response({'error': 'You have not participated in this hackathon'}, status=status.HTTP_400_BAD_REQUEST)

#         participant = participants.first()
#         if not participant.has_created_team:
#             return Response({'error': 'You have not created a team yet'}, status=status.HTTP_400_BAD_REQUEST)

#         team = participant.team

#         email = data.get('email')
#         if not email:
#             return Response({'error': 'Email is required to add a team member'}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             member_user = User.objects.get(email=email)
#         except ObjectDoesNotExist:
#             return Response({'error': f'User with email {email} not found'}, status=status.HTTP_404_NOT_FOUND)

#         # Check if the user has already participated in this hackathon
#         if HackathonParticipant.objects.filter(user=member_user, hackathon_id=hackathon_id).exists():
#             return Response({'error': f'User {member_user.email} has already participated in this hackathon'}, status=status.HTTP_400_BAD_REQUEST)

#         # Check if the user is already a member of the team
#         if TeamMember.objects.filter(user=member_user, team=team).exists():
#             return Response({'error': f'User {member_user.email} is already a member of this team'}, status=status.HTTP_400_BAD_REQUEST)
        
#         # Create the new team member
#         role = 'Member'  # Assuming newly added members are regular members
#         TeamMember.objects.create(team=team, user=member_user, role=role, hackathon_id=hackathon_id)

#         # Return a success response
#         return Response({'message': f'User {member_user.email} added to the team successfully'}, status=status.HTTP_201_CREATED)