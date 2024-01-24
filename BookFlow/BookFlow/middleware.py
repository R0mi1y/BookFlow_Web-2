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

        try:
            # Armazene o corpo da requisição

            if response.status_code >= 500 and False:
                request_body = request.body.decode('utf-8')
                self.log_error(request, response, request_body)
            else:
                self.log_debug(response)
                
        except Exception as e:
            self.save_exception(e)
            
        return response

    def log_error(self, request, response, request_body): 
        error_data = {
            'status_code': response.status_code,
            'method': request.method,
            'path': request.path,
            'body': request_body,
        }

        log_path_json = os.path.join(settings.MEDIA_ROOT, 'error_log.json')

        # Lê o conteúdo atual do arquivo de log JSON
        if os.path.exists(log_path_json):
            with open(log_path_json, 'r') as log_file:
                try:
                    log_data = json.load(log_file)
                except json.JSONDecodeError:
                    log_data = {'cont': 0, 'errors': []}
        else:
            log_data = {'cont': 0, 'errors': []}

        # Adiciona o novo erro à lista
        log_data['errors'].append(error_data)

        cont = log_data['cont']
        # log_data['cont'] += 1

        log_path_html = os.path.join(settings.MEDIA_ROOT, f'errors/error_log_{cont}.html')

        # Escreve a lista atualizada de volta ao arquivo JSON
        with open(log_path_json, 'w') as log_file:
            json.dump(log_data, log_file, indent=2)

        # Cria ou atualiza o arquivo HTML
        with open(log_path_html, 'w') as html_file:
            html_file.write(response.content.decode('utf-8'))
            
            
    def log_debug(self, response):
        if "<!DOCTYPE" not in response.content.decode('utf-8'):
            error_data = {
                'status_code': response.status_code,
                'message': response.content.decode('utf-8'),
            }

            log_path_json = os.path.join(settings.MEDIA_ROOT, 'debug_log.json')

            # Lê o conteúdo atual do arquivo de log JSON
            if os.path.exists(log_path_json):
                with open(log_path_json, 'r') as log_file:
                    try:
                        log_data = json.load(log_file)
                    except json.JSONDecodeError:
                        log_data = {'logs': []}
            else:
                log_data = {'logs': []}

            # Adiciona o novo erro à lista
            log_data['logs'].append(error_data)

            # Escreve a lista atualizada de volta ao arquivo JSON
            with open(log_path_json, 'w') as log_file:
                json.dump(log_data, log_file, indent=2)
            
            
    def save_exception(self, msm): 
        log_path_json = os.path.join(settings.MEDIA_ROOT, 'exception_log.json')

        # Lê o conteúdo atual do arquivo de log JSON
        if os.path.exists(log_path_json):
            with open(log_path_json, 'r') as log_file:
                try:
                    log_data = json.load(log_file)
                except json.JSONDecodeError:
                    log_data = {'logs': []}
        else:
            log_data = {'logs': []}

        # Adiciona o novo erro à lista
        log_data['logs'].append(str(msm))

        # Escreve a lista atualizada de volta ao arquivo JSON
        with open(log_path_json, 'w') as log_file:
            json.dump(log_data, log_file, indent=2)


def handle_error_500(request, exception):
    return JsonResponse({'error': 'Internal Server Error'}, status=500)
