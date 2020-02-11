<?php
error_reporting(E_ALL);
mb_internal_encoding("UTF-8");
header('Content-Type: text/html; charset=utf-8');  

function generateCode($length=6) {
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHI JKLMNOPRQSTUVWXYZ0123456789";
    $code = "";
    $clen = strlen($chars) - 1;
    while (strlen($code) < $length) {
            $code .= $chars[mt_rand(0,$clen)];
    }
    return $code;
}

if(isset($_POST['submit']))
{
    $db = new SQLite3('./db/base.db');

    $login = $_POST['login'];
    $passwd_form = $_POST['password'];

    // Вытаскиваем из БД запись, у которой логин равняеться введенному
    $result = $db->query("SELECT * FROM users WHERE login='{$login}' LIMIT 1");
    if((count($result))>0)
    {
        $row = $result->fetchArray();
        $id = $row['id'];
        $paswd = $row['paswd'];
    }
    else
    {
        echo"Пользователь не найден!";
        exit();
    }

    // Сравниваем пароли
    if($paswd === md5($passwd_form))
    {
        // Генерируем случайное число и шифруем его
        $hash = md5(generateCode(10));

        // Записываем в БД новый хеш авторизации и IP
        $db->exec("UPDATE users SET hash='{$hash}' WHERE id={$id}");

        // Ставим куки
        setcookie("id", $id, time() + (86400 * 30), "/");
        setcookie("uhash", $hash, time() + (86400 * 30), "/");

        $db->close();
        // Переадресовываем браузер на страницу проверки нашего скрипта
        header("Location: index.php"); exit();
    }
    else
    {
        print "Вы ввели неправильный логин/пароль";
    }
    $db->close();

}?>

<html>
<head>
    <title>Speedtest by k2</title>
</head>
<body>
    <div align="center">
    <form method="POST">
    Логин <input name="login" type="text" required><br>
    Пароль <input name="password" type="password" required><br>
    <input name="submit" type="submit" value="Войти">
    </form>
    </div>
</body>
</html>