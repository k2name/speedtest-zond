<?php
error_reporting(E_ALL);
mb_internal_encoding("UTF-8");

# шапка
function get_header()
{
  $header = '
  <!DOCTYPE html>
  <html>
    <head>
      <meta http-equiv="content-type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="./template/font-awesome.min.css">
      <link rel="stylesheet" type="text/css" href="./template/style.css">
      <link rel="stylesheet" href="./template/bootstrap.min.css">
      <script src="./template/jquery.min.js"></script>
      <script src="./template/popper.min.js"></script>
      <script src="./template/bootstrap.min.js"></script>
      <script type="text/javascript" src="./template/gcharts.js"></script>
      <title>Speedtest v 0.1</title>
    </head>
    <body>';
  return $header;
}

# навигация (меню)
function get_nav()
{
  $nav='
    <!-- меню -->
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark">

      <ul class="nav navbar-nav">
        <li class="nav-item active">
          <a class="nav-link" href="./index.php">Speedtest v0.1</a>
        </li>
      </ul>

      <ul class="navbar-nav ml-auto">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="./index.php?action=settings" id="navbardrop" data-toggle="dropdown">
            Настройки
          </a>
          <div class="dropdown-menu">
            <a class="dropdown-item" href="./index.php?action=settings">Настройки тестов</a>
            <a class="dropdown-item" href="./index.php?action=servers">Серверы</a>
            <a class="dropdown-item" href="./index.php?action=users">Пользователи</a>
          </div>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="./index.php?action=logout">Выход</a>
        </li>
      </ul>
    
    </nav>
    <!-- /меню -->';

  return $nav;
}

# подвал
function get_footer()
{
    $footer = '  <p align=center>Speedtest zond by k2name &copy; </br>2020</p></body></html>';
    return $footer;
}

# Превращаем секунды в дни/часы/минуты
function secondsToTime($seconds) {
    $dtF = new \DateTime('@0');
    $dtT = new \DateTime("@$seconds");
    return $dtF->diff($dtT)->format('%a дней, %h часов, %i минут, %s секунд');
}

# костыль, который возвращает количество строк в ответе
function SqliteNumRows($query){
  $numRows = 0;
    while($rows = $query->fetchArray()){
      ++$numRows;
    }
  return $numRows;
}

# график
function get_graf($result, $max_time, $min_time)
{
  
  $i = 0;
  if($result != NULL)
    {
      $numrows = SqliteNumRows($result);
      $data = '';
      while ($row = $result->fetchArray()) {
        $i += 1;
        $time = $row['time'];

        if ($i <= $numrows)
        {
          $data .= "[new Date(".date('Y',$time).", ".strval(intval(date('m', $time))-1).", ".date('d',$time).", ".date('H',$time).", ".date('i',$time).", ".date('s',$time)."), ".$row['download'].", ".$row['upload']."],";
        }
        else
        {
          $data .= "[new Date(".date('Y',$time).", ".strval(intval(date('m', $time))-1).", ".date('d',$time).", ".date('H',$time).", ".date('i',$time).", ".date('s',$time)."), ".$row['download'].", ".$row['upload']."]";  
        }
      }
    }
  else
    {
      $data = '[0, 0, 0]';
    }
  
  # начало JS
  $js = '
          <!-- График -->
          <script type="text/javascript">
            google.charts.load(\'current\', {packages: [\'corechart\', \'line\']});
            google.charts.setOnLoadCallback(drawLineColors);

            function drawLineColors() {
                  var data = new google.visualization.DataTable();
                  data.addColumn(\'datetime\', \'X\');
                  data.addColumn(\'number\', \'Download\');
                  data.addColumn(\'number\', \'Upload\');

                  data.addRows([';

  # данные для JS
  $js .= $data;
  
  # окончание JS
  $js .=']);

                  var options = {
                    title: \'Отчет за '.secondsToTime($max_time-$min_time).'\',
                    hAxis: {
                      format: \'(dd.MM.yy HH:mm:ss)\',
                      title: \'Дата/Время\'
                    },
                    vAxis: {
                      title: \'Скорость Mb/s\'
                    },
                    colors: [\'#c92300\', \'#1800e1\']
                  };

                  var chart = new google.visualization.LineChart(document.getElementById(\'chart_div\'));
                  chart.draw(data, options);
                }
          </script>
          <div id="chart_div"></div>
          <!-- /График -->
          ';
  return $js;
}

# график
function get_ping_graf($min_time, $max_time)
{
  # Подготовка данных
  # выбираем уникальные таймштампы из БД в пределах диапазона
  $timestamps = get_pingtest_timestamps($min_time, $max_time);
  if ($timestamps != NULL)
  {
    $pingdata = [];
    while ($row = $timestamps->fetchArray())
    {
      #!!!!!!!!!
      # Логика следующая. Берем уникальные тамштампы
      # по ним делаем выборки
      # по ним собираем массив в массиве. Ассоциативнойтьс сделать по таймштампу
      
      # для каждого таймштампа вытягиваем сервера и значения
      $result = get_pingtest_data($row['testtime']);
      if ($result != NULL)
      {
        $srv=[];
        # полученный список загоняем в массив
        while ($subrow = $result->fetchArray())
        {
          $srv[$subrow['server']] = $subrow['testresult'];
        }
        # полученный массив загоняем как значение в общий массив
        $pingdata[intval($row['testtime'])]=$srv;
      }
    }
  }


  # получаем уникальные названия серваков учавствовавших в тесте
  /*
  $result = get_pingtest_serverlist($min_time, $max_time);
  if (($result !=NULL) && ($timestamps != NULL))
  {
    $serverlist = [];
    while ($server = $result->fetchArray())
    {
      array_push($serverlist, $server[0]);
    }
  }
  else 
  {
    $result = NULL;
  }
  */

  $result = get_pingtest_serverlist();
  if (($result !=NULL) && ($timestamps != NULL))
  {
    $serverlist = $result->fetchArray();
    $serverlist = explode("|", $serverlist[0]);
  }
  else 
  {
    $result = NULL;
  }

  # Составляем матрицу для графика
  $s = 0;
  $data = "";
  # $serverlist
  if ($result != NULL)
  {
    # для каждого таймштампа получаем массив значений
    foreach ($pingdata as $time => $servers)
    {
      $s += 1;
      $s2 = 0;
      $server_data = "";
      # в каждом имеющемся массиве ищем сервера по списку
      foreach ($serverlist as $server) 
      {
        $value = "";
        $s2 +=1;
        # если в массиве имеется значение для нужного нам сервера - добавляем значение в строку. Если нет - ставим ноль
        if (isset($servers[$server]))
        {
          $value .= $servers[$server];
        }
        else
        {
          $value .= "0";
        }

        # после каждого не последнего эллемента добавляем запятую
        if ($s2 != count($serverlist))
        {
          $value .= ', ';
        }

        $server_data .= $value;
      }
      
      # набиваем строку для графика. СБорка
      $data .= "[new Date(".date('Y',$time).", ".strval(intval(date('m', $time))-1).", ".date('d',$time).", ".date('H',$time).", ".date('i',$time).", ".date('s',$time)."), ".$server_data."]"; 

      # если это не последний таймштамп - добавляем запятую в конце
      if ($s != count($pingdata))
      {
        $data .= ",";        
      }
    }
  }
  else
  {
    return NULL;
  }


  # начало JS
  $js = '
          <!-- График -->
          <script type="text/javascript">
            google.charts.load(\'current\', {packages: [\'corechart\', \'line\']});
            google.charts.setOnLoadCallback(drawLineColors);

            function drawLineColors() {
                  var data = new google.visualization.DataTable();
                  data.addColumn(\'datetime\', \'X\');';
  
  foreach ($serverlist as $server) 
  {
    $js .= "                data.addColumn('number', '".$server."');";
  }

  $js .= '
                  data.addRows([';

  # данные для JS
  $js .= $data;
  
  # окончание JS
  $js .=']);

                  var options = {
                    title: \'Отчет за '.secondsToTime($max_time-$min_time).'\',
                    hAxis: {
                      format: \'(dd.MM.yy HH:mm:ss)\',
                      title: \'Дата/Время\'
                    },
                    vAxis: {
                      title: \'Время отклика ms\'
                    }
                  };

                  var chart = new google.visualization.LineChart(document.getElementById(\'chart_div_ping\'));
                  chart.draw(data, options);
                }
          </script>
          <div id="chart_div_ping"></div>
          <!-- /График -->
          ';
  
  return $js;
}

# главная страница
function stats($type)
{
  #Получаем статус из БД для отображения в самом верху

  $result = get_current_settings();
  if ($result != NULL)
  {
    $row = $result->fetchArray();
    $status = $row['status'];
    $pingstatus = $row['pingstatus'];
  }
  else
  {
    return "Не могу получить настройки";
    exit();
  }

  $body = '
    <!-- container -->
    <div class="container-fluid">
      <div class="row">
        <div class="col-1">&nbsp;</div>
        <div class="col-9" align="center">';

  # вставляем график
  if ($type == "param")
  {
    $min_time = strtotime("{$_POST['mindate']} {$_POST['mintime']}");
    $max_time = strtotime("{$_POST['maxdate']} {$_POST['maxtime']}");
  }
  else
  {
    $max_time = time();
    # сутки по умолчанию
    $dif_time = 60*60*24;
    $min_time = $max_time-$dif_time;
  }
  # запрашиваем результаты спидеста
  $result = get_speedtest_data($min_time, $max_time);
  if ($result != NULL)
  {
    $body .= get_graf($result, $max_time, $min_time);
  }
  else
  {
    $body .= '<div class="alert alert-danger"><strong>Внимание!</strong> В БД отсутствуют значения Speedtest за указанный период времени!!!</div>';
  }
  
  # второй график для пингов. 
  $result = get_ping_graf($min_time, $max_time);
  if ($result != NULL)
  {
    $body .= $result;
  }
  else
  {
    $body .= '<div class="alert alert-danger"><strong>Внимание!</strong> В БД отсутствуют значения Pingtest за указанный период времени!!!</div>';
  }


  # закрываем центральный блок
  $body .= '</div>';

  # отображаем бар с статусом работы
  # speedtest
  if ($status==1)
  {
    $status = '          <p><div class="alert alert-success">Статус speedtest: <strong>Включено!</strong></div></p>';
  }
  else
  {
    $status = '          <p><div class="alert alert-danger">Статус speedtest: <strong>Выключено!</strong></div></p>';
  }
  # pingtest
  if ($pingstatus==1)
  {
    $status .= '          <p><div class="alert alert-success">Статус pingtest: <strong>Включено!</strong></div></p>';
  }
  else
  {
    $status .= '          <p><div class="alert alert-danger">Статус pingtest: <strong>Выключено!</strong></div></p>';
  }


  $time = time();

  # концовка
  $body .='
          <div class="col-2">
            <p>'.$status.'</p>
            
            <form action="index.php?action=stats" method="POST" class="form-inline">
              <div class="form-row">

                <div class="col">
                  <input class="form-control" type="date" value="'.date('Y-m-d', $min_time).'" id="mindate" name="mindate">
                </div>
                <div class="col">
                  <input class="form-control" type="time" value="'.date('H:i:s',$min_time).'" id="mintime" name="mintime">
                </div>
              </div>

              <div class="form-row">
                <div class="col">
                  <input class="form-control" type="date" value="'.date('Y-m-d',$max_time).'" id="maxdate" name="maxdate">
                </div>
                <div class="col">
                  <input class="form-control" type="time" value="'.date('H:i:s',$max_time).'" id="maxtime" name="maxtime">
                </div>
              </div>
              <div class="form-row" style="align:center">
                <div class="col">
                  <p>&nbsp;</p>
                  <button type="submit" class="btn btn-primary">Выбрать</button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>';
  return $body;
}

# Страница настроек
function get_settings_page()
{
  $result = get_current_settings();
  if ($result != NULL)
  {
    $settings = $result->fetchArray();
    $status = $settings['status'];
    $server = $settings['server'];
    $waittime = $settings['waittime'];
    $pingstatus = $settings['pingstatus'];
    $pingtarget = str_replace("|", "\n", $settings['pingtarget']);
    $error = False;
  }
  else
  {
    $error = True;
  }


  if ($error != True)
  {
    $result = get_servers_list();    
    if ($result == NULL)
    {
      $error = True;
    }
  }

  # набрасываем значения в страницу
  if ($error != True)
  {
    $body = '
    <div class="container-fluid">
      <div class="row">
        <div class="col-2">&nbsp;</div>
        <div class="col-8">
          <h2>Настройки</h2>
            <form class="was-validated" action="index.php?action=change_settings" method="post">

            <div class="form-check-inline">
              <input type="checkbox" class="form-check-input" name="status" ';
    
    # проверка статуса
    if ($status == 1) 
      {
        $body .= 'checked';
      }  
    $body .='>
              <label class="form-check-label">Состояние speedtest-тестирования (вкл/выкл)</label>
            </div>

            <div class="form-group">
              <label for="sel1"><br>Выбранный сервер</label>
              <select class="form-control" id="server" name="server">';

    # забираем из БД список провайдеров 
    while ($row = $result->fetchArray())
    {
      $name = $row['country']." | ".$row['city']." | ".$row['provider'];
      $id = $row['code'];
      if ($server == $id)
      {
        $body .= '<option value="'.$id.'" selected >'.$name.'</option>';
      }
      else
      {
        $body .= '<option value="'.$id.'">'.$name.'</option>';
      }
      
    }

    $body .= '</select>
            </div>
            <hr>
            <div class="form-check-inline">
              <input type="checkbox" class="form-check-input" name="pingstatus" ';
    
    # проверка статуса
    if ($pingstatus == 1) 
      {
        $body .= 'checked';
      }  
    $body .='>
              <label class="form-check-label">Состояние ping-тестирования (вкл/выкл)</label>
            </div>

            <div class="form-group">
              <label for="comment">Цели для ping:</label>
              <textarea class="form-control" rows="5" id="pingtarget" name="pingtarget" placeholder="По одному адресу или домену в строку">'.$pingtarget.'</textarea>
            </div> 
            <hr>
            <div class="form-group">
              <label for="usr"><h4>Общие настройки</h4></label>
              <p><label for="usr2">Частота тестирования (мин):</label></p>
              <input type="text" class="form-control" id="waittime" name="waittime" placeholder="5" value="'.$waittime.'">
            </div>

            <div class="row">
              <button type="submit" class="btn btn-primary">Сохранить</button>
            </div>
            </form>
          </div>
        <div class="col-2"><p>&nbsp;</p>
          <p>
          <form method="post" action="index.php?action=clear_history">
            <button type="submit" class="btn btn-primary">Очистить историю замеров</button>
          </form>
        </div>
    </div>';
  }
  else 
  {
    $body = '<div class="alert alert-danger"><strong>Внимание!</strong> Не удается прочитать настройки!!!</div>';
  }

  return $body;
}

# Страница со списком серверов
function get_servers_page()
{
  $result = get_servers_list();
  if ($result != NULL)
  {
    $settings = $result->fetchArray();;
    $body = '
    <div class="container-fluid">
      <div class="row">
        <div class="col-2">&nbsp;</div>
        <div class="col-8">
          <h2>Полный список серверов</h2>
          <input class="form-control" id="myInput" type="text" placeholder="Search..">
          <br>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Страна</th>
                <th>Город</th>
                <th>Провайдер</th>
              </tr>
            </thead>
            <tbody id="myTable">';


    while ($row = $result->fetchArray()) 
    {
      $body .= "
              <tr>
                <td>{$row['code']}</td>
                <td>{$row['country']}</td>
                <td>{$row['city']}</td>
                <td>{$row['provider']}</td>
              </tr>";
    }

    $body.='        </tbody>
          </table>
          <script>
          $(document).ready(function(){
            $("#myInput").on("keyup", function() {
              var value = $(this).val().toLowerCase();
              $("#myTable tr").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
              });
            });
          });
          </script>
        </div>
        <div class="col-2">
          <p>&nbsp;</p>
          <p>
          <form method="post" action="index.php?action=update_servers">
            <button type="submit" class="btn btn-primary">Обновить список</button>
          </form>
        </div>
    </div>';
  }
  else 
  {
    $body = '<div class="container-fluid">
      <div class="row">
        <div class="col-2">&nbsp;</div>
        <div class="col-8">
        <div class="alert alert-danger"><strong>Внимание!</strong> В БД отсутствует список серверов!!!</div>
        </div>
        <div class="col-2">
          <p>&nbsp;</p>
          <p>
          <form method="post" action="index.php?action=update_servers">
          <button type="submit" class="btn btn-primary">Обновить список</button>
          </form>
        </div>
        ';
  }

  return $body;
}

# Скачивание урла
function get_xml_from_url($url){
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
    try 
    {
      $xmlstr = curl_exec($ch);
      curl_close($ch);
      return $xmlstr;
    }
    catch (Exception $e)
    {
      return False;
    }
}

# функция обновления списка серверов
function update_servers()
{
  $url = "https://c.speedtest.net/speedtest-servers-static.php";
  
  # Получаем XML с функции
  $xmlstr = get_xml_from_url($url);
  
  # проверяем результат перед началом работы
  if ($xmlstr != False)
  {
    # удаляем все записи в таблице серверов
    del_servers_list();

    # 
    $xml = new SimpleXMLElement($xmlstr);
    $count = 0;
    $list = array();
    foreach($xml->servers->server as $server) 
    {
      $count += 1;
      array_push($list, $server);
      
      # Отправка если в массиве 100 записей
      if ($count == 100)
      {
        add_servers_list($list, $count);
        $list = [];
        $count = 0;
      }
    }
    # Отправка если в массиве что-то осталось
    if ($count > 0)
    {
      add_servers_list($list, $count);
    }

    # уничтожаем список в памяти
    unset($list);
    return True;
  }
  else
  {
    return False;
  }
}

# Страница со списком пользователей
function get_users_page()
{
  $result = get_users_lists();
  if ($result != NULL)
  {
    $body = '
    <div class="container-fluid">
      <div class="row">
        <div class="col-2">&nbsp;</div>
        <div class="col-8">
          <h2>Список пользователей</h2>
          <input class="form-control" id="myInput" type="text" placeholder="Search..">
          <br>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>ФИО</th>
                <th>Логин</th>
                <th>Править</th>
                <th>Удалить</th>
              </tr>
            </thead>
            <tbody id="myTable">';


    while ($row = $result->fetchArray()) 
    {
      $body .= "
              <tr>
                <td>{$row['id']}</td>
                <td>{$row['name']}</td>
                <td>{$row['login']}</td>
                <td><button onclick=\"window.location.href = 'index.php?action=edit_user&id={$row['id']}';\">изменить</button></td>
                <td><button onclick=\"window.location.href = 'index.php?action=del_user&id={$row['id']}';\">удалить</button></td>
              </tr>";
    }

    $body.='
            </tbody>
          </table>
          <script>
          $(document).ready(function(){
            $("#myInput").on("keyup", function() {
              var value = $(this).val().toLowerCase();
              $("#myTable tr").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
              });
            });
          });
          </script>';

    $body .='
        </div>
        <div class="col-2"><p>&nbsp;</p>
          <p>
          <form method="post" action="index.php?action=edit_user&id=new">
            <button type="submit" class="btn btn-primary">Создать нового</button>
          </form>
        </div>
    </div>';

  }
  else
  {
    $body = '<div class="alert alert-danger"><strong>Внимание!</strong> Не удается прочитать список пользователей!!!</div>';
  }
  return $body;
}

function edit_user($id)
{
  if ($id == "new")
  {
    $name = "";
    $login = "";
    $password = "";
  }
  else
  {
    $result = get_single_user($id);
    if ($result != NULL)
    {
      $row = $result->fetchArray();
      $name = $row['name'];
      $login = $row['login'];
      $password = "*******";
    }
  }

  if (($id == "new") OR ($result != NULL))
  {
    $body = '
    <div class="container-fluid">
      <div class="row">
        <div class="col-2">&nbsp;</div>
        <div class="col-8">
          <h2>Правка пользователя</h2>';

    if ($id == "new")
    {
      $body .= '      <form action="index.php?action=add_user" method="post">';
    }
    else
    {
      $body .= '      <form action="index.php?action=edit_user_byid&id='.$id.'" method="post">';
    }

    $body .='       <div class="form-group">
            <label for="usr">Имя:</label>
            <input type="text" class="form-control" id="name" name="name" placeholder="ФИО" value="'.$name.'">
          </div>
          <div class="form-group">
            <label for="usr">Логин:</label>
            <input type="text" class="form-control" id="login" name="login" placeholder="Логин" value="'.$login.'">
          </div>
          <div class="form-group">
            <label for="pwd">Пароль:</label>
            <input type="password" class="form-control" id="pwd" name="pwd" placeholder="пароль" value="'.$password.'">
          </div> 
          <button type="submit" class="btn btn-primary">сохранить</button>
          </form>
        </div>
        <div class="col-2"><p>&nbsp;</p>
        </div>
    </div>';
  }
  else
  {
    $body = '<div class="alert alert-danger"><strong>Внимание!</strong> Не удается найти/создать указанного пользователя!!!</div>';
  }

  return $body;
}


?>