import json
from django.db import models

class Settings(models.Model):
    authors = models.JSONField(default=list, blank=True)
    genres = models.JSONField(default=list, blank=True)
    
    def set_authors(self, x):
        self.authors = x

    def get_authors(self):
        return self.authors
    
    def set_genres(self, x):
        self.genres = x

    def get_genres(self):
        return self.genres
