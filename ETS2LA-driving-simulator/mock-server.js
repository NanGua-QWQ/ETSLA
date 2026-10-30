
const http = require("http");
const crypto = require("crypto");

function createSocketServer(port, onConnect) {
  const server = http.createServer();

    server.on("upgrade", (req, socket) => {
        const key = req.headers["sec-websocket-key"];
            if (!key) return socket.destroy();

                const accept = crypto
                      .createHash("sha1")
                            .update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
                                  .digest("base64");

                                      socket.write(
                                            "HTTP/1.1 101 Switching Protocols\r\n" +
                                                  "Upgrade: websocket\r\n" +
                                                        "Connection: Upgrade\r\n" +
                                                              "Sec-WebSocket-Accept: " + accept + "\r\n\r\n"
                                                                  );

                                                                      onConnect(socket);
                                                                        });

                                                                          server.listen(port, "127.0.0.1", () => {
                                                                              console.log("WebSocket running:", port);
                                                                                });
                                                                                }

                                                                                function send(socket, data) {
                                                                                  if (socket.destroyed) return;

                                                                                    const payload = Buffer.from(JSON.stringify(data));
                                                                                      const header = Buffer.alloc(payload.length < 126 ? 2 : 4);

                                                                                        header[0] = 0x81;

                                                                                          if (payload.length < 126) {
                                                                                              header[1] = payload.length;
                                                                                                } else {
                                                                                                    header[1] = 126;
                                                                                                        header.writeUInt16BE(payload.length, 2);
                                                                                                          }

                                                                                                            socket.write(Buffer.concat([header, payload]));
                                                                                                            }

                                                                                                            const clients = new Set();

                                                                                                            // 静态数据服务
                                                                                                            createSocketServer(37526, socket => {
                                                                                                              send(socket, {
                                                                                                                  add: {
                                                                                                                        nodes: {},
                                                                                                                              roads: [],
                                                                                                                                    prefabs: [],
                                                                                                                                          models: []
                                                                                                                                              },
                                                                                                                                                  remove: {
                                                                                                                                                        nodes: [],
                                                                                                                                                              roads: [],
                                                                                                                                                                    prefabs: [],
                                                                                                                                                                          models: []
                                                                                                                                                                              }
                                                                                                                                                                                });
                                                                                                                                                                                });

                                                                                                                                                                                // 实时车辆数据服务
                                                                                                                                                                                createSocketServer(37525, socket => {
                                                                                                                                                                                  clients.add(socket);

                                                                                                                                                                                    socket.on("close", () => clients.delete(socket));
                                                                                                                                                                                      socket.on("error", () => clients.delete(socket));
                                                                                                                                                                                      });

                                                                                                                                                                                      let time = 0;

                                                                                                                                                                                      setInterval(() => {
                                                                                                                                                                                        time += 0.05;

                                                                                                                                                                                          const x = Math.sin(time * 0.2) * 2;
                                                                                                                                                                                            const z = time * 3;

                                                                                                                                                                                              const data = {
                                                                                                                                                                                                  timestamp: Date.now(),

                                                                                                                                                                                                      telemetryData: {
                                                                                                                                                                                                            position: { X: x, Y: 0, Z: z },
                                                                                                                                                                                                                  rotation: {
                                                                                                                                                                                                                          X: 0,
                                                                                                                                                                                                                                  Y: 0,
                                                                                                                                                                                                                                          Z: 0,
                                                                                                                                                                                                                                                  W: 1
                                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                                              trailers: [],
                                                                                                                                                                                                                                                                    speed: 20 + Math.sin(time) * 3,
                                                                                                                                                                                                                                                                          speedLimit: 25,
                                                                                                                                                                                                                                                                                throttle: 0.3,
                                                                                                                                                                                                                                                                                      brake: 0,
                                                                                                                                                                                                                                                                                            clutch: 0,
                                                                                                                                                                                                                                                                                                  steering: Math.sin(time) * 0.1
                                                                                                                                                                                                                                                                                                      },

                                                                                                                                                                                                                                                                                                          selfDrivingData: {
                                                                                                                                                                                                                                                                                                                pathPoints: Array.from({ length: 20 }, (_, i) => ({
                                                                                                                                                                                                                                                                                                                        X: x + Math.sin(time * 0.2) * i * 0.02,
                                                                                                                                                                                                                                                                                                                                Y: 0.05,
                                                                                                                                                                                                                                                                                                                                        Z: z + i * 2
                                                                                                                                                                                                                                                                                                                                              })),
                                                                                                                                                                                                                                                                                                                                                    targetVehicles: [],
                                                                                                                                                                                                                                                                                                                                                          targetSemaphores: [],
                                                                                                                                                                                                                                                                                                                                                                targetSpeed: 22,
                                                                                                                                                                                                                                                                                                                                                                      isControllingSteering: true,
                                                                                                                                                                                                                                                                                                                                                                            isControllingAcceleration: true
                                                                                                                                                                                                                                                                                                                                                                                },

                                                                                                                                                                                                                                                                                                                                                                                    vehicles: [],
                                                                                                                                                                                                                                                                                                                                                                                        nodes: {},
                                                                                                                                                                                                                                                                                                                                                                                            roads: [],
                                                                                                                                                                                                                                                                                                                                                                                                prefabs: [],
                                                                                                                                                                                                                                                                                                                                                                                                    models: []
                                                                                                                                                                                                                                                                                                                                                                                                      };

                                                                                                                                                                                                                                                                                                                                                                                                        for (const socket of clients) {
                                                                                                                                                                                                                                                                                                                                                                                                            send(socket, data);
                                                                                                                                                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                                                                                                                                                              }, 50);

                                                                                                                                                                                                                                                                                                                                                                                                              console.log("ETS2LA 模拟遥测已启动");
                                                                                                                                                                                                                                                                                                                                                                                                              