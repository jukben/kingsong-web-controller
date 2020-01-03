import React, { useState } from "react";
import { KS_SERVICE } from "./constants";
import { BLEContextProvider } from "./context";
import { Controls } from "./components/controls";
import { Monitor } from "./components/monitor";
import { KingSongProtocol } from "./ks/service";

const App = () => {
  const [ble, setBle] = useState<KingSongProtocol | null>(null);

  const handleDisconnect = () => {
    if (!ble) {
      return;
    }

    ble.disconnect();
    setBle(null);
  };

  window.onbeforeunload = () => {
    handleDisconnect();
  };

  const handleConnect = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [0xfff0] }],
        optionalServices: [KS_SERVICE]
      });

      const GATTServer = device.gatt;

      if (!GATTServer) {
        console.error("GATT not found!");
        return;
      }

      const server = await GATTServer.connect();

      const service = new KingSongProtocol({ server });
      setBle(service);
    } catch (e) {
      console.error("Connection to the GATT server failed!");
    }
  };

  return (
    <BLEContextProvider value={ble}>
      <Controls onConnect={handleConnect} onDisconnect={handleDisconnect} />
      {ble && <Monitor />}
    </BLEContextProvider>
  );
};

export default App;
