import {ADD_TO_CART, ADD_COUNTER} from './mutations-type'

export default {
  addCart(context, payload) {
    // let oldProduct = null

    // for(let item of state.cartList) {
    //   if(item.iid === payload.iid) {
    //     oldProduct = item
    //   }
    // }
    return new Promise((resolve, reject) => {
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

      if(oldProduct) {  //数量+1
        // oldProduct.count += 1
        context.commit(ADD_COUNTER, oldProduct)
        resolve('商品数量+1')
      } else {  // 添加新商品
        payload.count = 1
        // state.cartList.push(payload)
        context.commit(ADD_TO_CART, payload)
        resolve('添加新商品')
      }
    })
  }
}