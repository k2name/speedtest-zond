#!/usr/bin/env python
# -*- coding: utf-8 -*-


import os
import sys
import time
import string
import sqlite3
import datetime
import requests
import speedtest
from pythonping import ping

# k2name addon
class sql:
    def connect(self):
        global conn
        # Подключаем файл базы данных
        try:
            conn = sqlite3.connect('db/base.db')
            conn.isolation_level = None
            conn.text_factory = str
        except:
            print("Файл базы данных не найден!")
            sys.exit(0)
        # Коннектимся к Базе данных
        try:
            cur = conn.cursor()
            return True
        except sqlite3.Error:
            print("Соединение с БД НЕ установлено!!!")
            return False
    
    def get_status(self):
        global conn
        cur = conn.cursor()
        try:
            cur.execute("select status from settings where id=1")
            conn.commit()
            data = cur.fetchone()
            return data
        except:
            return False

    def get_pingstatus(self):
        global conn
        cur = conn.cursor()
        try:
            cur.execute("select pingstatus from settings where id=1")
            conn.commit()
            data = cur.fetchone()
            return data
        except:
            return False

    def get_serverid(self):
        global conn
        cur = conn.cursor()
        try:
            cur.execute("select server from settings where id=1")
            conn.commit()
            data = cur.fetchone()
            return data
        except:
            return False

    def get_pingtarget(self):
        global conn
        cur = conn.cursor()
        try:
            cur.execute("select pingtarget from settings where id=1")
            conn.commit()
            data = cur.fetchone()
            return data
        except:
            return False            

    def get_waittime(self):
        global conn
        cur = conn.cursor()
        try:
            cur.execute("select waittime from settings where id=1")
            conn.commit()
            data = cur.fetchone()
            return data
        except:
            return False

    def insert_result(self, unixtime, server_name, download, upload):
        global conn
        cur = conn.cursor()

        try:
            cur.execute("INSERT into results VALUES(null, "+str(unixtime)+", '"+str(server_name)+"', "+str(download)+", "+str(upload)+");")
            conn.commit()
            return True
        except:
            return False

    def insert_pingresult(self, result):
        global conn
        cur = conn.cursor()

        i = 0
        sql = "INSERT into pingresults VALUES "
        for item in result:
            i += 1
            if i != len(result):
                sql += "(NULL, '"+str(item[0])+"', '"+str(item[1])+"', '"+str(item[2])+"'), "
            else:
                sql += "(NULL, '"+str(item[0])+"', '"+str(item[1])+"', '"+str(item[2])+"');"

        #print(sql)
        try:
            cur.execute(sql)
            conn.commit()
            return True
        except:
            return False

    def disconnect(self):
        global conn
        # Закрываем за собой коннект
        conn.close()

def sp_worker():
    # Подключаем БД
    global data

    # Получаем ID сервера
    global serverid
    serverid = []
    result = data.get_serverid()
    
    if result != False:
        serverid.append(result[0])
    else:
        serverid.append(28960)

    # узнаем текущее время
    unixtime = int(time.time())

    # погнали тест. Получаем на выходе скорости
    st = speedtest.Speedtest()
    try:
        st.get_servers(serverid)
        st.get_best_server()
    except KeyboardInterrupt:
        printer('\nCancelling...', error=True)
    except (SpeedtestException, SystemExit):
        e = get_exception()
        if getattr(e, 'code', 1) not in (0, 2):
            msg = '%s' % e
            if not msg:
                msg = '%r' % e
            raise SystemExit('ERROR: %s' % msg)

    # отдать на запись в БД
    download = round(st.download() / 1000000, 1)
    upload = round(st.upload() / 1000000, 1)
    ping = round(st.results.ping, 1)
    result = data.insert_result(unixtime, serverid[0], download, upload)

def pinger(ip):
    # очистка от мусора
    ip = ip.replace(" ", "")
    ip = ip.replace("\r\n", "")
    ip = ip.replace("\r", "")
    ip = ip.replace("\n", "")
    ip = ip.replace("\t", "")

    try:
        response = ping(ip, size=64, count=3)
        return response
    except:
        return False

def ping_worker():
    # Подключаем БД
    global data

    # Получаем список таргетов
    result = data.get_pingtarget()
    
    if result != False:
        # парсим ответ из БД
        result = result[0].split('|')
        collector=[]
        unixtime = int(time.time())
        for server in result:
            # проверяем длину возвращенного эллемента. Если больше 3 символов - запускаем тест
            if len(server)>3:
                result = pinger(server)
                if result != False:
                    '''
                    print("unixtime:"+str(unixtime))
                    print("server:"+str(server))
                    print("avg:"+str(result.rtt_avg_ms))
                    '''
                    collector.append((unixtime, server, result.rtt_avg_ms))

    result = data.insert_pingresult(collector)

    if result == False:
        print("Не могу записать данные пинговалки в БД")
    collector.clear()

def main():
    os.system('clear')

    # Подключаем БД
    global data
    data = sql()
    result = data.connect()
    if result == False:
        sys.exit(0)

    # Получаем статус проверки SP
    result = data.get_status()
    if result != False:
        status = result[0]
    if status == 1:
        sp_worker()

    # Получаем статус проверки Пинговалки
    result = data.get_pingstatus()
    if result != False:
        status = result[0]

    if status == 1:
        ping_worker()

    # подготовка к ожиданию следующего теста
    result = data.get_waittime()
    if result != False:
        waittime=int(result[0])*60
    else:
        waittime = 600

    data.disconnect
    time.sleep(waittime)

if __name__ == '__main__':
    while True:
        main()
