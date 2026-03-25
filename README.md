# BR Gateway

Allows for connecting to various Bedrock servers without configuring every instance in the GUI

## Requirements
- Bedrock server
- Cheats enabled in server.properties
- HTTP server responding with JSON of available ports

## Configuration
- Add behavior pack under `behavior_packs` folder
- Add manifest info under `world_behavior_packs.json`
- Customize `gw.js` with metadata server url
- Allow modules to be used under `config/default/permissions.json`
- Add server metadata file onto HTTP server
  
