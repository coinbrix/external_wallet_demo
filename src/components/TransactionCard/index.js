import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Hex from 'crypto-js/enc-hex';

export const tokens = [
  { value: 800011, label: 'USDC Mumbai', symbol: 'usdc' },
  { value: 800010, label: 'MATIC Mumbai',symbol:'matic' },
  { value: 970, label: 'BNB BSC Testnet',symbol: 'bnb' },
  { value: 973, label: 'BUSD BSC Testnet',symbol: 'busd' },
  { value: 560, label: 'BNB BSC Mainnet',symbol: 'bnb' },
  { value: 563, label: 'BUSD BSC Mainnet',symbol: 'busd' },
  { value: 564, label: 'RPG BSC Mainnet',symbol: 'rpg' },
  { value: 50, label: 'ETH on Goerli',symbol: 'eth'  },
  { value: 51, label: 'USDC on Goerli',symbol: 'usdc' },
  { value: 4200, label: 'ETH on Optimism Testnet',symbol: 'eth' },
  { value: 4201, label: 'USDC on Optimism Testnet',symbol: 'usdc' },
  { value: 99810, label: 'ETH on Caldera Goerli Appchain',symbol: 'eth' },
  { value: 99811, label: 'USDC on Caldera Goerli Appchain' ,symbol: 'usdc'},
  { value: 2220, label: 'ETH on Conduit Goerli Appchain',symbol: 'eth' },
  { value: 2221, label: 'USDC on Conduit Goerli Appchain',symbol: 'usdc' },
  { value: 93720, label: 'OAS on Oasys Testnet',symbol: 'oas' },
  { value: 93721, label: 'USDC on Oasys Testnet',symbol:'usdc' },
  { value: 295480, label: 'OAS on MCH Verse Mainnet',symbol:'oas' },
  { value: 295481, label: 'USDC on MCH Verse Mainnet',symbol: 'usdc' },
  { value: 201970, label: 'OAS on SAND Verse', symbol:'oas' },
  { value: 201971, label: 'USDC on SAND Verse', symbol:'usdc' },
  { value: 408750, label: 'OAS on Home Verse Testnet', symbol:'oas' },
  { value: 408751, label: 'USDC on Home Verse Testnet', symbol:'usdc' },
  { value: 431130, label: 'Avax on Avalanche Fuji testnet',symbol:'avax' },
  { value: 431131, label: 'USDC on Avalanche Fuji testnet', symbol:'usdc' },
  { value: 431140, label: 'Avax on Avalanche Mainnet', symbol:'avax' },
  { value: 431141, label: 'USDC on Avalanche Mainnet', symbol:'usdc' },
  { value: 431147, label: 'LODE on Avalanche Mainnet', symbol:'lode' },
  { value: 431148, label: 'AGX on Avalanche Mainnet', symbol:'agx'},
  { value: 431149, label: 'AUX on Avalanche Mainnet', symbol:'avax' },
  { value: 1370, label: 'MATIC Mainnet', symbol:'matic' },
  { value: 1371, label: 'USDC Mainnet', symbol:'usdc' },
  { value: 974, label: 'RPG BSC Testnet',  symbol:'rpg' },
  { value: 539350, label: 'JEWEL on DFK Mainnet', symbol:'jewel' },
  { value: 539351, label: 'USDC on DFK Mainnet', symbol:'jewel' },
];
export default function TransactionCard({
  userId,
  showUserAddressField,
  handleBuyAsset,
}) {


  const receivingAddressTypes = [
    {
      value: 'user',
      label: 'User',
    },
    {
      value: 'merchant',
      label: 'Merchant',
    },
  ];
  const [token, setToken] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [gamerAddress, setGamerAddress] = useState('');
  const [receivingAddressType, setReceivingAddressType] = useState('user');

  useEffect(() => {
    if (receivingAddressType === 'user') {
      // handleAddressField();
    } else {
      setGamerAddress('');
    }
    return () => {
      setGamerAddress('');
    };
  }, [receivingAddressType]);

  // const handleAddressField = async () => {
  //   const userInfo = await window.SingularityEvent.getConnectUserInfo();
  //   const userAvailabelAddresses =
  //     userInfo?.metaData?.wallet?.accounts?.evmPublicAddress || [];
  //   const userSelectedAddress = userAvailabelAddresses.length
  //     ? userAvailabelAddresses[0]?.publicAddress || ''
  //     : '';
  //   if (userSelectedAddress) {
  //     setGamerAddress(userSelectedAddress);
  //   }
  // };

  // function singularityPayments() {
  //   let isUserLoggedIn = false
  //
  //   const API_KEY = 'API_KEY_HERE';
  //   // Mounting event indicates that singularity is ready for initialization
  //   window.document.body.addEventListener('Singularity-mounted', () => {
  //
  //     window.Singularity.init(API_KEY, async () => {
  //       // Init callback indicates that singularity methods are ready for use
  //       // Singularity calls should be made after init success callback
  //       startTransaction()
  //     })
  //   })
  // }
  //
  // async function startTransaction() {
  //   if (await isUserLoggedIn()) {
  //     window.SingularityEvent.transactionFlow(requestDataString, null)
  //   }
  //   else {
  //     window.SingularityEvent.subscribe('SingularityEvent-login', data => {
  //       // If a login attempt is made, we should wait for login callback and perform any action after
  //       startTransaction()
  //     });
  //     await window.SingularityEvent.loginWithProvider(provider)
  //   }
  // }

  async function isUserLoggedIn() {
    const userData = await window.SingularityEvent.getConnectUserInfo()
    if(userData.metaData){
      return true
    }
    else {
      return false
    }
  }

  const initiateTransaction = async () => {
    setLoading(true);

    try {
      const clientReferenceId = uuidv4();

      let body = {
        clientReferenceId,
        singularityTransactionType: 'RECEIVE',
        transactionLabel: reason,
        transactionDescription: 'Description',
        transactionIconLink:
          'https://singularity-icon-assets.s3.ap-south-1.amazonaws.com/currency/matic.svg',
        clientReceiveObject: {
          clientRequestedAssetId: token,
          clientRequestedAssetQuantity: amount,
        },
        optionalAssets: tokens.map(token => token.value)
      };
      if (gamerAddress) {
        body = {
          ...body,
          clientReceiveObject: {
            ...body.clientReceiveObject,
            address: gamerAddress,
          },
        };
      }

      const secret =
        'SSk49aq1/kQ1eKH7Sg+u4JsisvrycRcLopHdM6lNEMVe/p7lsSVoRiY0neFYNJkHoWVEK30bPAV2pNU2WwOJXQ==';

      console.log('Body to generate signature ---->', body);
      const requestString = JSON.stringify(body);
      const signature = Hex.stringify(hmacSHA512(requestString, secret));
      window.SingularityEvent.transactionFlow(requestString, null);
      if (gamerAddress && handleBuyAsset) {
        handleBuyAsset();
      }
    } catch (err) {
      window.alert('Some error occured');
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        border: '6px solid white',
        bgcolor: '#FFFFFFA6',
        width: ['100%', 410],
        boxSizing: 'border-box',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography textAlign="center" mb={1}>
        Request payment from user
      </Typography>

      <FormControl fullWidth>
        {!token && (
          <InputLabel style={{ fontSize: '20px' }}>Requested Token</InputLabel>
        )}
        <Select
          value={token}
          onChange={e => setToken(e.target.value)}
          input={<OutlinedInput style={{ fontSize: '20px' }} />}
        >
          {tokens.map(({ value, label }) => (
            <MenuItem key={value} value={value} style={{ fontSize: '20px' }}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        type="number"
        placeholder="Requested Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        inputProps={{ style: { fontSize: '20px', height: '100%' } }}
        sx={{ mt: 1 }}
      />

      <TextField
        placeholder="Reason for Payment"
        value={reason}
        onChange={e => setReason(e.target.value)}
        inputProps={{ style: { fontSize: '20px', height: '100%' } }}
        sx={{ mt: 1 }}
      />
      {/* showUserAddressField prop is passed only in case of non-login form, 
        where we have to explicitly take user address */}
      {showUserAddressField ? (
        <TextField
          placeholder="Enter address"
          value={gamerAddress}
          onChange={e => setGamerAddress(e.target.value)}
          inputProps={{ style: { fontSize: '20px', height: '100%' } }}
          sx={{ mt: 1 }}
        />
      ) : (
        <FormControl fullWidth sx={{ mt: 1 }}>
          <InputLabel style={{ fontSize: '20px' }}>Send To</InputLabel>

          <Select
            placeholder="Send to"
            value={receivingAddressType}
            onChange={e => setReceivingAddressType(e.target.value)}
            input={<OutlinedInput style={{ fontSize: '20px' }} />}
          >
            {receivingAddressTypes.map(({ value, label }) => (
              <MenuItem key={value} value={value} style={{ fontSize: '20px' }}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Button
        sx={{
          fontSize: 20,
          lineHeight: '23px',
          mt: 1,
        }}
        variant="contained"
        disabled={!amount || !token || loading}
        onClick={initiateTransaction}
      >
        {loading ? 'Loading' : 'Request'}
      </Button>
    </Box>
  );
}
