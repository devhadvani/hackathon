from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth import get_user_model
# Create your models here.
class CustomUserManager(BaseUserManager):

    def email_validator(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError(_("You must provide a valid email"))
            
    def create_user(self, first_name, last_name, email, password, **extra_fields):

        if not first_name:
            raise ValueError(_("Users must submit a first name"))
        
        if not last_name:
            raise ValueError(_("Users must submit a last name"))
        

        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(_("Base User: and email address is required"))
        
        
        user = self.model(
            first_name=first_name,
            last_name=last_name,
            email=email,
            **extra_fields
        )

        user.set_password(password)
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)

        user.save()

        return user
    
    def create_superuser(self, first_name, last_name, email, password, **extra_fields):

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superusers must have is_superuser=True"))
        
        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superusers must have is_staff=True"))
        
        if not password:
            raise ValueError(_("Superusers must have a password"))

        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(_("Admin User: and email address is required"))
        

        user = self.create_user(first_name, last_name, email, password, **extra_fields)

        user.save()   

        return user


class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(_("First Name"), max_length=100)
    last_name = models.CharField(_("Last Name"), max_length=100)
    email = models.EmailField(_("Email Address"), max_length=254, unique=True)
    google_id = models.CharField(_("Google ID"), max_length=100, blank=True, null=True)
    profile_picture = models.ImageField(_("Profile Picture"), blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = CustomUserManager()

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    def __str__(self):
        return self.email

    @property
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

User = get_user_model()

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    skills = models.JSONField(_("Skills"), default=list)
    is_student = models.BooleanField(_("Is Student"), default=False)
    college_name = models.CharField(_("College Name"), max_length=100, blank=True, null=True)
    college_level = models.CharField(_("College Level"), max_length=20, blank=True, null=True)
    is_professional = models.BooleanField(_("Is Professional"), default=False)
    company_name = models.CharField(_("Company Name"), max_length=100, blank=True, null=True)
    career_start_date = models.DateField(_("Career Start Date"), blank=True, null=True)

    def __str__(self):
        return self.user.email


class Team(models.Model):
    hackathon = models.ForeignKey('Hackathon', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)



class Hackathon(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    what_to_build = models.TextField()
    what_to_submit = models.TextField()
    prize_structure = models.TextField()
    total_prize = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    registration_deadline = models.DateTimeField()
    organizers = models.ManyToManyField(User, related_name='organized_hackathons')
    website_url = models.URLField()
    location = models.CharField(max_length=255, blank=True, null=True)
    registration_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    submission_formats = models.CharField(max_length=255, choices=(
        ('GitHub Repo', 'GitHub Repository'),
        ('Demo URL', 'Demo URL'),
        ('Video Pitch', 'Video Pitch'),
        ('Presentation', 'Presentation'),
    ))
    tags = models.CharField(max_length=255)
    front_image = models.ImageField(upload_to='hackathon/images/',blank=True,null=True)
    banner_image = models.ImageField(upload_to='hackathon/images/',blank=True,null=True)
    first_place_team = models.ForeignKey(Team, on_delete=models.SET_NULL, related_name='first_place_hackathons', blank=True, null=True)
    second_place_team = models.ForeignKey(Team, on_delete=models.SET_NULL, related_name='second_place_hackathons', blank=True, null=True)
    third_place_team = models.ForeignKey(Team, on_delete=models.SET_NULL, related_name='third_place_hackathons', blank=True, null=True)


    def __str__(self):
        return self.title


class HackathonParticipant(models.Model):
    PARTICIPATION_TYPE_CHOICES = [
        ('Solo', 'Solo'),
        ('Team', 'Team'),
    ]
    hackathon = models.ForeignKey(Hackathon, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    team = models.ForeignKey('Team', on_delete=models.CASCADE, null=True)
    has_created_team = models.BooleanField(default=False)
    participation_type = models.CharField(max_length=10, choices=PARTICIPATION_TYPE_CHOICES)


class TeamMember(models.Model):
    ROLE_CHOICES = [
        ('Member', 'Member'),
        ('Leader', 'Leader'),
    ]
    team = models.ForeignKey(Team, on_delete=models.CASCADE,null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hackathon = models.ForeignKey(Hackathon, on_delete=models.CASCADE)    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

class Project(models.Model):
    hackathon = models.ForeignKey(Hackathon, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100,null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    github_repo_link = models.URLField(null=True, blank=True)
    video_link = models.URLField(null=True, blank=True)
    live_website_link = models.URLField(null=True, blank=True)
    team = models.ForeignKey('Team', on_delete=models.CASCADE, null=True)



class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="user")
    sender = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="sender")
    reciever = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="reciever")

    message = models.CharField(max_length=10000000000)

    is_read = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['date']
        verbose_name_plural = "Message"

    def __str__(self):
        return f"{self.sender} - {self.reciever}"

    @property
    def sender_profile(self):
        sender_profile = UserProfile.objects.get(user=self.sender)
        return sender_profile
    @property
    def reciever_profile(self):
        reciever_profile = UserProfile.objects.get(user=self.reciever)
        return reciever_profile