# Aplicação de Mensagens Seguras

Esta é uma aplicação web simples que permite a troca segura de mensagens entre dois usuários utilizando criptografia e proteção contra ataques CSRF.

## Funcionalidades

- Criptografia simétrica AES para proteger o conteúdo das mensagens
- Proteção contra ataques CSRF através de tokens
- Interface simples para envio e visualização de mensagens
- Simulação de dois usuários no mesmo ambiente

## Como executar a aplicação

1. Faça o download de todos os arquivos (`index.html` e `app.js`) e coloque-os no mesmo diretório.
2. Abra o arquivo `index.html` em um navegador web moderno.
3. Alternativamente, você pode usar um servidor web local para servir os arquivos.

## Escolhas de Design

### 1. Criptografia Simétrica (AES)

Optei pela utilização de criptografia simétrica (AES) pelos seguintes motivos:

- **Eficiência**: AES é computacionalmente menos intensivo que algoritmos assimétricos como RSA, o que é ideal para uma aplicação web que precisa criptografar e descriptografar mensagens frequentemente.
- **Simplicidade**: Para o escopo deste projeto, a criptografia simétrica é mais fácil de implementar e compreender.
- **Segurança adequada**: AES oferece um alto nível de segurança quando implementado corretamente.

Para a implementação, utilizei a biblioteca CryptoJS, que fornece uma implementação robusta do algoritmo AES.

### 2. Mitigação de CSRF

Para proteger contra ataques CSRF (Cross-Site Request Forgery), implementei:

- **Tokens CSRF**: Cada sessão de usuário recebe um token único que deve ser incluído em todas as requisições que modificam o estado da aplicação.
- **Validação de tokens**: Antes de processar qualquer mensagem, o sistema verifica se o token CSRF enviado corresponde ao token da sessão atual.

Esta abordagem impede que sites maliciosos realizem ações não autorizadas em nome do usuário logado, pois não teriam acesso ao token CSRF válido.

### 3. Interface Front-End

O design da interface foi pensado para ser:

- **Simples e intuitivo**: Interface clara com áreas distintas para mensagens enviadas e recebidas.
- **Informativo**: Exibe tanto o texto da mensagem quanto sua versão criptografada, para fins educacionais.
- **Prático**: Permite alternar entre dois usuários para simular a comunicação.

### 4. Armazenamento de Dados

Para simplificar, esta aplicação armazena todas as mensagens em memória (objeto JavaScript). Em um ambiente de produção, seria necessário:

- Armazenar as mensagens em um banco de dados
- Implementar autenticação de usuários
- Gerenciar as chaves de criptografia de forma segura

## Demonstração das Funcionalidades de Segurança

### 1. Criptografia

Para demonstrar o funcionamento da criptografia:

1. Digite uma mensagem e envie-a como Usuário 1.
2. Mude para o Usuário 2 e observe que a mensagem recebida está criptografada.
3. Insira a mesma chave de criptografia que o Usuário 1 utilizou, e veja que a mensagem é descriptografada corretamente.
4. Tente alterar a chave de criptografia no Usuário 2 e observe que a mensagem não será descriptografada corretamente.

### 2. Proteção CSRF

Para demonstrar a proteção contra CSRF:

1. Use o formulário "Teste de Proteção CSRF" para simular um ataque.
2. Observe que a tentativa é bloqueada porque o token CSRF é inválido.

Este teste simula o que aconteceria se um site malicioso tentasse enviar mensagens sem conhecer o token CSRF válido.

## Limitações e Considerações para Ambiente de Produção

- Esta aplicação é apenas para fins demonstrativos e educacionais.
- Em um ambiente real, seria necessário implementar:
  - HTTPS para proteger a transmissão dos dados
  - Armazenamento seguro das chaves de criptografia
  - Autenticação de usuários robusta
  - Validação de entrada mais rigorosa
  - Armazenamento persistente das mensagens
  - Proteções adicionais contra outros tipos de ataques web

## Tecnologias Utilizadas

- JavaScript (vanilla)
- HTML5/CSS3
- CryptoJS para implementação da criptografia AES
