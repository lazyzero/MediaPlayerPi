# MediaPlayerPi

## Prepare SD card for Raspberry Pi
Download the latest Raspbian lite from [here](https://downloads.raspberrypi.org/raspbian_lite_latest) and upload it to the SD card with Etcher or ApplePi-Baker or your preffered tool.

To enable SSH create a file called ssh on the boot partition of the SD card. And prepare to connect it to WiFi
```
touch /Volumes/boot/ssh
touch /Volumes/boot/wpa_supplicant.conf
```
Edit the `wpa_supplicant.conf` file an add the following (don't forget to adjust to your needs):
```
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=«your_ISO-3166-1_two-letter_country_code»

network={
    ssid="«your_SSID»"
    psk="«your_PSK»"
    key_mgmt=WPA-PSK
}
```
After booting the Raspberry Pi you should be able to access it by SSH.
```
ssh pi@raspberry.local
```
## Configure Raspberry Pi and install dependencies.
Execute `sudo raspi-config` and change the timezone and keyboard layout to your needs, hostname to something like `mediaplayerpi` and password.
Set the boot options to `autologin to CLI (B2)`.

If nesseccary configure additional WiFi networks in `/etc/wpa_supplicant/wpa_supplicant.conf`.

Install dependencies
```
sudo apt-get update
sudo apt-get dist-upgrade
sudo apt-get install midori matchbox-window-manager xserver-xorg x11-xserver-utils unclutter xinit git
```

Now install NodeJS 8.x
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
```

Clone MediaPlayerPi in your home directory
```
git clone git@github.com:lazyzero/MediaPlayerPi.git
```
