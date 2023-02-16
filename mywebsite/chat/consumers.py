import json
from channels.generic.websocket import WebsocketConsumer 
from asgiref.sync import async_to_sync

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_group_name = 'test'

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def receive(self, text_data):
        text_data_json = json.loads(text_data)

        if text_data_json['type'] == 'highlight':
            start = text_data_json['start']
            end = text_data_json['end']
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type':'highlight',
                    'start':start,
                    'end':end
                }
            )

        elif text_data_json['type'] == 'note':
            message = text_data_json['message']
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type':'note',
                    'message':message,
                }
            )


    def highlight(self, event):
        start = event['start']
        end = event['end']

        self.send(text_data=json.dumps({
            'type': 'highlight',
            'start':start,
            'end':end
        }))
    
    def note(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type': 'note',
            'message':message,
        }))
        
