import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import { MetaMaskSDK } from '@metamask/sdk';



function App() {

    let options = {}
    const MMSDK = new MetaMaskSDK(options);
    const ethereum = MMSDK.getProvider(); // You can also access via window.ethereum


    const [address, setAddress] = useState('--Address Here--')
    const [personalMessage, setPersonalMessage] = useState('Personal Message Signing')
    const [connectButtonLabel, setConnectButtonLabel] = useState('Connect Metamask')


  useEffect(() => {
    console.log('adding event listener', new Date().getSeconds());
    window.document.body.addEventListener('Singularity-mounted', () => {
      let key = 5;

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
        const signature = window.SingularityEvent.requestPersonalSignature(personalMessage, ethereum)
        console.log('Signature',signature)
    }


  return (
    <div className="App">
      <p>{address}</p>
      <button onClick={onConnectMetamaskClicked}>{connectButtonLabel}</button>
      <button onClick={onPersonalMessageSignedClicked}>Get Personal Message Signed</button>
    </div>
  );
}

export default App;
