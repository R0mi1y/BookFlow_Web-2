import json
import logging
import os
from django.conf import settings
from django.http import JsonResponse

logger = logging.getLogger(__name__)

class ErrorLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.log_path = os.path.join(settings.MEDIA_ROOT, 'error_log.json')

        # Garante que o diretório de mídia existe
        os.makedirs(settings.MEDIA_ROOT, exist_ok=True)

        # Cria o arquivo de log se não existir
        if not os.path.exists(self.log_path):
            with open(self.log_path, 'w') as log_file:
                log_file.write('[]')  # Inicializa como uma lista vazia

    def __call__(self, request):
        response = self.get_response(request)
        if response.status_code >= 500:
            self.log_error(request, response)
        return response

    def log_error(self, request, response):
        error_data = {
            'status_code': response.status_code,
            'method': request.method,
            'path': request.path,
            'body': request.body.decode('utf-8'),
            'error_message': response.content.decode('utf-8'),
        }

        # Lê o conteúdo atual do arquivo de log
        with open(self.log_path, 'r') as log_file:
            log_data = json.load(log_file)

        # Adiciona o novo erro à lista
        log_data.append(error_data)

        # Escreve a lista atualizada de volta ao arquivo
        with open(self.log_path, 'w') as log_file:
            json.dump(log_data, log_file, indent=2)

def handle_error_500(request, exception):
    return JsonResponse({'error': 'Internal Server Error'}, status=500)
