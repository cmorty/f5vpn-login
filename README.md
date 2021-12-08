# F5 VPN Command-line client

This software allows you to connect to an [F5 Networks](https://f5.com/) VPN server (BIG-IP APM) without using their proprietary VPN client.

**It is not supported or affiliated with F5 in any way.** I actually find it rather sad the client they provide is so terribly poor that I had to write this in order to get reliable access to my company's VPN.

This software does not require any software from F5 to be installed on the client. The only requirement is Python 3. It works on at least Linux and MacOS systems, but porting to any similar OS should be trivial. Porting to Windows, on the other hand, is probably not reasonably possible.

The primary feature this fork adds over upstream is support for two-factor authentication.

## WFM (Works For Me) mode

[This Repo](https://github.com/cmorty/f5vpn-login) is it WFM (Works For Me) mode.
Thus, if you have an issue you will probably be on your own.
If you can fix your issue yourself, feel free to create a pull request and I will look at it.

As an alternative there's also [gof5](https://github.com/kayrus/gof5), which however has no comfort login yet.

## Setup

The script requires [`ppp`](https://www.samba.org/ppp/). If you are on Linux, install it using your package manager. If you are on MacOS, you already have it.

The script also requires [`netstat`](http://man7.org/linux/man-pages/man8/netstat.8.html), which is generally packaged as ```net-tools```.

## Usage

### Basic
If your organization does not use 2FA and you are able to log in with just your username and password:

```bash
sudo ./f5vpn-login.py user@host
```

### Two-Factor Authentication

```bash
sudo ./f5vpn-login.py --sessionid=0123456789abcdef0123456789abcdef your.fully.qualified.hostname
```

You can find the session ID by going to the VPN host in a web browser, logging in, and running this JavaScript in Developer Tools:

```javascript
document.cookie.match(/MRHSession=(.*?); /)[1]
```

#### Automation (Simple)
Or, if you have [Greasemonkey](https://www.greasespot.net/) (FF-Only) or [Violentmonkey](https://violentmonkey.github.io/)(Most browsers) installed, [click here](session-id-grabber.user.js) to install a script to automatically copy the session ID to your clipboard on login.

Finally, to complete the circuit of laziness, write yourself a shell function to read the session ID from the clipboard and pass it to the script:
```bash
function vpnlogin {
  sessionid=$(xclip -o -selection clipboard)
  echo "Session ID from clipboard: $sessionid"
  sudo /path/to/f5vpn-login/f5vpn-login.py --sessionid $sessionid your.fully.qualified.hostname
}
```

>NOTE: The above is for Linux; on MacOS, use `pbpaste` instead of `xclip`

#### Automation (Comfort)

Prerequisites:
  * A User-Script plugin for your browser. The script is tests using Firefox. Others will probably work, too, but are not tested.
    * [Greasemonkey](https://www.greasespot.net/): FF-Only, but tested)
    * [Violentmonkey](https://violentmonkey.github.io/): Most browsers
  * gnome-terminal: You can use every other terminal, too, but need to adjust the `urlwrapper.sh`.
  * kdocker: Again, you can adjust the `urlwrapper.sh` to your needs.

Install the [alternative Userscript](f5vpnlinker.user.js) to replace F5's `onclick`-handler with a link to a custom protocol.

If you are using *Firefox* go to `about:config` and add `network.protocol-handler.expose.f5vpn` as `Boolean` set to false.
(Please feel free to update this readme and create a pull request for other browsers or solutions.)

Now open the login-page and click on the VPN. 
You will be asked for a program to open the link.
Choose the `urlwrapper.sh`.
Now a terminal window should pop up, requesting your password to run sudo.

## DNS and Routing

- By default, the script will change your DNS servers to the ones provided by the VPN server. Skip this step by by passing the `--skip-dns` option.

- By default, once connected, the script will route all traffic through the newly-created VPN network interface. Skip this step by passing the `--skip-routes` option (your VPN connection will be useless if this option is used, so only use it if you plan to set up the routing table yourself).

## Other Info

*user@host is saved for future invocations, so doesn't need to be
specified on future invocations.*

Use **CTRL-C** to exit.

The application will save "user@host" and last session ID in ``~/.f5vpn-login.conf``. In case of problems or for reset the session data simply remove that file.
