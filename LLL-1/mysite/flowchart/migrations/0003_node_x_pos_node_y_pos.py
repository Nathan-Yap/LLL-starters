# Generated by Django 4.1.6 on 2023-02-10 23:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flowchart', '0002_connection_name_node_name_node_text'),
    ]

    operations = [
        migrations.AddField(
            model_name='node',
            name='x_pos',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='node',
            name='y_pos',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]