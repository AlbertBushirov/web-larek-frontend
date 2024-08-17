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
- src/scss/styles.scss — корневой файл стилей
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

## Данные и типы данных, используемые в приложении

Интерфейс описывает данные частей приложения: каталог, превью, корзина, форма заказа - IAppState

```
catalog: IProduct[];
preview: string;
basket: string[];
order: IOrder;
total: string | number;
loading: boolean;
```

Продукт interface IProductItem

```
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number | null;
```

Список продуктов interface IProductsList

```
  products: IProductItem[];
```

Данные формы заказа interface IOrderForm

```
  payment: string;
  address: string;
  phone: string;
  email: string;
```

Данные покупки interface IOrder extends IOrderForm

```
  items: string[];
```

Интерфейс успешного заказа - IOrderResult

```
  id: string;
```

Тип ошибки заказа

```
type FormErrors = Partial<Record<keyof IOrder, string>>;
```

## Архитектура приложения

Код приложения разделен на слои, согласно MVP.

Структура проекта:

- интерфейс (вывод пользовательской информации);
- данные (лоигика приложения без интерфейса);
- Presenter (связывает данные с интерфейсом);

## Описание базовых классов

### Класс Api

Базовый класс отвечает за работу с серверными данными; хранит основные поля и методы;

Конструктор: (baseUrl: string; options: RequestInit = {}) хранит основные поля и методы, необходимые при работе с сервером

Методы:

- handleResponse - обрабатывает полученный ответ от сервера; возвращает ошибку если ответ отрицательный;
- post - принимает объект с данными, обрабатывает и отправляет их, как параметр при вызове метода;
- get - отправляет GET запрос с данными и возвращает ответ сервера;

### Класс Component

Абстрактный класс; создает компоненты пользовательского интерфейса;

Конструктор:

- (container: HTMLElement) контейнер, корневой DOM-элемент;

Методы:

- toggleClass - переключает класс;
- setText - устанавливает текстовое содержимое;
- hideElement - скрывает элемент;
- showElement - показывает элемент;
- setDisabled - изменяет состояние блокировки;
- render - возвращает DOM-элемент;
- setImage - устанавливает изображение с альтернативным текстом;

### Класс Model

Абстрактный класс; создает модальные окна

Конструктор: (data: Partial, protected events: IEvents) принимает данные модели и объект событий; копирует данные в модель;

Методы:

- emmitChanges — регистрирует входящее событие в EventEmitter;

### Класс EventEmitter

Базовая функциональность: реализует функционал обработчиков событий; позволяет отправлять события и подписываться на них;

Конструктор: constructor() создает карту событий;

Использует интерфейс IEvents;

Основные методы, реализуемые классом описаны интерфейсом IEvents:
Методы:

- on - устанавливает обработчик для указанного события;
- off - удаляет обработчик для указанного события;
- emit - вызывает событие с указанными данными;
- onAll - устанавливает обработчик для всех событий;
- offAll - удаляет все слушатели событий;
- trigger - создает слушатель событие с заданными аргументами;

## Описание классов данных

Данные классы принимают и хранят в себе данные об одном продукте: идентифекатор, заголовок, описание, категория, изображение, цену.

### Класс AppData

Главная модель управления проектом. Содержит в себе основные данные и методы для работы с моделью данных в целом. Наследуется от класса Model;

Поля класса:

- catalog - для данных списка товаров;
- preview - для данных выбранного товара (попап);
- bascket - ддля данных корзины покупок;
- order - для данных заказа, который отправляется на сервер;
- formErrors: FormErrors = {};

Конструктор: constructor() - конструктор наследуется от класса Model;

Методы:

- addBasket - добавляет товар в корзину;
- removeBasket - удаляет товар из корзины;
- clearBasket - очищает товары в корзине;
- getTotalPrice - возвращает общую цену товаров;
- setCatalog - формирует каталог продуктов, преобразуя каждый элемент в экземпляр Product;
- setPreview - установливает данные в первью;
- setOrderField - обновляет поле формы заказа, проверяет валидность заказа;
- setContactField - устанавливает значения в данные контактов заказа;
- validateContact - проверяет значения данных контактов;
- validateOrder - проверяет валидность полей формы заказа;
- resetOrderForm - обновляет форму заказа;
- orderData - совершает заказ, обновляет корзину;

### Класс WebLarekAPI

Основной класс работы с API. Расширяется базовым классом Api.

Конструктор: (cdn: string, baseUrl: string, options?: RequestInit) принимает и передает в родительский конструктор baseUrl и options; записывает в поле api текущий URL

Класс использует интерфейсы IOrderResult и IAuctionAPI

IOrderResult

```
id: string;
total: number;
```

IAuctionAPI

```
getCardList: () => Promise<ICardItem[]>;
getCardItem: (id: string) => Promise<ICardItem>;
orderCards: (order: IOrder) => Promise<IOrderResult>;
```

Методы:

- getCardList - метод запроса списка товаров с сервера;
- getCardItem - метод запроса элемента с сервера;
- orderCards - метод отправки данных заказа на сервер;

## Описание классов представления (View)

Классы представления отвечают за отображение всех элементов страницы

### Класс Page

Класс отвечает за отображение корзины, счетчика корзины и каталога товаров;

Поля класса:

- counter - отвечает за счетчик корзины;
- catalog - отвечает за хранение разметки каталога карточек;
- basket - отвечает за хранение разметки кнопки корзины;
- wrapper - отвечает за хранение обертки страницы;

Конструктор: (container: HTMLElement, protected events: IEvents) в конструкторе устанавливается обработчик события для элемента корзины, который открывает окно с выбранными товарами;

Класс использует интерфейс IPage

```
counter: number;
catalog: HTMLElement[];
locked: boolean;
```

Методы:

- catalog(items: HTMLElement[]) - отвечает за установку каталога;
- counter(value: number) - отвечает за установку счетчика;
- locked(value: boolean) - отвечает за не прокручивание страницы;

### Класс Card

Класс отвечает за отображение карточек, взятых из каталога; Наследуется от Component; использует данные ICardItem;

Поля класса:

- category - устанавливает категорию товара и добавляет соответствующий класс к элементу категории;
- title - устанавливает название товара;
- description - устанавливает описание карточки;
- image - устанавливает изображение карточки;
- price - устанавливает цену карточки и, если цена установлена, отключает кнопку карточки;
- button - устанавливает кнопку карточки 'В корзину';
- index - устанавливает индекс товара;

Конструктор: (container: HTMLElement, actions?: ICardAction) принимает контейнер для карточки и объект действий. В конструкторе устанавливаются обработчики событий для категории, заголовка, описания, кнопки, стоимости

Класс использует интерфейсы ICard и ICardAction

ICard

```
title: string;
category: string;
image: string;
price: number;
text: string;
```

ICardAction

```
onClick(evt:MouseElement) => void;
```

### Класс Modal

Класс отвечает за отображение модальных окон; Наследуется от Component

Поля класса:

- content - хранение разметки контейнера модального окна;
- closeButton - хранение кнопки модального окна;

Интерфейс класса - IModalData

```
content:HTMLElement;
```

Конструктор: (selector: string, events: IEvents) принимает селектор, в котором будет установленно модальное окно и экземпляр класса EventEmitter для возможности инициализации событий

Методы:

- open - открывает модальное окно;
- close - закрывает модальное окно;
- render - отображает модальное окно с контентом и открывает его;

### Класс Form

Класс создает формы, обрабатывает события ввода формы и отправки формы. Наследуется от Component

Поля класса:

- supbmit - разметка кнопки;
- errors - разметка ошибок в инпуте;

Интерфейс класса - IFormState

```
valid: boolean;
errors: string[];
```

Конструктор: (protected container: HTMLFormElement, protected events: IEvents) принимает селекторы полей форм, кнопки отправки форм и окна "заказ оформлен";

Методы:

- onInputChange - открывает окно "Заказ оформлен"
- valid - валидация полей форм;
- errors - чистит правильно заполненную форму;
- render - находит ошибку;

### OrderAddress

Отвечает за первое модальное окно оплаты заказаю Наследуется от Form

Поля:

- card — хранит разметку кнопок формы оплаты;
- cash - хранит данные способов оплаты;
- address - хранит инпут поля адреса доставки;
- contactButton - контейнер с кнопками 'Онлайн' и 'При получении';

Конструктор: (container: HTMLFormElement, events: IEvents) принимает container:HTMLElement и объект event:IEvent
передает данные в родительский конструктор
сохраняет необходимые элементы разметки в полях
на кнопки выбора формы оплаты вешает слушатель click

Методы:

- payment — устанавливает класс активности на кнопку;
- address — устанавливает значение поля адрес;

### OrderContacts

Класс отвечает за второе модальное окно оплаты заказа. Наследуется от Form

Поля:

- email - хранит разметку инпута почты;
- phone - хранит разметку инпута телефона;
- submitButton - хранит кнопку 'Оплатить';

Конструктор: (container: HTMLFormElement, events: IEvents) принимает container:HTMLElement и объект event:IEvent
передает данные в родительский конструктор

Методы:

- email - устанавливает значение инпута почты;
- phone - устанавливает значение инпута телефона;

### Класс Basket

Класс управляет отображением корзины товаров

Поля класса:

- list - хранит в себе список товаров в корзине;
- total - хранит в себе сумму стоимости товаров;
- button - кнопка 'оформить'

Конструктор: (container: HTMLElement, protected events: EventEmitter) принимает корневой элемент корзины и объект событий;

Методы:

- items - добавляет товары в корзине;
- total - добавляет и отображает сумму товаров в корзине;

### Класс Success

Класс отображает модальное окно успешного оформления заказа; наследуется от Component.

Поля класса:

- close - разметка кнопки 'За новыми покупками!'
- total - разметка суммы товаров;

Класс использует интерфейсы ISuccess и ISuccessActions

ISuccess

```
total:string | number;
```

ISuccessActions

```
onClick: () => void;
```

Конструктор: (container:HTMLElement и actions:ISuccessActions) принимает элемент успешной оплаты и устанавливает обработчик события для кнопки закрытия;

Методы:

- Result - устанавливает сообщение об успешной оплате;

## Взаимодействие компонентов (Presenter)

Код взаимодействия представления и данных между собой находится в файле index.ts, выполняет роль презентера.
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков событий, описанных в index.ts В index.ts создаются экземпляры всех классов, далее настраивается обработка событий.

События взаимодействия, описанные в index.ts

- basket:submit - подтверждение товаров в корзине;
- basket:open - открытие корзины;
- item:delete - выбор товара для удаления из корзины;
- order:input - изменение данных в форме с информацией заказа;
- contacts:input - изменение данных в форме с контактами пользователя;
- order:submit - сохранение данных о заказе в форме;
- contacts:submit - сохранение данных о контактах пользователя в форме;
- order:validated - событие после выполнения валидации формы заказа;
- contacts:validated - событие после выполнения валидации формы контактов пользователя;
- order:completed - завершение оформления заказа;
- contacts:completed - завершение оформления заказа (контакты);
- modal:changed - изменение контента модального окна;
- product:select - выбор товара для просмотра в модальном окне;
- product:previewClear - необходима очиста данных выбранного для показа в модальном окне товара;
- item:select - выбор карточки для добавления в корзину;
