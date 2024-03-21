import { IoCloseSharp } from "react-icons/io5";
import { useState } from 'react';
import axios from 'axios';

const EditTransactionModal = ({onClose, currentTransactionName, currentTransactionAmount, transactionID, fetchData}) => {
    const [newTransactionName, setNewTransactionName] = useState(currentTransactionName);
    const [newTransactionAmount, setNewTransactionAmount] = useState(currentTransactionAmount);

    let editTransaction = async function (event) {
        event.preventDefault();
        await axios.post('http://localhost:5000/editTransaction', {
            "teamSpaceID": window.localStorage.getItem("teamSpaceID"),
            "transactionID": transactionID,
            "newTransactionName": newTransactionName,
            "newTransactionAmount": Number(newTransactionAmount)
        }).then(response => {
            console.log(response)
            fetchData();
        }).catch(error => {
            console.log(error)
        })
    }

    const handleSubmit = async function(event) {
        event.preventDefault();
        await editTransaction(event);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg mt-1 relative max-w-md w-full">
            <IoCloseSharp className="absolute top-0 right-0 mr-4 mt-4 cursor-pointer"size={35} onClick={onClose}/>
            <h1 className="mb-4 text-lg font-bold">Edit Transaction</h1>
            <form
              onSubmit={(event) => handleSubmit(event)}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Transaction Name</label>
                <input
                  type="text"
                  placeholder="Enter name of your transaction"
                  onChange={(e) => setNewTransactionName(e.target.value)}
                  value={newTransactionName}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Transaction Amount</label>
                <input
                  type="text"
                  placeholder="Enter the transaction amount"
                  onChange={(e) => setNewTransactionAmount(e.target.value)}
                  value={newTransactionAmount}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
                  required
                />
              </div>
              <button className="bg-primary-500 hover:bg-primary-700 focus:ring-4 px-5 py-2.5 rounded-lg text-sm text-white font-medium text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Save Changes
              </button>
            </form>
          </div>
        </div>
    )

}


export default EditTransactionModal;