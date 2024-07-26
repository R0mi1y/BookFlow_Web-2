---

# BookFlow

BookFlow é uma plataforma que facilita o compartilhamento de livros físicos entre pessoas próximas. Cadastre os livros que você possui e veja no mapa onde outras pessoas dispostas a emprestar seus livros estão localizadas.

## Funcionalidades

- **Cadastro de Livros:** Adicione os livros físicos que você possui.
- **Mapa de Localização:** Visualize no mapa os locais de pessoas que estão dispostas a emprestar seus livros.
- **Condições de Empréstimo:** Especifique pré-requisitos e condições para o empréstimo dos seus livros.
- **Perfis de Usuários:** Veja perfis de outros usuários, incluindo os livros que possuem e as condições de empréstimo.

## Tecnologias Usadas

O repositório está dividido em três partes:

1. **API:** Desenvolvida em Django Rest Framework utilizando Python.
2. **Aplicativo em React Native:** Versão do aplicativo para dispositivos móveis.
3. **Aplicativo em Java:** Versão do aplicativo para Android, desenvolvida com Android Studio.

## Instalação

1. Clone o repositório:
    ```bash
    git clone https://github.com/R0mi1y/BookFlow_Web-2.git
    ```
2. Navegue até o diretório do projeto:
    ```bash
    cd BookFlow
    ```

### API

1. Instale as dependências:
    ```bash
    pip install -r requirements.txt
    ```
2. Inicie o servidor:
    ```bash
    python manage.py runserver 0.0.0.0:8000
    ```

### Aplicativo em React Native com expo

1. Navegue até o diretório do React Native:
    ```bash
    cd BookFlow-app
    ```
2. Instale as dependências:
    ```bash
    npm install
    ```
3. Inicie o aplicativo:
    ```bash
    npm expo start
    ```

### Aplicativo em Java (Android Studio)

1. Clone o fork `app_java` e abra a pasta no Android Studio.
2. Construa e execute o aplicativo no emulador ou dispositivo físico.

## Uso

1. Cadastre-se e faça login.
2. Adicione os livros que você possui.
3. Defina seu endereço para aparecer no mapa.
4. Navegue pelo mapa para ver outros usuários e os livros disponíveis para empréstimo.
5. Entre em contato com outros usuários para combinar o empréstimo.

## Contribuição

1. Faça um fork do projeto.
2. Crie uma nova branch:
    ```bash
    git checkout -b feature/nome-da-feature
    ```
3. Faça as alterações necessárias.
4. Commit suas mudanças:
    ```bash
    git commit -m 'Adicionei uma nova feature'
    ```
5. Faça o push para a branch:
    ```bash
    git push origin feature/nome-da-feature
    ```
6. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

Ediel Romily Silva Caetano - [edielromily7@gmail.com](mailto:edielromily7@gmail.com)

---
