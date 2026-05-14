import net from "net";

const TARGET_PORT = 5000;
const RELAY_PORT = 19796;

net.createServer((src) => {
  const dst = net.connect(TARGET_PORT, "127.0.0.1");
  src.pipe(dst);
  dst.pipe(src);
  src.on("error", () => dst.destroy());
  dst.on("error", () => src.destroy());
}).listen(RELAY_PORT, "0.0.0.0", () => {
  console.log(`Relay: 0.0.0.0:${RELAY_PORT} → 127.0.0.1:${TARGET_PORT}`);
});
