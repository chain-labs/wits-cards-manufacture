import MerkleTree from "merkletreejs";
import { encodePacked, keccak256 } from "viem";

export default function useToken() {
  const createMerkelTrees = (tokens: number) => {
    const leaves = tokens.map((token) => {
      return keccak256(encodePacked(["uint256"], [token]));
    });
    return new MerkleTree(leaves, keccak256);
  };
}
