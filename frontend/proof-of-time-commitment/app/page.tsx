"use client";

import { useState } from 'react';

import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

export default function Home() {
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(true);

  const handleOpenModalWithDisabledInput = () => {
    setIsFirstModalOpen(true);
    setIsInputDisabled(true);
  };

  const handleOpenModalWithEnabledInput = () => {
    setIsFirstModalOpen(true);
    setIsInputDisabled(false);
  };

  const handleOpenSecondModal = () => {
    setIsSecondModalOpen(true);
  };

  const handleCloseFirstModal = () => {
    setIsFirstModalOpen(false);
  };

  const handleCloseSecondModal = () => {
    setIsSecondModalOpen(false);
  };

  return (
    <>
      <header>
        <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo"></img>
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <DynamicContextProvider
            settings={{
              environmentId: 'eee025ae-5ce2-4293-82dc-577f6ae2b063',
              walletConnectors: [ EthereumWalletConnectors ],
            }}>
            <DynamicWidget />
          </DynamicContextProvider>
              <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
            </button>
          </div>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          </div>
          </div>
        </nav>
      </header>

      {/* First Modal */}
      {isFirstModalOpen && (
        <div className="fixed inset-0 flex z-10 items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <form>
              <div className="relative mb-6">
                <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="default-search"
                  className="block w-full h-11 px-5 py-2.5 leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
                  placeholder="Name"
                  disabled={isInputDisabled} // Disable input conditionally
                  required
                />
              </div>

              <div className="relative mb-6">
                <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">
                  Description
                </label>
                <textarea
                  className="block w-full h-40 px-4 py-2.5 text-base leading-7 font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-2xl placeholder-gray-400 focus:outline-none resize-none"
                  placeholder="Write a message..."
                  disabled={isInputDisabled} // Disable textarea conditionally
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseFirstModal}
                  className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSecondModalOpen && (
        <div className="fixed inset-0 flex z-10 items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h2 className="text-2xl font-bold mb-4">Attestation</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Is User A really do his/her work today?</label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="language" value="javascript" className="mr-2" />
                    He is Productive at work today at office.
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="language" value="python" className="mr-2" />
                    He is not doing his work today at office.
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseSecondModal}
                  className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg mr-2"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      <div className="flex flex-col pt-4 pl-8 pr-8 pb-4 min-h-screen bg-gray-900">
        <div className='h-[90px]'></div>
        <div className="relative w-full mb-4 bg-gray-800 p-6 rounded-md text-center">
          <div className="flex w-full justify-between items-center">
            <div>
              <h6 className="mb-4 text-xl font-extrabold leading-none tracking-tight text-white md:text-4xl">
                Your Declaration
              </h6>
            </div>
            <div>
              <button
                onClick={handleOpenModalWithEnabledInput}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 mr-2 inline"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Add Declaration.
              </button>
            </div>
          </div>

          <a href="#" onClick={handleOpenModalWithDisabledInput}>
            <div
              id="alert-1"
              className="flex items-center p-4 mb-4 text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
              role="alert"
            >
              <svg
                className="flex-shrink-0 w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <div className="ms-3 text-sm font-medium">
                A simple info alert with an{" "}
                <a href="#" className="font-semibold underline hover:no-underline">
                  example link
                </a>
                . Give it a click if you like.
              </div>
            </div>
          </a>
        </div>

        <div className="w-full mb-4 bg-gray-800 p-6 rounded-md text-center">
          <div className="flex w-full justify-between items-center">
            <div>
              <h6 className="mb-4 text-xl font-extrabold leading-none tracking-tight text-white md:text-4xl ">
                Your colleague's Declaration
              </h6>
            </div>
          </div>

          <a href="#" onClick={handleOpenSecondModal}>
            <div
              id="alert-1"
              className="flex items-center p-4 mb-4 text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
              role="alert"
            >
              <svg
                className="flex-shrink-0 w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <div className="ms-3 text-sm font-medium">
                A simple info alert with an{" "}
                <a href="#" className="font-semibold underline hover:no-underline">
                  example link
                </a>
                . Give it a click if you like.
              </div>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}

