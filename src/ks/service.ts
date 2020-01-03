import { KS_SERVICE, KS_CHARACTERISTICS, KS_ACTIONS } from "../constants";
import { decodeData } from "./utils";

export class KingSongProtocol {
  private s?: BluetoothRemoteGATTServer;
  private c?: BluetoothRemoteGATTCharacteristic;

  constructor({ server }: { server: BluetoothRemoteGATTServer }) {
    this.s = server;
  }

  isConnected() {
    return this.s && this.s.connected;
  }

  disconnect() {
    this.s?.disconnect();
  }

  decodeData(buffer: ArrayBuffer) {
    return decodeData(buffer);
  }

  get name() {
    if (!this.s) {
      throw new Error("GATT not connected!");
    }

    return this.s.device.name;
  }

  async startCommunication(handleResponse: (buffer: ArrayBuffer) => void) {
    if (!this.s) {
      return;
    }

    const serviceCache = await this.s.getPrimaryService(KS_SERVICE);

    this.c = await serviceCache.getCharacteristic(KS_CHARACTERISTICS);

    await this.c.startNotifications();

    await this.c.writeValue(KS_ACTIONS.REQUEST_NAME);

    this.c.addEventListener("characteristicvaluechanged", event => {
      if (!event.target) {
        return;
      }

      const buffer = ((event.target as unknown) as {
        value: { buffer: ArrayBuffer };
      }).value.buffer;

      handleResponse(buffer);
    });
  }
}
