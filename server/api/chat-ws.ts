import { addMessage } from "../utils/database";

const stats = {
  online: 0,
  total: 0,
}

export default defineWebSocketHandler({
  open(peer) {
    console.log(`[ws] open ${peer}`);
    stats.online++;
    stats.total++;

    peer.send({ user: "server", message: `Welcome to the server ${peer}! (Online users: ${stats.online}/${stats.total})` });

    peer.subscribe("chat");
    peer.publish("chat", { user: "server", message: `${peer} joined!` });

  },
  async message(peer, message) {
    console.log(`[ws] message ${peer} ${message.text()}`);
    await addMessage(peer.toString(), message.text());
    if (message.text() === "ping") {
      peer.send({ user: "server", message: "pong" });
    } else {
      const _message = {
        user: peer.toString(),
        message: message.text(),
      };
      peer.send(_message);
      peer.publish("chat", _message);
    }
  },
  upgrade(req) {
    console.log("[ws] upgrade", req.url);
    return {
      headers: {
        "x-powered-by": "cross-ws",
        "set-cookie": "cross-ws=1; SameSite=None; Secure",
      },
    };
  },
  close(peer, details) {
    console.log(`[ws] close ${peer}`, details);
    stats.online--;
  },
  error(peer, error) {
    console.log(`[ws] error ${peer}`, error);
  },
});
