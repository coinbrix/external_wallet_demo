import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import { MetaMaskSDK } from '@metamask/sdk';
import { v4 as uuidv4 } from 'uuid';
import Hex from 'crypto-js/enc-hex';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import TransactionCard from "./components/TransactionCard";




function App() {

    let options = {}
    const MMSDK = new MetaMaskSDK(options);
    const ethereum = MMSDK.getProvider(); // You can also access via window.ethereum


    const [address, setAddress] = useState('--Address Here--')
    const [personalMessage, setPersonalMessage] = useState('Personal Message Signing')
    const [connectButtonLabel, setConnectButtonLabel] = useState('Connect Metamask')
    const [loading, setLoading] = useState(true)


  useEffect(() => {
    console.log('adding event listener', new Date().getSeconds());
    window.document.body.addEventListener('Singularity-mounted', () => {

        // eslint-disable-next-line no-restricted-globals
        const url_string = location.href;
        const url = new URL(url_string);
        const key = url.searchParams.get("key") ?? 2;

        console.log('key from params', key)


      // let key = 2;
      // let key = 97;

      window.Singularity.init(key);

      window.SingularityEvent.subscribe('SingularityEvent-logout', () => {
        window.SingularityEvent.close();
      });
      window.SingularityEvent.subscribe('SingularityEvent-login', data => {
        console.log('login data --->', data);
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
      setConnectButtonLabel('Connected')
      console.log('address', add)
  }

    const onPersonalMessageSignedClicked = async () => {
        const signature = await window.SingularityEvent.requestPersonalSignatureCustomProvider(personalMessage, ethereum)
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

        const signature = await window.SingularityEvent.requestTypedSignatureCustomProvider(domain, primaryType, types, message, ethereum)

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
        await window.SingularityEvent.transactionFlowCustomProvider(requestString, signature, ethereum)
    }

    const handleLoginWithProvider = async () => {
        await window.SingularityEvent.loginWithProvider(ethereum)
    }



    return (
    <div className="App">
        { loading &&
            <center><h1>Loading...Please Wait...</h1></center>
        }
      <center><h2>Welcome to the best game ever</h2></center>
        <p>1. Connect wallet using the connect button below</p>
        <p>2. Once you see your address...you are logged in to the game. Click on "Login with provider" to login to singularity using provider available on game side</p>
        <p>3. Now test the transactions</p>
      <p>{address}</p>
      <button onClick={onConnectMetamaskClicked}>{connectButtonLabel}</button>
      <button onClick={onPersonalMessageSignedClicked}>Get Personal Message Signed</button>
      <button onClick={onTypedMessageSignedClicked}>Get Typed Message Signed</button>
      {/*<button onClick={handleReceiveTransactionClicked}>Start Receive Transaction</button>*/}
      <button onClick={handleLoginWithProvider}>Login with provider</button>
      <TransactionCard />
    </div>
  );
}

export default App;
