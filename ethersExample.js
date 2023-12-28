const { ethers } = require("ethers");
const mirrornodeBase = "https://testnet.mirrornode.hedera.com"; // hedera mirrornode base url
const invokeScEndpoint = "api/v1/contracts/call"; // invoke smart contract endpoint
const contractAddress = "0x00000000000000000000000000000000006c7fa5"; // smart contract to invoke
const tokenAddress = "0x0000000000000000000000000000000000069ba7"; // token address to check locked details
const accountAddress = "0x00000000000000000000000000000000000549af"; // account address to check locked details
const main = async () => {
  // 1. create the hexadecimal encoded data for function call

  const iface = new ethers.Interface([
    "function getLockedDetails(address tokenAddress) view returns (int64 lockedAmount, uint256 remainingLockDuration)",
  ]);
  const data = iface.encodeFunctionData("getLockedDetails", [tokenAddress]);

  // 2. create the request body
  const body = {
    block: "latest",
    data,
    estimate: false,
    from: accountAddress,
    to: contractAddress,
  };

  // 3. send the request
  const url = `${mirrornodeBase}/${invokeScEndpoint}`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { result } = await res.json();
  console.log("HEX encoded function result", result);
  console.log("-----------------------------------");

  // 4. decode the result
  const decodeParameter = iface.decodeFunctionResult(
    "getLockedDetails",
    result
  );

  console.log("Decoded parameters: ", decodeParameter);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
