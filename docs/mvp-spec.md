# Тех. задание для MVP Мемо

Нужно реализовать карточную игру, смысл которой довольно прост: вам нужно выбрать все пары карт.

[Ссылка на макет (страница «Инструменты разработки»).](https://www.figma.com/file/Xk8ocvZA9NlMmA0szZeI5h/%D0%B1%D0%B0%D0%B7%D0%BE%D0%B2%D1%8B%D0%B9-JS?node-id=4325%3A2)

## Описание игры

Вам предстоит реализовать следующий функционал: выбор сложности, основную логику игры, вывод результата. Ниже вы найдёте подробное описание каждого пункта.

### Логика выбора сложности

Есть три уровня сложности: **легкий, средний, сложный**. От уровня сложности зависит количество карточек, которые будут показаны пользователю на игровом экране.
Количество карточек для каждого уровня сложности можете назначать и свои или выбрать готовый пресет.

Предлагаем следующее пресеты:

- Легкий уровень - 6 карточек (3 пары)
- Средний уровень - 12 карточек (6 пар)
- Сложный уровень - 18 карточек (9 пар)

Как только уровень сложности выбран, игроку показывается на игровой поле.

### Игровое поле

Вам предстоит написать логику генерации необходимого количества карточек.
Карты обыкновенные игральные:

- 4 масти (черви, бубны, крести, пики)
- 9 рангов (6, 7, 8, 9, 10, Q, K, J, A)
  Когда карточки будут сгенерированы, их нужно перетасовать и показать игроку на 5 секунд, после чего карточки перевернуть рубашками вверх.

### Игровая механика

Когда пользователь кликает на карточку, она переворачивается и показывает ранг и масть. Необязательно делать анимацию перевода.
Когда игрок кликает на предположительную пару, то игра осуществляет сверку карточек:

- Если карточки совпадают ⇒ игра продолжается
- Если карточки не совпадают ⇒ игра заканчивается
  Если были найдены все пары, игрок побеждает.

### Финал игры

Каким бы ни был финал игры, пользователю показывается всплывающее окно со:

- Статусом (проиграл / выиграл).
- Временем, затраченным на игру.
- Кнопкой, предлагающей сыграть снова.

# **Новый режим игры и функционал**

На главной странице реализован чекбокс для включения **упрощенного режима** игры,
при котором **пользователю даются 3 попытки** и кнопка **"Старт"** для начала игры после выбора сложности.
После начала игры, внизу под карточками, на странице уровня,
есть иконка в виде **"Сердца" со счетчиком количества попыток**,
при каждой ошибке снимается 1 жизнь, данные динамически обновляются на странице игры.
После 3-х ошибок, открывается модальное окно со статусом **"Вы проиграли!"**.
Также добавили возможность **смены уровня сложности игры** посредством соответствующей кнопки-иконки,
которая находится снизу под карточками для удобства использования.

---

## **Реализован лидерборд**

На главной странице реализована новая **ссылка на страницу Лидерборда**.
При переходе по ссылке, открывается страница Лидерборда и список лидеров который приходит с Api - **Топ 10 самых быстрых игроков** по возрастанию потраченного времени на игру.
В этот список можно попасть **только пройдя 3-ий уровень сложности** и если пользователь побьет рекорд одного из 10-ти самых быстрых игроков.
Если выполняются все условия, открывается **специальное модальное окно**, где пользователю предлагается **ввести свое имя**(пользовательский ввод обработан).
По завершении нужно нажать на специальную иконку-кнопку в виде знака **"+"** или нажать клавишу **"Enter"** чтобы отправить данные на сервер.
Далее перейти на страницу **Лидерборда** по ссылке снизу в модальном окне, либо **Начать новую игру**.

---

### **Реализован лидерборд v2**

В новой версии лидерборда добавили **Достижения**.
На текущий момент их два - **Прохождение игры на сложном режиме** и **Прохождение игры без использования супер-сил**.
Если пользователь выполняет условия, получает соответствующие **ачивки** к его позиции в лидерборде.
Данные хранятся на сервере. Обновлен **Api** и вся ее логика работы с новой версией лидерборда.
При наведении на каждую из **ачивок** в списке, открывается подсказка(tooltip), описывающая условия получения достижении к своей позиции в лидерборде.

---

#### **Реализованы супер-способности**

В игру добавили **супер-способности** для вспомогательной помощи игроку.
Всего их две - **"Прозрение"** и **"Про-Рандом"**.
При активации способности - **"Прозрение", на 5 секунд показываются все карты. Таймер длительности игры на это время останавливается**.
При активации способности - **"Про-Рандом", открывается случайная пара карт**.
Обе способности можно использовать **только один раз за игру** и для удобства пользования, **добавили счетчики доступности супер-сил**.
Кнопки-иконки для активации супер-способностей **расположены в центре сверху над карточками**.
При наведении на каждую из способностей, открывается подсказка(tooltip), описывающая подробно каждую супер-силу.

**_Важно_** Чтобы избежать **читерства и багов**,
на время действия(5 сек) способности - **"Прозрение"**,
нельзя активировать способность - **"Про-Рандом"** и нажать на кнопку **"Начать заново"**.  
Частично обновлен интерфейс модального окна при попадании в **Лидерборд** и **подсказка(tooltip) на странице выбора сложности игры**, при наведении на чекбокс включения **легкого режима**.\*\*\*

---
