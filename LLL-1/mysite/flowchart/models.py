from django.db import models

# Create your models here.
class Node(models.Model):
    text = models.TextField()
    name = models.CharField(max_length=100)
    x_pos = models.IntegerField()
    y_pos = models.IntegerField()
    shape = models.IntegerField()

class Connection(models.Model):
    name = models.CharField(max_length=100)
    thickness = 2;