declare module 'book' {
  import {
    AnyContract,
    Contract,
    ContractBase,
    TransactionOptions,
    TransactionResult,
    TruffleArtifacts
  } from 'truffle';

  namespace book {
    interface Migrations extends ContractBase {
      setCompleted(
        completed: number,
        options?: TransactionOptions
      ): Promise<TransactionResult>;

      upgrade(
        address: Address,
        options?: TransactionOptions
      ): Promise<TransactionResult>;
    }

    interface AddressBook extends ContractBase {
      add(
        newAddress: Address,
        options?: TransactionOptions
      ): Promise<TransactionResult>;

      remove(
        addressToRemove: Address,
        options?: TransactionOptions
      ): Promise<TransactionResult>;

      clear(
        options?: TransactionOptions
      ): Promise<TransactionResult>;

      contains(address: Address): Promise<boolean>;

      get(options?: TransactionOptions): Promise<Address[]>;
    }

    interface AddressAddedEvent {
      newAddress: Address;
    }

    interface AddressRemovedEvent {
      removedAddress: Address;
    }

    type AddressBookClearedEvent = {};

    interface MigrationsContract extends Contract<Migrations> {
      'new'(options?: TransactionOptions): Promise<Migrations>;
    }

    interface AddressBookContract extends Contract<AddressBook> {
      'new'(options?: TransactionOptions): Promise<AddressBook>;
    }

    interface BookArtifacts extends TruffleArtifacts {
      require(name: string): AnyContract;
      require(name: './Migrations.sol'): MigrationsContract;
      require(name: './AddressBook.sol'): AddressBookContract;
    }
  }

  export = book;
}
