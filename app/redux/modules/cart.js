const ADD_CART_ITEM = 'ADD_CART_ITEM';
const UPDATE_CART_ITEM = 'UPDATE_CART_ITEM';
const REMOVE_CART_ITEM = 'REMOVE_CART_ITEM';

const SUBMIT_CART = 'SUBMIT_CART';
const CLEAR_CART = 'CLEAR_CART';
const ADD_REPORT_CART = 'ADD_REPORT_CART';

export default function reducer(state = [], action) {
  switch (action.type) {
    case ADD_CART_ITEM:
      return [
        ...state,
        action.cartItem
      ];
    case UPDATE_CART_ITEM:
      return state.map((item) => ((item.id === action.id ?
      { ...item, quantity: action.newQuantity } : item)));
    case REMOVE_CART_ITEM:
      return state.filter((item) => item.id !== action.id);
    case CLEAR_CART:
    case SUBMIT_CART:
      return [];
    case ADD_REPORT_CART:
      return [
        ...state,
        ...action.reportCart,
      ];
    default:
      return state;
  }
}

export function addReportCart(reportCart) {
  return {
    type: ADD_REPORT_CART,
    reportCart
  };
}

export function addCartItem(item) {
  const cartItem = {
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    cost: item.cost,
    sellingPrice: item.sellingPrice,
    stock: item.stock,
  };

  if (item.feet) {
    return {
      type: ADD_CART_ITEM,
      cartItem: {
        ...cartItem,
        feet: item.feet,
        stock: item.stock,
        fraction: item.fraction,
        totalFeet: item.totalFeet,
      }
    };
  }

  return {
    type: ADD_CART_ITEM,
    cartItem
  };
}

export function updateCartItem(id, newQuantity) {
  return {
    type: UPDATE_CART_ITEM,
    id,
    newQuantity
  };
}

export function removeCartItem(id) {
  return {
    type: REMOVE_CART_ITEM,
    id
  };
}

export function clearCart() {
  return {
    type: CLEAR_CART,
  };
}

export function submitCart(cart, reportCart, next) {
  return (dispatch, _, { ref, timestamp }) => {
    const date = new Date();
    const dayMonth = date.toLocaleDateString().replace(/\//g, '-');
    // const itemsToUpdate = {};

    cart.forEach((item) => {
      let id = item.id;
      let quantity = item.quantity;
      // let remainingStock = Math.abs(item.quantity - item.stock);

      if (typeof item.id === 'string' && /ft$/.test(item.id)) {
        // const timesFeet = item.fraction * item.feet;
        // const totalFeet = timesFeet * (item.stock / item.fraction);
        // const totalQuantity = item.feet * item.quantity;

        id = Number(item.id.replace(/\D+\w+(?!-ft)/, ''));
        // remainingStock = (totalFeet - totalQuantity) / timesFeet;
        quantity = item.quantity / item.fraction;
      }

      ref.child(`inventory/${id}/stock`)
        .transaction((current) => (current - quantity))
        .then(() => next(null, `[#${item.id}]${item.name} stock`))
        .catch(next);

      // itemsToUpdate[`${id}/stock`] = remainingStock;
    });

    // ref.child('inventory').update(itemsToUpdate)
    //   .then(() => next(null, 'New item stock'))
    //   .catch(next);

    ref.child('.info/serverTimeOffset').on('value', (fbTime) => {
      const now = Date.now() + fbTime.val();

      ref.child(`reports/${dayMonth}/${now}`)
        .set({ changedCartTime: 0, cart })
        .then(() => next(null, 'Item/s purchase'))
        .catch(next);

      dispatch({ type: SUBMIT_CART });

      if (reportCart.timestamp) {
        const tsDate = new Date(reportCart.timestamp.slice(0, -3) * 1000)
          .toLocaleDateString()
          .replace(/\//g, '-');

        reportCart.cart.forEach((item) => {
          let id = item.id;

          if (item.feet) {
            id = Number(item.id.replace(/\D+\w+(?!-ft)/, ''));
          }

          ref.child(`inventory/${id}/stock`)
            .transaction((current) => {
              if (item.feet) {
                return current + (item.quantity / item.fraction);
              }

              return current + item.quantity;
            });
        });

        ref.child(`reports/${tsDate}/${reportCart.timestamp}`)
          .update({ changedCartTime: timestamp });
      }
    });
  };
}
