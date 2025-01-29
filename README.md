# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/components/common/ — папка c общими компонентами
- src/components/special/ 

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения (упрощенный вид презентера)
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

## Архитектура проекта
Приложение основано на упрощенной версии шаблона проектирования MVP. В данном контексте все приложение содержит общий "Presenter", который координирует работу всех View и Model через событийно-ориентированный подход, используя механизм сообщений, которые возникают в результате определенных событий внутри отображений и моделей

Приложение работает со следующими типами данных:
Интерфейс, описывающий товар.
```
interface IProduct {
	id: string;
	description: string;
	price: number | undefined;
	title: string;
	image: string;
	category: string;
}
```
Тип, описывающий способ оплаты заказа.
```
type PaymentMethod = 'cash' | 'card';
```
Интерфейс, описывающий заказ пользователя.
```
interface IOrder {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number | undefined;
	items: string[];
}
```
Интерфейс, описывающий то, каким должен быть ответ от сервера при успешном заказе.
```
interface IOrderResult {
	id: string;
	total: number;
}
```
Интерфейс, описывающий корзину с товарами.
```
interface IBasket {
	items: string[];
	total: number;
}
```
Тип для формы заказа, исключающий некоторые типы из интерфейса заказа пользователя
```
type OrderForm = Omit<IOrder, 'total' | 'items'>;
```
Тип для формы данных пользователя, исключающий некоторые типы из интерфейса заказа пользователя
```
type ContactForm = Omit<
	IOrder,
	'total' | 'items' | 'payment' | 'address'
>;
```

## Компоненты
**Events**: брокер событий, реализующий паттерн "Наблюдатель". Он управляет подпиской и уведомлением событий между компонентами.

**AppData**: модель данных прилоежния с набором методов работы с данными.

**Api**: отвечает за взаимодействие с сервером, включая методы для отправки и получения данных.

**Component**: абстрактный класс, в котором реализованы базовые методы для реализации компонентов.

**WebLarekApi**: наследуется от Api и предоставляет методы для получения списка товаров и отправки заказов.

**Basket**: управляет данными корзины, включая добавление, удаление товаров и расчет общей стоимости.

**Form**: обрабатывает данные, введенные пользователем при оформлении заказа, включая валидацию контактной информации и адреса.

**Product**: управляет отображением карточки товара, включая установку текста, категории и цены.

**Order**: наследуется от **Form**: управляет отображением и обработкой формы заказа, включая выбор метода оплаты и ввод адреса доставки.

**Contacts**: наследуется от **Form**: управляет формой ввода контактной информации пользователя.

**Modal**: управляет отображением модальных окон в приложении.

**Success**: отображает сообщение об успешном оформлении заказа.

## Базовые блоки

### Базовый класс EventEmitter
Обеспечивает работу событий и выполняет роль презентера в упрощенной реализации приложения в архитектуре MVP.
Данный класс реализует интерфейс `IEvents`, использует типы `TEmitterEvent`, `TSubscriber`, `TEventName`:

### Базовый класс Api
В этом классе реализован набор операций для взаимодействия с сервером.
HTTP методы типизированы как `TApiPostMethods`;
```
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
```
## Модели данных
### Класс AppState
Модель данных прилоежния с набором методов работы с данными. В данной реализации выполняет роль распределителя между товарами, корзиной и заказом.
Реализовано в интерфейсе:
```
interface IAppState {
	selectedProduct: IProduct;
	basket: {}
	productList: IProduct[];
	currentOrder: IOrder;
}
```
```typescript
//Метод устанавливает выбранный товар в объекте и эмитирует событие с переданным товаром.
previewProduct(item: IProduct): void {}

//Метод обновляет список товаров и эмитирует событие с новым списком товаров.
updateProductList(products: IProduct[]): void {}

//Этот метод проверяет, находится ли продукт в корзине (по идентификатору продукта)
isProductInBasket(product: IProduct): boolean {}

//Метод добавляет продукт в корзину 
addToBasket(product: IProduct): void {}

//Метод удаляет продукт из корзины. 
removeFromBasket(product: IProduct): void {}

//Метод очищает корзину
clearBasket(): void {}

//Метод устанавливает тип оплаты для текущего заказа
setPaymentType(paymentType: PaymentMethod): void {}


//Этот метод обновляет поле заказа
updateOrderField(field: keyof OrderForm, value: string): void {}

//Метод выполняет валидацию формы заказа
validateOrder(): boolean {}

//Методы для валидации
private _validateOrder(): void {}

private _isOrderValid(): boolean {}

private _isValidEmail(email: string): boolean {}

private _isValidPhone(phone: string): boolean {}


//Утилиты
private _createEmptyOrder(): IOrder {}

private _notifyBasketUpdated(): void {}
```



