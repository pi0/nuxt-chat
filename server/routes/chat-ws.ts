export default defineWebSocketHandler({
  open(peer) {
    console.log(`[ws] open ${peer}`);
    peer.send({ user: "server", message: `Welcome to the server ${peer}!` });
    peer.subscribe("chat");
    peer.publish("chat", { user: "server", message: `${peer} joined!` });
  },
  message(peer, message) {
    console.log(`[ws] message ${peer} ${message.text()}`);
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
  },
  error(peer, error) {
    console.log(`[ws] error ${peer}`, error);
  },
});
