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
- Create world in Bedrock client with Beta APIs enabled, import into gateway server: https://learn.microsoft.com/en-us/minecraft/creator/documents/experimentalfeaturestoggle?view=minecraft-bedrock-stable
  
