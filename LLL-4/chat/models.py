from django.db import models

# Create your models here.

class Note(models.Model):
    text = models.TextField()
    name = models.CharField(max_length=100)
    left_pos = models.IntegerField()
    right_pos = models.IntegerField()

class Text(models.Model):
    text = models.TextField()
