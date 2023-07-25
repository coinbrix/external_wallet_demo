import {useEffect, useState} from "react";
import { MetaMaskSDK } from '@metamask/sdk';
import { v4 as uuidv4 } from 'uuid';
import Hex from 'crypto-js/enc-hex';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import TransactionCard from "./components/TransactionCard";
import Onboard from '@web3-onboard/core'
import walletConnectModule from '@web3-onboard/walletconnect'
import { providers } from "ethers";
import {TextField} from "@mui/material";

export const POLYGON_ALCHEMY_RPC_API_KEY = 'JMO79zfZTuw2dVCRIAfvqUthDSOFPzG0';
export const POLYGON_ALCHEMY_RPC_URL = `https://polygon-mainnet.g.alchemy.com/v2/${POLYGON_ALCHEMY_RPC_API_KEY}`;
// export const POLYGON_MUMBAI_RPC_URL = `https://skilled-dawn-research.matic-testnet.quiknode.pro/ad667afe0dad9b979ffb5053038c93cf1ce4b066/`;
export const POLYGON_MUMBAI_RPC_URL = `https://rpc-mumbai.maticvigil.com/`;
export const POLYGON_CHAIN_ID = '0x89';
export const POLYGON_MUMBAI_ID = '0x13881';
export const POLYGON_TOKEN = 'MATIC';
export const POLYGON_LABEL = 'Polygon Mainnet';
export const POLYGON_MUMBAI_LABEL = 'Polygon Mumbai';
export const WALLET_CONNECT_MOBILE_LINKS = ['metamask', 'argent', 'trust'];

const wcV2InitOptions = {
    /**
     * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
     */
    projectId: '6f8be5b49de8e66f26bd138769b2af70',
    /**
     * Chains required to be supported by all wallets connecting to your DApp
     */
    // requiredChains: [1, 13881, 89],
    // requiredChains: [13881],
    /**
     * Defaults to `appMetadata.explore` that is supplied to the web3-onboard init
     * Strongly recommended to provide atleast one URL as it is required by some wallets (i.e. MetaMask)
     * To connect with WalletConnect
     */
    dappUrl: 'http://YourAwesomeDapp.com',
    qrcodeModalOptions: {
        mobileLinks: WALLET_CONNECT_MOBILE_LINKS
    }
}

const walletConnect = walletConnectModule(wcV2InitOptions)


const onboard = Onboard({
    // ... other Onboard options
    wallets: [
        walletConnect
        //... other wallets
    ],
    appMetadata: {
        explore: 'http://YourAwesomeDapp.com',
        name: 'dss',
        description: 'dwfgeg',
        icon: "icon URL",
        logo: "logo URL",
    },
    chains: [
        {
            id: POLYGON_CHAIN_ID,
            token: POLYGON_TOKEN,
            label: POLYGON_LABEL,
            rpcUrl: POLYGON_ALCHEMY_RPC_URL
        },
        {
            id: POLYGON_MUMBAI_ID,
            token: POLYGON_TOKEN,
            label: POLYGON_MUMBAI_LABEL,
            rpcUrl: POLYGON_MUMBAI_RPC_URL
        },
        {
            id: '0x1',
            token: 'ETH',
            label: 'Ethereum',
            rpcUrl: 'https://rpc.ankr.com/eth'
        },
        {
            id: '0xA86A',
            token: 'AVAX',
            label: 'Avalanche',
            rpcUrl: 'https://api.avax.network/ext/bc/C/rpc'
        }
    ],
})


function App() {

    let options = {}
    const MMSDK = new MetaMaskSDK(options);
    const ethereum = MMSDK.getProvider(); // You can also access via window.ethereum

    const [wcProvider, setWcProvider] = useState()


    const [address, setAddress] = useState('--Address Here--')
    const [personalMessage, setPersonalMessage] = useState('Personal Message Signing')
    const [connectButtonLabel, setConnectButtonLabel] = useState('Connect Metamask')
    const [loading, setLoading] = useState(true)

    const WALLET_OPTIONS = {
        METAMASK: 'METAMASK',
        WALLET_CONNECT: 'WALLET_CONNECT'
    }

    const [apiKey, setApiKey] = useState('F21nGK7KSyFqkeI6BTDkTU3vn0V76imb')
    const [connectedWallet, setConnectedWallet] = useState()

    const initializeSingularity = () => {
        window.Singularity.init(apiKey, () => {
            alert(`SIngularity Initialized with api key - ${apiKey}`)
        });
    }




  useEffect(() => {
    console.log('adding event listener', new Date().getSeconds());
    window.document.body.addEventListener('Singularity-mounted', () => {

      window.SingularityEvent.subscribe('SingularityEvent-logout', () => {
        window.SingularityEvent.close();
      });
      window.SingularityEvent.subscribe('SingularityEvent-login', data => {
        console.log('login data --->', data);
        alert(`Logged in user data -----> ${data}`)
        window.SingularityEvent.close();
      });

      window.SingularityEvent.subscribe('SingularityEvent-open', () => {

      });

      window.SingularityEvent.subscribe('SingularityEvent-close', () => {
        console.log('subscribe close drawer ');
      });

      window.SingularityEvent.subscribe(
          'SingularityEvent-onTransactionApproval',
          data => {
            console.log('Txn approved', JSON.parse(data));
          }
      );
      window.SingularityEvent.subscribe(
          'SingularityEvent-onTransactionSuccess',
          data => {
            console.log('Txn Successfull', JSON.parse(data));
          }
      );
      window.SingularityEvent.subscribe(
          'SingularityEvent-onTransactionFailure',
          data => {
            console.log('Txn failed', JSON.parse(data));
          }
      );

      setLoading(false)
    });
  }, []);

  const onConnectMetamaskClicked = async () => {
      const add = await ethereum.request({method: 'eth_requestAccounts', params: []});
      const addValue = add[0]
      setAddress(addValue)
      setConnectedWallet(WALLET_OPTIONS.METAMASK)
      // setConnectButtonLabel('Connected')
      console.log('address', add)
  }

    const onConnectWalletConnectClicked = async () => {
        const connectedWallets = await onboard.connectWallet()
        console.log(connectedWallets)
        const walletData = connectedWallets[0]

        console.log('ppp', walletData.provider)

        setWcProvider(walletData.provider)
        setAddress(walletData.accounts[0].address)

        setConnectedWallet(WALLET_OPTIONS.WALLET_CONNECT)
    }

    const onPersonalMessageSignedClicked = async () => {
        const signature = await window.SingularityEvent.requestPersonalSignature(personalMessage)
        console.log('Signature demo',signature)
        if (signature.metaData)
            window.alert('Signature: ' + signature.metaData);
    }


    const onTypedMessageSignedClicked = async () => {
        const domain = {
            name: 'GamePay',
            version: '1',
            chainId: 97,
            verifyingContract: '0xED975dB5192aB41713f0080E7306E08188e53E7f'
        };

        const types = {
            bid: [
                { name: 'bidder', type: 'address' },
                { name: 'collectableId', type: 'uint256' },
                { name: 'amount', type: 'uint256' },
                { name: 'nounce', type: 'uint' }
            ]
        };

        const message = {
            bidder: '0xAa81f641d4b3546F05260F49DEc69Eb0314c47De',
            collectableId: 1,
            amount: 100,
            nounce: 1
        };

        const primaryType ="bid";

        const signature = await window.SingularityEvent.requestTypedSignature(domain, primaryType, types, message)

        console.log('Signature demo',signature)
        if (signature.metaData)
            window.alert('Signature: ' + signature.metaData);
    }

    const handleReceiveTransactionClicked = async () => {

        const clientReferenceId = uuidv4();

        let body = {
            clientReferenceId,
            singularityTransactionType: 'RECEIVE',
            transactionLabel: 'Label Here',
            transactionDescription: 'Description',
            transactionIconLink:
                'https://singularity-icon-assets.s3.ap-south-1.amazonaws.com/currency/matic.svg',
            clientReceiveObject: {
                clientRequestedAssetId: 800011,
                clientRequestedAssetQuantity: 0.00001,
            },
        };

        const secret =
            'SSk49aq1/kQ1eKH7Sg+u4JsisvrycRcLopHdM6lNEMVe/p7lsSVoRiY0neFYNJkHoWVEK30bPAV2pNU2WwOJXQ==';

        console.log('Body to generate signature ---->', body);
        const requestString = JSON.stringify(body);
        const signature = Hex.stringify(hmacSHA512(requestString, secret));
        await window.SingularityEvent.transactionFlow(requestString, signature)
    }

    const handleLoginWithProvider = async () => {
      console.log('using this to login', wcProvider)

        if(connectedWallet === WALLET_OPTIONS.METAMASK){
            await window.SingularityEvent.loginWithProvider(ethereum)
        }

        if(connectedWallet === WALLET_OPTIONS.WALLET_CONNECT){
            await window.SingularityEvent.loginWithProvider(wcProvider)
        }
    }



    return (
        <>
    <div className="App">
        { loading &&
            <center><h1>Loading...Please Wait...</h1></center>
        }
      <center><h2>Welcome to the best game ever</h2></center>

        <p>1. Initialize Singularity</p>

        Api Key:
        <TextField
            placeholder="Api Key"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            inputProps={{ style: { fontSize: '20px', height: '100%' } }}
            sx={{ mt: 1 }}
        />

        <button onClick={initializeSingularity}>Initialize Singularity</button>

        <p>2. Connect wallet using any of the the connect button below</p>

        { connectedWallet &&
            <p>Connected using ${connectedWallet} - ${address}</p>
        }
        { !connectedWallet &&
            <>
            <button onClick={onConnectMetamaskClicked}>{connectButtonLabel}</button>
            <button onClick={onConnectWalletConnectClicked}>Connect wallet connect</button>
            </>
        }


        <p>3. Once you see your address...you are logged in to the game. Click on "Login with provider" to login to singularity using provider available on game side</p>
        <p>{address}</p>
        <button onClick={handleLoginWithProvider}>Login with provider</button>

        <p>4. Now test the transactions</p>


        <TextField
            placeholder="Text Message here"
            value={personalMessage}
            onChange={e => setPersonalMessage(e.target.value)}
            inputProps={{ style: { fontSize: '20px', height: '100%' } }}
            sx={{ mt: 1 }}
        />
      <button onClick={onPersonalMessageSignedClicked}>Get Personal Message Signed</button>

      {/*<button onClick={onTypedMessageSignedClicked}>Get Typed Message Signed</button>*/}
      {/*<button onClick={handleReceiveTransactionClicked}>Start Receive Transaction</button>*/}
      <TransactionCard />
    </div>
            </>
  );
}

export default App;
