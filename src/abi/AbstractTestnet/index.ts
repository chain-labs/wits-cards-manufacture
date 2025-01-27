import { abstractTestnet } from "viem/chains";

interface IContract {
  address?: `0x${string}`;
  abi?: object[];
}

import abi from "./abi.json";
import { CONTRACTS } from "../config";
import { zeroAddress } from "viem";
import { useEffect, useState } from "react";

const useAbstractTestnet = () => {
  const [contract, setContract] = useState<IContract>({
    abi: [],
    address: zeroAddress,
  });

  useEffect(() => {
    const address = CONTRACTS[abstractTestnet.id];
    if (address) {
      setContract({ address, abi });
    }
  }, []);

  return contract;
};

export default useAbstractTestnet;
