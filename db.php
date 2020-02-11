<?php
mb_internal_encoding("UTF-8");

// Проверка Авторизации
function ckeck_coockies()
{
    global $db;
    if (isset($_COOKIE['id']) and isset($_COOKIE['uhash']))
    {
        $result = $db->query("SELECT id, hash FROM users WHERE id ='{$_COOKIE['id']}' LIMIT 1");
        if(SqliteNumRows($result)>0)
        {
            $row = $result->fetchArray();
            $id = $row['id'];
            $hash = $row['hash'];
        }
        else
        {
            setcookie("id", "", time() + (86400 * 30), "/");
            setcookie("uhash", "", time() + (86400 * 30), "/");
            header("Location: login.php"); 
            exit();
        }


        if (($id != $_COOKIE['id']) or ($hash != $_COOKIE['uhash']))
        {
            setcookie("id", NULL, time() + (86400 * 30), "/");
            setcookie("uhash", NULL, time() + (86400 * 30), "/");
            header("Location: login.php"); 
            exit();
        }

    }
    else
    {
        header("Location: login.php"); 
        exit();
    }
}

# Читаем настройки из таблицы
function get_current_settings()
{
    global $db;
    $result = $db->query("SELECT * FROM settings WHERE id=1;");
    if(SqliteNumRows($result)>0)
    {
        return $result;
    }
    else 
    {
        return NULL;
    }
}

# получаем данные из БД
function get_data($min, $max)
{
    global $db;
    $result = $db->query("SELECT * FROM `results` WHERE `time` BETWEEN {$min} AND {$max};");
    if(SqliteNumRows($result)>0)
    {
        return $result;
    }
    else 
    {
        return NULL;
    }
}

# Получаем список серверов из БД
function get_servers_list()
{
    global $db;
    $result = $db->query("SELECT * FROM `servers` ORDER BY `country` ASC;");
    if(SqliteNumRows($result)>0)
    {
        return $result;
    }
    else 
    {
        return NULL;
    }
}

# Удаляем список серверов в таблице
function del_servers_list()
{
    global $db;
    $result = $db->exec("DELETE from `servers` where `id`>0;");
}

# Добавляем множественные значения в список серверов
function add_servers_list($list, $count)
{
    # city      - город
    # country   - страна
    # code      - id провайдера
    # provider  - провайдер

    #$server->attributes()->id              # ID
    #$server->attributes()->name            # город
    #$server->attributes()->sponsor         # Компания
    #$server->attributes()->country         # Страна

    global $db;
    $query = "INSERT INTO servers (city, country, code, provider) VALUES ";

    $tmp=0;
    # добавляем значения в запрос
    foreach ($list as $server) 
    {
        $tmp += 1;

        # Чистим от кавычек все возможные поля
        $city = str_replace("'","''", $server->attributes()->name);
        $country = str_replace("'","''", $server->attributes()->country);
        $provider = str_replace("'","''", $server->attributes()->sponsor);

        # набиваем массив значениями
        $query .= "('{$city}', '{$country}', '{$server->attributes()->id}', '{$provider}')";
        if ($tmp != $count)
        {
            $query .= ", ";
        }
        else
        {
            $query .= ";";
        }
    }
    #echo $query."\n";
    $result = $db->exec($query);
}

# меняем настройки в БД
function save_settings()
{
    global $db;
    if(isset($_POST['status']))
    {
        $status = 1;
    }
    else
    {
        $status = 0;
    }

    $server = $_POST['server'];
    $waittime =  $_POST['waittime'];

    # загоняем в БД данные
    $result = $db->exec("UPDATE `settings` SET `status`='{$status}', `server`='{$server}', `waittime`='{$waittime}' WHERE id=1;");
}

# Удаляем список серверов в таблице
function clear_history()
{
    global $db;
    $result = $db->exec("DELETE from `results` where `id`>0;");
}

# получаем список пользователей из БД
function get_users_lists()
{
    global $db;
    $result = $db->query("SELECT * FROM `users` ORDER BY `name` ASC;");
    if(SqliteNumRows($result)>0)
    {
        return $result;
    }
    else 
    {
        return NULL;
    }
}

# получаем запись конктерного пользователя
function get_single_user($id)
{
    global $db;
    $result = $db->query("SELECT * FROM `users` WHERE `id`='{$id}';");
    if(SqliteNumRows($result)>0)
    {
        return $result;
    }
    else 
    {
        return NULL;
    }
}

# функция правки данных пользователя
function edit_userdata()
{
    global $db;
    # подготовка данных
    if((isset($_GET['id'])) AND (isset($_POST['name'])) AND (isset($_POST['login'])) AND (isset($_POST['pwd'])))
    {
        $id = $_GET['id'];
        $name = $_POST['name'];
        $login = $_POST['login'];
        $paswd = md5($_POST['pwd']);

        $result = $db->exec("UPDATE `users` SET `name`='{$name}', `login`='{$login}', `paswd`='{$paswd}' WHERE `id`='{$id}';");
        return True;
    }
    else
    {
        return False;
    }
}

# функция добавления нового пользователя
function add_user()
{
    global $db;
    # подготовка данных
    if( (isset($_POST['name'])) AND (isset($_POST['login'])) AND (isset($_POST['pwd'])))
    {
        $name = $_POST['name'];
        $login = $_POST['login'];
        $paswd = md5($_POST['pwd']);
        $result = $db->exec("INSERT INTO `users` (name, login, paswd) VALUES ('$name', '$login', '$paswd');");
        return True;
    }
    else
    {
        return False;
    }
}

# Удаляем пользователя
function del_user()
{
    global $db;
    if(isset($_GET['id']))
    {
        $id = $_GET['id'];
        $result = $db->exec("DELETE from `users` where `id`='{$id}';");
        return True;
    }
    else
    {
        return False;
    }
}


?>



