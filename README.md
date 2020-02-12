# speedtest-zond
zond speedtest for Banana PI

Install:
1. Install on device nginx+php-fpm
2. Configure default site
3. Upload all files to folder with default site
4. Make systemd unit for file speedtest.py
5. Open web-interface in you browser 

Install web-server on debian-based OS:
  apt-get update
  apt-get upgrade
  apt-get install nginx php7.3-curl php7.3-gd php7.3-mbstring php7.3-sqlite3 sqlite3

Systemd:
  Move sample speedtest.service from folder to /etc/systemd/system
  Edit path in speedtest.service file if need
  systemctl daemon-reload
  systemctl enable speedtest.service
  systemctl start speedtest.service
  systemctl status speedtest.service

Default login:password is admin:admin

telegramm @k2name
