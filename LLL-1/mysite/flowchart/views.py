from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Node, Connection
import json
# Create your views here.

def index(request):
    return render(request, 'result.html')

def save(request):
    nodes = Node.objects.all()

    if request.method == 'POST':
        new_pos = request.POST['new_pos']
        values = json.loads(new_pos)
        for key in list(values.keys()):
            node = Node.objects.get(name=key)
            node.x_pos = values[key]['x']
            node.y_pos = values[key]['y']
            node.save()
        return render('/flow/chart')

def connect(request):
    if request.method == 'POST':
        new_name = request.POST['new_connection']
        c = Connection()
        c.name = new_name
        c.save()

        # Rounding the first selected element
        node = Node.objects.get(name=new_name.split('-')[0])
        node.shape = 25
        node.save()

        return redirect('/flow/chart')

def delete(request):
    nodes = Node.objects.all()
    connections = Connection.objects.all()

    if request.method == 'POST':
        node_id = request.POST['node']
        cs = []
        for node in nodes:
            if node.name == node_id:
                node.delete()
        for c in connections:
            cs = c.name.split("-")
            if cs[0] == node_id or cs[1] == node_id:
                c.delete()

        return redirect('/flow/chart')

def chart(request):
    # n1 = Node()
    # n1.name = "1"
    # n1.text = "Hello it worked"
    # n1.x_pos = 200
    # n1.y_pos = 200

    nodes = Node.objects.all()

    if request.method == 'POST':
        total = 0
        for node in nodes:
            if int(node.name) > total:
                total = int(node.name)
        node_text = request.POST['node_text']
        node_name = total + 1
        node_x = 300
        node_y = 300
        shape = 0

        new_node = Node(text=node_text,name=node_name,x_pos=node_x,y_pos=node_y,shape=shape)
        new_node.save()

        return redirect('/flow/chart')

    connections = Connection.objects.all()
    
    return render(request, 'result.html', {'nodes': nodes, 'connections': connections})
