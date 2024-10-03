import { skaleNebulaTestnet } from "viem/chains";

interface IContract {
  address?: `0x${string}`;
  abi?: any;
}

import abi from "./abi.json";
import { CONTRACTS } from "../config";
import { zeroAddress } from "viem";
import { useEffect, useState } from "react";

const useSkaleNebulaTestnet = () => {
  const [contract, setContract] = useState<IContract>({
    abi: {},
    address: zeroAddress,
  });

  useEffect(() => {
    const address = CONTRACTS[skaleNebulaTestnet.id];
    if (address) {
      setContract({ address, abi });
    }
  }, []);

  return contract;
};

export default useSkaleNebulaTestnet;
