rm -rf src/contracts &&
mkdir -p src/contracts/oswap-openswap-contract &&
mkdir -p src/contracts/scom-commission-proxy-contract &&
cp -r node_modules/@scom/oswap-openswap-contract/src/* src/contracts/oswap-openswap-contract &&
cp -r node_modules/@scom/scom-commission-proxy-contract/src/* src/contracts/scom-commission-proxy-contract