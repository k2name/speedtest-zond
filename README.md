# speedtest-zond
zond speedtest for Banana PI

Install:
1. Install on device nginx+php-fpm
2. Configure default site
3. Upload all files to folder with default site
4. Make systemd unit for file tester.py
5. Open web-interface in you browser 

Install web-server on debian-based OS:
1. apt-get update
2. apt-get upgrade
3. apt-get install nginx php7.3-curl php7.3-gd php7.3-mbstring php7.3-sqlite3 sqlite3

Systemd:
1. Move sample speedtest.service from folder to /etc/systemd/system
2. Edit path in speedtest.service file if need
3. systemctl daemon-reload
4. systemctl enable speedtest.service
5. systemctl start speedtest.service
6. systemctl status speedtest.service

Default login:password is admin:admin

telegramm @k2name