export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageCallback: ((message: string) => void) | null = null;
  onlineMembers = '0';

  constructor(private url: string) {}

  // Inicjalizacja połączenia WebSocket
  connect() {
    if (this.socket) {
      console.warn('WebSocket is already connected');
      return;
    }

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    this.socket.onmessage = (event) => {
      this.onlineMembers = event.data;
      if (this.messageCallback) {
        this.messageCallback(event.data);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      this.socket = null;
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  // Ustawienie callbacka na odbieranie wiadomości
  onMessage(callback: (message: string) => void) {
    this.messageCallback = callback;
  }

  // Wysłanie wiadomości przez WebSocket
  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket is not open');
    }
  }

  // Zamknięcie połączenia WebSocket
  close() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const websocketService = new WebSocketService('ws://192.168.1.102:80?userId=1');
