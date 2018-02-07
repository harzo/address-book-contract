import { assert } from 'chai';

import * as Web3 from 'web3';

import { AddressAddedEvent, AddressBook, BookArtifacts } from 'book';

import { ContractContextDefinition } from 'truffle';
import {
  assertNumberEqual,
  assertReverts,
  findLastLog,
  ZERO_ADDRESS
} from './helpers';

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

  describe('#add', () => {
    const newAddress = accounts[1];

    it('should emit AddressAdded event', async () => {
      const tx = await addressBook.add(newAddress, { from: owner });

      const log = findLastLog(tx, 'AddressAdded');
      assert.isOk(log);

      const event = log.args as AddressAddedEvent;
      assert.equal(event.newAddress, newAddress);
    });

    it('should add new address', async () => {
      await addressBook.add(newAddress, { from: owner });

      assert.deepEqual(await addressBook.get(), [newAddress]);
    });

    it('should set new address existence', async () => {
      await addressBook.add(newAddress, { from: owner });

      assert.isTrue(await addressBook.contains(newAddress));
    });

    it('should revert for not owner', async () => {
      await assertReverts(async () => {
        await addressBook.add(newAddress, { from: newAddress });
      });
    });

    it('should revert for zero address', async () => {
      await assertReverts(async () => {
        await addressBook.add(ZERO_ADDRESS, { from: owner });
      });
    });

    it('should revert for existing address', async () => {
      await addressBook.add(newAddress, { from: owner });

      await assertReverts(async () => {
        await addressBook.add(newAddress, { from: owner });
      });
    });
  });
});
