import {
  ConnectionHandler,
  RecordProxy,
  Variables,
  getRelayHandleKey,
} from 'relay-runtime';
import {
  HandleFieldPayload,
  ReadOnlyRecordProxy,
  RecordSourceProxy,
} from 'relay-runtime/lib/store/RelayStoreTypes';
import { getStableStorageKey } from 'relay-runtime/lib/store/RelayStoreUtils';

const CONNECTION_HANDLE_KEYS = '__connectionHandleKeys';

function update(store: RecordSourceProxy, payload: HandleFieldPayload) {
  ConnectionHandler.update(store, payload);

  // Hackishly get the handle key minus the args.
  const [handleName] = payload.handleKey.split('(');

  const record = store.get(payload.dataID)!;

  const prevHandleKeys: Record<string, unknown> | undefined = record.getValue(
    CONNECTION_HANDLE_KEYS,
    {
      handleName,
    },
  ) as any;
  const nextHandleKeys = {
    ...prevHandleKeys,
    [payload.handleKey]: payload.args,
  };

  // FIXME: The RecordProxy API doesn't let us set objects as values. We bypass
  //  this validation by reaching into internals.
  // eslint-disable-next-line no-underscore-dangle
  const mutator: any = (record as any)._mutator;

  // It's slightly janky to store this as a value rather than as linked
  //  records, but this will prevent the value from getting GCed so long as the
  //  parent record stays live, which is what we want. These data are light
  //  enough that this shouldn't take too much memory.
  mutator.setValue(
    record.getDataID(),
    getStableStorageKey(CONNECTION_HANDLE_KEYS, { handleName }),
    nextHandleKeys,
  );
}

function connectionExists(
  connection: RecordProxy | null | undefined,
): connection is RecordProxy {
  return !!connection;
}

function getConnections(
  record: ReadOnlyRecordProxy,
  key: string,
  filter?: (variables: Variables) => boolean,
): Array<RecordProxy> {
  const handleName = getRelayHandleKey('connection', key, null);

  const handleKeys: Record<string, Variables> | undefined = record.getValue(
    CONNECTION_HANDLE_KEYS,
    {
      handleName,
    },
  ) as any;
  if (!handleKeys) {
    return [];
  }

  return Object.entries(handleKeys)
    .filter(([_handleKey, args]) => !filter || filter(args))
    .map(([handleKey]) =>
      // XXX: This takes advantage of how a full storageKey with args can be
      //  used in place of name and args separately.
      record.getLinkedRecord(handleKey),
    )
    .filter(connectionExists);
}

export default {
  ...ConnectionHandler,
  update,
  getConnections,
};
