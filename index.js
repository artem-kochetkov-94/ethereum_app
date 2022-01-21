const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/6251d07411044ec99ce4198e2e522a93'));

const myApi = {
    createAccount: () => {
        return web3.eth.accounts.create();
    },
    getBalance: async addr => {
        try {
            const balance = await web3.eth.getBalance(addr);
            return balance;
        } catch (error) {
            console.log('getBalance error', error.message);
        }
    
        return null;
    },
    signTransaction: async (from, to, value) => {
        const tx = {
            from: from.address,
            to: to.address,
            gasPrice: 20000000000,
            gas: 42000,
            value,
            data: '',
        };

        try {
            const signedTx = await web3.eth.accounts.signTransaction(tx, from.privateKey);
            return signedTx;
        } catch (error) {
            console.log('signTransaction error', error.message);
        }

        return null;
    },
    sendSignedTransaction: async signedTx => {
        const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return result;
    }
};

async function app() {
    const alice = myApi.createAccount();
    const bob = myApi.createAccount();

    myApi.signTransaction(alice, bob, 1000000000000000000)
        .then(result => myApi.sendSignedTransaction(result))
        .then(result => console.log('resul', result));
}

app();