<?php
error_reporting(E_ALL);
mb_internal_encoding("UTF-8");
header('Content-Type: text/html; charset=utf-8');

$db = new SQLite3('./db/base.db');     // подключаем базу данных
require_once('./db.php');               // подключаем файл с SQL запросами. Все собрал в кучу.
require_once('./template.php');         // подключаем файл шаблонов страниц

// Проверка авторизации
ckeck_coockies();

# --------------------- Проверка входящих параметров и отображение нужной страницы --------------------

# Проверяем наличие вызова определенной страницы
if(isset($_GET['action']))
{
    $page = $_GET['action'];
}
else 
{
    $page='def';
}

# отображаем страницу согласно заголовка
switch ($page){
    case 'stats':
        echo get_header();
        echo get_nav();
        echo stats('param');
        echo get_footer();
        break;
    case 'settings':
        echo get_header();
        echo get_nav();
        echo get_settings_page();
        echo get_footer();
        break;
    case 'change_settings':
        echo get_header();
        echo get_nav();
        save_settings();
        echo '<div class="alert alert-success"><strong>Успешно!</strong> Настройки сохранены!!!</div>';
        echo get_footer();
        header('Refresh: 3; URL=index.php?action=settings');
        break;
    case 'servers':
        echo get_header();
        echo get_nav();
        echo get_servers_page();
        echo get_footer();
        break;
    case 'update_servers':
        $result = update_servers();
        echo get_header();
        echo get_nav();
        if ($result == True)
        {
            echo '<div class="alert alert-success"><strong>Успешно!</strong> Сервера импортированы в базу данных!</div>';
        }
        else
        {
            echo '<div class="alert alert-danger"><strong>Ошибка!</strong> Не удалось скачать список серверо с сайта!!!</div>';
        }
        echo get_footer();
        header('Refresh: 3; URL=index.php?action=servers');
        break;
    case 'clear_history':
        echo get_header();
        echo get_nav();
        clear_history();
        echo '<div class="alert alert-success"><strong>Успешно!</strong> История замеров очищена!</div>';
        echo get_footer();
        header('Refresh: 3; URL=index.php?action=settings');
        break;
    case 'users':
        echo get_header();
        echo get_nav();
        echo get_users_page();
        echo get_footer();
        break;
    case 'edit_user':
        echo get_header();
        echo get_nav();
        if(isset($_GET['id']))
        {
            echo edit_user($_GET['id']);
        }
        echo get_footer();
        break;
    case 'edit_user_byid':
        echo get_header();
        echo get_nav();
        $result = edit_userdata();
        if ($result == True)
        {
            echo '<div class="alert alert-success"><strong>Успешно!</strong> Пользователь изменен!</div>';
        }
        else
        {
            echo '<div class="alert alert-danger"><strong>Внимание!</strong> Не удается сохранить изменения!!!</div>';
        }
        echo get_footer();
        header('Refresh: 3; URL=index.php?action=users');
        break;
    case 'add_user':
        echo get_header();
        echo get_nav();
        $result = add_user();
        if ($result == True)
        {
            echo '<div class="alert alert-success"><strong>Успешно!</strong> Пользователь добавлен!</div>';
        }
        else
        {
            echo '<div class="alert alert-danger"><strong>Внимание!</strong> Не удается добавить пользователя!!!</div>';
        }
        echo get_footer();
        header('Refresh: 3; URL=index.php?action=users');
        break;
    case 'del_user':
        echo get_header();
        echo get_nav();
        $result = del_user();
        if ($result == True)
        {
            echo '<div class="alert alert-success"><strong>Успешно!</strong> Пользователь удален!</div>';
        }
        else
        {
            echo '<div class="alert alert-danger"><strong>Ошибка!</strong> Не удалось найти пользоателя!!!</div>';
        }
        echo get_footer();
        header('Refresh: 3; URL=index.php?action=users');
        break;
    case 'logout':
        setcookie("id", NULL, time() + (86400 * 30), "/");
        setcookie("uhash", NULL, time() + (86400 * 30), "/");
        header('Location: login.php');
        #exit();
        break;
    default:
        echo get_header();
        echo get_nav();
        echo stats('def');
        echo get_footer();
}

$db->close();

?>