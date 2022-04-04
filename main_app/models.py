from tkinter.tix import MAX
from django.db import models
from django.contrib.auth.models import User
# Create your models here.

MAX_ATTEMPTS = 250

class Userdata(models.Model):
    user_id=models.ForeignKey(User,on_delete=models.CASCADE)
    name=models.CharField(max_length=100)
    score = models.IntegerField(default = 0)
    chancesUsed = models.IntegerField(default = 0)
    answerGiven = models.CharField(max_length = 10, default="00000")
    timeElapsed = models.IntegerField(default = 0)
    total_penalty=models.IntegerField(default = 0)

    attempts = models.IntegerField(default = MAX_ATTEMPTS)
    # q2_attempts = models.IntegerField(default = 0)
    # q3_attempts = models.IntegerField(default = 0)
    # q4_attempts = models.IntegerField(default = 0)
    # q5_attempts = models.IntegerField(default = 0)

    def __str__(self):
            return str(self.user_id.username)

class Question(models.Model):
    qno=models.IntegerField(default=0)
    weight = models.IntegerField(default=20)
    text = models.CharField(max_length=45000)
    time_penalty = models.ManyToManyField(Userdata, through="Time_Penalty",blank=True,null=True)
    testcaseno=models.IntegerField(default=0)
    samplein = models.CharField(max_length=45000,default='')
    sampleout = models.CharField(max_length=45000,default='')
    test_case1=models.CharField(max_length=1000,default='')
    test_case2=models.CharField(max_length=1000,default='')
    test_case3=models.CharField(max_length=1000,default='')
    test_case4=models.CharField(max_length=1000,default='')
    test_case5=models.CharField(max_length=1000,default='')
    test_case6=models.CharField(max_length=1000,default='')
    
    test_case1_sol=models.CharField(max_length=1000,default='')
    test_case2_sol=models.CharField(max_length=1000,default='')
    test_case3_sol=models.CharField(max_length=1000,default='')
    test_case4_sol=models.CharField(max_length=1000,default='')
    test_case5_sol=models.CharField(max_length=1000,default='')
    test_case6_sol=models.CharField(max_length=1000,default='')
    
    # max_attempts = models.IntegerField(default = 0)
    
    def __str__(self):
        return str(self.weight)

class Time_Penalty(models.Model):
    player = models.ForeignKey(Userdata, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE,related_name='questions')
    time_penalty = models.IntegerField(default=0)
    no_wa = models.IntegerField(default=0)

    class Meta:
        unique_together = ("player", "question")

    def __str__(self):
        return "{} : {}".format(self.player.name, self.question.qno)
