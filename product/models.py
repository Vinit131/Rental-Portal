from django.db import models
from category.models import Category  # Import Category model

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(max_length=500)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
