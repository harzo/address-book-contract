import { assert } from 'chai';

import * as Web3 from 'web3';

import {
  AddressAddedEvent,
  AddressBook,
  AddressBookClearedEvent,
  AddressRemovedEvent,
  BookArtifacts
} from 'book';

import { ContractContextDefinition } from 'truffle';
import { assertReverts, findLastLog, ZERO_ADDRESS } from './helpers';

declare const web3: Web3;
declare const artifacts: BookArtifacts;
declare const contract: ContractContextDefinition;

const AddressBookContract = artifacts.require('./AddressBook.sol');

contract('AddressBook', accounts => {
  const owner = accounts[0];
  let addressBook: AddressBook;

  beforeEach(async () => {
    addressBook = await AddressBookContract.new({ from: owner });
  });

  describe('#add use', () => {
    it('gas for 1st address', async () => {
      const tx = await addressBook.add(accounts[0], { from: owner });
      console.log(tx.receipt.gasUsed);
    });

    it('gas for 2nd address', async () => {
      await addressBook.add(accounts[0], { from: owner });
      const tx = await addressBook.add(accounts[1], { from: owner });
      console.log(tx.receipt.gasUsed);
    });

    it('gas for 3rd address', async () => {
      await addressBook.add(accounts[0], { from: owner });
      await addressBook.add(accounts[1], { from: owner });
      const tx = await addressBook.add(accounts[2], { from: owner });
      console.log(tx.receipt.gasUsed);
    });
  });

  describe('#remove use', () => {
    beforeEach(async () => {
      await addressBook.add(accounts[0], { from: owner });
      await addressBook.add(accounts[1], { from: owner });
      await addressBook.add(accounts[2], { from: owner });
      await addressBook.add(accounts[3], { from: owner });
      await addressBook.add(accounts[4], { from: owner });
    });

    it('gas for 1st address', async () => {
      const tx = await addressBook.remove(accounts[0], { from: owner });
      console.log(tx.receipt.gasUsed);
    });

    it('gas for 2nd address', async () => {
      await addressBook.remove(accounts[0], { from: owner });
      const tx = await addressBook.remove(accounts[1], { from: owner });
      console.log(tx.receipt.gasUsed);
    });

    it('gas for 3rd address', async () => {
      await addressBook.remove(accounts[0], { from: owner });
      await addressBook.remove(accounts[1], { from: owner });
      const tx = await addressBook.remove(accounts[2], { from: owner });
      console.log(tx.receipt.gasUsed);
    });

    it('gas for 4th address', async () => {
      await addressBook.remove(accounts[0], { from: owner });
      await addressBook.remove(accounts[1], { from: owner });
      await addressBook.remove(accounts[2], { from: owner });
      const tx = await addressBook.remove(accounts[3], { from: owner });
      console.log(tx.receipt.gasUsed);
    });

    it('gas for last address', async () => {
      await addressBook.remove(accounts[0], { from: owner });
      await addressBook.remove(accounts[1], { from: owner });
      await addressBook.remove(accounts[2], { from: owner });
      await addressBook.remove(accounts[3], { from: owner });
      const tx = await addressBook.remove(accounts[4], { from: owner });
      console.log(tx.receipt.gasUsed);
    });
  });

  describe('#clear use', () => {
    it('gas', async () => {
      await addressBook.add(accounts[0], { from: owner });
      await addressBook.add(accounts[1], { from: owner });
      await addressBook.add(accounts[2], { from: owner });

      const tx = await addressBook.clear({ from: owner });
      console.log(tx.receipt.gasUsed);
    });
  });
});
