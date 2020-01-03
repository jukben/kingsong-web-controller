import React, { useEffect, useState } from "react";
import { useBLE } from "../context";
import { KingSongProtocol } from "../ks/service";

const Loading = () => <div>Loading...</div>;

export const Monitor = () => {
  const ble = useBLE();

  const [data, setData] = useState<ReturnType<KingSongProtocol["decodeData"]>>(
    null
  );

  useEffect(() => {
    if (!ble) {
      return;
    }

    const handleResponse = (buffer: ArrayBuffer) => {
      const decodedDataFromWheel = ble.decodeData(buffer);
      if (decodedDataFromWheel) {
        setData(decodedDataFromWheel);
      }
    };

    ble.startCommunication(handleResponse);
  }, [ble]);

  return data ? (
    <div>
      speed: {data.speed} km/h
      <br />
      temperature: {data.temperature} °C
    </div>
  ) : (
    <Loading />
  );
};
