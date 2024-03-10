from django.shortcuts import render
from  rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, UserProfile
from .serializers import UserProfileSerializer
from rest_framework import status
# Create your views here.
@api_view(['GET'])
def hello(request):
    return Response({'message': 'Hello, world!'})

@api_view(['POST'])
def create_user_profile(request):
    serializer = UserProfileSerializer(data=request.data)
    print(request.data)
    # print(serializer)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)