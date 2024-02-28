import type { Peer } from "crossws";
import { getQuery } from "ufo";

const users = new Map<string, { online: boolean }>();

export default defineWebSocketHandler({
  open(peer) {
    console.log(`[ws] open ${peer}`);

    const userId = getUserId(peer);
    users.set(userId, { online: true });

    const stats = getStats();
    peer.send({
      user: "server",
      message: `Welcome to the server ${userId}! (Online users: ${stats.online}/${stats.total})`,
    });

    peer.subscribe("chat");
    peer.publish("chat", { user: "server", message: `${peer} joined!` });
  },
  async message(peer, message) {
    console.log(`[ws] message ${peer} ${message.text()}`);

    const userId = getUserId(peer);

    if (message.text() === "ping") {
      peer.send({ user: "server", message: "pong" });
    } else {
      const _message = {
        user: userId,
        message: message.text(),
      };
      peer.send(_message); // echo back
      peer.publish("chat", _message);

      // no spam ping and pong =)
      await addMessage(userId, message.text());
    }
  },

  close(peer, details) {
    console.log(`[ws] close ${peer}`);

    const userId = getUserId(peer);
    users.set(userId, { online: false });
  },

  error(peer, error) {
    console.log(`[ws] error ${peer}`, error);
  },

  upgrade(req) {
    return {
      headers: {
        "x-powered-by": "cross-ws",
      },
    };
  },
});

function getUserId(peer: Peer) {
  const query = getQuery(peer.url);
  return query.userId as string;
}

function getStats() {
  const online = Array.from(users.values()).filter((u) => u.online).length;
  return { online, total: users.size };
}
