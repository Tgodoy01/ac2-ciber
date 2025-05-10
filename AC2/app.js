// Estrutura de dados para armazenar mensagens (simula um banco de dados)
const messageStore = {
    user1: {
        sent: [],
        received: []
    },
    user2: {
        sent: [],
        received: []
    }
};

// Usuário atual
let currentUser = 'user1';
// Token CSRF gerado para a sessão atual
let csrfToken = generateCsrfToken();

// Função para gerar um token CSRF
function generateCsrfToken() {
    // Em uma aplicação real, isso seria mais robusto e armazenado no servidor
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

// Exibir o token CSRF na interface
document.getElementById('csrf-token').textContent = csrfToken;

// Função para alternar entre usuários
function switchUser(user) {
    currentUser = user;
    
    // Atualizar UI
    document.getElementById('current-user').textContent = user;
    document.getElementById('btn-user1').classList.toggle('active', user === 'user1');
    document.getElementById('btn-user2').classList.toggle('active', user === 'user2');
    
    // Atualizar mensagens para o usuário atual
    renderMessages();
    
    // Gerar um novo token CSRF ao trocar de usuário (simula nova sessão)
    csrfToken = generateCsrfToken();
    document.getElementById('csrf-token').textContent = csrfToken;
}

// Função para criptografar uma mensagem com AES
function encryptMessage(message, key) {
    try {
        return CryptoJS.AES.encrypt(message, key).toString();
    } catch (error) {
        console.error('Erro ao criptografar mensagem:', error);
        return null;
    }
}

// Função para descriptografar uma mensagem com AES
function decryptMessage(encryptedMessage, key) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedMessage, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Erro ao descriptografar mensagem:', error);
        return 'Erro ao descriptografar: Chave incorreta ou mensagem inválida';
    }
}

// Função para enviar uma mensagem
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const encryptionKey = document.getElementById('encryption-key').value;
    
    if (!messageInput.value.trim() || !encryptionKey.trim()) {
        alert('Por favor, digite uma mensagem e uma chave de criptografia.');
        return;
    }
    
    // Obter dados do formulário
    const messageText = messageInput.value;
    
    // Criptografar a mensagem
    const encryptedMessage = encryptMessage(messageText, encryptionKey);
    
    // Exibir mensagem criptografada para debug
    document.getElementById('encrypted-message').textContent = encryptedMessage;
    
    // Definir o destinatário (o outro usuário)
    const recipient = currentUser === 'user1' ? 'user2' : 'user1';
    
    // Criar objeto de mensagem
    const messageObj = {
        id: Date.now(),
        sender: currentUser,
        recipient: recipient,
        text: messageText,
        encryptedText: encryptedMessage,
        timestamp: new Date().toLocaleTimeString(),
        csrfToken: csrfToken // Incluir token CSRF para verificação
    };
    
    // Simular envio para o servidor (processMessage valida o token CSRF)
    const processResult = processMessage(messageObj);
    
    if (processResult.success) {
        // Limpar campo de entrada
        messageInput.value = '';
        
        // Atualizar a interface
        renderMessages();
    } else {
        alert(processResult.error);
    }
}

// Função que simula o processamento da mensagem no servidor (com verificação CSRF)
function processMessage(messageObj) {
    // Verificar token CSRF
    if (messageObj.csrfToken !== csrfToken) {
        return {
            success: false,
            error: 'Erro de segurança: Token CSRF inválido!'
        };
    }
    
    // Armazenar mensagem enviada no remetente
    messageStore[messageObj.sender].sent.push(messageObj);
    
    // Armazenar mensagem recebida no destinatário
    messageStore[messageObj.recipient].received.push(messageObj);
    
    return {
        success: true
    };
}

// Função para renderizar todas as mensagens
function renderMessages() {
    renderSentMessages();
    renderReceivedMessages();
}

// Função para renderizar mensagens enviadas
function renderSentMessages() {
    const sentMessagesContainer = document.getElementById('sent-messages');
    sentMessagesContainer.innerHTML = '';
    
    const messages = messageStore[currentUser].sent;
    
    if (messages.length === 0) {
        sentMessagesContainer.innerHTML = '<div class="message">Nenhuma mensagem enviada.</div>';
        return;
    }
    
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message sent';
        
        messageElement.innerHTML = `
            <div class="header">Para: ${msg.recipient} - ${msg.timestamp}</div>
            <div class="content">${msg.text}</div>
            <div class="encrypted" style="font-size: 0.8em; color: #777; margin-top: 5px;">
                <strong>Versão criptografada:</strong> 
                <span style="word-break: break-all;">${msg.encryptedText.substring(0, 50)}...</span>
            </div>
        `;
        
        sentMessagesContainer.appendChild(messageElement);
    });
}

// Função para renderizar mensagens recebidas
function renderReceivedMessages() {
    const receivedMessagesContainer = document.getElementById('received-messages');
    receivedMessagesContainer.innerHTML = '';
    
    const messages = messageStore[currentUser].received;
    const encryptionKey = document.getElementById('encryption-key').value;
    
    if (messages.length === 0) {
        receivedMessagesContainer.innerHTML = '<div class="message">Nenhuma mensagem recebida.</div>';
        return;
    }
    
    messages.forEach(msg => {
        const decryptedText = encryptionKey ? 
            decryptMessage(msg.encryptedText, encryptionKey) : 
            'Digite uma chave para descriptografar';
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message received';
        
        messageElement.innerHTML = `
            <div class="header">De: ${msg.sender} - ${msg.timestamp}</div>
            <div class="content">${decryptedText}</div>
            <div class="encrypted" style="font-size: 0.8em; color: #777; margin-top: 5px;">
                <strong>Versão criptografada:</strong> 
                <span style="word-break: break-all;">${msg.encryptedText.substring(0, 50)}...</span>
            </div>
        `;
        
        receivedMessagesContainer.appendChild(messageElement);
    });
}

// Função para simular um ataque CSRF
function simulateCsrfAttack() {
    const csrfMessage = document.getElementById('csrf-message').value;
    const recipient = currentUser === 'user1' ? 'user2' : 'user1';
    
    // Criar um objeto de mensagem com um token CSRF inválido
    const maliciousMessage = {
        id: Date.now(),
        sender: currentUser,
        recipient: recipient,
        text: csrfMessage,
        encryptedText: encryptMessage(csrfMessage, 'chave-maliciosa'),
        timestamp: new Date().toLocaleTimeString(),
        csrfToken: 'token-csrf-falso' // Token CSRF inválido
    };
    
    // Tentar processar a mensagem
    const result = processMessage(maliciousMessage);
    
    // Mostrar o resultado do ataque
    const csrfResultElement = document.getElementById('csrf-result');
    if (!result.success) {
        csrfResultElement.innerHTML = `
            <div style="color: green; font-weight: bold;">
                Ataque CSRF bloqueado! Motivo: ${result.error}
            </div>
        `;
    } else {
        csrfResultElement.innerHTML = `
            <div style="color: red; font-weight: bold;">
                Ataque CSRF bem-sucedido! A proteção falhou.
            </div>
        `;
    }
}

// Inicializar a interface
renderMessages();