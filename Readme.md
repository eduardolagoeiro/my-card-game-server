# Card Game Server

## running
```
docker-compose up app
```

## testing
```
docker-compose run app npm run test [testFileName]
```

## debug test
run
```
docker-compose run --service-ports app npm run test [testFileName]
```
attach in node port 9229

in vscode you can create a .vscode/launch.json and run 
```
{
  "configurations": [
    {
      "name": "Attach to Docker Node Process",
      "type": "node",
      "protocol": "inspector",
      "request": "attach",
      "stopOnEntry": false,
      "port": 9229,
      "localRoot": "${workspaceRoot}",
      "remoteRoot": "/app",
      "sourceMaps": true
  }
  ]
}
```
