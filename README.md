# Image viewer card (homekit style)
Card to display images from a folder on home assistant.
Use case it to have an view to display your notification images from a camera for example.


## Configuration

### Installation instructions

**HACS installation:**
Go to the hacs store and use the repo url `REPO URL HERE` and add this as a custom repository under settings.

Add the following to your ui-lovelace.yaml:
```yaml
resources:
  url: /community_plugin/plugin/cover-tile-card.js
  type: module
```

**Manual installation:**
Copy the .js file from the dist directory to your www directory and add the following to your ui-lovelace.yaml file:

```yaml
resources:
  url: /local/cover-tile-card.js
  type: module
```

### Main Options

| Name | Type | Default | Supported options | Description |
| -------------- | ----------- | ------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `entity` | string | **Required** | `folder.nest` | Entity of the folder you wanna load the images from |