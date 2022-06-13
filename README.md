# Estra

Work-in-progress UDP server sampler for use with the [ORCΛ](https://github.com/hundredrabbits/Orca) live-programming environment.

<img src='screenshot.png' width="600"/>

## Installation
```sh
#Clone repo
git clone https://github.com/kyleaedwards/estra.git

cd estra

# Install dependencies
npm install

# Start the server
npm run start
```

## Usage
Samples are triggered by providing the filename (minus the .wav) to ORCΛ's UDP operator (`;`). Any .wav files in the `samples` directory will be invokable.

## Troubleshooting
- Ensure ORCΛ is sending messages to the default UDP port (49161).
