const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/6251d07411044ec99ce4198e2e522a93'));
const ABI = require('./ABI');

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

    const helloWorldContract = new web3.eth.Contract(ABI.helloWorld);
    helloWorldContract
        .deploy({
            data: '0x60606040525b604060405190810160405280600c81526020017f48656c6c6f20576f726c6421000000000000000000000000000000000000000081526020015060006000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10608b57805160ff191683800117855560b9565b8280016001018555821560b9579182015b8281111560b8578251826000505591602001919060010190609c565b5b50905060e0919060c4565b8082111560dc576000818150600090555060010160c4565b5090565b50505b610178806100f16000396000f360606040526000357c010000000000000000000000000000000000000000000000000000000090048063bcdfe0d51461003c57610037565b610002565b346100025761004e60048050506100bc565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156100ae5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b602060405190810160405280600081526020015060006000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156101695780601f1061013e57610100808354040283529160200191610169565b820191906000526020600020905b81548152906001019060200180831161014c57829003601f168201915b50505050509050610175565b9056',
        })
        .send({
            from: alice.address,
            gaz: 4700000,
            gasPrice: 20000000000,
        },
        (error, transactionHash) => {
            console.log('error', error.message);
            console.log('transactionHash', transactionHash);
        })
        .then(contract => console.log('contract', contract));

    // myApi.signTransaction(alice, bob, 1000000000000000000)
    //     .then(result => myApi.sendSignedTransaction(result))
    //     .then(result => console.log('resul', result));
}

app();
