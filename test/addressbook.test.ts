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

  describe('#remove', () => {
    const addressToRemove = accounts[1];

    context('when address book is not empty', () => {
      beforeEach(async () => {
        await addressBook.add(accounts[0], { from: owner });
        await addressBook.add(accounts[1], { from: owner });
        await addressBook.add(accounts[2], { from: owner });
      });

      it('should emit AddressRemoved event', async () => {
        const tx = await addressBook.remove(addressToRemove, { from: owner });

        const log = findLastLog(tx, 'AddressRemoved');
        assert.isOk(log);

        const event = log.args as AddressRemovedEvent;
        assert.equal(event.removedAddress, addressToRemove);
      });

      it('should remove address from address book', async () => {
        await addressBook.remove(addressToRemove, { from: owner });

        assert.deepEqual(await addressBook.get(), [accounts[0], accounts[2]]);
      });

      it('should set new removed address existence to false', async () => {
        await addressBook.remove(addressToRemove, { from: owner });

        assert.isFalse(await addressBook.contains(addressToRemove));
      });
    });

    it('should revert for not owner', async () => {
      await assertReverts(async () => {
        await addressBook.remove(addressToRemove, { from: addressToRemove });
      });
    });

    it('should revert for zero address', async () => {
      await assertReverts(async () => {
        await addressBook.remove(ZERO_ADDRESS, { from: owner });
      });
    });

    it('should revert for not existing address', async () => {
      await assertReverts(async () => {
        await addressBook.remove(addressToRemove, { from: owner });
      });
    });
  });

  describe('#clear', () => {
    context('when address book is not empty', () => {
      beforeEach(async () => {
        await addressBook.add(accounts[0], { from: owner });
        await addressBook.add(accounts[1], { from: owner });
        await addressBook.add(accounts[2], { from: owner });
      });

      it('should emit AddressBookCleared event', async () => {
        const tx = await addressBook.clear({ from: owner });

        const log = findLastLog(tx, 'AddressBookCleared');
        assert.isOk(log);

        const event = log.args as AddressBookClearedEvent;
        assert.isOk(event);
      });

      it('should set existence of all removed addresses to false', async () => {
        await addressBook.clear({ from: owner });

        assert.isFalse(await addressBook.contains(accounts[0]));
        assert.isFalse(await addressBook.contains(accounts[1]));
        assert.isFalse(await addressBook.contains(accounts[2]));
      });

      it('should clear address book', async () => {
        await addressBook.clear({ from: owner });

        assert.deepEqual(await addressBook.get(), []);
      });
    });

    it('should revert for not owner', async () => {
      await assertReverts(async () => {
        await addressBook.clear({ from: accounts[1] });
      });
    });
  });
});
