# Website Video Audio Collections _(TEST)_

## Run Server
```
- npm i -g peer
- peerjs --port 5051 (webRTC server)

- yarn
- yarn dev (Express API server with websocket and ssr)
```

## How to use
- open you browser as localhost:5050
- Give video audio collecting authorization
- open more browser with the same roomId*

_*roomId_: If you print localhost:5050,it will be generate roomId and show as blow:
_localhost:5050/645bf6f-d3a6-4592-b5fc-d1e419226285_
localhost:5050/_{roomId}_

## Performance
- you should see camera view.
- open more browser with the same room, will be more views there.
- warning: when open more than 6 browsers will show a serious stutter. (6^2 views there)