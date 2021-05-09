# Points Converter Utility

This utility converts Aurora points to BlueMap markers file

## How To Use

- make sure you have access to the desired server and a corresponding private ssh key ready
- create a `conf.json` file in this directory that looks like this:
    ````
    {
        "host": "12.345.67.89",
        "privateKeyPath": "/some/key.pem"
    }
    ````
- run `yarn convert`
