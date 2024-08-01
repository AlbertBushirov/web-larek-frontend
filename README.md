# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


## Типы данных


### Приложение

```
basket: IBasket[];
cardsList: ICardItem[];
preview: string | null;
order: IOrder | null;
```


### Товар

```
id: string;
description: string;
image: string;
title: string;
category: string;
price: number | null;
inBasket: boolean;
```


### Корзина товаров

```
quantity: number;
title: string;
price: number;
totalPrice: number;
```


### Данные заказа

```
payment: string;
address: string;
email: string;
phone: string;
total: number;
id: string[];
```


### Тип ошибки заказа

```
FormErrors = Partial<Record<keyof IOrder, string>>;
```


## Архитектура приложения

Код приложения разделен на слои, согласно MVP.

Структура проекта: 

- интерфейс (вывод пользовательской информации);
- данные (лоигика приложения без интерфейса);
- Presenter (связывает данные с интерфейсом);


## Описание базовых классов


### Класс Api

Базовая функциональность: работа с серверными данными; хранит основные поля и методы;

Конструктор: 
- URL основного API;
- дополнительные параметры HTTP запроса;

Методы: 
- handleResponse - обрабатывает полученный ответ от сервера; возвращает ошибку если ответ отрицательный;
- post - принимает объект с данными, обрабатывает и отправляет их, как параметр при вызове метода;
- get - отправляет GET запрос с данными и возвращает ответ сервера;



### Класс Component 

Базовая функциональность: абстрактный класс; создает компоненты пользовательского интерфейса;

Конструктор: 
- mainElement - контейнер, корневой DOM-элемент;

Методы: 
- toggleClass - переключает класс;
- setText - устанавливает текстовое содержимое;
- hideElement - скрывает элемент;
- showElement - показывает элемент;
- setDisabled - изменяет состояние блокировки;
- render - возвращает DOM-элемент;
- setImage - устанавливает изображение с альтернативным текстом;



### Класс Model

Базовая функциональность: абстрактный класс, создает модальные окна;

Конструктор: принимает данные модели и объект событий; копирует данные в модель;

Методы: 
- emmitChanges — регистрирует входящее событие в EventEmitter;


### Класс EventEmitter

Базовая функциональность: реализует функционал обработчиков событий; позволяет отправлять события и подписываться на них;

Конструктор: создает схему событий;

Методы: 
- installEvent - устанавливает обработчик события;
- deleteEvent - удаляет обработчик события;
- callEvent - вызывает событие;


## Описание классов данных;


### Класс AppData 

Базовая функциональность: содержит основные данные для работы с моделями; работает, как собирающий класс.

Поля класса: 
- catalog - список товара;
- preview - выбранный товар;
- bascket - корзина покупок;
- order - заказ;


Методы: 
- addBasket - добавляет товар в корзину;
- getQuantity - возвращает количество товаров в корзине;
- removeBasket - удаляет товар из корзины;
- clearBasket - очищает товары в корзине;
- clearOrder - очищает данные заказа;


### Класс Page 

Базовая функциональность: отвечает за отображение корзины, счетчика корзины и каталога товаров;

Поля класса: 
- counter - отвечает за счетчик корзины;
- catalog - хранение разметки кнопки корзины;
-locked - прокручивание страницы;

Конструктор: 
- обработчик событий корзины;

Методы: 
- catalog - показывает список товаров;
- counter - показывает список товаров в корзине;


### Класс Card 

Базовая функциональность: отображение карточек, взятых из каталога;

Поля класса:
- title - название карточки;
- category - разметка категории;
- image - изображение карточки;
- price - цена карточки;

Конструктор: принимает контейнер карточки товара, а так же инпут "категории товара";  

Методы: 
- cardImage - устанавливает изображение карточки;
- cardCategory - устанавливает категорию товара;
- cardTitle - устанавливает название товара;


### Класс Modal

Базовая функциональность: класс отвечает за отображение модальных окон; Наследуется от Component

Поля класса: 
- 

Конструктор: принимает селектор, в котором будет установленно модальное окно и экземпляр класса EventEmitter для возможности инициализации событий

Методы:
- openModal - открывает модальное окно;
- closeModal - закрывает модальное окно;
- createModal - создает модальное окно;


### Класс Form

Базовая функциональность: занимается валидацией и отправкой форм. Наследуется от Component;

Поля класса: 
- errors - разметка ошибок в инпуте;
- supbmit - разметка кнопки;

Конструктор: принимает селекторы полей форм, кнопки отправки форм и окна "заказ оформлен";

Методы: 
- hideValidation - открывает окно "Заказ оформлен"
- enableValidation - валидация полей форм;
- clearValidation - чистит правильно заполненную форму;
- findErrors - найти ошибку;

### Класс Order

Базовая функциональность: реализует изменения состояний кнопок способа оплаты; наследуется от Form;

Конструктор: принимает элементы оплаты;  

Методы: 
- toggleButton - переклюает состояние кнопок способа оплаты;


### Класс Contacts

Базовая функциональность: устанавливает адрес доставки товара пользователя; наследуется от Form;

Конструктор: принимает контактные данные;  

Методы: 
- installAdress - устанавливает адрес доставки товара;


### Класс Basket 

Базовая функциональность: отображает корзину товаров, колличество товаров в корзине; наследуется от Component.

Поля класса: 
- items - HTMLElement[];
- total - number;

Конструктор: 
- принимает корневой элемент корзины и объект событий;

Методы: 
- toggleButton - отображает или отключает кнопку оформления заказа в зависимости от наличия товаров в корзине;
- quantityBasket - отображает сумму товаров в корзине;


### Класс Success 

Базовая функциональность: отображает модальное окно успешного оформления заказа. Наследуется от Component;

Поля класса:
- total - разметка суммы товаров;

Конструктор: 
- принимает элемент успешной оплаты и устанавливает обработчик события для кнопки закрытия;

Методы: 
- setResult - устанавливает сообщение об успешной оплате;



## Взаимодействие компонентов

Код, описывающий взаимодействие представления и данных между собой находится в файле index.ts, выполняющем роль презентера.
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков событий, описанных в index.ts В index.ts создаются экземпляры всех классов, далее настраивается обработка событий.




