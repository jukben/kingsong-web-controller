import React from "react";
import { useBLE } from "../context";

export const Controls = ({
  onConnect,
  onDisconnect
}: {
  onConnect: () => void;
  onDisconnect: () => void;
}) => {
  const ble = useBLE();

  return ble ? (
    <>
      <button onClick={onDisconnect}>Disconnect from {ble.name}</button>
    </>
  ) : (
    <button onClick={onConnect}>Connect</button>
  );
};
