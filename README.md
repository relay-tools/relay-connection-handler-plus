# Relay Connection Handler Plus! [![npm][npm-badge]][npm]

[Relay](https://relay.dev/) connection handler with additional functionality.

# Usage

```js
import ConnectionHandler from 'relay-connection-handler-plus';
import { Environment } from 'relay-runtime';
import RelayDefaultHandlerProvider from "relay-runtime/lib/handlers/RelayDefaultHandlerProvider";

function handlerProvider(handle) {
  switch (handle) {
    case 'connection':
      return ConnectionHandler;
    default:
      return RelayDefaultHandlerProvider(handle);
  }
}

const environment = new Environment({
  handlerProvider,
  /* ... */
});
```

Relay Connection Handler Plus! provides an enhanced connection handler that can be used in place of the default connection handler.

This connection handler exposes an additional `getConnections` method. This method allows getting all connections for a connection key, per [facebook/relay#1861](https://github.com/facebook/relay/issues/1861):

```js
const connections = ConnectionHandler.getConnections(record, connectionKey);
```

The `getConnections` method also allows getting a subset of connections for a given connection key that were fetched with args matching a filter function. For example, it can be used to get all connections loaded with `color: "red"`, regardless of the other arguments on the connection:

```js
const connections = ConnectionHandler.getConnections(
  record,
  connectionKey,
  ({ color }) => color === 'red',
);
```

[npm-badge]: https://img.shields.io/npm/v/relay-connection-handler-plus.svg
[npm]: https://www.npmjs.org/package/relay-connection-handler-plus
