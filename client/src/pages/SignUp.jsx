import { useState, useEffect } from 'react';
import axios from 'axios';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [passwordReqMessage, setPasswordReqMessage] = useState("");

    let handleSignUp = async function (event) {
        event.preventDefault();
        await axios.post('http://localhost:5000/signup', {username, email, password})
            .then(response => {
                if (
                  response.data.message && response.data.message.includes(
                    "Password did not conform with policy"
                  )
                ) {
                  setPasswordReqMessage(
                    "Password must contain a minimum of 8 letters, with at least 1 uppercase letter, 1 number, 1 symbol"
                  );
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    let handleVerify = async function (event) {
        event.preventDefault();
        await axios.post('http://localhost:5000/verify', {username, verificationCode})
            .then(async response => {
                if (response.data.status == 202) {
                    handleLogin(event)
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    let handleLogin = async function (event) {
        event.preventDefault();
        await axios.post('http://localhost:5000/login', { username, password })
            .then(async response => {
                window.localStorage.setItem("userID", response.data.data.userID)
                window.localStorage.setItem("username", username)
                console.log(window.localStorage.getItem("userID"))
                if (response.data.status == 201) {
                    await getTeamSpaceID(response.data.data.userID)
                } else {
                    console.log("invalid login")
                }
            })
            .catch(error => { console.log(error) });
    }

    let getTeamSpaceID = async function (userID) {
        await axios.get('http://localhost:5000/getTeamSpaceByUserID', { params: { "userID": userID } })
            .then(response => {
                if (response.data.status == 201 && response.data.data.teamSpaceID != null) {
                    window.localStorage.setItem("teamSpaceID", response.data.data.teamSpaceID)
                    window.location.replace('/')
                } else {
                    window.location.replace('/register')
                }
            }).catch(error => {
                console.log(error)
            });
    }

    return (
      <>
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a
              href="#"
              className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
            ></a>
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h2 className="text-l font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create an account
                </h2>

                <form
                  className="space-y-4 md:space-y-6"
                  action="#"
                  onSubmit={handleSignUp}
                >
                  <div>
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Username:
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter your username"
                      required
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Email:
                    </label>
                    <input
                      type="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter your email"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password:
                    </label>
                    <input
                      type="password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter a password"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordReqMessage && (
                      <div className="bg-red-200 bg-opacity-75 text-red-900 p-3 my-4 rounded-lg px-5 py-2.5">
                        <p className="text-sm">{passwordReqMessage}</p>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-primary-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Sign Up
                  </button>
                </form>
                <p>Step 2:</p>
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleVerify}
                >
                  <div>
                    <label htmlFor="verificationCode">Verification Code</label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter Verification Code"
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required
                    />
                  </div>
                  <button className="w-full text-white bg-primary-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    Verify
                  </button>
                  <p className="text-sm font-light text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Log in
                  </a>
                </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </>
    );
}

export default SignUp;