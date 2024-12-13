from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, telephone, firstname, lastname, mail, password=None):
        if not telephone:
            raise ValueError('Le numéro de téléphone est requis')
        user = self.model(
            telephone=telephone,
            firstname=firstname,
            lastname=lastname,
            mail=self.normalize_email(mail),
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, telephone, firstname, lastname, mail, password):
        user = self.create_user(
            telephone,
            firstname=firstname,
            lastname=lastname,
            mail=mail,
            password=password
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    telephone = models.CharField(max_length=15, unique=True)
    mail = models.CharField(max_length=100)
    haveShop = models.BooleanField(default=False) 

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'telephone'
    REQUIRED_FIELDS = ['firstname', 'lastname']  # Champs requis

    def __str__(self):
        return f"{self.firstname} {self.lastname}"
