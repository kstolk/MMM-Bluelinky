# MMM-Bluelinky
Show Hyundai EV car data on your Magic Mirror using BlueLinky npm package. This package is based on the MMM-Tesla2 module.

## Installation
```bash 
cd ~/MagicMirror/modules
```

```bash
git clone https://github.com/Cyw00d/MMM-Bluelinky.git
```

```bash
cd MMM-Bluelinky && npm install
```

## Configuration
Copy the example config to your MagicMirror config file:

```javascript

{
  module: 'MMM-Bluelinky',
  position: 'bottom_left',	// This can be any of the regions.
  config: {
    name: 'Optional Car Name',
    username: 'your-bluelink-email',
    password: "your-bluelink-password",
    region: 'EU',
    pin: '0123',
  }
},
```
| key  | Required | Description | Example |
| - | - | - | - |
| username  | yes  | Your bluelink username | `user@provider.com` |
| password  | yes | Your bluelink password | `B3tterTh4nG4z!` |
| region| yes | `EU` `CA` or `US` | `EU` |
| name | no | Optional name | `John's Hyundai` |

## Preview
![Test Image 3](/preview.jpg)
Left Hyundai Ioniq example without custom name. As you can see this module is based on the MMM-Tesla2 module on the right.

## BlueLinky
This package uses [bluelinky](https://github.com/Hacksore/bluelinky). It is an unoffcial nodejs API wrapper for Hyundai BlueLink

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
