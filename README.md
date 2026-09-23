# 🃏 Coup - React Native App

Este é um aplicativo em **React Native** (baseado no jogo de cartas **Coup**) com integração de **NFC** (leitura/escrita de tags NFC nas cartas) e **TTS (Text-to-Speech / Síntese de Voz)** em Português.

---

## 📋 Sumário

1. [Pré-requisitos](#-pré-requisitos)
2. [Instalação do Projeto](#-instalação-do-projeto)
3. [Configuração do Celular](#-configuração-do-celular)
4. [Como Rodar o App no Celular](#-como-rodar-o-app-no-celular)
   - [Método 1: React Native CLI (Via Cabo USB + Depuração)](#método-1-react-native-cli-via-cabo-usb--depuração)
   - [Método 2: Gerando e Instalando o APK](#método-2-gerando-e-instalando-o-apk)
5. [Recursos Hardware (NFC e Voz)](#-recursos-hardware-nfc-e-voz)
6. [Solução de Problemas](#-solução-de-problemas)

---

## 🛠️ Pré-requisitos

Para preparar a sua máquina de desenvolvimento, você precisará instalar as ferramentas listadas abaixo:

### 1. Node.js & Gerenciador de Pacotes

- **Node.js** (Versão recomendada: **LTS 14, 16 ou 18** para manter compatibilidade com React Native 0.61).
- **npm** (incluso no Node.js) ou **Yarn**.

### 2. JDK (Java Development Kit)

- **JDK 8 (Java 8)** ou **JDK 11**.
- Certifique-se de configurar a variável de ambiente `JAVA_HOME` apontando para o seu JDK.

### 3. Android Studio & Android SDK

- Baixe e instale o [Android Studio](https://developer.android.com/studio).
- No Android Studio, instale:
  - **Android SDK Platform** (Android 9.0 Pie / Android 10 ou superior).
  - **Android SDK Build-Tools**.
  - **Android SDK Command-line Tools**.
- Configure as Variáveis de Ambiente no seu sistema:
  - **Windows**:
    - `ANDROID_HOME` = `C:\Users\SEU_USUARIO\AppData\Local\Android\Sdk`
    - Adicione ao `Path`: `%ANDROID_HOME%\platform-tools` e `%ANDROID_HOME%\tools`.
  - **Linux / macOS**:
    - Adicione no `~/.bashrc` ou `~/.zshrc`:
      ```bash
      export ANDROID_HOME=$HOME/Android/Sdk
      export PATH=$PATH:$ANDROID_HOME/emulator
      export PATH=$PATH:$ANDROID_HOME/tools
      export PATH=$PATH:$ANDROID_HOME/tools/bin
      export PATH=$PATH:$ANDROID_HOME/platform-tools
      ```

---

## 📦 Instalação do Projeto

1. **Baixe ou clone o repositório:**

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd coup-react
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```
   > _Nota: O script de pós-instalação (`npm run postinstall`) será executado automaticamente para corrigir compatibilidades do Metro bundler._

---

## 📱 Configuração do Celular

Para rodar e testar o aplicativo diretamente no seu celular físico:

### 1. Ativar o Modo de Desenvolvedor no Celular

1. Abra as **Configurações** do seu smartphone Android.
2. Vá em **Sobre o telefone** (ou _Sobre o dispositivo_).
3. Procure por **Número da Versão** (ou _Build Number_).
4. Toque rapidamente **7 vezes** sobre o número da versão até aparecer a mensagem _"Você agora é um desenvolvedor!"_.

### 2. Ativar a Depuração USB

1. Volte ao menu principal de **Configurações** e entre em **Opções do Desenvolvedor** (ou _Sistema > Opções do Desenvolvedor_).
2. Ative a opção **Depuração USB** (USB Debugging).

### 3. Conectar o Celular ao Computador

1. Conecte o celular ao PC utilizando um **cabo USB de boa qualidade** (que suporte transferência de dados).
2. Uma mensagem de autorização aparecerá na tela do celular perguntando: _"Permitir depuração USB?"_.
3. Marque a caixa _"Sempre permitir a partir deste computador"_ e confirme em **OK**.

### 4. Verificar se o Dispositivo foi Reconhecido

Abra um terminal no seu computador e execute:

```bash
adb devices
```

Se o celular foi configurado corretamente, aparecerá na lista um código do dispositivo seguido do status `device`:

```text
List of devices attached
0123456789ABCDEF    device
```

---

## 🚀 Como Rodar o App no Celular

### Método 1: React Native CLI (Via Cabo USB + Depuração)

1. **Inicie o servidor de pacotes Metro:**
   No diretório do projeto, rode:

   ```bash
   npm start
   ```

   _(Mantenha esta janela do terminal aberta)_.

2. **Redirecione a porta do Metro para o celular (Recomendado):**
   Em uma nova janela de terminal, execute:

   ```bash
   adb reverse tcp:8081 tcp:8081
   ```

3. **Instale e rode o app no celular:**
   Ainda na segunda janela de terminal, execute:
   ```bash
   npm run android
   ```
   _O comando compilará a aplicação Android e enviará o App automaticamente para a tela do seu celular._

---

### Método 2: Gerando e Instalando o APK

Caso prefira gerar um instalador APK standalone para instalar diretamente no celular sem precisar manter o computador conectado:

1. **Compilar o APK de Debug:**

   - **Windows (PowerShell/CMD):**
     ```cmd
     cd android
     .\gradlew.bat assembleDebug
     ```
   - **Linux / macOS:**
     ```bash
     cd android
     ./gradlew assembleDebug
     ```

2. **Localizar o arquivo APK gerado:**
   O arquivo APK estará localizado em:
   `android/app/build/outputs/apk/debug/app-debug.apk`

3. **Instalar no celular:**
   - **Via ADB:**
     ```bash
     adb install android/app/build/outputs/apk/debug/app-debug.apk
     ```
   - **Ou enviando para o celular:** Copie o arquivo `app-debug.apk` para a memória do celular (via WhatsApp, Google Drive ou USB) e execute o arquivo no celular para instalar.

---
